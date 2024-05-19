// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

// NEON Protocol - ERC20 based tools for hedging and lending.
//Deposit, Withdraw ERC20 tokens
//Get underlying value for tokens in WETH, USDT AND USDC
//Create, Take Call Options, Put Options and Equity Swaps OTC
//Settle trade in base or underlying value equivalent on maturity
//Payout profits and fees to parties, protocol, miner
//Distribute revenue or third party service stakes
//Read hedging data storages; array lists, individual mappings and structs, collective mappings and variables

// Options Functionality
//1. to receive any ERC20 token as collateral/underlying tokens
//2. Price tokens in base currency via getUnderlyingValue
//4. enable options writing using tokens as underlying assets
//5. enable options buying in base currency for stipulated duration
//6. settlement based on price of assets in comparison to strike value & terms
//7. payment and logging of proceeds, fees and commissions for protocol and parties involved
//8. read smart contract data on wallet balances, hedge activity, revenue logs

//key functions
// - value
// - deposit
// - withdraw
// - calculate fees
// - get pair addresses of all erc20
// - create hedge
// - buy hedge
// - settle hedge
// - withdrawable versus locked
// - get hedge details by id
// - fetch hedges

//key dependencies
// 1. getReserves Uniswap

//dev guides
// - addresses can deposit or withdraw tokens 
// - all tokens are treated as ERC20
// - uniswap version 2 router is used in beta protocol
// - deposits, lockedinuse and withdrawals track wallets balances
// - lockedinuse is the current account (+-) on trades, and acts as escrow for each deal
// - only base currencies :weth, usdt and usdc contract balance tracked
// - getUnderlyingValue fetches value of tokens & returns base value & pair address
// - unified writing, taking and settlement functions
// - each hedge is taxed upon settlement, in relevant tokens (base or underlying)
// - contract taxes credited in mappings under address(this) and send out to staking/rewards contract

import "./SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract HEDGEFUND {

    using SafeMath for uint256;
    bool private locked = false;
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
      uint256 lockedinuse; // adjust on hedge creation or buy or settle
    }
    struct contractBalance {
      uint256 deposited;
      uint256 withdrawn;
    }
    struct hedgingOption{
      address owner;
      address taker;
      address token;
      address paired;
      uint status;//0 - none, 1 - created, 2 - taken, 3 - settled
      uint256 amount;
      uint256 createValue;
      uint256 startvalue;
      uint256 endvalue;
      uint256 cost;
      uint256 dt_created;
      uint256 dt_started;
      uint256 dt_expiry;
      uint256 dt_settled;
      HedgeType hedgeType;
    }
    enum HedgeType {CALL, PUT, SWAP}

    struct userPL{
        uint256 winnings;
        uint256 losses;
    }

    // mapping of wallet token balances [token][user]
    mapping(address => mapping(address => userBalance)) private userBalanceMap;

    // mapping of wallet profit & loss [pair][user]
    mapping(address => mapping(address => userPL)) private userPLMap;

    //mapping of user-hedge-Ids array for each erc20 token
    mapping(address => mapping(address => uint[])) private userHedgesForTokenMap;

    // track all erc20 deposits and withdrawals to contract
    mapping(address => contractBalance) public protocolBalanceMap;

    // mapping of all hedge storages by Id
    mapping(uint => hedgingOption) private hedgeMap;

    // mapping of all hedges & swaps for each erc20
    mapping(address => uint[]) private tokenOptions;
    mapping(address => uint[]) private tokenSwaps;

    // mapping of all hedges for user by Id
    mapping(address => uint[]) myoptionsHistory;
    mapping(address => uint[]) myswapsHistory;
    mapping(address => uint[]) myoptionsCreated;
    mapping(address => uint[]) myoptionsTaken;
    mapping(address => uint[]) myswapsCreated;
    mapping(address => uint[]) myswapsTaken;
    
    // mapping of all tokens transacted by user
    mapping(address => address[]) public userERC20s;
    mapping(address => address[]) public baseERC20s;

    // mapping of all protocol profits and fees collected from hedges
    mapping(address => uint256) public protocolProfitsTokens;//liquidated to bases at discount
    mapping(address => uint256) public protocolProfitsBases;
    mapping(address => uint256) public protocolFeesTokens;//liquidated to bases at discount
    mapping(address => uint256) public protocolFeesBases;
    mapping(address => uint256) public protocolCreateValue;
    mapping(address => uint256) public protocolTakenValue;
    mapping(address => uint256) public protocolCostValue;
    mapping(address => uint256) public protocolSwapsValue;
    mapping(address => uint256) public protocolOptionsValue;
    mapping(address => uint256) public protocolSettleValue;

    // more volume mappings
    mapping(address => uint256) public protocolCashierFees;
    mapping(address => uint256) public wethEquivUserHedged;
    mapping(address => uint256) public usdtEquivUserHedged;
    mapping(address => uint256) public usdcEquivUserHedged;
    mapping(address => uint256) public wethEquivUserCosts;
    mapping(address => uint256) public usdtEquivUserCosts;
    mapping(address => uint256) public usdcEquivUserCosts;    

    // mapping bookmarks of each user
    mapping(address => mapping(uint256 => bool)) public bookmarks;
    mapping(address => uint256[]) public bookmarkedOptions; // Array to store bookmarked optionIds for each user
    
    // all hedges
    uint[] private optionsCreated;
    uint[] private hedgesTaken;
    uint[] private equityswapsCreated;
    uint[] private equityswapsTaken;
    
    // global counters
    uint public optionID;
    
    // fee variables
    uint256 public feeNumerator;
    uint256 public feeDenominator;

    // erc20 deposits equiv in base currencies
    uint256 public wethEquivDeposits;
    uint256 public usdtEquivDeposits;
    uint256 public usdcEquivDeposits;

    // erc20 withdrawals equiv in base currencies
    uint256 public wethEquivWithdrawals;
    uint256 public usdtEquivWithdrawals;
    uint256 public usdcEquivWithdrawals;
    
    // core addresses
    address private constant UNISWAP_FACTORY_ADDRESS = 0xc35DADB65012eC5796536bD9864eD8773aBc74C4;
    address private constant UNISWAP_ROUTER_ADDRESS = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506;
    address public wethAddress;
    address public usdtAddress;
    address public usdcAddress;
    address public neonAddress;
    address public owner;

    //events
    event Received(address, uint);
    event onDeposit(address indexed token, uint256 indexed amount, address indexed wallet);
    event onWithdraw(address indexed token, uint256 indexed amount, address indexed wallet);
    event hedgeCreated(address indexed token, uint256 indexed optionId, uint256 amount, HedgeType hedgeType, uint256 cost);
    event hedgePurchased(address indexed token, uint256 indexed optionId, uint256 amount, HedgeType hedgeType, address buyer);
    event hedgeSettled(address indexed token, uint256 indexed optionId, uint256 amount, uint256 indexed payOff, uint256 endvalue);
    event minedHedge(uint256 optionId, address indexed miner, address indexed token, address indexed paired, uint256 tokenFee, uint256 baseFee);
    event bookmarkToggle(address indexed user, uint256 hedgeId, bool bookmarked);

    constructor() public {
        IUniswapV2Router02 router = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        wethAddress = router.WETH();
        usdtAddress = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9; // USDT address on Arb
        usdcAddress = 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d; // USDC address on Arb
        neonAddress = 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d;
        // variables
        feeNumerator = 5;
        feeDenominator = 1000;
        owner = msg.sender;
    }

    function depositToken(address _token, uint256 _amount) public payable {
        require(_amount > 0, "Your attempting to transfer 0 tokens");
        
        // Deposit token to contract
        uint256 allowance = IERC20(_token).allowance(msg.sender, address(this));
        require(allowance >= _amount, "You need to set a higher allowance");
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        // Log user balance & tokens
        userBalance storage uto = userBalanceMap[_token][msg.sender];
        uto.deposited = uto.deposited.add(_amount);
        if(uto.deposited == 0){
          userERC20s[msg.sender].push(_token);
        }
        // Log new token address
        // protocolBalanceMap ia analytics only. userBalanceMap stores withdrawable balance
        if(protocolBalanceMap[_token].deposited == 0){
          userERC20s[address(this)].push(_token);
        }
        protocolBalanceMap[_token].deposited += _amount;
        
        // Log main base equivalents
        (uint256 marketValue, address paired) = getUnderlyingValue(_token, _amount);
        if(paired == wethAddress){wethEquivDeposits += marketValue;}
        if(paired == usdtAddress){usdtEquivDeposits += marketValue;}
        if(paired == usdcAddress){usdcEquivDeposits += marketValue;}        
        
        // Emit deposit event
        emit onDeposit(_token, _amount, msg.sender);
    }

    function withdrawToken(address token, uint256 amount) public {
        userBalance storage uto = userBalanceMap[token][msg.sender];
        uint256 withdrawable = getWithdrawableBalance(token, msg.sender);
        require(amount <= withdrawable && amount > 0, "You have Insufficient available balance");
        require(msg.sender != address(this), "Not allowed");

        // Tax withdrawals on bases only; WETH, USDT, USDC. 1/10 of settle tax
        uint256 tokenFee;
        if(token == wethAddress || token == usdtAddress || token == usdcAddress) {
            tokenFee = calculateFee(amount) / 10;
        }
        if(tokenFee > 0) {
            protocolCashierFees[token].add(tokenFee);
            userBalanceMap[token][address(this)].deposited.add(tokenFee);
        }
        // Withdraw
        uto.withdrawn = uto.withdrawn.add(amount);
        require(IERC20(token).transfer(msg.sender, amount - tokenFee), "Transfer failed");

        // Log main base value equivalents
        (uint256 marketValue, address paired) = getUnderlyingValue(token, amount);
        if(paired == wethAddress){wethEquivWithdrawals += marketValue;}
        if(paired == usdtAddress){usdtEquivWithdrawals += marketValue;}
        if(paired == usdcAddress){usdcEquivWithdrawals += marketValue;}

        // Emit withdrawal event
        emit onWithdraw(token, amount, msg.sender);
    }

    // Create Hedge: covers both call options and equity swaps. put options to be enabled in Beta V2
    //cost is in base currency or pair token
    //swap collateral must  be equal, settle function relies on this implementation here
    //put options will have amax loss check to only accept a strike price 50% away max
    function createHedge(bool tool, address token, uint256 amount, uint256 cost, uint256 deadline) public nonReentrant {
        require(!locked, "Function is locked");
        locked = true;
        require(amount > 0 && cost > 0 && deadline > block.timestamp, "Invalid option parameters");
        uint256 withdrawable = getWithdrawableBalance(token, msg.sender);
        require(withdrawable > 0, "Insufficient free balance");
        require(token != address(0), "Token address cannot be zero");
        require(token != UNISWAP_ROUTER_ADDRESS, "Token address cannot be router address");
        require(token != UNISWAP_FACTORY_ADDRESS, "Token address cannot be factory address");
        require(token != address(this), "Token address cannot be contract address");
        // Assign option values directly to the struct
        hedgingOption storage newOption = hedgeMap[optionID];
            newOption.owner = msg.sender;
            newOption.token = token;
            newOption.status = 1;
            newOption.amount = amount;
        (newOption.createValue, newOption.paired) = getUnderlyingValue(token, amount);
            newOption.cost = cost;
            newOption.dt_expiry = deadline;
            newOption.dt_created = block.timestamp;
            newOption.hedgeType = tool ? HedgeType.CALL : HedgeType.SWAP;

        // Update user balances for token in hedge
        userBalance storage hto = userBalanceMap[token][msg.sender]; 
        hto.lockedinuse += amount;
        // Update arrays
        if (newOption.hedgeType == HedgeType.SWAP) {
            require(cost >= newOption.createValue, " Swap collateral must be equal value");
            myswapsHistory[msg.sender].push(optionID);
            myswapsCreated[msg.sender].push(optionID);
            equityswapsCreated.push(optionID);
            tokenOptions[token].push(optionID);
        } else {
            myoptionsHistory[msg.sender].push(optionID);
            myoptionsCreated[msg.sender].push(optionID);
            optionsCreated.push(optionID);
            tokenSwaps[token].push(optionID);
        }
        // Log protocol analytics
        optionID++;
        protocolCreateValue[newOption.paired].add(newOption.createValue);

        // Wallet hedge volume in main bases only
        if(newOption.paired == wethAddress){wethEquivUserHedged[msg.sender] += newOption.createValue;}
        if(newOption.paired == usdtAddress){usdtEquivUserHedged[msg.sender] += newOption.createValue;}
        if(newOption.paired == usdcAddress){usdcEquivUserHedged[msg.sender] += newOption.createValue;}

        // Emit
        emit hedgeCreated(token, optionID, amount, newOption.hedgeType, cost);
        locked = false;
    }

    // Hedges are bought in base or paired currency of underlying token
    // For Call and Put Options cost is premium, lockedinuse here but paid out on settlement
    // For Equity Swaps cost is equal to underlying value as 100% collateral is required. There is no premium
    function buyHedge(uint256 _optionId) public nonReentrant {
        require(!locked, "Function is locked");
        locked = true;
        hedgingOption storage hedge = hedgeMap[_optionId];
        userBalance storage stk = userBalanceMap[hedge.paired][msg.sender];
        require(getWithdrawableBalance(hedge.paired, msg.sender) >= hedge.cost, "Insufficient free base balance");
        require(_optionId < optionID && msg.sender != hedge.owner, "Invalid option ID | Owner cant buy");
       
        // Calculate, check and update start value based on the hedge type
        (hedge.startvalue, ) = getUnderlyingValue(hedge.token, hedge.amount);
        if (hedge.hedgeType == HedgeType.CALL) {
            hedge.startvalue += hedge.cost;
        }
        require(hedge.startvalue > 0, "Math error whilst getting price");
        stk.lockedinuse = stk.lockedinuse.add(hedge.cost);
        hedge.dt_started = block.timestamp;
        hedge.taker = msg.sender;
        hedge.status = 2;

        // Store updated structs
        userBalanceMap[hedge.paired][msg.sender] = stk;
        hedgeMap[_optionId] = hedge;
        // Update arrays and takes count
        if (hedge.hedgeType == HedgeType.SWAP) {
            myswapsHistory[msg.sender].push(_optionId);
            equityswapsTaken.push(_optionId);
            myswapsTaken[msg.sender].push(_optionId);
        } else if(hedge.hedgeType == HedgeType.CALL) {
            myoptionsHistory[msg.sender].push(_optionId);
            hedgesTaken.push(_optionId);
            myoptionsTaken[msg.sender].push(_optionId);            
        }
        // Log base tokens involved in protocol revenue
        if(protocolTakenValue[hedge.paired] == 0){
            baseERC20s[address(this)].push(hedge.paired);
        }
        // Protocol Revenue Trackers
        protocolTakenValue[hedge.paired].add(hedge.startvalue);
        protocolCostValue[hedge.paired].add(hedge.cost);
        if (hedge.hedgeType == HedgeType.SWAP) {
            protocolSwapsValue[hedge.paired].add(hedge.startvalue);
        } else if(hedge.hedgeType == HedgeType.CALL) {
            protocolOptionsValue[hedge.paired].add(hedge.startvalue);
        }
        // Wallet hedge volume analytics in main bases only
        if(hedge.paired == wethAddress){wethEquivUserCosts[msg.sender] += hedge.startvalue;}
        if(hedge.paired == usdtAddress){usdtEquivUserCosts[msg.sender] += hedge.startvalue;}
        if(hedge.paired == usdcAddress){usdcEquivUserCosts[msg.sender] += hedge.startvalue;}

        // Emit the hedgePurchased event
        emit hedgePurchased(hedge.token, _optionId, hedge.amount, hedge.hedgeType, msg.sender);
        locked = false;
    }
    
    //Settlement 
    //value is calculated using 'getOptionValue' function
    //strike value is determined by creator, thus pegging a strike price inherently. Start value is set when hedge is taken
    //premium is cost and paid in base currency of underlying token
    //for swaps the cost is 100% equal value to underlying start value, this acts as collateral rather than hedge premium
    //the payoff (difference between start and strike value) is paid in underlying or base
    //losses are immediately debited from withdrawn. for winner, winnings are credited to deposited balance direct
    //restore initials for both parties, funds are moved from lockedinuse to deposit, reverse of creating or buying
    //fees are collected on base tokens; if option cost was paid to owner as winning, if swap cost used as PayOff
    //fees are collected on underlying tokens; if option and swap PayOffs were done in underlying tokens
    //hedge fees are collected into address(this) userBalanceMap and manually distributed as dividents to a staking contract
    //miners are the ones who settle hedges. Stake tokens to be able to mine hedges.
    //miners can pick hedges with tokens and amounts they wish to mine & avoid accumulating mining rewards in unwanted tokens
    //miner dust can be deposited into mining dust liquidation pools that sell the tokens at a discount & miners claim their share
    //each wallet has to log each token interacted with for the sake of pulling all balances credited to it on settlement. This allows for net worth valuations on wallets
    //protocol revenues are stored under userBalanceMap[address(this)] storage
    //on revenue; protocol revenue from taxing hedges ARE moved to staking contract as staking dividents
    //on revenue; proceeds for mining a hedge, are NOT moved to staking contract
    //on revenue; native equity swap liquidity proceeds ARE moved to staking contract
    //on revenue; revenue for providing native-collateral ARE transferred to staking contract
    
    struct HedgeInfo {
        uint256 startValue;
        uint256 underlyingValue;
        uint256 payOff;
        uint256 priceNow;
        uint256 tokensDue;
        uint256 tokenFee;
        uint256 baseFee;
        bool isPayoffOverCost;
        bool isBelowStrikeValue;
        bool newAddressFlag;
    }

    // Settle a hedge
    function settleHedge(uint256 _optionId) external {
        HedgeInfo memory hedgeInfo;
        require(_optionId < optionID, "Invalid option ID");
        hedgingOption storage option = hedgeMap[_optionId];
        require(block.timestamp >= option.dt_expiry, "Option has not expired");

        // Initialize local variables
        hedgeInfo.startValue = option.startvalue;
        (hedgeInfo.underlyingValue, ) = getUnderlyingValue(option.token, option.amount);

        // Get storage ready for user balances of the owner, taker, and contract
        userBalance storage oti = userBalanceMap[option.paired][option.owner];
        userBalance storage otiU = userBalanceMap[option.token][option.owner];
        userBalance storage tti = userBalanceMap[option.paired][option.taker];
        userBalance storage ttiU = userBalanceMap[option.token][option.taker];
        userBalance storage ccBT = userBalanceMap[option.paired][address(this)];
        userBalance storage ccUT = userBalanceMap[option.token][address(this)];
        userBalance storage minrT = userBalanceMap[option.token][address(this)];
        userBalance storage minrB = userBalanceMap[option.paired][address(this)];

        hedgeInfo.baseFee = calculateFee(option.cost);
        hedgeInfo.newAddressFlag = ttiU.deposited == 0;

        if (option.hedgeType == HedgeType.CALL) {
            hedgeInfo.isPayoffOverCost = hedgeInfo.underlyingValue > hedgeInfo.startValue.add(option.cost);
            if (hedgeInfo.isPayoffOverCost) {
                // Taker profit in base = underlying - cost - strike value
                hedgeInfo.payOff = hedgeInfo.underlyingValue.sub(hedgeInfo.startValue.add(option.cost));
                // Convert to equivalent tokens lockedInUse by owner, factor fee
                (hedgeInfo.priceNow, ) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff.div(hedgeInfo.priceNow);
                // Check if collateral is enough, otherwise use max balance from Owner lockedInUse
                if (otiU.lockedinuse < hedgeInfo.tokensDue){
                    hedgeInfo.tokensDue = otiU.lockedinuse;
                }
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take full gains from owner, credit taxed payoff to taker, pocket difference
                ttiU.deposited += hedgeInfo.tokensDue.sub(hedgeInfo.tokenFee);
                otiU.lockedinuse -= option.amount - hedgeInfo.tokensDue;
                otiU.withdrawn += hedgeInfo.tokensDue;
                // Restore winners collateral
                oti.deposited += option.cost.sub(hedgeInfo.baseFee);
                tti.lockedinuse -= option.cost;
                tti.withdrawn += option.cost;
                // Move cost - credit taxes in both, as profit is in underlying and cost is in base
                ccUT.deposited += (hedgeInfo.tokenFee * 85).div(100);
                ccBT.deposited += (hedgeInfo.baseFee * 85).div(100);
                // Miner fee - 15% of protocol fee for settling option. Mining call options always come with 2 token fees
                minrT.deposited += (hedgeInfo.tokenFee * 15).div(100);
                minrB.deposited += (hedgeInfo.baseFee * 15).div(100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(hedgeInfo.payOff - calculateFee(hedgeInfo.payOff), option.paired, option.owner, option.taker, 1);
            } else {
                // Move payoff - owner wins cost & losses nothing. 
                oti.deposited += option.cost.sub(hedgeInfo.baseFee);
                tti.lockedinuse -= option.cost;
                tti.withdrawn += option.cost;
                // Restore winners collateral - underlying to owner. none to taker.
                oti.lockedinuse -= option.amount;
                // Move money - credit base fees only as the payout is in base. 
                ccBT.deposited += (hedgeInfo.baseFee * 85).div(100);
                // Miner fee - 15% of protocol fee for settling option
                minrB.deposited += (hedgeInfo.baseFee * 15).div(100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(option.cost.sub(hedgeInfo.baseFee), option.paired, option.owner, option.taker, 0);
            }
        } else if (option.hedgeType == HedgeType.PUT) {
            hedgeInfo.isBelowStrikeValue = hedgeInfo.underlyingValue < hedgeInfo.startValue.add(option.cost);
            if (hedgeInfo.isBelowStrikeValue) {
                // Taker profit in base = strike value - underlying - cost
                hedgeInfo.payOff = hedgeInfo.startValue.sub(hedgeInfo.underlyingValue).sub(option.cost);
                // Convert to equivalent tokens lockedInUse by writer, factor fee
                (hedgeInfo.priceNow, ) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff.div(hedgeInfo.priceNow);
                // Check if writer collateral is enough, otherwise use max balance from writer lockedInUse
                if (otiU.lockedinuse < hedgeInfo.tokensDue){
                    hedgeInfo.tokensDue = otiU.lockedinuse;
                }
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take value difference from writer, credit taxed payoff to taker, pocket difference
                ttiU.deposited += hedgeInfo.tokensDue.sub(hedgeInfo.tokenFee);
                otiU.lockedinuse -= option.amount - hedgeInfo.tokensDue;
                otiU.withdrawn += hedgeInfo.tokensDue;
                // Restore winners collateral
                oti.deposited += option.cost.sub(hedgeInfo.baseFee);
                tti.lockedinuse -= option.cost;
                tti.withdrawn += option.cost;
                // Move cost - credit taxes in both, as profit is in underlying and cost is in base
                ccUT.deposited += (hedgeInfo.tokenFee * 85).div(100);
                ccBT.deposited += (hedgeInfo.baseFee * 85).div(100);
                // Miner fee - 15% of protocol fee for settling option. Mining call options always come with 2 token fees
                minrT.deposited += (hedgeInfo.tokenFee * 15).div(100);
                minrB.deposited += (hedgeInfo.baseFee * 15).div(100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(hedgeInfo.payOff - calculateFee(hedgeInfo.payOff), option.paired, option.owner, option.taker, 1);
            } else {
                // Move payoff - owner wins cost & losses nothing
                oti.deposited += option.cost.sub(hedgeInfo.baseFee);
                tti.lockedinuse -= option.cost;
                tti.withdrawn += option.cost;
                // Restore winners collateral - underlying to owner. none to taker
                oti.lockedinuse -= option.amount;
                // Move money - credit base fees only as the payout is in base. 
                ccBT.deposited += (hedgeInfo.baseFee * 85).div(100);
                // Miner fee - 15% of protocol fee for settling option
                minrB.deposited += (hedgeInfo.baseFee * 15).div(100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(option.cost.sub(hedgeInfo.baseFee), option.paired, option.owner, option.taker, 0);
            }
        } else if (option.hedgeType == HedgeType.SWAP) {
            if (hedgeInfo.underlyingValue > hedgeInfo.startValue) {
                hedgeInfo.payOff = hedgeInfo.underlyingValue.sub(hedgeInfo.startValue);
                // Max loss config
                if (hedgeInfo.payOff > option.cost) {
                    hedgeInfo.payOff = option.cost;
                }
                // Convert equivalent in tokens
                (hedgeInfo.priceNow, ) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff.div(hedgeInfo.priceNow);
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move money - in underlying, take full gains from owner, credit taxed amount to taker, pocket difference
                ttiU.deposited += hedgeInfo.tokensDue.sub(hedgeInfo.tokenFee);
                otiU.lockedinuse -= option.amount;
                otiU.withdrawn += hedgeInfo.tokensDue;
                // Restore winner collateral - for taker restore cost (swaps have no premium)
                tti.lockedinuse -= option.cost;
                // Move money - take taxes from winnings in underlying. none in base because taker won underlying tokens
                ccUT.deposited += (hedgeInfo.tokenFee * 85).div(100);
                // Miner fee - 15% of protocol fee for settling option. none in base because taker won underlying tokens
                minrT.deposited += (hedgeInfo.tokenFee * 15).div(100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(hedgeInfo.payOff - calculateFee(hedgeInfo.payOff), option.paired, option.owner, option.taker, 0);
            } else {                
                hedgeInfo.payOff = hedgeInfo.startValue.sub(hedgeInfo.underlyingValue);
                // Max loss config
                if (hedgeInfo.payOff > option.cost) {
                    hedgeInfo.payOff = option.cost;
                }
                // Move payoff - loss of base cost to taker only, owner loses nothing
                // 1. credit equivalent payoff in base to owner
                // 2. credit takers full cost back & then debit loss using withrawn instantly
                oti.deposited += hedgeInfo.payOff.sub(hedgeInfo.baseFee);
                tti.lockedinuse -= option.cost;
                tti.withdrawn += hedgeInfo.payOff;
                // Restore winner collateral - for owner, all underlying tokens
                otiU.lockedinuse -= option.amount;
                // Move money - winnings in base so only base fees credited
                ccBT.deposited += (hedgeInfo.baseFee * 85).div(100);
                // Miner fee - 15% of protocol fee for settling option. none in underlying tokens
                minrB.deposited += (hedgeInfo.baseFee * 15).div(100);
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(hedgeInfo.payOff, option.paired, option.owner, option.taker, 1);
            }
        }
        // Log analytics
        logAnalyticsFees(option.token, hedgeInfo.tokenFee, hedgeInfo.baseFee, hedgeInfo.tokensDue, option.cost, hedgeInfo.underlyingValue);
        
        // Update hedge
        option.status = 3;
        option.endvalue = hedgeInfo.underlyingValue;
        option.dt_settled = block.timestamp;

        // catch new erc20 address so that wallet can log all underlying token balances credited to it
        // base addresses already caught on deposit by wallet
        if(hedgeInfo.tokensDue > 0 && hedgeInfo.newAddressFlag) {            
            userERC20s[option.taker].push(option.token);            
        }

        // Emit
        emit hedgeSettled(option.token, _optionId, option.amount, hedgeInfo.payOff, hedgeInfo.underlyingValue);
        emit minedHedge(_optionId, msg.sender, option.token, option.paired, hedgeInfo.tokenFee, hedgeInfo.baseFee);
    }

    // Log Protocol Revenue
    // - use userBalanceMap to get raw revenue balances and populate sums frontend
    function logAnalyticsFees(address token, uint256 tokenFee, uint256 baseFee, uint256 tokenProfit, uint256 baseProfit, uint256 endValue) internal {
       (address paired, ) = getPairAddressZK(token);
        protocolProfitsTokens[token].add(tokenProfit);
        protocolProfitsBases[paired].add(baseProfit);
        protocolFeesTokens[token].add(tokenFee);
        protocolFeesBases[paired].add(baseFee);
        protocolSettleValue[paired].add(endValue);
    }

    // Log User PL in base value
    function logPL(uint256 amount, address paired, address optionowner, address optiontaker, uint winner) internal {
        if(winner == 0) {
            userPLMap[paired][optionowner].winnings += amount;
            userPLMap[paired][optiontaker].losses += amount;
        }else if(winner == 1) {
            userPLMap[paired][optiontaker].winnings += amount;
            userPLMap[paired][optionowner].losses += amount;
        }
    }

    function updateFee(uint256 numerator, uint256 denominator) onlyOwner public {
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

    // Toggle a bookmark for a Hedge by its ID
    function bookmarkHedge(uint256 _optionId) public {
        bool bookmarked = bookmarks[msg.sender][_optionId];
        bookmarks[msg.sender][_optionId] = !bookmarked;
        emit bookmarkToggle(msg.sender, _optionId, !bookmarked);
        // Update the bookmarkedOptions array for the user
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
    //Getter functions start here.
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
    
    //get base value for amount of tokens, or value in paired currency.
    //base value is always the pair address of the token provided. get pair using UniswapV2 standard.
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
            tokenValue = (_tokenAmount * pairInfo.reserve1 * pairInfo.token0Decimals) / (pairInfo.reserve0 * pairInfo.token1Decimals);
            return (tokenValue, pairInfo.pairedCurrency);
        } else if (_tokenAddress == pair.token1()) {
            tokenValue = (_tokenAmount * pairInfo.reserve0 * pairInfo.token1Decimals) / (pairInfo.reserve1 * pairInfo.token0Decimals);
            return (tokenValue, pairInfo.pairedCurrency);
        } else {
            revert("Invalid token address");
        }
    }
    
    // balance of tokens on protocol
    function getWithdrawableBalance(address token, address user) public view returns (uint256) {
      userBalance memory uto = userBalanceMap[token][address(user)];
      uint256 withdrawable = 0;
      withdrawable = withdrawable.add(uto.deposited).sub(uto.withdrawn).sub(uto.lockedinuse);
      return withdrawable;
    }

    // zero knowledge pair addr generator
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

    // Get token balances breakdown for wallet
    function getuserTokenBalances (address token, address user) public view returns (uint256, uint256, uint256, uint256, uint256, address) {
      userBalance memory uto = userBalanceMap[address(token)][address(user)];
      uint256 deposited = uto.deposited;
      uint256 withdrawn = uto.withdrawn;
      uint256 lockedinuse = uto.lockedinuse;
      uint256 withdrawableBalance = getWithdrawableBalance(token, msg.sender);
      uint256 withdrawableValue; address paired;
      if(token != wethAddress && token != usdtAddress && token != usdcAddress ){
        (withdrawableValue, paired) = getUnderlyingValue(token, withdrawableBalance);
      }else{
        (withdrawableValue, paired) = (withdrawableBalance, address(0));
      }
      return (deposited, withdrawn, lockedinuse, withdrawableBalance, withdrawableValue, paired);
    }
    
    /*user's erc20 history deposited and traded, targeted search
    ~ user is the address of the user whose history is being searched in the userERC20s mapping. 
    ~ startIndex is used to specify the starting index in the tokens array for the user, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + actualLimit (exclusive) 
    ~ and populates the result array with the values from tokens starting from index startIndex to startIndex + actualLimit - 1. 
    ~ The startIndex is used to calculate the correct index in the result array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the tokens array using a require statement, 
    ~ and actualLimit is calculated as the minimum of length - startIndex and limit to avoid exceeding the length of tokens.
    */
    function getUserHistory(address user, uint startIndex, uint limit) public view returns (address[] memory) {
        address[] memory tokens = userERC20s[user];
        uint length = tokens.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        address[] memory result = new address[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            result[i - startIndex] = tokens[i];
        }
        return result;
    }

    /*All user hedge positions created + taken: targeted search
    ~  user is the address of the user whose positions are being searched in the myoptionsHistory mapping. 
    ~ startIndex is used to specify the starting index in the fullArray for the user, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + actualLimit (exclusive) 
    ~ and populates the subset array with the values from fullArray starting from index startIndex to startIndex + actualLimit - 1. 
    ~ The startIndex is used to calculate the correct index in the subset array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the fullArray using a require statement, 
    ~ and actualLimit is calculated as the minimum of length - startIndex and limit to avoid exceeding the length of fullArray.
    */
    function getUserOptionsSubset(address user, uint startIndex, uint limit) public view returns (uint[] memory) {
        uint[] memory fullArray = myoptionsHistory[user];
        uint length = fullArray.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            subset[i - startIndex] = fullArray[i];
        }
        return subset;
    }

    function getUserSwapsSubset(address user, uint startIndex, uint limit) public view returns (uint[] memory) {
        uint[] memory fullArray = myswapsHistory[user];
        uint length = fullArray.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            subset[i - startIndex] = fullArray[i];
        }
        return subset;
    }

    /*user hedges created: targeted search
    ~ user is the address of the user whose hedges are being searched in the myoptionsCreated mapping. 
    ~ startIndex is used to specify the starting index in the fullArray for the user, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + actualLimit (exclusive) 
    ~ and populates the subset array with the values from fullArray starting from index startIndex to startIndex + actualLimit - 1. 
    ~ The startIndex is used to calculate the correct index in the subset array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the fullArray using a require statement, 
    ~ and actualLimit is calculated as the minimum of length - startIndex and limit to avoid exceeding the length of fullArray.
    */
    function getUserOptionsCreated(address user, uint startIndex, uint limit) public view returns(uint[] memory){
        uint[] memory fullArray = myoptionsCreated[user];
        uint length = fullArray.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            subset[i - startIndex] = fullArray[i];
        }
        return subset;
    }

    function getUserSwapsCreated(address user, uint startIndex, uint limit) public view returns(uint[] memory){
        uint[] memory fullArray = myswapsCreated[user];
        uint length = fullArray.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            subset[i - startIndex] = fullArray[i];
        }
        return subset;
    }

    /*user hedges taken: targeted search
     ~ user is the address of the user whose hedges are being searched in the myoptionsTaken mapping. 
     ~ startIndex is used to specify the starting index in the fullArray for the user, and limit is used to determine the number of items to search. 
     ~ The loop iterates from startIndex to startIndex + actualLimit (exclusive) 
     ~ and populates the subset array with the values from fullArray starting from index startIndex to startIndex + actualLimit - 1. 
     ~ The startIndex is used to calculate the correct index in the subset array by subtracting it from the loop variable i. 
     ~ Additionally, a check is added to ensure that startIndex is within the bounds of the fullArray using a require statement, 
     ~ and actualLimit is calculated as the minimum of length - startIndex and limit to avoid exceeding the length of fullArray.
     */
    function getUserOptionsTaken(address user, uint startIndex, uint limit) public view returns(uint[] memory){
        uint[] memory fullArray = myoptionsTaken[user];
        uint length = fullArray.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            subset[i - startIndex] = fullArray[i];
        }
        return subset;
    }

    function getUserSwapsTaken(address user, uint startIndex, uint limit) public view returns(uint[] memory){
        uint[] memory fullArray = myswapsTaken[user];
        uint length = fullArray.length;
        require(startIndex < length, "Invalid start index");
        uint actualLimit = length - startIndex < limit ? length - startIndex : limit;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = startIndex; i < startIndex + actualLimit; i++) {
            subset[i - startIndex] = fullArray[i];
        }
        return subset;
    }

    /* all options created: targeted search
    ~ startIndex is used to specify the starting index in the optionsCreated array, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + limit (exclusive) 
    ~ and populates the result array with the values from optionsCreated array starting from index startIndex to startIndex + limit - 1. 
    ~ The startIndex is used to calculate the correct index in the result array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the optionsCreated array using a require statement.
    */
    function getAllOptions(uint startIndex, uint limit) public view returns (uint[] memory) {
        require(startIndex < optionsCreated.length, "Invalid start index");
        uint endIndex = startIndex + limit;
        if (endIndex > optionsCreated.length) {
            endIndex = optionsCreated.length;
        }
        uint[] memory result = new uint[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = optionsCreated[i];
        }        
        return result;
    }

    /* all swaps created: targeted search
    ~ startIndex is used to specify the starting index in the equityswapsCreated array, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + limit (exclusive) 
    ~ and populates the result array with the values from equityswapsCreated array starting from index startIndex to startIndex + limit - 1. 
    ~ The startIndex is used to calculate the correct index in the result array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the equityswapsCreated array using a require statement.
    */
    function getAllSwaps(uint startIndex, uint limit) public view returns (uint[] memory) {
        require(startIndex < equityswapsCreated.length, "Invalid start index");
        uint endIndex = startIndex + limit;
        if (endIndex > equityswapsCreated.length) {
            endIndex = equityswapsCreated.length;
        }
        uint[] memory result = new uint[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = equityswapsCreated[i];
        }
        return result;
    }

    /* all options taken: targeted search
    ~ startIndex is used to specify the starting index in the hedgesTaken array, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + limit (exclusive) 
    ~ and populates the result array with the values from hedgesTaken array starting from index startIndex to startIndex + limit - 1. 
    ~ The startIndex is used to calculate the correct index in the result array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the hedgesTaken array using a require statement.
    */
    function getAllOptionsTaken(uint startIndex, uint limit) public view returns (uint[] memory) {
        require(startIndex < hedgesTaken.length, "Invalid start index");
        uint endIndex = startIndex + limit;
        if (endIndex > hedgesTaken.length) {
            endIndex = hedgesTaken.length;
        }
        uint[] memory result = new uint[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = hedgesTaken[i];
        }        
        return result;
    }

    /* all swaps taken: targeted search
    ~ startIndex is used to specify the starting index in the equityswapsTaken array, 
    ~ and limit is used to determine the number of items to search. 
    ~ The loop iterates from startIndex to startIndex + limit (exclusive) 
    ~ and populates the result array with the values from equityswapsTaken array starting from index startIndex to startIndex + limit - 1. 
    ~ The startIndex is used to calculate the correct index in the result array by subtracting it from the loop variable i. 
    ~ Additionally, a check is added to ensure that startIndex is within the bounds of the equityswapsTaken array using a require statement.
    */
    function getAllSwapsTaken(uint startIndex, uint limit) public view returns (uint[] memory) {
        require(startIndex < equityswapsTaken.length, "Invalid start index");
        uint endIndex = startIndex + limit;
        if (endIndex > equityswapsTaken.length) {
            endIndex = equityswapsTaken.length;
        }
        uint[] memory result = new uint[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = equityswapsTaken[i];
        }        
        return result;
    }

    /* hedges list under specific ERC20 address: targeted search
    ~ the startIndex parameter is used to specify the starting index of the array, 
    ~ and the limit parameter is used to determine the number of items to include in the result. 
    ~ The endIndex is calculated as the minimum value between startIndex + limit and the length of the full array to ensure that it does not exceed the array bounds. 
    ~ Then, the actualLimit is calculated as the difference between endIndex and startIndex, 
    ~ which represents the actual number of items in the result array. 
    ~ Finally, the subset array is populated with the elements from the fullArray using the calculated indices based on startIndex and actualLimit.
    */
    function getOptionsForToken(address _token, uint startIndex, uint limit) public view returns(uint[] memory){
        uint[] memory fullArray = tokenOptions[_token];
        require(startIndex < fullArray.length, "Start index exceeds array length");
        uint endIndex = startIndex + limit > fullArray.length ? fullArray.length : startIndex + limit;
        uint actualLimit = endIndex - startIndex;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = 0; i < actualLimit; i++) {
            subset[i] = fullArray[startIndex + i];
        }
        return subset;
    }

     function getSwapsForToken(address _token, uint startIndex, uint limit) public view returns(uint[] memory){
        uint[] memory fullArray = tokenSwaps[_token];
        require(startIndex < fullArray.length, "Start index exceeds array length");
        uint endIndex = startIndex + limit > fullArray.length ? fullArray.length : startIndex + limit;
        uint actualLimit = endIndex - startIndex;
        uint[] memory subset = new uint[](actualLimit);
        for (uint i = 0; i < actualLimit; i++) {
            subset[i] = fullArray[startIndex + i];
        }
        return subset;
    }

    // get hedge details
    function getHedgeDetails(uint256 _optionId) public view returns (hedgingOption memory) {
        hedgingOption memory hedge = hedgeMap[_optionId];
        require(hedge.owner != address(0), "Option does not exist");
        return hedge;
    }
    // get deposited tokens count
    function getDepositedTokensLength() external view returns (uint) {
        return userERC20s[address(this)].length;
    }
    // get all options count
    function getAllOptionsLength() public view returns (uint256) {
        return optionsCreated.length;
    }
    // get all equity swaps count
    function getAllSwapsLength() public view returns (uint256) {
        return equityswapsCreated.length;
    }
    // get options count under specific token
    function getOptionsForTokenCount(address _token) public view returns (uint256) {
        return tokenOptions[_token].length;
    }
    // get swaps count under specific token
    function getSwapsForTokenCount(address _token) public view returns (uint256) {
        return tokenSwaps[_token].length;
    }
    
    // get protocol analytic values - in fixed base sets
    // --depracated to direct reading manually per address
    function getHedgesCreatedVolume(address baseAddress) public view returns (uint256) {
        return protocolCreateValue[baseAddress];
    }
    function getHedgesTakenVolume(address baseAddress) public view returns (uint256) {
        return protocolTakenValue[baseAddress];
    }
    function getHedgesCostVolume(address baseAddress) public view returns (uint256) {
        return protocolCostValue[baseAddress];
    }
    function getHedgesOptionsVolume(address baseAddress) public view returns (uint256) {
        return protocolOptionsValue[baseAddress];
    }
    function getHedgesSwapsVolume(address baseAddress) public view returns (uint256) {
        return protocolSwapsValue[baseAddress];
    }
    function getHedgesSettledVolume(address baseAddress) public view returns (uint256) {
        return protocolSettleValue[baseAddress];
    }
    function getHedgesProfitVolume(address baseAddress) public view returns (uint256) {
        return protocolProfitsBases[baseAddress];
    }
    function getHedgesFeeVolume(address baseAddress) public view returns (uint256) {
        return protocolFeesBases[baseAddress];
    }
    function getCashierFeeVolume(address baseAddress) public view returns (uint256) {
        return protocolCashierFees[baseAddress];
    }
    // Get cashier deposit withdrawal volume in base equivalent 
    function getBaseEquivDeposits() public view returns (uint256,uint256,uint256) {
        return (wethEquivDeposits, usdtEquivDeposits, usdcEquivDeposits);
    }
    function getBaseEquivWithdrawals() public view returns (uint256,uint256,uint256) {
        return (wethEquivWithdrawals, usdtEquivWithdrawals, usdcEquivWithdrawals);
    }
    // Get wallet's hedge & costs volume in base equivalent
    function getuserWriteVolume(address wallet) public view returns (uint256, uint256, uint256) {
        return (wethEquivUserHedged[wallet], usdtEquivUserHedged[wallet], usdcEquivUserHedged[wallet]);
    }
    function getuserTakeVolume(address wallet) public view returns (uint256, uint256, uint256) {
        return (wethEquivUserCosts[wallet], usdtEquivUserCosts[wallet], usdcEquivUserCosts[wallet]);
    }
    // Get wallets profit & loss in base
    function getUserProfits(address pairAddress, address walletAddress) public view returns (uint256) {
        return userPLMap[pairAddress][walletAddress].profits;
    }
    function getUserLosses(address pairAddress, address walletAddress) public view returns (uint256) {
        return userPLMap[pairAddress][walletAddress].losses;
    }
    // Get distributed revenue; withdrawn to staking contract for revenue
    function getTotalDistributed() public view returns (uint256) {
        return userBalanceMap[wethAddress][address(this)].withdrawn;
    }
    // Get protocol token balances
    function getContractTokenBalances(address _token) public view returns (uint256, uint256, uint256) {
        return (userBalanceMap[_token][address(this)].deposited, userBalanceMap[_token][address(this)].withdrawn);
    }
    // Get protocol revenue across all 3 bases
    function getProtocolRevenue() public view returns (uint256, uint256, uint256) {
        return (userBalanceMap[wethAddress][address(this)].deposited, userBalanceMap[usdtAddress][address(this)].deposited, userBalanceMap[usdcAddress][address(this)].deposited);
    }
    
    // Get array of user or wallet's ERC20 token interactions
    function getUserTokenList(address wallet) external view returns (address[] memory) {
        return userERC20s[wallet];
    }
    // Get array of all tokens ever deposited to protocol
    function getAllTokenList() external view returns (address[] memory) {
        return userERC20s[address(this)];
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
