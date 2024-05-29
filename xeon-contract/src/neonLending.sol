// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";
import "./neonStaking.sol";

contract ERC20LendingPlatform is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct LoanRequest {
        address requester;
        address giver;
        address token;
        address pair;
        uint256 collateralAmount;
        uint256 loanAmount;
        uint256 interest;
        uint256 dueDate;
        bool repaid;
        bool collateralLocked;
    }

    struct userBalance {
        uint256 deposited;
        uint256 withdrawn;
        uint256 lockedinuse;
    }

    // Loans
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(address => uint[]) public loansDefaulted;// defaulted are pushed to array
    // User balances
    mapping(address => mapping(address => userBalance)) public userBalanceMap;
    mapping(address => address[]) public userERC20s;
    // Protocol fees
    mapping(address => uint256) public protocolCashierFees;
    mapping(address => userBalance) public protocolBalanceMap;

    // Analytics
    mapping(address => uint256[]) public loansGiven;
    mapping(address => uint256[]) public myLoansGiven;
    mapping(address => uint256) public loansGivenVolume;
    mapping(address => uint256[]) public loansTaken;
    mapping(address => uint256[]) public myLoansTaken;
    mapping(address => uint256) public loansTakenVolume;
    mapping(address => bool) public miners;
    
    // Protocol analytics tracking
    mapping(address => uint256) public protocolProfitsTokens; // Profits made by traders in tokens
    mapping(address => uint256) public protocolPairProfits; // Profits made by traders in paired currency
    mapping(address => uint256) public settledVolume; // Volume of repayments in paired currency
    mapping(address => bool) public minerMap;

    address public wethAddress;
    address public usdtAddress;
    address public usdcAddress;
    address public uniswapV3Factory;

    // Equivs
    uint256 public wethEquivDeposits;
    uint256 public usdtEquivDeposits;
    uint256 public usdcEquivDeposits;
    uint256 public wethEquivWithdrawals;
    uint256 public usdtEquivWithdrawals;
    uint256 public usdcEquivWithdrawals;

    // Global counters
    uint256 public loanRequestCount;
    uint256 public depositedTokensLength;
    uint256 public loansGivenLength;
    uint256 public loansTakenLength;
    uint256 public feeNumerator;
    uint256 public feeDenominator;
    uint public miners;    
    uint public settledTradesCount;

    // Staking
    neonStaking public stakingContract;

    event LoanRequested(uint256 indexed loanId, address indexed requester, address token, uint256 collateralAmount, uint256 loanAmount, uint256 interest, uint256 dueDate);
    event LoanRepaid(uint256 indexed loanId, address indexed requester);
    event LoanDefaulted(uint256 indexed loanId, address indexed requester, address indexed loanGiver, address settler);
    event onDeposit(address indexed token, uint256 amount, address indexed user);
    event onWithdraw(address indexed token, uint256 amount, address indexed user);
    event loanGiven(uint indexed loanId, address indexed giver, address indexed token, uint256 amount);
    event feeUpdated(uint256 numerator, uint256 denominator);
    event FeesTransferred(address indexed token, address indexed to, uint256 amount);

    constructor(address _wethAddress, address _usdtAddress, address _usdcAddress, address _stakingContract, address _uniswapV3Factory) {
        require(_stakingContract != address(0), "Invalid StakingContract address");
        require(_uniswapV3Factory != address(0), "Invalid UniswapV3Factory address");

        uniswapV3Factory = IUniswapV3Factory(_uniswapV3Factory);
        stakingContract = neonStaking(_stakingContract);

        wethAddress = _wethAddress;
        usdtAddress = _usdtAddress;
        usdcAddress = _usdcAddress;
        feeNumerator = 1; // Default values
        feeDenominator = 100; // Default values
    }

    /**
    * @dev Updates the fee numerator and denominator.
    * The owner of the contract can update the fee percentage used for calculating fees.
    * 
    * @param numerator The numerator of the fee percentage.
    * @param denominator The denominator of the fee percentage.
    */
    function updateFee(uint256 numerator, uint256 denominator) external onlyOwner {
        feeNumerator = numerator;
        feeDenominator = denominator;
        emit feeUpdated(numerator, denominator);
    }

    /**
    * @dev Calculates the fee based on the given amount and the current fee percentage.
    * 
    * Requirements:
    * - The amount must be greater than or equal to the fee denominator.
    * 
    * @param amount The amount to calculate the fee for.
    * @return fee The calculated fee.
    */
    function calculateFee(uint256 amount) public view returns (uint256) {
        require(amount >= feeDenominator, "Revenue is too small");
        uint256 amountInLarge = amount * (feeDenominator - feeNumerator);
        uint256 amountIn = amountInLarge / feeDenominator;
        uint256 fee = amount - amountIn;
        return fee;
    }

    /**
    * @dev Allows users to deposit tokens into the lending contract.
    * Users can deposit tokens into the lending contract, which will be used as collateral or for other purposes.
    * 
    * Requirements:
    * - The amount of tokens to deposit must be greater than 0.
    * - The token address must not be 0.
    * 
    * Effects:
    * - Transfers tokens from the sender to the contract.
    * - Updates user and protocol balances accordingly, feesOnToken is true by default.
    * - Emits a deposit event.
    * 
    * @param _token The address of the token to deposit.
    * @param _amount The amount of tokens to deposit.
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

        // Update equivalent deposits
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
        userBalance storage user = userBalanceMap[_token][msg.sender];
        if (uto.deposited == 0) {
            userERC20s[msg.sender].push(_token);
        }
        user.deposited += receivedAmount;

        // Log new token address
        if (protocolBalanceMap[_token].deposited == 0) {
            userERC20s[address(this)].push(_token);
            depositedTokensLength++;
        }
        protocolBalanceMap[_token].deposited += receivedAmount;

        // Emit deposit event
        emit onDeposit(_token, receivedAmount, msg.sender);
    }

    /**
    * @dev Allows users to withdraw tokens from the lending contract.
    * Users can withdraw tokens from the lending contract if they have sufficient available balance.
    * 
    * Requirements:
    * - The amount to withdraw must be greater than 0 and less than or equal to the available balance.
    * 
    * Effects:
    * - Transfers tokens from the contract to the sender.
    * - Updates user and protocol balances accordingly.
    * - Emits a withdrawal event.
    * 
    * @param token The address of the token to withdraw.
    * @param amount The amount of tokens to withdraw.
    */
    function withdrawToken(address token, uint256 amount) external nonReentrant {
        (, , , uint256 withdrawable, , ) = getUserTokenBalances(token, msg.sender);
        require(amount > 0 && amount <= withdrawable, "Insufficient available balance");

        userBalance storage user = userBalanceMap[token][msg.sender];
        user.withdrawn += amount;

        uint256 tokenFee;
        if (token == wethAddress || token == usdtAddress || token == usdcAddress) {
            tokenFee = calculateFee(amount) / 10;
            protocolCashierFees[token] += tokenFee;
            userBalanceMap[token][address(this)].deposited += tokenFee;
        }

        if (token == wethAddress) {
            require(IWETH9(wethAddress).transfer(msg.sender, amount - tokenFee), "Transfer failed");
        } else {
            require(IERC20(token).transfer(msg.sender, amount - tokenFee), "Transfer failed");
        }

        protocolBalanceMap[token].withdrawn += amount;

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

        emit onWithdraw(token, amount, msg.sender);
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
    * @dev Allows users to request a loan by providing collateral and specifying loan details.
    * 
    * Requirements:
    * - The collateral amount must be greater than 0.
    * - The loan amount must be greater than 0.
    * - The user must have sufficient collateral deposited.
    * - Requesters collateral is lockedInUse derung the loan duration.
    * - The loan duration must be greater than 0.
    * 
    * @param token The address of the collateral token.
    * @param collateralAmount The amount of collateral to provide.
    * @param loanAmount The amount of the loan requested.
    * @param interest The interest rate for the loan.
    * @param duration The duration of the loan.
    */
    function requestLoan(address token, uint256 collateralAmount, uint256 loanAmount, uint256 interest, uint256 duration) external nonReentrant {
        require(collateralAmount > 0, "Collateral amount must be greater than 0");
        require(loanAmount > 0 && duration > 0, "Amount and duration must be greater than 0");

        userBalance storage user = userBalanceMap[token][msg.sender];
        require(uto.deposited - user.lockedinuse >= collateralAmount, "Insufficient collateral");

        user.lockedinuse += collateralAmount;

        loanRequestCount++;
        uint256 loanId = loanRequestCount;
        // get paired token for the collateral then save it 
        (, address paired) = getUnderlyingValue(token, collateralAmount);
        require(paired != address(0), "Paired token doesn't exist");

        loanRequests[loanId] = LoanRequest({
            requester: msg.sender,
            token: token,
            pair: paired,
            collateralAmount: collateralAmount,
            loanAmount: loanAmount,
            interest: interest,
            dueDate: block.timestamp + duration,
            repaid: false,
            collateralLocked: true
        });

        emit LoanRequested(loanId, msg.sender, token, collateralAmount, loanAmount, interest, block.timestamp + duration);
    }

    /**
    * @dev Allows users to give a loan to another user.
    * 
    * Requirements:
    * - The loan must not have been repaid already.
    * - The requested loan amount must match the loan amount.
    * - Loan amount is always in paired token value.
    * - Fee is applied & always in paired token value.
    * - Loan amount is paid to the requester directly.
    * 
    * @param loanId The ID of the loan to be given.
    * @param token The address of the token to be loaned.
    * @param loanAmount The amount of the loan to be given.
    */
    function giveLoan(uint256 loanId, address token, uint256 loanAmount) external nonReentrant {
        LoanRequest storage loan = loanRequests[loanId];
        require(block.timestamp <= loan.dueDate, "Loan is overdue");
        require(loan.giver == address(0), "Loan already given");
        require(!loan.repaid, "Loan already repaid");
        require(loan.loanAmount == loanAmount, "Loan amount mismatch");

        uint256 protocolFee = calculateFee(loanAmount);
        uint256 amountAfterFee = loanAmount - protocolFee;
        
        // Paired value transfer
        IERC20(loan.pair).safeTransferFrom(msg.sender, loan.requester, amountAfterFee);
        IERC20(loan.pair).safeTransferFrom(msg.sender, address(this), protocolFee);

        loanRequests[loanId] = LoanRequest({
            giver: msg.sender
        });

        // Log protocol fees and loan data
        protocolCashierFees[loan.pair] += protocolFee;
        logLoanData(loanId, token, loanAmount, msg.sender, loan.requester, loan.pair, protocolFee);
        emit LoanGiven(loanId, msg.sender, loan.pair, loanAmount);
    }

    /**
    * @dev Allows users to repay a loan.
    * 
    * Requirements:
    * - The loan must not have been repaid already.
    * - The loan must not be overdue.
    * - The user must be the requester of the loan.
    * - The repayment amount must match the total repayment (loan amount + interest).
    * - Loan amount is always in paired token value.
    * - Fee is applied & always in paired token value.
    * - Repayment amount is paied direct to the loan giver.
    *
    * @param loanId The ID of the loan to be repaid.
    * @param token The address of the token to be loaned.
    * @param repaymentAmount The amount of the loan to be given.
    */
    function repayLoan(uint256 loanId, address token, uint256 repaymentAmount) external nonReentrant {
        LoanRequest storage loan = loanRequests[loanId];
        require(block.timestamp <= loan.dueDate, "Loan is overdue");
        require(!loan.repaid, "Loan already repaid");
        require(loan.requester == msg.sender, "Only the requester can repay the loan");

        uint256 totalRepayment = loan.loanAmount + loan.interest;
        require(repaymentAmount == totalRepayment, "Repayment amount mismatch");

        // Protocol Fee
        uint256 protocolFee = calculateFee(totalRepayment);
        uint256 amountAfterFee = totalRepayment - protocolFee;

        // Paired value transfer to requester & protocol fees
        IERC20(loan.pair).safeTransferFrom(msg.sender, loan.requester, amountAfterFee);
        IERC20(loan.pair).safeTransferFrom(msg.sender, address(this), protocolFee);
        userBalanceMap[loan.pair][address(this)] += protocolFee;

        // Flag loan as repaid
        loan.repaid = true;
        loan.collateralLocked = false;

        // Update requester balance
        userBalance storage user = userBalanceMap[loan.token][loan.requester];
        user.lockedinuse -= loan.collateralAmount;

        // Log fees and analytics
        protocolCashierFees[loan.pair] += protocolFee;
        logAnalyticsFees(loan.pair, amountAfterFee);

        emit LoanRepaid(loanId, loan.requester);
    }

    /**
    * @dev Handles default on a loan.
    * 
    * Requirements:
    * - The caller must be one of the loan parties or a miner.
    * - The loan must be overdue.
    * - The loan must not have been repaid already.
    * - Miners are allowed to settle and collect a fee on default.
    * - Loan giver gets equivalent in collateral, of repayment amount owed in pair.
    * 
    * @param loanId The ID of the loan in default.
    */
    function handleDefault(uint256 loanId) external nonReentrant {
        LoanRequest storage loan = loanRequests[loanId];        
        require(msg.sender == loan.requester || msg.sender == loan.giver || isMiner(msg.sender), "Only loan parties allowed");
        require(block.timestamp > loan.dueDate, "Loan is not overdue");
        require(!loan.repaid, "Loan already repaid");

        uint256 totalRepayment = loan.loanAmount + loan.interest;
        uint256 collateralToLoanGiver = (totalRepayment * 10**uint256(getTokenDecimals(loan.token))) / getTokenPrice(loan.token);
        // if defaulter doesnt have enough to meet the collateralToLoanGiver, use all of them
        if (collateralToLoanGiver > loan.collateralAmount) {
            collateralToLoanGiver = loan.collateralAmount;
        }

        // Debit requesters collateral
        userBalance storage user = userBalanceMap[loan.token][loan.requester];
        user.lockedinuse -= loan.collateralAmount;
        user.withdrawn += collateralToLoanGiver;

        // Protocol Fee
        uint256 protocolFee = calculateFee(totalRepayment);
        uint256 amountAfterFee = totalRepayment - protocolFee;
        uint256 collateralToLoanGiverAfterFee = collateralToLoanGiver - protocolFee;

        if (isMiner(msg.sender)) {
            // Split protocol fee 50/50 between protocol and miner. Paired value
            uint256 minerProtocolFee = protocolFee / 2;
            IERC20(loan.pair).safeTransfer(msg.sender, minerProtocolFee);
            protocolCashierFees[loan.pair] += minerProtocolFee;
            logMiningData(msg.sender);
        }
        // Paired value transfer to giver & protocol fees collected in user map
        IERC20(loan.pair).safeTransfer(loan.giver, collateralToLoanGiverAfterFee);
        userBalanceMap[loan.pair][address(this)] += protocolFee;

        loan.collateralLocked = false;
        // defaulted loans are pushed to array
        loansDefaulted[msg.sender].push(loanId);

        // Log fees and analytics
        protocolCashierFees[loan.pair] += protocolFee;
        logAnalyticsFees(loan.token, collateralToLoanGiverAfterFee);
        emit LoanDefaulted(loanId, loan.requester, collateralToLoanGiverAfterFee, msg.sender);
    }


    // ====== Helper Functions ========

    /**
    * @dev Logs the details of the loan transaction, including loans given, loans taken, and their volumes.
    * This function updates the relevant storage mappings and counters for the loans given by the lender and taken by the borrower.
    * 
    * @param loanId The ID of the loan being processed.
    * @param token The address of the token involved in the loan.
    * @param loanAmount The amount of the loan.
    * @param lender The address of the lender.
    * @param borrower The address of the borrower.
    * @param paired The address of the paired token.
    */
    function logLoanData(
        uint256 loanId,
        address token,
        uint256 loanAmount,
        address lender,
        address borrower,
        address paired,
        uint256 protocolFee
    ) internal {
        // Log loans given
        loansGivenLength++;
        loansGiven[token].push(loanId);
        loansGiven[paired].push(loanId);
        myLoansGiven[lender].push(loanId);

        // Log loans taken
        loansTakenLength++;
        loansTaken[token].push(loanId);
        loansTaken[paired].push(loanId);
        myLoansTaken[borrower].push(loanId);

        // Log loan volumes
        loansGivenVolume[paired] += loanAmount;
        loansTakenVolume[paired] += loanAmount;
    }

    /**
    * @dev Logs mining data for the protocol.
    * This function increments the settled trades count and tracks unique miners contributing to the protocol.
    * 
    * @param miner The address of the miner to log data for.
    */
    function logMiningData(address miner) internal {
        settledTradesCount++;
        if (!minerMap[miner]) {
            minerMap[miner] = true;
            miners++;
        }
    }

    /**
    * @dev Logs analytics fees for the protocol.
    * This function records settlement / repayment volume
    * 
    * @param token The address of the token involved in the transaction.
    * @param endValue The final value of the transaction.
    */
    function logAnalyticsFees(address token, uint256 repaymentValue) internal {
        (address paired, ) = getPairAddressZK(token);
        settledVolume[paired] += repaymentValue;
    }
    
    /**
    * @dev Retrieves the price of a token in its paired currency.
    * This function calculates the price of a token in its paired currency by calling 'getUnderlyingValue' function 
    * with a token amount equivalent to 10^decimal, where 'decimal' is the number of decimals of the token.
    * 
    * @param token The address of the token to retrieve the price for.
    * @return The price of the token in its paired currency.
    */
    function getTokenPrice(address token) internal view returns (uint256) {
        (uint256 price, ) = getUnderlyingValue(token, 10**uint256(getTokenDecimals(token)));
        return price;
    }

    /**
    * @dev Retrieves the number of decimals of a token.
    * This function returns the number of decimals of a given token by calling the 'decimals' function of the ERC20 token contract.
    * 
    * @param token The address of the token to retrieve the number of decimals for.
    * @return The number of decimals of the token.
    */
    function getTokenDecimals(address token) internal view returns (uint8) {
        return IERC20(token).decimals();
    }

    /**
    * @dev Checks if an address is a miner based on staked balance.
    * This function determines if a given address is a miner by checking if they have a deposited balance in the staking contract.
    * 
    * @param _addr The address to check for miner status.
    * @return A boolean indicating whether the address is a miner (true) or not (false).
    */
    function isMiner(address _addr) internal view returns (bool) {
        return userBalanceMap[stakingContract][_addr].deposited > 0;
    }

    /**
    * @dev Retrieves the address of the pool and the paired currency for a token.
    * This function fetches the address of the pool and the paired currency for a given token by calling 
    * the 'getPairAddressZK' function and verifies the existence of the pool.
    * 
    * @param _tokenAddress The address of the token to retrieve pool and paired currency information for.
    * @return poolAddress The address of the Uniswap V3 pool.
    * @return pairedCurrency The address of the paired currency.
    */
    struct PairInfo {
        address pairAddress;
        address pairedCurrency;
        IERC20 token0;
        IERC20 token1;
        uint112 reserve0;
        uint112 reserve1;
        uint256 token0Decimals;
        uint256 token1Decimals;
    }
    function getUnderlyingValue(address _tokenAddress, uint256 _tokenAmount) public view returns (uint256, address) {
        (address poolAddress, address pairedCurrency) = getPairAddressZK(_tokenAddress);
        require(poolAddress != address(0), "Pool doesn't exist");

        uint32 period = 3600; // 1 hour
        (int24 tick, ) = OracleLibrary.consult(poolAddress, period);

        uint256 priceX96 = OracleLibrary.getQuoteAtTick(tick, uint128(_tokenAmount), _tokenAddress, pairedCurrency);

        return (priceX96, pairedCurrency);
    }

    /**
    * @dev Retrieves the address of the Uniswap V3 pool and the paired currency for a token.
    * This function fetches the address of the Uniswap V3 pool and the paired currency for a given token.
    * 
    * @param tokenAddress The address of the token to retrieve pool and paired currency information for.
    * @return poolAddress The address of the Uniswap V3 pool.
    * @return pairedCurrency The address of the paired currency.
    */
    function getPairAddressZK(address tokenAddress) public view returns (address poolAddress, address pairedCurrency) {
        address wethPoolAddress = IUniswapV3Factory(uniswapV3Factory).getPool(tokenAddress, wethAddress, 3000); // 0.3% fee tier assumed
        address usdtPoolAddress = IUniswapV3Factory(uniswapV3Factory).getPool(tokenAddress, usdtAddress, 3000); // 0.3% fee tier
        address usdcPoolAddress = IUniswapV3Factory(uniswapV3Factory).getPool(tokenAddress, usdcAddress, 3000); // 0.3% fee tier
        if (wethPoolAddress != address(0)) {
            return (wethPoolAddress, wethAddress);
        } else if (usdtPoolAddress != address(0)) {
            return (usdtPoolAddress, usdtAddress);
        } else if (usdcPoolAddress != address(0)) {
            return (usdcPoolAddress, usdcAddress);
        } else {
            revert("Token is not paired with WETH, USDT, or USDC");
        }
    }

    /**
    * @dev Retrieves the token balances and other information for a user.
    * This function fetches the deposited, withdrawn, locked in use, and withdrawable balances for a user 
    * along with the value of withdrawable tokens in their paired currency.
    * 
    * @param token The address of the token to retrieve balances for.
    * @param user The address of the user to retrieve balances for.
    * @return deposited The total amount deposited by the user.
    * @return withdrawn The total amount withdrawn by the user.
    * @return lockedinuse The amount locked in use by the user.
    * @return withdrawable The amount available for withdrawal by the user.
    * @return withdrawableValue The value of the withdrawable amount in its paired currency.
    * @return paired The address of the paired currency.
    */
    function getUserTokenBalances(address token, address user) public view returns (uint256 deposited, uint256 withdrawn, uint256 lockedinuse, uint256 withdrawable, uint256 withdrawableValue, address paired) {
        userBalance memory user = userBalanceMap[token][user];
        deposited = user.deposited;
        withdrawn = user.withdrawn;
        lockedinuse = user.lockedinuse;
        withdrawable = user.deposited - user.withdrawn - user.lockedinuse;
        if (token != usdtAddress && token != usdcAddress) {
            (withdrawableValue, paired) = getUnderlyingValue(token, withdrawable);
        } else {
            (withdrawableValue, paired) = (withdrawable, address(0));
        }
        return (deposited, withdrawn, lockedinuse, withdrawable, withdrawableValue, paired);
    }

    /**
    * @dev Retrieves information about a loan position.
    * This function fetches information about a loan position including the value of collateral, loan amount, and time left for repayment.
    * 
    * @param loanId The ID of the loan to retrieve information for.
    * @return collateralValue The value of the collateral for the loan.
    * @return loanValue The total value of the loan including the principal and interest.
    * @return timeLeft The time left until the loan is due for repayment.
    */
    function getLoanPosition(uint256 loanId) external view returns (uint256 collateralValue, uint256 loanValue, uint256 timeLeft) {
        LoanRequest storage loan = loanRequests[loanId];
        collateralValue = (loan.collateralAmount * getTokenPrice(loan.token)) / 10**uint256(getTokenDecimals(loan.token));
        loanValue = loan.loanAmount + loan.interest;
        timeLeft = loan.dueDate > block.timestamp ? loan.dueDate - block.timestamp : 0;
        return (collateralValue, loanValue, timeLeft);
    }

    /**
    * @dev Retrieves the details of a loan by its ID and user address.
    * This function fetches the details of a loan based on its ID.
    * 
    * @param loanId The ID of the loan to retrieve information for.
    * @return requester The address of the requester of the loan.
    * @return giver The address of the giver of the loan.
    * @return token The address of the token involved in the loan.
    * @return collateralAmount The amount of collateral provided for the loan.
    * @return loanAmount The amount of the loan.
    * @return interest The interest on the loan.
    * @return dueDate The due date of the loan.
    * @return repaid A boolean indicating whether the loan has been repaid (true) or not (false).
    * @return collateralLocked A boolean indicating whether the collateral for the loan is locked (true) or not (false).
    */
    function getLoanData(uint256 loanId, address user) public view returns (address requester, address giver, address token, uint256 collateralAmount, uint256 loanAmount, uint256 interest, uint256 dueDate, bool repaid, bool collateralLocked) {
        LoanRequest memory loan = loanRequests[loanId];

        return (loan.requester, loan.giver, loan.token, loan.collateralAmount, loan.loanAmount, loan.interest, loan.dueDate, loan.repaid, loan.collateralLocked);
    }

    /**
    * @dev Retrieves a subset of loan IDs from a specified start index with a specified limit.
    * This internal function retrieves a subset of loan IDs starting from the specified index with the specified limit.
    * 
    * @param startIndex The start index of the subset.
    * @param limit The maximum number of loan IDs to retrieve.
    * @return An array of loan IDs within the specified subset.
    */
    function getSubsetLoans(uint256 startIndex, uint256 limit) internal view returns (uint256[] memory) {
        uint256 length = loanRequestCount;
        require(startIndex <= length, "Invalid start index");
        uint256 actualLimit = (length - startIndex < limit) ? length - startIndex : limit;
        uint256[] memory result = new uint256[](actualLimit);
        
        uint256 count = 0;
        for (uint256 i = startIndex; i < startIndex + actualLimit; i++) {
            result[count] = i + 1;
            count++;
        }
        assembly {
            mstore(result, count)
        }
        return result;
    }

    /**
    * @dev Retrieves loan IDs for loan requests made by a specific user.
    * This function retrieves loan IDs for loan requests made by a specified user within a given range.
    * 
    * @param user The address of the user to retrieve loan requests for.
    * @param startIndex The starting index of the loan IDs.
    * @param limit The maximum number of loan IDs to retrieve.
    * @return An array containing loan IDs for loan requests made by the specified user.
    */
    function getUserLoanRequests(address user, uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        uint256 length = loanRequestCount;
        require(startIndex <= length, "Invalid start index");
        uint256 actualLimit = (length - startIndex < limit) ? length - startIndex : limit;
        uint256[] memory result = new uint256[](actualLimit);
        
        uint256 count = 0;
        for (uint256 i = startIndex; i < startIndex + actualLimit; i++) {
            if (loanRequests[i + 1].requester == user) {
                result[count] = i + 1;
                count++;
            }
        }
        assembly {
            mstore(result, count)
        }
        return result;
    }

    /**
    * @dev Retrieves loan IDs for loans given by a specific user.
    * This function retrieves loan IDs for loans given by a specified user within a given range.
    * 
    * @param user The address of the user to retrieve loans given by.
    * @param startIndex The starting index of the loan IDs.
    * @param limit The maximum number of loan IDs to retrieve.
    * @return An array containing loan IDs for loans given by the specified user.
    */
    function getUserLoansGiven(address user, uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        uint256 length = loanRequestCount;
        require(startIndex <= length, "Invalid start index");
        uint256 actualLimit = (length - startIndex < limit) ? length - startIndex : limit;
        uint256[] memory result = new uint256[](actualLimit);
        
        uint256 count = 0;
        for (uint256 i = startIndex; i < startIndex + actualLimit; i++) {
            if (loanRequests[i + 1].giver == user) {
                result[count] = i + 1;
                count++;
            }
        }
        assembly {
            mstore(result, count)
        }
        return result;
    }

    /**
    * @dev Retrieves loan IDs for defaulted loans within a specified range.
    * This function retrieves loan IDs for defaulted loans within a given range based on the current block timestamp.
    * 
    * @param startIndex The starting index of the loan IDs.
    * @param limit The maximum number of loan IDs to retrieve.
    * @return An array containing loan IDs for defaulted loans.
    */
    function getLoansDefaulted(uint256 startIndex, uint256 limit) public view returns (uint256[] memory) {
        uint256 length = loanRequestCount;
        require(startIndex <= length, "Invalid start index");
        uint256 actualLimit = (length - startIndex < limit) ? length - startIndex : limit;
        uint256[] memory result = new uint256[](actualLimit);

        uint256 count = 0;
        for (uint256 i = startIndex; i < startIndex + actualLimit; i++) {
            if (!loanRequests[i + 1].repaid && loanRequests[i + 1].dueDate < block.timestamp) {
                result[count] = i + 1;
                count++;
            }
        }        
        assembly {
            mstore(result, count)
        }
        return result;
    }
    
    /**
    * @dev Retrieves all loans defaulted by user.
    * @param user The address of the user to retrieve loans defaulted by.
    * @return An array containing loan IDs for loans defaulted by the specified user.
    */
    function getUserLoansDefaulted(address user) public view returns (uint256[] memory) {
        uint256 length = loanRequestCount;
        uint256[] memory result = new uint256[](length);

        uint256 count = 0;
        for (uint256 i = 0; i < length; i++) {
            if (!loanRequests[i + 1].repaid && loanRequests[i + 1].dueDate < block.timestamp && loanRequests[i + 1].requester == user) {
                result[count] = i + 1;
                count++;
            }
        }
        assembly {
            mstore(result, count)
        }
        return result;
    }

    /**
    * @dev Retrieves the total protocol fees accrued across all tokens, considering paired currencies.
    * Users can query the total protocol fees accrued across all supported tokens, considering paired currencies.
    * 
    * @return The total protocol fees accrued across all tokens, considering paired currencies.
    */
    function getTotalProtocolFees() external view returns (uint256) {
        uint256 totalFees = 0;
        for (uint256 i = 0; i < depositedTokensLength; i++) {
            address token = userERC20s[address(this)][i];
            if (token != usdtAddress && token != usdcAddress) {
                // Get paired currency for the token
                (, address pairedCurrency) = getPairAddressZK(token);
                // Retrieve protocol fees for the paired currency
                totalFees += protocolCashierFees[pairedCurrency];
            } else {
                // Retrieve protocol fees for the token directly
                totalFees += protocolCashierFees[token];
            }
        }
        return totalFees;
    }

    /**
    * @dev Returns the loan IDs of loans given for a specific token.
    * @param token The address of the token.
    * @param start The starting index.
    * @param count The number of loan IDs to return.
    * @return An array of loan IDs.
    */
    function getLoansGiven(address token, uint256 start, uint256 count) external view returns (uint256[] memory) {
        uint256 length = loansGiven[token].length;
        uint256 end = start + count > length ? length : start + count;
        uint256[] memory loanIds = new uint256[](end - start);
        for (uint256 i = start; i < end; i++) {
            loanIds[i - start] = loansGiven[token][i];
        }
        return loanIds;
    }

    /**
    * @dev Returns the loan IDs of loans taken for a specific token.
    * @param token The address of the token.
    * @param start The starting index.
    * @param count The number of loan IDs to return.
    * @return An array of loan IDs.
    */
    function getLoansTaken(address token, uint256 start, uint256 count) external view returns (uint256[] memory) {
        uint256 length = loansTaken[token].length;
        uint256 end = start + count > length ? length : start + count;
        uint256[] memory loanIds = new uint256[](end - start);
        for (uint256 i = start; i < end; i++) {
            loanIds[i - start] = loansTaken[token][i];
        }
        return loanIds;
    }

    /**
    * @dev Returns the loan IDs of loans given by a specific lender.
    * @param lender The address of the lender.
    * @param start The starting index.
    * @param count The number of loan IDs to return.
    * @return An array of loan IDs.
    */
    function getMyLoansGiven(address lender, uint256 start, uint256 count) external view returns (uint256[] memory) {
        uint256 length = myLoansGiven[lender].length;
        uint256 end = start + count > length ? length : start + count;
        uint256[] memory loanIds = new uint256[](end - start);
        for (uint256 i = start; i < end; i++) {
            loanIds[i - start] = myLoansGiven[lender][i];
        }
        return loanIds;
    }

    /**
    * @dev Returns the loan IDs of loans taken by a specific borrower.
    * @param borrower The address of the borrower.
    * @param start The starting index.
    * @param count The number of loan IDs to return.
    * @return An array of loan IDs.
    */
    function getMyLoansTaken(address borrower, uint256 start, uint256 count) external view returns (uint256[] memory) {
        uint256 length = myLoansTaken[borrower].length;
        uint256 end = start + count > length ? length : start + count;
        uint256[] memory loanIds = new uint256[](end - start);
        for (uint256 i = start; i < end; i++) {
            loanIds[i - start] = myLoansTaken[borrower][i];
        }
        return loanIds;
    }

    /**
    * @dev Returns the total volume of loans given in a specific paired currency.
    * @param paired The address of the paired currency.
    * @return The total volume of loans given.
    */
    function getLoansGivenVolume(address paired) external view returns (uint256) {
        return loansGivenVolume[paired];
    }

    /**
    * @dev Returns the total volume of loans taken in a specific paired currency.
    * @param paired The address of the paired currency.
    * @return The total volume of loans taken.
    */
    function getLoansTakenVolume(address paired) external view returns (uint256) {
        return loansTakenVolume[paired];
    }


    // Receive function to accept Ether
    receive() external payable {
        emit received(msg.sender, msg.value);
    }

}
