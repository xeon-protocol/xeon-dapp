// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

// Xeon Protocol - liquidity unlocking and risk management platform.
// Audit findings corrections: 20 - 05 - 2024

// ====================Description===========================
// This is the main smart contract for the Xeon Protocol.
// The smart contract is deployed on the testnet.
// - Deposit any ERC-20 token as collateral 
// - Withdraw any ERC20 token
// - Get underlying value of any ERC20 token in paired currency
// - Use Uniswap V3 TWAP oracle + other dynamic price sources to get price of assets
// - Get user token balances 
// - Lock in collateral for a duration
// - Write/Take Loans requests
// - Write/Take Options
// - Write/Take Equity Swaps
// - Write/Take OTC swaps
// - Custom deal terms on all trades
// - Requests to topup collateral during a deal, passed on mutual consent
// - Requests to settle trade before maturity, passed on mutual consent
// - Settle trade in underlying assets upon deal maturity
// - Settle trade in paired currency upon deal maturity
// - Payout settlement profits and fees to: trade parties, protocol, miner
// - Distribute revenue or third party service stakes
// - Restore collateral on settlement
// - Read data storages; array lists, individual mappings and structs, collective mappings and variables
    
//  Functionality goals
//1. to receive any ERC20 token as collateral/underlying tokens
//2. tokens are priced in their dex paired currency.
//4. enable writing using tokens as underlying assets
//5. enable buying in paired currency for stipulated duration
//6. settlement based on price of assets in comparison to strike value & terms
//7. allow settle-now or topup-topup consensus between parties during a deal
//8. payment and logging of proceeds, fees and commissions for protocol and parties involved
//9. read smart contract data on wallet balances, hedge activity, revenue logs

// List of Key Functions in this smart contract
// - deposit
// - withdraw
// - get pair addresses of all erc20
// - get underlying value of all erc20
// - cashier fees calculation
// - write deal
// - buy deal
// - settlement
// - mine deal
// - revenue and fees logging for all stakeholders
// - get deal details by deal id
// - fetch deal arrays; created, taken, settled

// Third Party Key Dependencies
// 1. 
// 2. 
// 3. 
// 4. 

// Dev notes
// - addresses can deposit or withdraw erc20 tokens 
// - all tokens are treated as ERC20
// - deposits, lockedinuse and withdrawals track wallets balances
// - lockedinuse is the current account (+-) on trades, and acts as escrow for each deal
// - getUnderlyingValue fetches value of tokens & returns paired value & pair address
// - split writing, taking and settlement functions for all deal types
// - each deal is taxed upon settlement, in relevant tokens (paired or underlying)
// - contract taxes credited in mappings under address(this) and send out to staking/rewards contract
// - Smart contract does not have support for distributing earnings to staking contract yet

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";

// minimal interface for the WETH9 contract
interface IWETH9 {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
}

contract oXEONVAULT {

    using SafeMath for uint256;
    bool private isExecuting;

    modifier nonReentrant() {
        require(!isExecuting, "Function is currently being executed");
        isExecuting = true;
        _;
        isExecuting = false;
    }
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    struct userBalance {
        uint256 deposited; // incremented on successful deposit
        uint256 withdrawn; // incremented on successful withdrawal
        uint256 lockedinuse; // adjust on deal creation or buy or settle
    }
    struct contractBalance {
        uint256 deposited;
        uint256 withdrawn;
    }
    struct hedgingOption {
        bool zapTaker;
        bool zapWriter;
        address owner;
        address taker;
        address token;
        address paired;
        uint status; //0 - none, 1 - created, 2 - taken, 3 - settled
        uint256 amount;
        uint256 createValue;
        uint256 startValue;
        uint256 strikeValue;
        uint256 endValue;
        uint256 cost;
        uint256 dt_created;
        uint256 dt_started;
        uint256 dt_expiry;
        uint256 dt_settled;
        HedgeType hedgeType;
        uint256 [] topupRequests;
    }
    enum HedgeType {CALL, PUT, SWAP}

    struct userPL{
        uint256 profits;
        uint256 losses;
    }

    struct topupData {
        address requester;
        uint256 amountWriter;
        uint256 amountTaker;
        uint256 requestTime;
        uint256 acceptTime;
        uint256 rejectTime;
        uint state; // 0 - requested, 1 accepted, 2 rejected
    }

    // mapping of wallet token balances [token][user]
    mapping(address => mapping(address => userBalance)) public userBalanceMap;

    //mapping of user-hedge-Ids array for each erc20 token
    mapping(address => mapping(address => uint[])) private userHedgesForTokenMap;

    // mapping of wallet profit & loss [pair][user]
    mapping(address => mapping(address => userPL)) private userPLMap;

    // track all erc20 deposits and withdrawals to contract
    mapping(address => contractBalance) public protocolBalanceMap;

    // mapping of all hedge storages by Id
    mapping(uint => hedgingOption) private hedgeMap;

    // mapping topup requests 
    mapping(uint => topupData) public topupMap;

    // mapping of all hedges created for each erc20
    mapping(address => uint[]) private tokenOptions;
    mapping(address => uint[]) private tokenSwaps;

    // mapping of all hedges taken for each erc20
    mapping(address => uint[]) private optionsBought;
    mapping(address => uint[]) private equityswapsBought;

    // mapping of all hedges settled for each erc20
    mapping(address => uint[]) private optionsSettled;
    mapping(address => uint[]) private equityswapsSettled;

    // mapping of all hedges for user by Id
    mapping(address => uint[]) public myoptionsCreated;
    mapping(address => uint[]) public myoptionsTaken;
    mapping(address => uint[]) public myswapsCreated;
    mapping(address => uint[]) public myswapsTaken;
    
    // mapping of all tokens transacted by user
    mapping(address => address[]) public userERC20s;
    mapping(address => address[]) public pairedERC20s;

    // mapping of all protocol profits and fees collected from hedges
    mapping(address => uint256) public protocolProfitsTokens;//liquidated to paired at discount
    mapping(address => uint256) public protocolPairProfits;
    mapping(address => uint256) public protocolFeesTokens;//liquidated to paired at discount
    mapping(address => uint256) public protocolPairedFees;
    mapping(address => uint256) public hedgesCreatedVolume;//volume saved in paired currency
    mapping(address => uint256) public hedgesTakenVolume;
    mapping(address => uint256) public hedgesCostVolume;
    mapping(address => uint256) public swapsVolume;
    mapping(address => uint256) public optionsVolume;
    mapping(address => uint256) public settledVolume;

    // more volume mappings
    mapping(address => uint256) public protocolCashierFees;
    mapping(address => mapping(address => uint256)) public equivUserHedged;
    mapping(address => mapping(address => uint256)) public equivUserCosts; 

    // miner mappings
    mapping(address => bool) public minerMap;

    // mapping bookmarks of each user
    mapping(address => mapping(uint256 => bool)) public bookmarks;
    mapping(address => uint256[]) public bookmarkedOptions; // Array to store bookmarked optionIds for each user
    
    // all hedges
    uint[] private optionsCreated;    
    uint[] private equityswapsCreated;
    uint[] private optionsTaken;
    uint[] private equityswapsTaken;
    
    // global counters
    uint public depositedTokensLength;
    uint public optionsCreatedLength;
    uint public equityswapsCreatedLength;
    uint public equityswapsTakenLength;
    uint public optionsTakenLength;
    uint public optionID;
    uint public topupRequestID;
    uint public settledTradesCount;
    uint public miners;
    
    // fee variables
    uint256 public feeNumerator;
    uint256 public feeDenominator;

    // erc20 deposits equiv in paired currencies
    uint256 public wethEquivDeposits;
    uint256 public usdtEquivDeposits;
    uint256 public usdcEquivDeposits;

    // erc20 withdrawals equiv in paired currencies
    uint256 public wethEquivWithdrawals;
    uint256 public usdtEquivWithdrawals;
    uint256 public usdcEquivWithdrawals;

    // core addresses
    IUniswapV3Factory public uniswapV3Factory;
    address public wethAddress;
    address public usdtAddress;
    address public usdcAddress;
    address public XeonAddress;
    address public owner;

    // events
    event received(address, uint);
    event onDeposit(address indexed token, uint256 indexed amount, address indexed wallet);
    event onWithdraw(address indexed token, uint256 indexed amount, address indexed wallet);
    event hedgeCreated(address indexed token, uint256 indexed optionId, uint256 createValue, HedgeType hedgeType, address indexed writer);
    event hedgePurchased(address indexed token, uint256 indexed optionId, uint256 startValue, HedgeType hedgeType, address indexed buyer);
    event hedgeSettled(address indexed token, uint256 indexed optionId, uint256 endValue, uint256 payOff, address indexed miner);
    event minedHedge(uint256 optionId, address indexed miner, address indexed token, address indexed paired, uint256 tokenFee, uint256 pairFee);
    event bookmarkToggle(address indexed user, uint256 hedgeId, bool bookmarked);
    event topupRequested(address indexed party, uint256 indexed hedgeId, uint256 topupAmount, bool consent);
    event zapRequested(uint indexed hedgeId, address indexed party);

    constructor(address _uniswapV3Factory) {
        uniswapV3Factory = IUniswapV3Factory(_uniswapV3Factory);
        wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // WETH address on Sepolia
        usdtAddress = 0x297B8d4B35294e730087ADF0597A31a9bC1746af; // oUSDT address on Sepolia
        usdcAddress = 0x8267cF9254734C6Eb452a7bb9AAF97B392258b21; // USDC address on Sepolia
        XeonAddress = 0xDb90a9f7cEaA33a32Ec836Bbadeeaa8772Ad9797; // V2.1 deployed 14/01/2024 21:52:48
        // Variables
        feeNumerator = 5;
        feeDenominator = 1000;
        owner = msg.sender;
    }

    function getPrice(address token0, address token1, uint32 period) external view returns (uint256 priceX96) {
        address poolAddress = uniswapV3Factory.getPool(token0, token1, 3000); // 3000 is the fee tier (0.3%)
        require(poolAddress != address(0), "Pool doesn't exist");
        
        (int24 tick, ) = OracleLibrary.consult(poolAddress, period);
        priceX96 = OracleLibrary.getQuoteAtTick(tick, 1 ether, token0, token1);
    }

    function depositToken(address _token, uint256 _amount) external nonReentrant {
        require(_amount > 0, "You're attempting to transfer 0 tokens");
        // Deposit WETH , stables or ERC20
        if (_token == wethAddress) {
            require(IWETH9(wethAddress).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
            wethEquivDeposits += _amount;
        } else {
            // Allowance check and transfer for non-WETH tokens
            uint256 allowance = IERC20(_token).allowance(msg.sender, address(this));
            require(allowance >= _amount, "You need to set a higher allowance");
            require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");

            // Log main pair equivalents
            if (_token != usdtAddress && _token != usdcAddress) {
                (uint256 marketValue, address paired) = getUnderlyingValue(_token, _amount);
                if (paired == wethAddress) wethEquivDeposits += marketValue;
                else if (paired == usdtAddress) usdtEquivDeposits += marketValue;
                else if (paired == usdcAddress) usdcEquivDeposits += marketValue;
            } else if (_token == usdtAddress) {
                usdtEquivDeposits += _amount;
            } else if (_token == usdcAddress) {
                usdcEquivDeposits += _amount;
            }
        }

        // Log user balance & tokens
        userBalance storage uto = userBalanceMap[_token][msg.sender];
        if (uto.deposited == 0) {
            userERC20s[msg.sender].push(_token);
        }
        uto.deposited += _amount;

        // Log new token address
        // protocolBalanceMap is analytics only, curcial to log below. 
        // userBalanceMap stores protocols withdrawable balance
        if (protocolBalanceMap[_token].deposited == 0) {
            userERC20s[address(this)].push(_token);
            depositedTokensLength++;
        }
        protocolBalanceMap[_token].deposited += _amount;

        // Emit deposit event
        emit onDeposit(_token, _amount, msg.sender);
    }

    function withdrawToken(address token, uint256 amount) external nonReentrant {
        // Read user balances into local variables
        (, , , uint256 withdrawable, , ) = getUserTokenBalances(token, msg.sender);

        require(amount <= withdrawable && amount > 0, "You have Insufficient available balance");
        require(msg.sender != address(this), "Not allowed");

        // Tax withdrawals on pair only; WETH, USDT, USDC. 1/10 of settle tax
        uint256 tokenFee;
        if (token == wethAddress || token == usdtAddress || token == usdcAddress) {
            tokenFee = calculateFee(amount).div(10);
            protocolCashierFees[token] += tokenFee;
            userBalanceMap[token][address(this)].deposited += tokenFee;
        }

        // Withdraw
        userBalanceMap[token][msg.sender].withdrawn += amount;

        if (token == wethAddress) {
            require(IWETH9(wethAddress).transfer(msg.sender, amount.sub(tokenFee)), "Transfer failed");
        } else {
            require(IERC20(token).transfer(msg.sender, amount.sub(tokenFee)), "Transfer failed");
        }

        // Log withdrawal
        protocolBalanceMap[token].withdrawn += amount;

        // Log main paired value equivalents
        if (token == wethAddress) {
            wethEquivWithdrawals += amount;
        } else if (token != wethAddress && token != usdtAddress && token != usdcAddress) {
            (uint256 marketValue, address paired) = getUnderlyingValue(token, amount);
            if (paired == wethAddress) wethEquivWithdrawals += marketValue;
            else if (paired == usdtAddress) usdtEquivWithdrawals += marketValue;
            else if (paired == usdcAddress) usdcEquivWithdrawals += marketValue;
        }

        // Emit withdrawal event
        emit onWithdraw(token, amount, msg.sender);
    }

    // Create Hedge: covers both call options and equity swaps. put options to be enabled in Beta V2
    // premium or buying cost paid in paired token of the underlying asset in the deal
    // no premium for swaps. swap collateral must  be equal for both parties, settle function relies on this implementation here
    // put options will have a max loss check to only accept a strike price 50% away max
    function createHedge(uint tool, address token, uint256 amount, uint256 cost, uint256 strikeprice, uint256 deadline) external nonReentrant {
        require(tool <= 2 && amount > 0 && cost > 0 && deadline > block.timestamp, "Invalid option parameters");
        (, , , uint256 withdrawable, , ) = getUserTokenBalances(token, msg.sender);
        require(withdrawable > 0 && withdrawable >= amount, "Insufficient Vault Balance. Deposit more tokens");

        // Assign option values directly to the struct
        hedgingOption storage newOption = hedgeMap[optionID];
        newOption.owner = msg.sender;
        newOption.token = token;
        newOption.status = 1;
        newOption.amount = amount;
        (newOption.createValue, newOption.paired) = getUnderlyingValue(token, amount);
        newOption.cost = cost;
        newOption.strikeValue = strikeprice.mul(amount);
        newOption.dt_expiry = deadline;
        newOption.dt_created = block.timestamp;
        if (tool == 0) {
            newOption.hedgeType = HedgeType.CALL;
        } else if (tool == 1) {
            newOption.hedgeType = HedgeType.PUT;
        } else if (tool == 2) {
            newOption.hedgeType = HedgeType.SWAP;
        } else {
            revert("Invalid tool option");
        }

        // Update user balances for token in hedge
        userBalanceMap[token][msg.sender].lockedinuse += amount;
        
        // Update arrays
        if (newOption.hedgeType == HedgeType.SWAP) {
            require(cost >= newOption.createValue, "Swap collateral must be equal value");
            myswapsCreated[msg.sender].push(optionID);
            equityswapsCreated.push(optionID);
            equityswapsCreatedLength ++;
            tokenOptions[token].push(optionID);
        } else {
            myoptionsCreated[msg.sender].push(optionID);
            optionsCreated.push(optionID);
            optionsCreatedLength ++;
            tokenSwaps[token].push(optionID);
        }

        // Log protocol analytics
        hedgesCreatedVolume[newOption.paired].add(newOption.createValue);
        // Emit
        emit hedgeCreated(token, optionID, newOption.createValue, newOption.hedgeType, msg.sender);
    }

    // Hedge costs are in paired currency of underlying token
    // For Call and Put Options cost is premium, lockedinuse during buy, but paid out on settlement
    // For Equity Swaps cost is equal to underlying value as 100% collateral is required. There is no premium
    // Strike value is not set here, maturity calculations left to the settlement function
    function buyHedge(uint256 _optionId) external nonReentrant {
        hedgingOption storage hedge = hedgeMap[_optionId];
        userBalance storage stk = userBalanceMap[hedge.paired][msg.sender];

        require(_optionId < optionID && msg.sender != hedge.owner, "Invalid option ID | Owner can't buy");
        (, , , uint256 withdrawable, , ) = getUserTokenBalances(hedge.paired, msg.sender);
        require(withdrawable >= hedge.cost, "Insufficient free Vault balance");

        // Calculate, check, and update start value based on the hedge type
        (hedge.startValue, ) = (hedge.hedgeType == HedgeType.SWAP)
            ? getUnderlyingValue(hedge.token, hedge.amount + hedge.cost)
            : getUnderlyingValue(hedge.token, hedge.amount);

        require(hedge.startValue > 0, "Math error whilst getting price");

        stk.lockedinuse = stk.lockedinuse.add(hedge.cost);
        hedge.dt_started = block.timestamp;
        hedge.taker = msg.sender;
        hedge.status = 2;

        // Store updated structs
        userBalanceMap[hedge.paired][msg.sender] = stk;
        hedgeMap[_optionId] = hedge;

        // Update arrays and takes count
        if (hedge.hedgeType == HedgeType.SWAP) {
            equityswapsTakenLength ++;
            equityswapsBought[hedge.token].push(_optionId);
            equityswapsTaken.push(_optionId);
            myswapsTaken[msg.sender].push(_optionId);
        } else {
            optionsTakenLength ++;
            optionsBought[hedge.token].push(_optionId);
            optionsTaken.push(_optionId);
            myoptionsTaken[msg.sender].push(_optionId);
        }

        // Log pair tokens involved in protocol revenue
        if (hedgesTakenVolume[hedge.paired] == 0) {
            pairedERC20s[address(this)].push(hedge.paired);
        }

        // Protocol Revenue Trackers
        hedgesTakenVolume[hedge.paired] += hedge.startValue;
        hedgesCostVolume[hedge.paired] += hedge.cost;

        if (hedge.hedgeType == HedgeType.SWAP) {
            swapsVolume[hedge.paired] += hedge.startValue;
        } else if (hedge.hedgeType == HedgeType.CALL) {
            optionsVolume[hedge.paired] += hedge.startValue;
        }
        // Emit the hedgePurchased event
        emit hedgePurchased(hedge.token, _optionId, hedge.startValue, hedge.hedgeType, msg.sender);
    }

    // topup Request & Accept function
    // any party can initiate & accepter only matches amount
    // Action is request (false) or accept (true)
    // Request amount can be incremented if not accepted yet
    function topupHedge(uint _optionId, uint256 amount, bool action) external nonReentrant {
        hedgingOption storage hedge = hedgeMap[_optionId];
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to request");
        require(topupMap[topupRequestID].state == 0, "Request already accepted");

        bool requestAccept; 
        if(!action) {
            topupRequestID += 1;
            hedge.topupRequests.push(topupRequestID);
        } else {
            requestAccept = true;
            topupMap[topupRequestID].state = 1;
        }

        address tokenToUse = (msg.sender == hedge.owner) ? hedge.token : hedge.paired;
        // Topup tokens
        (, , , uint256 withdrawable, , ) = getUserTokenBalances(tokenToUse, msg.sender);
        require(withdrawable >= amount, "Insufficient Vault balance. Deposit more tokens");
        // Update lockedinuse
        userBalance storage bal = userBalanceMap[tokenToUse][msg.sender];
        bal.lockedinuse = bal.lockedinuse.add(hedge.cost);
        userBalanceMap[tokenToUse][msg.sender] = bal;
        if (topupMap[topupRequestID].amountWriter == 0 && topupMap[topupRequestID].amountTaker == 0){
            topupMap[topupRequestID].requester = msg.sender;
        }
        // Update hedge amount/cost
        if (msg.sender == hedge.owner) {
            hedge.amount += amount;
            topupMap[topupRequestID].amountWriter += amount;
        } else {
            hedge.cost += amount;
            topupMap[topupRequestID].amountTaker += amount;
        }
        emit topupRequested(msg.sender, _optionId, amount, requestAccept);
    }

    function rejectTopupRequest(uint _optionId, uint _requestID) external {
        hedgingOption storage hedge = hedgeMap[_optionId];
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to reject");
        require(topupMap[_requestID].state == 0, "Request already accepted or rejected");
        topupMap[_requestID].state = 2;
    }

    function cancelTopupRequest(uint _requestID) external {
        require(topupMap[_requestID].amountTaker == 0, "Request already accepted");
        require(topupMap[_requestID].requester == msg.sender, "Only owner can cancel");
        topupMap[_requestID].state = 2;
    }

    function zapRequest(uint _optionId) external {  
        hedgingOption storage hedge = hedgeMap[_optionId];    
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to request");
        require(hedge.dt_started > block.timestamp, "Hedge not taken yet");
        if(msg.sender == hedge.owner) {
            hedge.zapWriter = true;
        } else {
            hedge.zapTaker = true;
        }
        emit zapRequested(_optionId, msg.sender);
    }
    
    // Settlement 
    // value is calculated using 'getOptionValue' function
    // strike value is determined by writer, thus pegging a strike price inherently. Start value is set when hedge is taken
    // Premium is cost and paid in pair currency of underlying token
    // for swaps the cost is 100% equal value to underlying start value, this acts as collateral rather than hedge premium
    // the payoff (difference between start and strike value) is paid in underlying or pair currency
    // losses are immediately debited from withdrawn. for winner, profits are credited to deposited balance direct
    // restore initials for both parties, funds are moved from lockedinuse to deposit, reverse of creating or buying
    // fees are collected in paired tokens; if option cost was paid to owner as winning, if swap cost used as PayOff
    // fees are collected in underlying tokens; if option and swap PayOffs were done in underlying tokens
    // hedge fees are collected into address(this) userBalanceMap and manually distributed as dividents to a staking contract
    // miners are the ones who settle hedges. Stake tokens to be able to mine hedges.
    // miners can pick hedges with tokens and amounts they wish to mine & avoid accumulating mining rewards in unwanted tokens
    // miner dust can be deposited into mining dust liquidation pools that sell the tokens at a discount & miners claim their share
    // each wallet has to log each token interacted with for the sake of pulling all balances credited to it on settlement. This allows for net worth valuations on wallets
    // protocol revenues are stored under userBalanceMap[address(this)] storage
    // on revenue; protocol revenue from taxing hedges ARE moved to staking contract as staking dividents
    // on revenue; proceeds for mining a hedge, are NOT moved to staking contract
    // on revenue; native equity swap liquidity proceeds ARE moved to staking contract
    // on revenue; revenue for providing native-collateral ARE transferred to staking contract
    // only parties in the deal can settle it for now, in testnet, miners to be intergrated later in testnet
    
    struct HedgeInfo {
        uint256 underlyingValue;
        uint256 payOff;
        uint256 priceNow;
        uint256 tokensDue;
        uint256 tokenFee;
        uint256 pairedFee;
        bool marketOverStart;
        bool isBelowStrikeValue;
        bool newAddressFlag;
    }

    function settleHedge(uint256 _optionId) external {
        HedgeInfo memory hedgeInfo;
        require(_optionId < optionID, "Invalid option ID");
        hedgingOption storage option = hedgeMap[_optionId];
        // Check if either zapWriter or zapTaker flags are true, or if the hedge has expired
        require(option.zapWriter && option.zapTaker || block.timestamp >= option.dt_expiry, "Hedge cannot be settled yet");

        (hedgeInfo.underlyingValue, ) = getUnderlyingValue(option.token, option.amount);

        userBalance storage oti = userBalanceMap[option.paired][option.owner];
        userBalance storage otiU = userBalanceMap[option.token][option.owner];
        userBalance storage tti = userBalanceMap[option.paired][option.taker];
        userBalance storage ttiU = userBalanceMap[option.token][option.taker];
        userBalance storage ccBT = userBalanceMap[option.paired][address(this)];
        userBalance storage ccUT = userBalanceMap[option.token][address(this)];
        userBalance storage minrT = userBalanceMap[option.token][address(this)];
        userBalance storage minrB = userBalanceMap[option.paired][address(this)];

        hedgeInfo.pairedFee = calculateFee(option.cost);
        hedgeInfo.newAddressFlag = ttiU.deposited == 0;

        if (option.hedgeType == HedgeType.CALL) {
            hedgeInfo.marketOverStart = hedgeInfo.underlyingValue > option.startValue.add(option.cost);
            if (hedgeInfo.marketOverStart) {
                // Taker profit in pair currency = underlying - cost - strike value
                // Convert to equivalent tokens lockedInUse by owner, factor fee
                // Check if collateral is enough, otherwise use max balance from Owner lockedInUse
                hedgeInfo.payOff = hedgeInfo.underlyingValue.sub(option.startValue.add(option.cost));
                (hedgeInfo.priceNow, ) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff.div(hedgeInfo.priceNow);
                if (otiU.lockedinuse < hedgeInfo.tokensDue){
                    hedgeInfo.tokensDue = otiU.lockedinuse;
                }
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take full gains from owner, credit taxed payoff to taker, pocket difference
                ttiU.deposited = ttiU.deposited.add(hedgeInfo.tokensDue.sub(hedgeInfo.tokenFee));
                otiU.lockedinuse = otiU.lockedinuse.sub(option.amount.sub(hedgeInfo.tokensDue));
                otiU.withdrawn = otiU.withdrawn.add(hedgeInfo.tokensDue);
                // Restore winners collateral
                oti.deposited = oti.deposited.add(option.cost.sub(hedgeInfo.pairedFee));
                tti.lockedinuse = tti.lockedinuse.sub(option.cost);
                tti.withdrawn = tti.withdrawn.add(option.cost);
                // Move cost - credit taxes in both, as profit is in underlying and cost is in pair
                ccUT.deposited = ccUT.deposited.add((hedgeInfo.tokenFee * 85) / 100);
                ccBT.deposited = ccBT.deposited.add((hedgeInfo.pairedFee * 85) / 100);
                // Miner fee - 15% of protocol fee for settling option. Mining call options always come with 2 token fees
                minrT.deposited = minrT.deposited.add((hedgeInfo.tokenFee * 15) / 100);
                minrB.deposited = minrB.deposited.add((hedgeInfo.pairedFee * 15) / 100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(hedgeInfo.payOff.sub(calculateFee(hedgeInfo.payOff)), option.paired, option.owner, option.taker, 1);
            } else {
                // Move payoff - owner wins cost & losses nothing. 
                oti.deposited = oti.deposited.add(option.cost.sub(hedgeInfo.pairedFee));
                tti.lockedinuse = tti.lockedinuse.sub(option.cost);
                tti.withdrawn = tti.withdrawn.add(option.cost);
                // Restore winners collateral - underlying to owner. none to taker.
                oti.lockedinuse = oti.lockedinuse.sub(option.amount);
                // Move money - credit pair fees only as the payout is in paired currency. 
                ccBT.deposited = ccBT.deposited.add((hedgeInfo.pairedFee * 85) / 100);
                minrB.deposited = minrB.deposited.add((hedgeInfo.pairedFee * 15) / 100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(option.cost.sub(hedgeInfo.pairedFee), option.paired, option.owner, option.taker, 0);
            }
        } else if (option.hedgeType == HedgeType.PUT) {
            hedgeInfo.isBelowStrikeValue = hedgeInfo.underlyingValue < option.startValue.sub(option.cost);
            if (hedgeInfo.isBelowStrikeValue) {
                // Taker profit in paired = strike value - underlying - cost
                // Convert to equivalent tokens lockedInUse by writer, factor fee
                // Check if writer collateral is enough, otherwise use max balance from writer lockedInUse
                hedgeInfo.payOff = option.startValue.sub(hedgeInfo.underlyingValue).sub(option.cost);
                (hedgeInfo.priceNow, ) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff.div(hedgeInfo.priceNow);
                if (otiU.lockedinuse < hedgeInfo.tokensDue){
                    hedgeInfo.tokensDue = otiU.lockedinuse;
                }
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take value difference from writer, credit taxed payoff to taker, pocket difference
                ttiU.deposited = ttiU.deposited.add(hedgeInfo.tokensDue.sub(hedgeInfo.tokenFee));
                otiU.lockedinuse = otiU.lockedinuse.sub(option.amount.sub(hedgeInfo.tokensDue));
                otiU.withdrawn = otiU.withdrawn.add(hedgeInfo.tokensDue);
                // Restore winners collateral
                oti.deposited = oti.deposited.add(option.cost.sub(hedgeInfo.pairedFee));
                tti.lockedinuse = tti.lockedinuse.sub(option.cost);
                tti.withdrawn = tti.withdrawn.add(option.cost);
                // Move cost - credit taxes in both, as profit is in underlying and cost is in paired
                ccUT.deposited = ccUT.deposited.add((hedgeInfo.tokenFee * 85) / 100);
                ccBT.deposited = ccBT.deposited.add((hedgeInfo.pairedFee * 85) / 100);
                // Miner fee - 15% of protocol fee for settling option. Mining call options always come with 2 token fees
                minrT.deposited = minrT.deposited.add((hedgeInfo.tokenFee * 15) / 100);
                minrB.deposited = minrB.deposited.add((hedgeInfo.pairedFee * 15) / 100);
                logPL(hedgeInfo.payOff.sub(calculateFee(hedgeInfo.payOff)), option.paired, option.owner, option.taker, 1);
            } else {
                // Move payoff - owner wins cost & losses nothing
                oti.deposited = oti.deposited.add(option.cost.sub(hedgeInfo.pairedFee));
                tti.lockedinuse = tti.lockedinuse.sub(option.cost);
                tti.withdrawn = tti.withdrawn.add(option.cost);
                // Restore winners collateral - underlying to owner. none to taker
                oti.lockedinuse = oti.lockedinuse.sub(option.amount);
                // Move money - credit pair fees only as the payout is in paired. 
                ccBT.deposited = ccBT.deposited.add((hedgeInfo.pairedFee * 85) / 100);
                minrB.deposited = minrB.deposited.add((hedgeInfo.pairedFee * 15) / 100);
                logPL(option.cost.sub(hedgeInfo.pairedFee), option.paired, option.owner, option.taker, 0);
            }
        } else if (option.hedgeType == HedgeType.SWAP) {
            if (hedgeInfo.underlyingValue > option.startValue) {
                hedgeInfo.payOff = hedgeInfo.underlyingValue.sub(option.startValue);
                if (hedgeInfo.payOff > option.cost) {
                    hedgeInfo.payOff = option.cost;
                }
                (hedgeInfo.priceNow, ) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff.div(hedgeInfo.priceNow);
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move money - in underlying, take full gains from owner, credit taxed amount to taker, pocket difference
                ttiU.deposited = ttiU.deposited.add(hedgeInfo.tokensDue.sub(hedgeInfo.tokenFee));
                otiU.lockedinuse = otiU.lockedinuse.sub(option.amount);
                otiU.withdrawn = otiU.withdrawn.add(hedgeInfo.tokensDue);
                 // Restore winner collateral - for taker restore cost (swaps have no premium)
                tti.lockedinuse = tti.lockedinuse.sub(option.cost);
                // Move money - take taxes from profits in underlying. none in paired because taker won underlying tokens
                ccUT.deposited = ccUT.deposited.add((hedgeInfo.tokenFee * 85) / 100);
                // Miner fee - 15% of protocol fee for settling option. none in paired because taker won underlying tokens
                minrT.deposited = minrT.deposited.add((hedgeInfo.tokenFee * 15) / 100);
                logPL(hedgeInfo.payOff.sub(calculateFee(hedgeInfo.payOff)), option.paired, option.owner, option.taker, 0);
            } else {                
                hedgeInfo.payOff = option.startValue.sub(hedgeInfo.underlyingValue);
                if (hedgeInfo.payOff > option.cost) {
                    hedgeInfo.payOff = option.cost;
                }
                // Move payoff - loss of paired cost to taker only, owner loses nothing
                // 1. credit equivalent payoff in paired to owner
                // 2. credit takers full cost back & then debit loss using withrawn instantly
                oti.deposited = oti.deposited.add(hedgeInfo.payOff.sub(hedgeInfo.pairedFee));
                tti.lockedinuse = tti.lockedinuse.sub(option.cost);
                tti.withdrawn = tti.withdrawn.add(hedgeInfo.payOff);
                // Restore winner collateral - for owner, all underlying tokens
                otiU.lockedinuse = otiU.lockedinuse.sub(option.amount);
                // Move money - profits in pair so only paired fees credited
                ccBT.deposited = ccBT.deposited.add((hedgeInfo.pairedFee * 85) / 100);
                // Miner fee - 15% of protocol fee for settling option. none in underlying tokens
                minrB.deposited = minrB.deposited.add((hedgeInfo.pairedFee * 15) / 100);
                logPL(hedgeInfo.payOff, option.paired, option.owner, option.taker, 1);
            }
        }

        option.status = 3;
        option.endValue = hedgeInfo.underlyingValue;
        option.dt_settled = block.timestamp;

        if(option.hedgeType == HedgeType.CALL || option.hedgeType == HedgeType.PUT) {
            optionsSettled[option.token].push(_optionId);            
        }
        if(option.hedgeType == HedgeType.SWAP) {
            equityswapsSettled[option.token].push(_optionId);
        }
        logMiningData(msg.sender);
        logAnalyticsFees(option.token, hedgeInfo.tokenFee, hedgeInfo.pairedFee, hedgeInfo.tokensDue, option.cost, hedgeInfo.underlyingValue);
        
        // Catch new erc20 address so that wallet can log all underlying token balances credited to it
        // Paired addresses already caught on deposit by wallet
        if(hedgeInfo.tokensDue > 0 && hedgeInfo.newAddressFlag) {            
            userERC20s[option.taker].push(option.token);            
        }
    
        emit hedgeSettled(option.token, _optionId, hedgeInfo.underlyingValue, hedgeInfo.payOff, msg.sender);
        emit minedHedge(_optionId, msg.sender, option.token, option.paired, hedgeInfo.tokenFee, hedgeInfo.pairedFee);
    }

    function logMiningData(address miner) internal {
        settledTradesCount ++;
        if(!minerMap[miner]) {
            minerMap[miner] = true;
            miners ++;
        }
    }

    function logAnalyticsFees(address token, uint256 tokenFee, uint256 pairedFee, uint256 tokenProfit, uint256 pairProfit, uint256 endValue) internal {
        (address paired, ) = getPairAddressZK(token);
        // all profits made by traders
        protocolProfitsTokens[token] = protocolProfitsTokens[token].add(tokenProfit); 
        protocolPairProfits[paired] = protocolPairProfits[paired].add(pairProfit);
        // fees collected by protocol
        protocolFeesTokens[token] = protocolFeesTokens[token].add(tokenFee);
        protocolPairedFees[paired] = protocolPairedFees[paired].add(pairedFee);
        settledVolume[paired] = settledVolume[paired].add(endValue);
    }

    function logPL(uint256 amount, address paired, address optionowner, address optiontaker, uint winner) internal {
        if(winner == 0) {
            userPLMap[paired][optionowner].profits = userPLMap[paired][optionowner].profits.add(amount);
            userPLMap[paired][optiontaker].losses = userPLMap[paired][optiontaker].losses.add(amount);
        } else if(winner == 1) {
            userPLMap[paired][optiontaker].profits = userPLMap[paired][optiontaker].profits.add(amount);
            userPLMap[paired][optionowner].losses = userPLMap[paired][optionowner].losses.add(amount);
        }
    }

    // Fees
    function updateFee(uint256 numerator, uint256 denominator) onlyOwner external {
      feeNumerator = numerator;
      feeDenominator = denominator;
    }
    
    function calculateFee(uint256 amount) public view returns (uint256){
      require(amount >= feeDenominator, "Revenue is too small");    
      uint256 amountInLarge = amount.mul(feeDenominator.sub(feeNumerator));
      uint256 amountIn = amountInLarge.div(feeDenominator);
      uint256 fee = amount.sub(amountIn);
      return (fee);
    }

    // Toggle hedge bookmark using ID
    function bookmarkHedge(uint256 _optionId) external {
        bool bookmarked = bookmarks[msg.sender][_optionId];
        bookmarks[msg.sender][_optionId] = !bookmarked;
        emit bookmarkToggle(msg.sender, _optionId, !bookmarked);
        // Update bookmarkedOptions array for wallet
        if (!bookmarked) {
            bookmarkedOptions[msg.sender].push(_optionId);
        } else {
            uint256[] storage options = bookmarkedOptions[msg.sender];
            for (uint256 i = 0; i < options.length; i++) {
                if (options[i] == _optionId) {
                    // When values match remove the optionId from array
                    if (i < options.length - 1) {
                        options[i] = options[options.length - 1];
                    }
                    options.pop();
                    break;
                }
            }
        }
    }

    // Get Bookmarks
    function getBookmark(address user, uint256 _optionId) public view returns (bool) {
        return bookmarks[user][_optionId];
    }

    function getmyBookmarks(address user) public view returns (uint256[] memory) {
        return bookmarkedOptions[user];
    }

    //==============================
    // Getter functions start here.
    //==============================

    struct PairInfo {
        address pairAddress;
        address pairedCurrency;
        ERC20 token0;
        ERC20 token1;
        uint112 reserve0;
        uint112 reserve1;
        uint256 token0Decimals;
        uint256 token1Decimals;
    }
    
    // Get token value in paired currency.
    // paired value is always the pair address of the token provided. get pair using UniswapV2 standard.
    function getUnderlyingValue(address _tokenAddress, uint256 _tokenAmount) public view returns (uint256, address) {
        PairInfo memory pairInfo;
        (pairInfo.pairAddress, pairInfo.pairedCurrency) = getPairAddressZK(_tokenAddress);
        IUniswapV2Pair pair = IUniswapV2Pair(pairInfo.pairAddress);
        if (pair.token0() == address(0) || pair.token1() == address(0)) { return (0, address(0));}
        pairInfo.token0 = ERC20(pair.token0());
        pairInfo.token1 = ERC20(pair.token1());
        (pairInfo.reserve0, pairInfo.reserve1, ) = pair.getReserves();
        pairInfo.token0Decimals = uint256(10) ** pairInfo.token0.decimals();
        pairInfo.token1Decimals = uint256(10) ** pairInfo.token1.decimals();
        uint256 tokenValue;
        if (_tokenAddress == pair.token0()) {
            tokenValue = (_tokenAmount * pairInfo.reserve1 * pairInfo.token1Decimals) / (pairInfo.reserve0 * pairInfo.token0Decimals);
            return (tokenValue, pairInfo.pairedCurrency);
        } else if (_tokenAddress == pair.token1()) {
            tokenValue = (_tokenAmount * pairInfo.reserve0 * pairInfo.token0Decimals) / (pairInfo.reserve1 * pairInfo.token1Decimals);
            return (tokenValue, pairInfo.pairedCurrency);
        } else {
            revert("Invalid token address");
        }
    }

    // Zero Knowledge pair address generator
    function getPairAddressZK(address tokenAddress) public view returns (address pairAddress, address pairedCurrency) {
        IUniswapV2Factory factory = IUniswapV2Factory(UNISWAP_FACTORY_ADDRESS);
        address wethPairAddress = factory.getPair(tokenAddress, wethAddress);
        address usdtPairAddress = factory.getPair(tokenAddress, usdtAddress);
        address usdcPairAddress = factory.getPair(tokenAddress, usdcAddress);
        if (wethPairAddress != address(0)) {
            return (wethPairAddress, wethAddress);
        } else if (usdtPairAddress != address(0)) {
            return (usdtPairAddress, usdtAddress);
        } else if (usdcPairAddress != address(0)) {
            return (usdcPairAddress, usdcAddress);
        } else {
            revert("TokenValue: token is not paired with WETH, USDT, or USDC");
        }
    }

    // Token balances breakdown for wallet
    function getUserTokenBalances (address token, address user) public view returns (uint256 deposited, uint256 withdrawn, uint256 lockedinuse, uint256 withdrawable, uint256 withdrawableValue, address paired) {
        userBalance memory uto = userBalanceMap[address(token)][address(user)];
        deposited = uto.deposited;
        withdrawn = uto.withdrawn;
        lockedinuse = uto.lockedinuse;
        withdrawable = (uto.deposited).sub(uto.withdrawn).sub(uto.lockedinuse);
        if(token != usdtAddress && token != usdcAddress ){
            (withdrawableValue, paired) = getUnderlyingValue(token, withdrawable);
        }else{
            (withdrawableValue, paired) = (withdrawable, address(0));
        }
        return (deposited, withdrawn, lockedinuse, withdrawable, withdrawableValue, paired);
    }
    
    // Internal function to retrieve a subset of an array based on startIndex and limit
    function getSubset(uint[] storage fullArray, uint startIndex, uint limit) internal view returns (uint[] memory) {
        uint length = fullArray.length;
        require(startIndex <= length, "Start index equal array length");
        if (length == 0) {
            return new uint[](0); //return empty array
        }
        uint actualLimit = (length - startIndex < limit) ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = 0; i < actualLimit; i++) {
            subset[i] = fullArray[startIndex + i];
        }
        // Resize the array to remove unused slots
        assembly {
            mstore(subset, actualLimit)
        }
        return subset;
    }

    // Function to retrieve a subset of tokens from a user's history.
    function getUserHistory(address user, uint startIndex, uint limit) public view returns (address[] memory) {
        address[] storage tokens = userERC20s[user];
        uint length = tokens.length;
        require(startIndex <= length, "Invalid start index");
        if (length == 0) {
            return new address[](0); //return empty array
        }
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        address[] memory result = new address[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            result[i - startIndex] = tokens[i];
        }
        // Resize the array to remove unused slots
        assembly {
            mstore(result, actualLimit)
        }
        return result;
    }

    // Functions to retrieve a subset of options or swaps created/taken by a user
    function getUserOptionsCreated(address user, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(myoptionsCreated[user], startIndex, limit);
    }

    function getUserSwapsCreated(address user, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(myswapsCreated[user], startIndex, limit);
    }

    function getUserOptionsTaken(address user, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(myoptionsTaken[user], startIndex, limit);
    }

    function getUserSwapsTaken(address user, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(myswapsTaken[user], startIndex, limit);
    }
    
    // Functions to retrieve PL for user
    function getEquivUserPL(address user, address pairedCurrency) external view returns (uint256 profits, uint256 losses) {
        return (userPLMap[pairedCurrency][user].profits, userPLMap[pairedCurrency][user].losses);
    }

    // Helper function to retrieve a subset of options or swaps created/taken
    function getAllOptions(uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(optionsCreated, startIndex, limit);
    }

    function getAllSwaps(uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(equityswapsCreated, startIndex, limit);
    }

    // Function to retrieve a subset of options or swaps taken
    function getAllOptionsTaken(uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(optionsTaken, startIndex, limit);
    }

    function getAllSwapsTaken(uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(equityswapsTaken, startIndex, limit);
    }

    // Function to retrieve purchased options or swaps for ERC20 address
    function getBoughtOptionsERC20(address _token, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(optionsBought[_token], startIndex, limit);
    }

    function getBoughtSwapsERC20(address _token, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(equityswapsBought[_token], startIndex, limit);
    }

    // Function to retrieve settled options or swaps for ERC20 address
    function getSettledOptionsERC20(address _token, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(optionsSettled[_token], startIndex, limit);
    }

    function getSettledSwapsERC20(address _token, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(equityswapsSettled[_token], startIndex, limit);
    }

    // Function to retrieve a subset of options or swaps for a specific token
    function getOptionsForToken(address _token, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(tokenOptions[_token], startIndex, limit);
    }

    function getSwapsForToken(address _token, uint startIndex, uint limit) public view returns (uint[] memory) {
        return getSubset(tokenSwaps[_token], startIndex, limit);
    }

    // Function to get hedge details
    function getHedgeDetails(uint256 _optionId) public view returns (hedgingOption memory) {
        hedgingOption storage hedge = hedgeMap[_optionId];
        require(hedge.owner != address(0), "Option does not exist");
        return hedge;
    }

    function getHedgeRange(uint256 startId, uint256 endId) public view returns (hedgingOption[] memory) {
        require(endId >= startId, "Invalid range");

        uint256 rangeSize = endId - startId + 1;
        hedgingOption[] memory result = new hedgingOption[](rangeSize);
        uint256 count = 0;

        for (uint256 i = 0; i < rangeSize; i++) {
            uint256 optionId = startId + i;
            hedgingOption storage hedge = hedgeMap[optionId];
            if (hedge.owner != address(0)) {
                result[count] = hedge;
                count++;
            }
        }

        // Resize the array to remove unused slots
        assembly {
            mstore(result, count)
        }

        return result;
    }
    
    // Function to get the length of the options array for a specific token
    function getCountTokenOptions(address token) external view returns (uint) {
        return tokenOptions[token].length;
    }
     function getCountTokenSwaps(address token) external view returns (uint) {
        return tokenSwaps[token].length;
    }

    // Function to get the length of the options array for a specific user
    function getUserOptionCount(address user, bool store) external view returns (uint) {
        if(store) {
            return myoptionsCreated[user].length;
        } else {
            return myoptionsTaken[user].length;
        }
    }
    function getUserSwapCount(address user, bool store) external view returns (uint) {
        if(store) {
            return myswapsCreated[user].length;
        } else {
            return myswapsTaken[user].length;
        }        
    }

    // Receive function to accept Ether
    receive() external payable {
        emit received(msg.sender, msg.value);
    }
}
