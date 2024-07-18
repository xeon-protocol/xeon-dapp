// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "openzeppelin/contracts/access/Ownable.sol";
import "openzeppelin/contracts/token/ERC20/ERC20.sol";
import "openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "./XeonStaking.sol";

// minimal interface for the WETH9 contract
interface IWETH9 {
    function transfer(address dst, uint256 wad) external returns (bool);
    function transferFrom(address src, address dst, uint256 wad) external returns (bool);
}

// price oracle interface
interface IPriceOracle {
    function getTWAP(address pool, uint32 interval) external view returns (uint256);
}

/**
 * @title XeonHedging
 */
contract XeonHedging {
    using SafeERC20 for IERC20;

    bool private isExecuting;

    modifier nonReentrant() {
        require(!isExecuting, "Function is currently being executed");
        isExecuting = true;
        _;
        isExecuting = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    struct userBalance {
        uint256 deposited; // incremented on successful deposit
        uint256 withdrawn; // incremented on successful withdrawal
        uint256 lockedInUse; // adjust on deal creation or buy or settle
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
        uint256 status; //0 - none, 1 - created, 2 - taken, 3 - settled
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
        uint256[] topupRequests;
    }

    enum HedgeType {
        CALL,
        PUT,
        SWAP
    }

    struct userPL {
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
        uint256 state; // 0 - requested, 1 accepted, 2 rejected
    }

    // mapping of wallet token balances [token][user]
    mapping(address => mapping(address => userBalance)) public userBalanceMap;

    //mapping of user-hedge-Ids array for each erc20 token
    mapping(address => mapping(address => uint256[])) private userHedgesForTokenMap;

    // mapping of wallet profit & loss [pair][user]
    mapping(address => mapping(address => userPL)) private userPLMap;

    // track all erc20 deposits and withdrawals to contract
    mapping(address => contractBalance) public protocolBalanceMap;

    // mapping of all hedge storages by Id
    mapping(uint256 => hedgingOption) private hedgeMap;

    // mapping topup requests
    mapping(uint256 => topupData) public topupMap;

    // mapping of all deals created for each erc20
    mapping(address => uint256[]) private tokenOptions;
    mapping(address => uint256[]) private tokenSwaps;

    // mapping of all deals taken for each erc20
    mapping(address => uint256[]) private optionsBought;
    mapping(address => uint256[]) private equityswapsBought;

    // mapping of all deals settled for each erc20
    mapping(address => uint256[]) private optionsSettled;
    mapping(address => uint256[]) private equityswapsSettled;

    // mapping of all deals for user by Id
    mapping(address => uint256[]) public myoptionsCreated;
    mapping(address => uint256[]) public myoptionsTaken;
    mapping(address => uint256[]) public myswapsCreated;
    mapping(address => uint256[]) public myswapsTaken;

    // mapping of all tokens transacted by user
    mapping(address => address[]) public userERC20s;
    mapping(address => address[]) public pairedERC20s;

    // mapping of all protocol profits and fees collected from deals
    mapping(address => uint256) public protocolProfitsTokens; //liquidated to paired at discount
    mapping(address => uint256) public protocolPairProfits;
    mapping(address => uint256) public protocolFeesTokens; //liquidated to paired at discount
    mapping(address => uint256) public protocolPairedFees;
    mapping(address => uint256) public hedgesCreatedVolume; //volume saved in paired currency
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
    mapping(address => uint256[]) public bookmarkedOptions;

    // all deals
    uint256[] private optionsCreated;
    uint256[] private equityswapsCreated;
    uint256[] private optionsTaken;
    uint256[] private equityswapsTaken;

    // global counters
    uint256 public depositedTokensLength;
    uint256 public optionsCreatedLength;
    uint256 public equityswapsCreatedLength;
    uint256 public equityswapsTakenLength;
    uint256 public optionsTakenLength;
    uint256 public dealID;
    uint256 public topupRequestID;
    uint256 public settledTradesCount;
    uint256 public miners;

    // fee variables
    uint256 public feeNumerator;
    uint256 public feeDenominator;
    uint256 public protocolFeeRate;
    uint256 public validatorFeeRate;

    // erc20 deposits equiv in paired currencies
    uint256 public wethEquivDeposits;
    uint256 public usdtEquivDeposits;
    uint256 public usdcEquivDeposits;

    // erc20 withdrawals equiv in paired currencies
    uint256 public wethEquivWithdrawals;
    uint256 public usdtEquivWithdrawals;
    uint256 public usdcEquivWithdrawals;

    // core addresses
    IUniswapV2Factory public uniswapV2Factory;
    IUniswapV3Factory public uniswapV3Factory;
    XeonStaking public stakingContract;
    address public priceOracle;
    address public wethAddress;
    address public usdtAddress;
    address public usdcAddress;
    address public xeonAddress;
    address public stakingAddress;
    address public owner;

    // events
    event Received(address, uint256);
    event ContractInitialized(address indexed, address indexed);
    event OnDeposit(address indexed token, uint256 indexed amount, address indexed wallet);
    event OnWithdraw(address indexed token, uint256 indexed amount, address indexed wallet);
    event HedgeCreated(
        address indexed token, uint256 indexed dealId, uint256 createValue, HedgeType hedgeType, address indexed writer
    );
    event HedgePurchased(
        address indexed token, uint256 indexed dealId, uint256 startValue, HedgeType hedgeType, address indexed buyer
    );
    event HedgeSettled(
        address indexed token, uint256 indexed dealId, uint256 endValue, uint256 payOff, address indexed miner
    );
    event MinedHedge(
        uint256 dealId,
        address indexed miner,
        address indexed token,
        address indexed paired,
        uint256 tokenFee,
        uint256 pairFee
    );
    event BookmarkToggle(address indexed user, uint256 hedgeId, bool bookmarked);
    event TopupRequested(address indexed party, uint256 indexed hedgeId, uint256 topupAmount);
    event TopupAccepted(
        address indexed acceptor, uint256 indexed dealID, uint256 indexed requestID, uint256 pairedAmount
    );
    event ZapRequested(uint256 indexed hedgeId, address indexed party);
    event HedgeDeleted(uint256 indexed dealID, address indexed deletedBy);
    event FeesTransferred(address indexed token, address indexed to, uint256 amount);
    event ValidatorFeeUpdated(uint256 protocolFeeRate, uint256 validatorFeeRate);
    event FeeUpdated(uint256 feeNumerator, uint256 feeDenominator);
    event EtherWithdrawn(address indexed to, uint256 amount);

    // constructor
    constructor(
        address _uniswapV2Factory,
        address _uniswapV3Factory,
        address _priceOracle,
        XeonStaking _stakingContract
    ) {
        require(_uniswapV2Factory != address(0), "Invalid UniswapV2Factory address");
        require(_uniswapV3Factory != address(0), "Invalid UniswapV3Factory address");
        require(_priceOracle != address(0), "Invalid Oracle Address");
        require(address(_stakingContract) != address(0), "Invalid StakingContract Address");

        uniswapV2Factory = IUniswapV2Factory(_uniswapV2Factory);
        uniswapV3Factory = IUniswapV3Factory(_uniswapV3Factory);
        priceOracle = _priceOracle;
        stakingContract = XeonStaking(_stakingContract);

        wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // WETH address on Sepolia
        usdtAddress = 0x297B8d4B35294e730087ADF0597A31a9bC1746af; // USDT address on Sepolia
        usdcAddress = 0x8267cF9254734C6Eb452a7bb9AAF97B392258b21; // USDC address on Sepolia
        xeonAddress = 0xDb90a9f7cEaA33a32Ec836Bbadeeaa8772Ad9797; // V2.1 deployed 14/01/2024 21:52:48

        feeNumerator = 5;
        feeDenominator = 1000;

        emit ContractInitialized(_priceOracle, address(_stakingContract));
    }

    /**
     * @dev Allows users to deposit ERC-20 tokens into the protocol.
     * This function uses SafeERC20 to safely transfer tokens from the user to the contract.
     * It also updates the protocol's records of equivalent token deposits for major pairs (WETH, USDT, USDC).
     * Checks before & after token balance, to prevent discrepancies for fee-on-transfer tokens, between the reported and actual balances.
     * Requirements:
     * - The amount of tokens to be deposited must be greater than zero.
     * - The token address must be valid (non-zero).
     *
     * Emits an {OnDeposit} event.
     *
     * @param _token The address of the ERC-20 token to be deposited.
     * @param _amount The amount of tokens to be deposited.
     */
    function depositToken(address _token, uint256 _amount) external nonReentrant {
        require(_amount > 0 && _token != address(0), "You're attempting to transfer 0 tokens");

        IERC20 token = IERC20(_token);

        // Get contract balance of the token before transfer
        uint256 initialContractBalance = token.balanceOf(address(this));

        // Transfer tokens from sender to contract
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _amount);

        // Get contract balance of the token after transfer
        uint256 finalContractBalance = token.balanceOf(address(this));

        // Calculate the actual amount received after transfer
        uint256 receivedAmount = finalContractBalance - initialContractBalance;

        // Update equivalent deposits based on the token received
        if (_token == wethAddress) {
            wethEquivDeposits += receivedAmount;
        } else {
            // Log main pair equivalents
            if (_token != usdtAddress && _token != usdcAddress) {
                (uint256 marketValue, address paired) = getUnderlyingValue(_token, receivedAmount);
                if (paired == wethAddress) {
                    wethEquivDeposits += marketValue;
                } else if (paired == usdtAddress) {
                    usdtEquivDeposits += marketValue;
                } else if (paired == usdcAddress) {
                    usdcEquivDeposits += marketValue;
                }
            } else if (_token == usdtAddress) {
                usdtEquivDeposits += receivedAmount;
            } else if (_token == usdcAddress) {
                usdcEquivDeposits += receivedAmount;
            }
        }

        // Log user balance & tokens
        userBalance storage uto = userBalanceMap[_token][msg.sender];
        if (uto.deposited == 0) {
            userERC20s[msg.sender].push(_token);
        }
        uto.deposited += receivedAmount;

        // Log new token address
        if (protocolBalanceMap[_token].deposited == 0) {
            userERC20s[address(this)].push(_token);
            depositedTokensLength++;
        }
        protocolBalanceMap[_token].deposited += receivedAmount;

        // Emit deposit event
        emit OnDeposit(_token, receivedAmount, msg.sender);
    }

    /**
     * @dev Allows users to withdraw ERC-20 tokens from the protocol.
     * This function ensures the user has sufficient withdrawable balance and applies a fee for major pairs (WETH, USDT, USDC).
     *
     * Requirements:
     * - The amount to be withdrawn must be greater than zero and less than or equal to the user's available balance.
     * - The caller must not be the contract itself.
     *
     * Emits an {OnWithdraw} event.
     *
     * @param token The address of the ERC-20 token to be withdrawn.
     * @param amount The amount of tokens to be withdrawn.
     */
    function withdrawToken(address token, uint256 amount) external nonReentrant {
        // Read user balances into local variables
        (,,, uint256 withdrawable,,) = getUserTokenBalances(token, msg.sender);

        require(amount <= withdrawable && amount > 0, "You have Insufficient available balance");
        require(msg.sender != address(this), "Not allowed");

        // Tax withdrawals on pair only; WETH, USDT, USDC. 1/10 of settle tax
        uint256 tokenFee;
        if (token == wethAddress || token == usdtAddress || token == usdcAddress) {
            tokenFee = calculateFee(amount) / 10;
            protocolCashierFees[token] += tokenFee;
            userBalanceMap[token][address(this)].deposited += tokenFee;
        }

        // Withdraw
        userBalanceMap[token][msg.sender].withdrawn += amount;

        if (token == wethAddress) {
            require(IWETH9(wethAddress).transfer(msg.sender, amount - tokenFee), "Transfer failed");
        } else {
            require(IERC20(token).transfer(msg.sender, amount - tokenFee), "Transfer failed");
        }

        // Log withdrawal
        protocolBalanceMap[token].withdrawn += amount;

        // Log main paired value equivalents
        if (token == wethAddress) {
            wethEquivWithdrawals += amount;
        } else if (token == usdtAddress) {
            usdtEquivWithdrawals += amount;
        } else if (token == usdcAddress) {
            usdcEquivWithdrawals += amount;
        } else {
            (uint256 marketValue, address paired) = getUnderlyingValue(token, amount);
            if (paired == wethAddress) wethEquivWithdrawals += marketValue;
            else if (paired == usdtAddress) usdtEquivWithdrawals += marketValue;
            else if (paired == usdcAddress) usdcEquivWithdrawals += marketValue;
        }

        // Emit withdrawal event
        emit OnWithdraw(token, amount, msg.sender);
    }

    /**
     * @dev Transfers collected fees from the protocol to a specified wallet address.
     * This function debits the protocol's user balance map and credits the recipient's user balance map.
     *
     * Requirements:
     * - The protocol must have a sufficient balance to transfer the specified amount.
     * - The amount to be transferred must be specified and non-zero.
     *
     * Emits a {FeesTransferred} event.
     *
     * @param token The address of the token for which the fees are being transferred.
     * @param to The address of the recipient wallet to which the fees are to be credited.
     * @param amount The amount of fees to be transferred.
     */
    function transferCollectedFees(address token, address to, uint256 amount) external onlyOwner {
        require(userBalanceMap[token][address(this)].deposited >= amount, "Insufficient protocol balance");

        userBalanceMap[token][address(this)].deposited -= amount;
        userBalanceMap[token][to].deposited += amount;

        emit FeesTransferred(token, to, amount);
    }

    /**
     * @dev Creates a hedge, which can be a call option, put option, or equity swap.
     * The premium or buying cost is paid in the paired token of the underlying asset in the deal.
     * There is no premium for swaps, and swap collateral must be equal for both parties as the settle function relies on this implementation.
     * Users can only write options with an underlying value and strike value that currently puts the taker in a loss.
     *
     * Requirements:
     * - The tool type must be valid (0 for CALL, 1 for PUT, 2 for SWAP).
     * - The amount and cost must be greater than zero.
     * - The deadline must be a future timestamp.
     * - The user must have sufficient withdrawable balance in the vault.
     * - For CALL options, the strike price must be greater than the market value.
     * - For PUT options, the strike price must be less than the market value.
     * - For SWAPs, the collateral value must be equal.
     *
     * Emits a {HedgeCreated} event.
     *
     * @param tool The type of hedge (0 for CALL, 1 for PUT, 2 for SWAP).
     * @param token The address of the ERC-20 token.
     * @param amount The amount of the underlying asset.
     * @param cost The premium or buying cost.
     * @param strikeprice The strike price of the option.
     * @param deadline The expiration timestamp of the hedge.
     */
    function createHedge(
        uint256 tool,
        address token,
        uint256 amount,
        uint256 cost,
        uint256 strikeprice,
        uint256 deadline
    ) external nonReentrant {
        require(tool <= 2 && amount > 0 && cost > 0 && deadline > block.timestamp, "Invalid option parameters");
        (,,, uint256 withdrawable,,) = getUserTokenBalances(token, msg.sender);
        require(withdrawable > 0 && withdrawable >= amount, "Insufficient Vault Balance. Deposit more tokens");

        // Assign option values directly to the struct
        hedgingOption storage newOption = hedgeMap[dealID];
        newOption.owner = msg.sender;
        newOption.token = token;
        newOption.status = 1;
        newOption.amount = amount;
        (newOption.createValue, newOption.paired) = getUnderlyingValue(token, amount);
        newOption.cost = cost;
        newOption.strikeValue = strikeprice * amount;
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

        // Users can only write options with an underlying value and strike value that puts the taker in a loss now
        if (newOption.hedgeType == HedgeType.CALL) {
            require(newOption.strikeValue > newOption.createValue, "Strike price must be greater than market value");
        } else if (newOption.hedgeType == HedgeType.PUT) {
            require(newOption.strikeValue < newOption.createValue, "Strike price must be less than market value");
        }

        // Update user balances for token in hedge
        userBalanceMap[token][msg.sender].lockedInUse += amount;

        // Update arrays
        if (newOption.hedgeType == HedgeType.SWAP) {
            require(cost >= newOption.createValue, "Swap collateral must be equal value");
            myswapsCreated[msg.sender].push(dealID);
            equityswapsCreated.push(dealID);
            equityswapsCreatedLength++;
            tokenSwaps[token].push(dealID);
        } else {
            myoptionsCreated[msg.sender].push(dealID);
            optionsCreated.push(dealID);
            optionsCreatedLength++;
            tokenOptions[token].push(dealID);
        }

        // Log protocol analytics
        dealID++;
        hedgesCreatedVolume[newOption.paired] += newOption.createValue;

        // Emit hedge creation event
        emit HedgeCreated(token, dealID, newOption.createValue, newOption.hedgeType, msg.sender);
    }

    /**
     * @dev Purchases a hedge, which can be a call option, put option, or equity swap.
     * Hedge costs are in the paired currency of the underlying token.
     * The cost is paid out to the writer immediately, with no protocol fees applied.
     * For equity swaps, the cost is equal to the underlying value as 100% collateral is required.
     * Strike value is not set here; maturity calculations are left to the settlement function.
     * Debits costs and credits them to withdrawn for the taker. Profits are recorded as deposits on settlement.
     *
     * Requirements:
     * - The hedge must be available (status = 1).
     * - The hedge must not be expired.
     * - The caller must not be the hedge owner.
     * - The caller must have sufficient free vault balance.
     * - The deal ID must be valid and less than the current deal ID.
     *
     * Emits a {HedgePurchased} event.
     *
     * @param _dealID The ID of the hedge to be purchased.
     */
    function buyHedge(uint256 _dealID) external nonReentrant {
        hedgingOption storage hedge = hedgeMap[_dealID];
        userBalance storage stk = userBalanceMap[hedge.paired][msg.sender];

        // Validate the hedge status and ownership
        require(hedge.status == 1, "Hedge already taken");
        require(block.timestamp < hedge.dt_expiry, "Hedge expired");
        require(_dealID < dealID && msg.sender != hedge.owner, "Invalid option ID | Owner can't buy");

        // Fetch the user's withdrawable balance for the paired token
        (,,, uint256 withdrawable,,) = getUserTokenBalances(hedge.paired, msg.sender);
        require(withdrawable >= hedge.cost, "Insufficient free Vault balance");

        // Calculate, check, and update start value based on the hedge type
        (hedge.startValue,) = (hedge.hedgeType == HedgeType.SWAP)
            ? getUnderlyingValue(hedge.token, hedge.amount + hedge.cost) // Include cost in calculation for SWAP
            : getUnderlyingValue(hedge.token, hedge.amount); // Exclude cost for CALL and PUT

        require(hedge.startValue > 0, "Math error whilst getting price"); // Sanity check

        // Transfer cost from Taker userBalanceMap to Writer userBalanceMap
        if (hedge.hedgeType != HedgeType.SWAP) {
            userBalanceMap[hedge.paired][msg.sender].withdrawn += hedge.cost;
            userBalanceMap[hedge.token][hedge.owner].deposited += hedge.cost;
        }

        // Update hedge struct to indicate it is taken and record the taker
        hedge.dt_started = block.timestamp;
        hedge.taker = msg.sender;
        hedge.status = 2; // Update status to taken

        // Store updated structs back to storage
        userBalanceMap[hedge.paired][msg.sender] = stk;
        hedgeMap[_dealID] = hedge;

        // Update arrays and taken count
        if (hedge.hedgeType == HedgeType.SWAP) {
            equityswapsTakenLength++;
            equityswapsBought[hedge.token].push(_dealID);
            equityswapsTaken.push(_dealID);
            myswapsTaken[msg.sender].push(_dealID);
        } else {
            optionsTakenLength++;
            optionsBought[hedge.token].push(_dealID);
            optionsTaken.push(_dealID);
            myoptionsTaken[msg.sender].push(_dealID);
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

        // Emit the HedgePurchased event
        emit HedgePurchased(hedge.token, _dealID, hedge.startValue, hedge.hedgeType, msg.sender);
    }

    /**
     * @dev Deletes an untaken or expired and unexercised hedge.
     * Only the owner or a miner can delete the hedge under specific conditions.
     *
     * Conditions and rules:
     * - **Owner Deletion**: The owner can delete an untaken hedge before it is taken (status = 1).
     * - **Owner Deletion Post Expiry**: The owner can also delete the hedge after it expires and if it remains unexercised (status != 3).
     * - **Miner Deletion**: A miner can delete an expired and unexercised hedge (status = 2) and receives a fee for doing so.
     * - **Taker Deletion**: Prohibited.
     * - **Equity Swaps**: Cannot be deleted once taken, only settled.
     * - **Fee Handling**: If a miner deletes the hedge, the fee is split between the miner and the protocol.
     * - **Balance Restoration**: Upon deletion, the remaining balance after fees is restored to the hedge owner.
     *
     * Requirements:
     * - The hedge must be in a valid state for deletion (status = 1 or status = 2).
     * - The caller must be the owner if the hedge is untaken (status = 1).
     * - The caller must be the owner or a miner if the hedge is expired and unexercised (status = 2).
     * - The hedge must be expired if a miner is deleting it.
     * - Equity swaps (HedgeType.SWAP) cannot be deleted if taken.
     *
     * @param _dealID The ID of the hedge to be deleted.
     */
    function deleteHedge(uint256 _dealID) public nonReentrant {
        hedgingOption storage hedge = hedgeMap[_dealID];
        require(hedge.status == 1 || hedge.status == 2, "Invalid hedge status");

        // Check the caller's authority based on the hedge status
        if (hedge.status == 2) {
            require(msg.sender == hedge.owner || isMiner(msg.sender), "Owner or miner only can delete");
            require(block.timestamp >= hedge.dt_expiry, "Hedge must be expired before deleting");
        } else if (hedge.status == 1) {
            require(msg.sender == hedge.owner, "Only owner can delete");
        }

        // Ensure equity swaps cannot be deleted once taken
        require(hedge.hedgeType != HedgeType.SWAP && hedge.status == 1, "Swap can't be deleted");

        // Miner deleting an expired hedge
        if (msg.sender != hedge.owner) {
            require(block.timestamp > hedge.dt_expiry, "Hedge must be expired");
            uint256 fee = calculateFee(hedge.amount);
            uint256 feeSplit = fee / 2;

            // Transfer fee to miner and protocol
            userBalanceMap[hedge.token][msg.sender].deposited += feeSplit;
            userBalanceMap[hedge.token][address(this)].deposited += feeSplit;

            // Restore the remaining balance to the hedge owner
            uint256 amountAfterFee = hedge.amount - fee;
            userBalanceMap[hedge.token][hedge.owner].lockedInUse -= hedge.amount;
            userBalanceMap[hedge.token][hedge.owner].withdrawn += amountAfterFee;

            // Log the mining data for the miner
            logMiningData(msg.sender);

            // Log analytics fees
            logAnalyticsFees(hedge.token, feeSplit, feeSplit, 0, 0, hedge.amount);
        } else {
            // Owner deleting the hedge
            userBalanceMap[hedge.token][hedge.owner].lockedInUse -= hedge.amount;
            userBalanceMap[hedge.token][hedge.owner].withdrawn += hedge.amount;
        }

        // Delete the hedge
        delete hedgeMap[_dealID];

        // Emit event
        emit HedgeDeleted(_dealID, msg.sender);
    }

    /**
     * @dev Helper function to check if the caller is a miner.
     *
     * This function verifies if the provided address belongs to a miner by checking if
     * the address has a positive deposited balance in the staking contract.
     *
     * Requirements:
     * - The `_addr` must be a valid Ethereum address.
     * - The `userBalanceMap` for the `stakingContract` must have a deposited balance greater than zero for the `_addr`.
     *
     * @param _addr The address to check.
     * @return bool Returns `true` if the address is a miner, otherwise `false`.
     */
    function isMiner(address _addr) internal view returns (bool) {
        (uint256 assignedForMining,,,) = stakingContract.getAssignedAndUnassignedAmounts(_addr);
        return assignedForMining > 0;
    }

    /**
     * @notice Initiates a top-up request for a hedging option.
     *
     * This function allows any party involved in a hedging option to initiate a top-up request.
     * The owner or the taker can match the top-up amount.
     * After the request, the start value of the hedging option is updated accordingly.
     * User balances are not updated here, this is initiation only.
     *
     * Conditions and rules:
     * - Any party involved in the hedging option can initiate a top-up request.
     * - Only the accepter of the hedging option can match the top-up amount.
     * - The request amount can be incremented if it has not been accepted yet.
     *
     * Requirements:
     * - The caller must be either the owner or the taker of the hedging option.
     *
     * @param _dealID The unique identifier of the hedging option.
     * @param amount The amount to be topped up.
     */
    function topupRequest(uint256 _dealID, uint256 amount) external nonReentrant {
        hedgingOption storage hedge = hedgeMap[_dealID];

        ERC20 token = ERC20(hedge.token);

        // Get token decimal for calculations
        uint256 tokenDecimals = token.decimals();

        // Check the caller's authority
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to top up");

        // Increment the top-up request ID for each new request
        topupRequestID += 1;
        hedge.topupRequests.push(topupRequestID);
        topupMap[topupRequestID].requester = msg.sender;

        // Determine the token associated with the hedging option
        address tokenAddr = hedge.token;
        uint256 pairedAmount;

        // Calculate the paired amount based on the sender (owner or taker)
        if (msg.sender == hedge.owner) {
            // Owner tops up with tokens, increment startValue directly
            (uint256 underlyingValue,) = getUnderlyingValue(tokenAddr, 1);
            pairedAmount = amount * (10 ** tokenDecimals) / underlyingValue;
            topupMap[topupRequestID].amountWriter += amount;
        } else {
            // Taker tops up with paired currency, increment startValue directly
            pairedAmount = amount;
            topupMap[topupRequestID].amountTaker += amount;
        }

        // Update the start value of the hedging option by adding the paired amount
        hedge.startValue += pairedAmount;

        // Update the hedging option in the mapping
        hedgeMap[_dealID] = hedge;

        // Emit an event indicating that a top-up has been requested
        emit TopupRequested(msg.sender, _dealID, amount);
    }

    /**
     * @notice Accepts a top-up request for a hedging option.
     *
     * This function allows the owner or the taker of a hedging option to accept a top-up request
     * initiated by the other party. Once accepted, the top-up amount is added to the relevant
     * balances, and collateral is locked into the deal for both parties.
     *
     * Requirements:
     * - The caller must be either the owner or the taker of the hedging option.
     * - The top-up request must not have been previously accepted.
     * - The caller cannot be the requester of the top-up.
     *
     * @param _requestID The unique identifier of the top-up request.
     * @param _dealID The unique identifier of the hedging option.
     */
    function acceptRequest(uint256 _requestID, uint256 _dealID) external nonReentrant {
        topupData storage request = topupMap[_requestID];
        hedgingOption storage hedge = hedgeMap[_dealID];

        // Get token decimal for calculations
        ERC20 token = ERC20(hedge.token);
        uint256 tokenDecimals = token.decimals();

        // Ensure the caller's authority and the state of the top-up request
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to accept");
        require(request.state == 0, "Request already accepted");
        require(msg.sender != request.requester, "Requester can't accept the topup");

        // Determine the token associated with the hedging option
        address tokenAddr = hedge.token;
        uint256 pairedAmount;
        uint256 underlyingValue;

        // Calculate the paired amount based on the sender (owner or taker)
        if (msg.sender == hedge.owner) {
            // Owner accepts top-up with tokens
            (underlyingValue,) = getUnderlyingValue(tokenAddr, 1);
            pairedAmount = request.amountTaker * (10 ** tokenDecimals) / underlyingValue;
            // Update the hedging option balances and start value for the owner
            hedge.amount += pairedAmount;
            request.amountWriter += pairedAmount;
        } else {
            // Taker accepts top-up with paired currency
            (underlyingValue,) = getUnderlyingValue(tokenAddr, 1);
            pairedAmount = request.amountWriter * underlyingValue / (10 ** tokenDecimals);
            // Update the hedging option balances and start value for the taker
            hedge.cost += pairedAmount;
            request.amountTaker += pairedAmount;
        }

        // Lock collateral into deal for both parties
        address ownerToken = hedge.token;
        address takerToken = hedge.paired;
        uint256 ownerAmountToUse = request.amountWriter;
        uint256 takerAmountToUse = request.amountTaker;

        // Ensure that the parties have sufficient balance to cover the top-up
        (,,, uint256 ownerWithdrawable,,) = getUserTokenBalances(ownerToken, hedge.owner);
        require(ownerWithdrawable >= ownerAmountToUse, "Insufficient owner collateral");
        userBalanceMap[ownerToken][hedge.owner].lockedInUse += ownerAmountToUse; // lock collateral in deal
        userBalanceMap[ownerToken][hedge.owner].deposited += takerAmountToUse; // receive cost from taker

        (,,, uint256 takerWithdrawable,,) = getUserTokenBalances(takerToken, hedge.taker);
        require(takerWithdrawable >= takerAmountToUse, "Insufficient taker collateral");
        userBalanceMap[takerToken][hedge.taker].withdrawn += takerAmountToUse; // send cost to taker

        // Update the state of the top-up request to indicate acceptance and record the acceptance time
        request.state = 1;
        request.acceptTime = block.timestamp;

        // Emit an event indicating that the top-up request has been accepted
        emit TopupAccepted(msg.sender, _dealID, _requestID, pairedAmount);
    }

    /**
     * @notice Rejects a top-up request for a hedging option.
     *
     * This function allows the owner or the taker of a hedging option to reject a top-up request.
     * Once rejected, the state of the top-up request is updated to indicate rejection.
     *
     * Requirements:
     * - The caller must be either the owner or the taker of the hedging option.
     * - The top-up request must not have been previously accepted or rejected.
     *
     * @param _dealID The unique identifier of the hedging option.
     * @param _requestID The unique identifier of the top-up request.
     */
    function rejectTopupRequest(uint256 _dealID, uint256 _requestID) external {
        hedgingOption storage hedge = hedgeMap[_dealID];
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to reject");
        require(topupMap[_requestID].state == 0, "Request already accepted or rejected");

        // Update the state of the top-up request to indicate rejection
        topupMap[_requestID].state = 2;
    }

    /**
     * @notice Cancels a top-up request initiated by the owner.
     *
     * This function allows the owner of a hedging option to cancel a top-up request initiated by them.
     * Once canceled, the state of the top-up request is updated to indicate cancellation.
     *
     * Requirements:
     * - The top-up request must not have been previously accepted.
     * - The caller must be the requester of the top-up request.
     *
     * @param _requestID The unique identifier of the top-up request.
     */
    function cancelTopupRequest(uint256 _requestID) external {
        require(topupMap[_requestID].amountTaker == 0, "Request already accepted");
        require(topupMap[_requestID].requester == msg.sender, "Only owner can cancel");

        // Update the state of the top-up request to indicate cancellation
        topupMap[_requestID].state = 2;
    }

    /**
     * @notice Initiates a request to activate a "zap" for a hedging option.
     *
     * This function allows the owner or the taker of an Equity Swap to request a Zap.
     * The "zap" feature enables experdited settlement before expiry date.
     *
     * Requirements:
     * - The caller must be either the owner or the taker of the hedging option.
     * - The hedging option must have already been taken.
     * - The hedge must be Equity Swap type to benefit from the "zap".
     * - Call & Put options are excerised at Taker's discretion before expiry, zap benefits Writer to end sooner
     * - If both parties agree to Zap, expiry date on the deal is updated to now:
     * ---Taker loses right to exercise Call or Put Option.
     * ---Equity Swaps are unaffected. Setllement can now be triggered sooner.
     *
     * @param _dealID The unique identifier of the hedging option.
     */
    function zapRequest(uint256 _dealID) external {
        hedgingOption storage hedge = hedgeMap[_dealID];

        // Check caller's authority, is either owner or taker
        require(msg.sender == hedge.owner || msg.sender == hedge.taker, "Invalid party to request");
        require(hedge.dt_started > hedge.dt_created, "Hedge not taken yet");

        // Update the corresponding "zap" flag based on the caller
        if (msg.sender == hedge.owner) {
            hedge.zapWriter = true;
        } else {
            hedge.zapTaker = true;
        }

        // Update expiry date to now if flags are true for both parties
        if (hedge.zapWriter && hedge.zapTaker) {
            hedge.dt_expiry = block.timestamp;
        }

        // Emit an event indicating that a "zap" has been requested
        emit ZapRequested(_dealID, msg.sender);
    }

    /**
     * @notice Initiates the settlement process for a hedging option.
     *
     * This function handles the settlement of a hedging option, whether it's a call option, put option, or swap.
     * The settlement involves determining the payoff based on the underlying value, updating user balances, and distributing fees.
     *
     * Settlement Process Overview:
     * - The value is always measured in paired currency, token value is calculated using the 'getUnderlyingValue' function.
     * - The strike value is set by the writer, establishing the strike price. The start value is set when the hedge is initiated.
     * - Premium is the cost and is paid in the pair currency of the underlying token.
     * - For swaps, the cost equals 100% of the underlying start value, acting as collateral rather than hedge premium.
     * - The payoff, which is the difference between the market value and strike value, is paid in underlying or pair currency.
     * - Losses are immediately debited from withdrawn funds. For winners, profits are credited directly to the deposited balance.
     * - Initials for both parties are restored by moving funds from locked in use to deposit, which is the reverse of creating or buying.
     * - Fees are collected in paired tokens if option and swap PayOffs were done in paired tokens.
     * - Fees are collected in underlying tokens if option and swap PayOffs were done in underlying tokens.
     * - Settlement fees are collected into 'address(this)' userBalanceMap and manually distributed as dividends to a staking contract.
     * - Miners can settle deals after they expire, important for Equity Swaps not Options. For options Miners can only delete unexercised options.
     * - Miners have no right to validate or settle Equity Swaps. But for Options and Loans (in our lending platform) they can after expiry.
     * - Miners can pick deals with tokens and amounts they wish to mine to avoid accumulating mining rewards in unwanted tokens.
     * - Each wallet has to log each token interacted with for the sake of pulling all balances credited to it on settlement. This allows for net worth valuations on wallets.
     * - Protocol revenues are stored under 'userBalanceMap[address(this)]' storage. On revenue, protocol revenue is withdrawn manually and sent to the staking wallet.
     * - Takers only can settle/exercise open call options and put options before expiry. After expiry, it's deleted and taxed.
     * - Both parties have the ability to settle equity swaps, but only after expiry.
     *
     * Conditions and Rules:
     * - Call and put options can only be settled by miners or the taker.
     * - Only the taker can settle before expiry; after expiry, the option is deleted.
     * - Swaps require fast settlement after expiry and can be settled by the miner or any of the parties in the deal.
     * - If a hedge has Zap request consesus on experdited settlement, the expiry date is updated to now.
     * - If the loser of a deal does not have enough collateral to pay the winner PayOff, all the losers collateral is used to pay the winner.
     * - For Put Options, Takers must take care to excerice the option whilst the collateral from the Owner still has value to cover the PayOff.
     * - After the PayOff is deducted from losers collateral, any remaining value or balance locked in the deal is restored to the loser.
     *
     * Requirements:
     * - The caller must be either the owner or the taker of the hedging option.
     *
     * @param _dealID The unique identifier of the hedging option.
     */
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

    function settleHedge(uint256 _dealID) external {
        HedgeInfo memory hedgeInfo;
        require(_dealID < dealID, "Invalid option ID");
        hedgingOption storage option = hedgeMap[_dealID];
        require(option.status == 2, "Hedge already settled");

        // Validate caller's authority based on hedge type and timing
        if (option.hedgeType == HedgeType.CALL || option.hedgeType == HedgeType.PUT) {
            require(msg.sender == option.taker || isMiner(msg.sender), "Invalid party to settle");
            if (block.timestamp < option.dt_expiry) {
                require(msg.sender == option.taker, "Only the taker can settle before expiry");
            } else {
                deleteHedge(_dealID); // Taker cannot settle after expiry, hedge is deleted
                return;
            }
        } else if (option.hedgeType == HedgeType.SWAP) {
            require(
                msg.sender == option.owner || msg.sender == option.taker || isMiner(msg.sender),
                "Invalid party to settle"
            );
            require(
                option.zapWriter && option.zapTaker || block.timestamp >= option.dt_expiry,
                "Hedge cannot be settled yet"
            );
        }

        (hedgeInfo.underlyingValue,) = getUnderlyingValue(option.token, option.amount);

        userBalance storage oti = userBalanceMap[option.paired][option.owner];
        userBalance storage otiU = userBalanceMap[option.token][option.owner];
        userBalance storage tti = userBalanceMap[option.paired][option.taker];
        userBalance storage ttiU = userBalanceMap[option.token][option.taker];
        userBalance storage ccBT = userBalanceMap[option.paired][address(this)];
        userBalance storage ccUT = userBalanceMap[option.token][address(this)];
        userBalance storage minrT = userBalanceMap[option.token][msg.sender];
        userBalance storage minrB = userBalanceMap[option.paired][msg.sender];

        hedgeInfo.newAddressFlag = ttiU.deposited == 0;

        // Settlement logic for CALLs
        if (option.hedgeType == HedgeType.CALL) {
            hedgeInfo.marketOverStart = hedgeInfo.underlyingValue > option.strikeValue + option.cost;
            if (hedgeInfo.marketOverStart) {
                // Taker profit in pair currency = underlying - cost - strike value
                // Convert to equivalent tokens lockedInUse by owner, factor fee
                // Check if collateral is enough, otherwise use max balance from Owner lockedInUse
                hedgeInfo.payOff = hedgeInfo.underlyingValue - (option.strikeValue + option.cost);
                (hedgeInfo.priceNow,) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff / hedgeInfo.priceNow;
                if (otiU.lockedInUse < hedgeInfo.tokensDue) {
                    hedgeInfo.tokensDue = otiU.lockedInUse;
                }
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take payoff from owner, credit taxed payoff to taker, finalize owner loss
                ttiU.deposited += hedgeInfo.tokensDue - hedgeInfo.tokenFee;
                otiU.lockedInUse -= option.amount - hedgeInfo.tokensDue;
                otiU.withdrawn += hedgeInfo.tokensDue;
                // Restore taker collateral from lockedInUse - not applicable, taker won & cost was paid to owner
                //
                // Move fees - credit taxes in both, as profit is in underlying and cost is in pair
                ccUT.deposited += (hedgeInfo.tokenFee * protocolFeeRate) / 100;
                // Miner fee - X% of protocol fee for settling option. Mining call options always come with 2 token fees
                minrT.deposited += (hedgeInfo.tokenFee * validatorFeeRate) / 100;
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(hedgeInfo.payOff - calculateFee(hedgeInfo.payOff), option.paired, option.owner, option.taker, 1);
            } else {
                // Move payoff - owner wins cost & losses nothing. Mining not required as cost already paid to writer
                // Restore winners collateral - underlying to owner. none to taker.
                oti.lockedInUse -= option.amount;
                // Log wallet PL: 0 - owner won, 1 taker won
                logPL(option.cost, option.paired, option.owner, option.taker, 0);
            }
        }
        // Settlement logic for PUTs
        else if (option.hedgeType == HedgeType.PUT) {
            hedgeInfo.isBelowStrikeValue = option.strikeValue > hedgeInfo.underlyingValue + option.cost;
            if (hedgeInfo.isBelowStrikeValue) {
                // Taker profit in paired = underlying value - strike value
                // Convert to equivalent tokens lockedInUse by writer, factor fee
                // Check if writer collateral is enough, otherwise use max balance from writer lockedInUse
                hedgeInfo.payOff = option.strikeValue - hedgeInfo.underlyingValue + option.cost;
                (hedgeInfo.priceNow,) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff / hedgeInfo.priceNow;
                if (otiU.lockedInUse < hedgeInfo.tokensDue) {
                    hedgeInfo.tokensDue = otiU.lockedInUse;
                }
                // Get protocol settlement fee in tokens
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take payoff from writer, credit taxed payoff to taker, finalize writer loss
                otiU.lockedInUse -= option.amount - hedgeInfo.tokensDue;
                ttiU.deposited += hedgeInfo.tokensDue - hedgeInfo.tokenFee;
                otiU.withdrawn += hedgeInfo.tokensDue;
                // Restore taker collateral from lockedInUse - not applicable, taker won & cost already paid to owner
                // Move fees - credit taxes in both, as profit is in underlying and cost is in paired
                ccUT.deposited += (hedgeInfo.tokenFee * protocolFeeRate) / 100;
                minrT.deposited += (hedgeInfo.tokenFee * validatorFeeRate) / 100;
                logPL(hedgeInfo.payOff - calculateFee(hedgeInfo.payOff), option.paired, option.owner, option.taker, 1);
            } else {
                // Writer wins cost & losses nothing. Mining not required as cost already paid to writer
                // Restore winners collateral - underlying to owner. none to taker
                oti.lockedInUse -= option.amount;
                logPL(option.cost, option.paired, option.owner, option.taker, 0);
            }
        }
        // Settlement logic for SWAP
        else if (option.hedgeType == HedgeType.SWAP) {
            // if price if higher than start, payoff in token to taker
            // if price is lower than start, payoff in paired token to writer
            if (hedgeInfo.underlyingValue > option.startValue) {
                hedgeInfo.payOff = hedgeInfo.underlyingValue - option.startValue;
                // Convert payoff to token equivalent
                (hedgeInfo.priceNow,) = getUnderlyingValue(option.token, 1);
                hedgeInfo.tokensDue = hedgeInfo.payOff / hedgeInfo.priceNow;
                // Use all tokens if token amount is not enough to cover payoff
                if (hedgeInfo.tokensDue > option.amount) {
                    hedgeInfo.tokensDue = option.amount;
                }
                // Get protocol settlement fee in tokens. EquitySwaps vary in payoff unlike options where its always = hedge cost
                hedgeInfo.tokenFee = calculateFee(hedgeInfo.tokensDue);
                // Move payoff - in underlying, take full gains from writer, credit taxed amount to taker, pocket difference
                ttiU.deposited += hedgeInfo.tokensDue - hedgeInfo.tokenFee;
                otiU.lockedInUse -= option.amount;
                otiU.withdrawn += hedgeInfo.tokensDue;
                // Restore winner collateral - for taker restore cost (swaps have no premium)
                tti.lockedInUse -= option.cost;
                // Move fees - take taxes from profits in underlying. none in paired because taker won underlying tokens
                ccUT.deposited += (hedgeInfo.tokenFee * protocolFeeRate) / 100;
                // Miner fee - X% of protocol fee for settling option. none in paired because taker won underlying tokens
                minrT.deposited += (hedgeInfo.tokenFee * validatorFeeRate) / 100;
                logPL(hedgeInfo.payOff - calculateFee(hedgeInfo.payOff), option.paired, option.owner, option.taker, 0);
            } else {
                hedgeInfo.payOff = option.startValue - hedgeInfo.underlyingValue;
                // Use all cost if paired token amount is not enough to cover payoff
                if (hedgeInfo.payOff > option.cost) {
                    hedgeInfo.payOff = option.cost;
                }
                // Get protocol settlement fee in paired currency. [EquitySwaps vary in payoff unlike options where its always = hedge cost]
                hedgeInfo.pairedFee = calculateFee(hedgeInfo.payOff);
                // Move payoff - loss of paired cost to taker only, writer loses nothing
                // 1. credit equivalent payoff in paired to writer
                // 2. credit takers full cost back & then debit loss using withrawn instantly
                oti.deposited += hedgeInfo.payOff - hedgeInfo.pairedFee;
                tti.lockedInUse -= option.cost;
                tti.withdrawn += hedgeInfo.payOff;
                // Restore winner collateral - for owner, all underlying tokens
                otiU.lockedInUse -= option.amount;
                // Move fees - profits in pair so only paired fees credited
                ccBT.deposited += (hedgeInfo.pairedFee * protocolFeeRate) / 100;
                // Miner fee - X% of protocol fee for settling option. none in underlying tokens
                minrB.deposited += (hedgeInfo.pairedFee * validatorFeeRate) / 100;
                logPL(hedgeInfo.payOff, option.paired, option.owner, option.taker, 1);
            }
        }

        option.status = 3;
        option.endValue = hedgeInfo.underlyingValue;
        option.dt_settled = block.timestamp;

        if (option.hedgeType == HedgeType.CALL || option.hedgeType == HedgeType.PUT) {
            optionsSettled[option.token].push(_dealID);
        }
        if (option.hedgeType == HedgeType.SWAP) {
            equityswapsSettled[option.token].push(_dealID);
        }
        logMiningData(msg.sender);
        logAnalyticsFees(
            option.token,
            hedgeInfo.tokenFee,
            hedgeInfo.pairedFee,
            hedgeInfo.tokensDue,
            option.cost,
            hedgeInfo.underlyingValue
        );

        // Catch new erc20 address so that wallet can log all underlying token balances credited to it
        // Paired addresses already caught on deposit by wallet
        if (hedgeInfo.tokensDue > 0 && hedgeInfo.newAddressFlag) {
            userERC20s[option.taker].push(option.token);
        }

        emit HedgeSettled(option.token, _dealID, hedgeInfo.underlyingValue, hedgeInfo.payOff, msg.sender);
        emit MinedHedge(_dealID, msg.sender, option.token, option.paired, hedgeInfo.tokenFee, hedgeInfo.pairedFee);
    }

    /**
     * @notice Logs mining data when a trade settles.
     *
     * This function increments the settled trades count and updates the miner count if the miner is new.
     *
     * @param miner The address of the miner.
     */
    function logMiningData(address miner) internal {
        settledTradesCount++;
        if (!minerMap[miner]) {
            minerMap[miner] = true;
            miners++;
        }
    }

    /**
     * @notice Logs analytics and fees data after a settlement.
     *
     * This function updates the protocol profits, fees, and paired fees after a settlement.
     *
     * @param token The address of the token.
     * @param tokenFee The fee collected in the token.
     * @param pairedFee The fee collected in the paired token.
     * @param tokenProfit The profit made in the token.
     * @param pairProfit The profit made in the paired token.
     * @param endValue The end value of the settlement.
     */
    function logAnalyticsFees(
        address token,
        uint256 tokenFee,
        uint256 pairedFee,
        uint256 tokenProfit,
        uint256 pairProfit,
        uint256 endValue
    ) internal {
        (address paired,) = getPairAddress(token);
        // All profits made by traders
        protocolProfitsTokens[token] += tokenProfit;
        protocolPairProfits[paired] += pairProfit;
        // Fees collected by protocol
        protocolFeesTokens[token] += tokenFee;
        protocolPairedFees[paired] += pairedFee;
        settledVolume[paired] += endValue;
    }

    /**
     * @notice Logs profit and loss (PL) data after a settlement.
     *
     * This function updates the profit and loss data for the involved parties after a settlement.
     *
     * @param amount The amount of profit or loss.
     * @param paired The address of the paired token.
     * @param optionowner The address of the option owner.
     * @param optiontaker The address of the option taker.
     * @param winner Indicates whether the option owner (0) or taker (1) is the winner.
     */
    function logPL(uint256 amount, address paired, address optionowner, address optiontaker, uint256 winner) internal {
        if (winner == 0) {
            userPLMap[paired][optionowner].profits += amount;
            userPLMap[paired][optiontaker].losses += amount;
        } else if (winner == 1) {
            userPLMap[paired][optiontaker].profits += amount;
            userPLMap[paired][optionowner].losses += amount;
        }
    }

    /**
     * @notice Updates the protocol fee.
     *
     * This function updates the numerator and denominator of the protocol fee.
     *
     * @param numerator The new numerator of the fee.
     * @param denominator The new denominator of the fee.
     */
    function updateFee(uint256 numerator, uint256 denominator) external onlyOwner {
        feeNumerator = numerator;
        feeDenominator = denominator;
        emit FeeUpdated(numerator, denominator);
    }

    /**
     * @notice Updates the validator fee.
     *
     * This function updates the validator fee as a pecentage
     *
     * @param protocolPercent The percentage amount of protocol fee.
     * @param validatorPercent The percentage amount of validator fee.
     */
    function updateValidatorFee(uint256 protocolPercent, uint256 validatorPercent) external onlyOwner {
        // check that protocolFeeRate + validatorFeeRate == 100
        require(protocolPercent + validatorPercent == 100, "Total fee rate must be 100");
        protocolFeeRate = protocolPercent;
        validatorFeeRate = validatorPercent;
        emit ValidatorFeeUpdated(protocolFeeRate, validatorFeeRate);
    }

    /**
     * @notice Calculates the fee based on the given amount.
     *
     * This function calculates the fee based on the given amount and the fee numerator and denominator.
     *
     * @param amount The amount for which the fee is calculated.
     * @return The calculated fee amount.
     */
    function calculateFee(uint256 amount) public view returns (uint256) {
        require(amount >= feeDenominator, "Revenue is too small");
        uint256 amountInLarge = amount * (feeDenominator - feeNumerator);
        uint256 amountIn = amountInLarge / feeDenominator;
        uint256 fee = amount - amountIn;
        return fee;
    }
    /**
     * @notice Toggles the bookmark status of a hedging option using its ID.
     *
     * This function toggles the bookmark status of a hedging option based on its ID for the caller.
     * It emits an event indicating the toggle action.
     *
     * @param _dealID The unique identifier of the hedging option.
     */

    function bookmarkHedge(uint256 _dealID) external {
        bool bookmarked = bookmarks[msg.sender][_dealID];
        bookmarks[msg.sender][_dealID] = !bookmarked;
        emit BookmarkToggle(msg.sender, _dealID, !bookmarked);
        // Update bookmarkedOptions array for wallet
        if (!bookmarked) {
            bookmarkedOptions[msg.sender].push(_dealID);
        } else {
            uint256[] storage options = bookmarkedOptions[msg.sender];
            for (uint256 i = 0; i < options.length; i++) {
                if (options[i] == _dealID) {
                    // When values match, remove the dealId from array
                    if (i < options.length - 1) {
                        options[i] = options[options.length - 1];
                    }
                    options.pop();
                    break;
                }
            }
        }
    }

    /**
     * @notice Gets the bookmark status of a hedging option for a specific user.
     *
     * This function retrieves the bookmark status of a hedging option for a specific user.
     *
     * @param user The address of the user.
     * @param _dealID The unique identifier of the hedging option.
     * @return The bookmark status.
     */
    function getBookmark(address user, uint256 _dealID) public view returns (bool) {
        return bookmarks[user][_dealID];
    }

    /**
     * @notice Gets all bookmarks of a user.
     *
     * This function retrieves all bookmarks of a user.
     *
     * @param user The address of the user.
     * @return An array containing all bookmarked hedging option IDs.
     */
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
    // paired value is always the pair address of the token provided.
    // TWAP oracle is used to get the price.
    function getUnderlyingValue(address _tokenAddress, uint256 _tokenAmount) public view returns (uint256, address) {
        (address poolAddress, address pairedCurrency) = getPairAddress(_tokenAddress);
        require(poolAddress != address(0), "Pool doesn't exist");

        // Uniswap V3 TWAP Oracle
        uint32 period = 3600; // attempting 1hr
        uint256 priceX96 = IPriceOracle(priceOracle).getTWAP(poolAddress, period);

        uint256 value = (priceX96 * _tokenAmount) / (1 << 96); // Adjust for fixed-point division

        return (value, pairedCurrency);
    }

    // Get pair address for a given token across multiple fee tiers
    function getPairAddress(address tokenAddress) public view returns (address poolAddress, address pairedCurrency) {
        uint24[] memory feeTiers = new uint24[](3);
        feeTiers[0] = 500; // 0.05% fee tier
        feeTiers[1] = 3000; // 0.3% fee tier
        feeTiers[2] = 10000; // 1% fee tier

        // Check for WETH pairs first in Uniswap V2
        address wethPoolAddressV2 = uniswapV2Factory.getPair(tokenAddress, wethAddress);
        if (wethPoolAddressV2 != address(0)) {
            return (wethPoolAddressV2, wethAddress);
        }

        // Check for WETH pairs in Uniswap V3
        for (uint256 i = 0; i < feeTiers.length; i++) {
            address wethPoolAddressV3 = uniswapV3Factory.getPool(tokenAddress, wethAddress, feeTiers[i]);
            if (wethPoolAddressV3 != address(0)) {
                return (wethPoolAddressV3, wethAddress);
            }
        }

        // Check for USDT pairs in Uniswap V2
        address usdtPoolAddressV2 = uniswapV2Factory.getPair(tokenAddress, usdtAddress);
        if (usdtPoolAddressV2 != address(0)) {
            return (usdtPoolAddressV2, usdtAddress);
        }

        // Check for USDT pairs in Uniswap V3
        for (uint256 i = 0; i < feeTiers.length; i++) {
            address usdtPoolAddressV3 = uniswapV3Factory.getPool(tokenAddress, usdtAddress, feeTiers[i]);
            if (usdtPoolAddressV3 != address(0)) {
                return (usdtPoolAddressV3, usdtAddress);
            }
        }

        // Check for USDC pairs in Uniswap V2
        address usdcPoolAddressV2 = uniswapV2Factory.getPair(tokenAddress, usdcAddress);
        if (usdcPoolAddressV2 != address(0)) {
            return (usdcPoolAddressV2, usdcAddress);
        }

        // Check for USDC pairs in Uniswap V3
        for (uint256 i = 0; i < feeTiers.length; i++) {
            address usdcPoolAddressV3 = uniswapV3Factory.getPool(tokenAddress, usdcAddress, feeTiers[i]);
            if (usdcPoolAddressV3 != address(0)) {
                return (usdcPoolAddressV3, usdcAddress);
            }
        }

        revert("Token is not paired with WETH, USDT, or USDC");
    }

    // Token balances breakdown for wallet
    function getUserTokenBalances(address token, address user)
        public
        view
        returns (
            uint256 deposited,
            uint256 withdrawn,
            uint256 lockedInUse,
            uint256 withdrawable,
            uint256 withdrawableValue,
            address paired
        )
    {
        userBalance memory uto = userBalanceMap[address(token)][address(user)];
        deposited = uto.deposited;
        withdrawn = uto.withdrawn;
        lockedInUse = uto.lockedInUse;
        withdrawable = uto.deposited - uto.withdrawn - uto.lockedInUse;
        if (token != usdtAddress && token != usdcAddress) {
            (withdrawableValue, paired) = getUnderlyingValue(token, withdrawable);
        } else {
            (withdrawableValue, paired) = (withdrawable, address(0));
        }
        return (deposited, withdrawn, lockedInUse, withdrawable, withdrawableValue, paired);
    }

    // Internal function to retrieve a subset of an array based on startIndex and limit
    function getSubset(uint256[] storage fullArray, uint256 startIndex, uint256 limit)
        internal
        view
        returns (uint256[] memory)
    {
        uint256 length = fullArray.length;
        require(startIndex <= length, "Start index equal array length");
        if (length == 0) {
            return new uint256[](0); //return empty array
        }
        uint256 actualLimit = (length - startIndex < limit) ? length - startIndex : limit;
        uint256[] memory subset = new uint256[](actualLimit);
        for (uint256 i = 0; i < actualLimit; i++) {
            subset[i] = fullArray[startIndex + i];
        }
        // Resize the array to remove unused slots
        assembly {
            mstore(subset, actualLimit)
        }
        return subset;
    }

    // Function to retrieve a subset of tokens from a user's history.
    function getUserHistory(address user, uint256 startIndex, uint256 limit) public view returns (address[] memory) {
        address[] storage tokens = userERC20s[user];
        uint256 length = tokens.length;
        require(startIndex <= length, "Invalid start index");
        if (length == 0) {
            return new address[](0); //return empty array
        }
        uint256 actualLimit = length - startIndex < limit ? length - startIndex : limit;
        address[] memory result = new address[](actualLimit);
        for (uint256 i = startIndex; i < startIndex + actualLimit; i++) {
            result[i - startIndex] = tokens[i];
        }
        // Resize the array to remove unused slots
        assembly {
            mstore(result, actualLimit)
        }
        return result;
    }

    // Functions to retrieve a subset of options or swaps created/taken by a user
    function getUserOptionsCreated(address user, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(myoptionsCreated[user], startIndex, limit);
    }

    function getUserSwapsCreated(address user, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(myswapsCreated[user], startIndex, limit);
    }

    function getUserOptionsTaken(address user, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(myoptionsTaken[user], startIndex, limit);
    }

    function getUserSwapsTaken(address user, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(myswapsTaken[user], startIndex, limit);
    }

    // Functions to retrieve PL for user
    function getEquivUserPL(address user, address pairedCurrency)
        external
        view
        returns (uint256 profits, uint256 losses)
    {
        return (userPLMap[pairedCurrency][user].profits, userPLMap[pairedCurrency][user].losses);
    }

    // Helper function to retrieve a subset of options or swaps created/taken
    function getAllOptions(uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        return getSubset(optionsCreated, startIndex, limit);
    }

    function getAllSwaps(uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        return getSubset(equityswapsCreated, startIndex, limit);
    }

    // Function to retrieve a subset of options or swaps taken
    function getAllOptionsTaken(uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        return getSubset(optionsTaken, startIndex, limit);
    }

    function getAllSwapsTaken(uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        return getSubset(equityswapsTaken, startIndex, limit);
    }

    // Function to retrieve purchased options or swaps for ERC20 address
    function getBoughtOptionsERC20(address _token, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(optionsBought[_token], startIndex, limit);
    }

    function getBoughtSwapsERC20(address _token, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(equityswapsBought[_token], startIndex, limit);
    }

    // Function to retrieve settled options or swaps for ERC20 address
    function getSettledOptionsERC20(address _token, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(optionsSettled[_token], startIndex, limit);
    }

    function getSettledSwapsERC20(address _token, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(equityswapsSettled[_token], startIndex, limit);
    }

    // Function to retrieve a subset of options or swaps for a specific token
    function getOptionsForToken(address _token, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(tokenOptions[_token], startIndex, limit);
    }

    function getSwapsForToken(address _token, uint256 startIndex, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        return getSubset(tokenSwaps[_token], startIndex, limit);
    }

    // Function to get hedge details
    function getHedgeDetails(uint256 _dealID) public view returns (hedgingOption memory) {
        hedgingOption storage hedge = hedgeMap[_dealID];
        require(hedge.owner != address(0), "Option does not exist");
        return hedge;
    }

    function getHedgeRange(uint256 startId, uint256 endId) public view returns (hedgingOption[] memory) {
        require(endId >= startId, "Invalid range");

        uint256 rangeSize = endId - startId + 1;
        hedgingOption[] memory result = new hedgingOption[](rangeSize);
        uint256 count = 0;

        for (uint256 i = 0; i < rangeSize; i++) {
            uint256 dealId = startId + i;
            hedgingOption storage hedge = hedgeMap[dealId];
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
    function getCountTokenOptions(address token) external view returns (uint256) {
        return tokenOptions[token].length;
    }

    function getCountTokenSwaps(address token) external view returns (uint256) {
        return tokenSwaps[token].length;
    }

    // Function to get the length of the options array for a specific user
    function getUserOptionCount(address user, bool store) external view returns (uint256) {
        if (store) {
            return myoptionsCreated[user].length;
        } else {
            return myoptionsTaken[user].length;
        }
    }

    function getUserSwapCount(address user, bool store) external view returns (uint256) {
        if (store) {
            return myswapsCreated[user].length;
        } else {
            return myswapsTaken[user].length;
        }
    }

    // Receive function to accept Ether
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdrawEther(address payable to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");

        (bool success,) = to.call{value: amount}("");
        require(success, "Transfer failed");

        emit EtherWithdrawn(to, amount);
    }
}
