// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin/contracts/token/ERC20/IERC20.sol";
import "openzeppelin/contracts/access/AccessControl.sol";
import "./MockERC20Factory.sol";

contract ClaimHelper is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    MockERC20Factory public tokenFactory;
    uint256 public claimAmount = 10_000 * 10 ** 18;
    mapping(address => bool) public hasClaimedInitial;
    mapping(address => uint256) public referralCount;
    mapping(address => mapping(address => uint256)) public internalBalances;
    mapping(address => uint256) public lastClaimTime;
    mapping(address => address[]) public referrals;
    mapping(address => address) public referrerOf;

    event TokensClaimed(address indexed user, address indexed token, uint256 amount);
    event InitialTokensClaimed(address indexed user, uint256 amount);
    event InitialTokensClaimedWithReferral(
        address indexed user, address indexed referrer, uint256 amount, uint256 referralBonus
    );
    event ReferralReward(address indexed referrer, address indexed referee, uint256 amount);
    event MockERC20FactoryUpdated(address indexed oldFactory, address indexed newFactory);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    constructor(MockERC20Factory _tokenFactory) {
        tokenFactory = _tokenFactory;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // add an admin
    function addAdmin(address admin) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, admin);
        emit AdminAdded(admin);
    }

    // remove an admin
    function removeAdmin(address admin) external onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, admin);
        emit AdminRemoved(admin);
    }

    // set the MockERC20Factory address
    function setTokenFactory(MockERC20Factory _tokenFactory) external onlyRole(ADMIN_ROLE) {
        address oldFactory = address(tokenFactory);
        tokenFactory = _tokenFactory;
        emit MockERC20FactoryUpdated(oldFactory, address(tokenFactory));
    }

    /**
     * @dev claim initial tokens for testnet onboarding, allowed once
     * @notice initial claim can only be performed once
     * @param token address of token to claim
     */
    function claimInitial(address token) external {
        require(!hasClaimedInitial[msg.sender], "ClaimHelper: Already claimed initial tokens");

        uint256 availableAmount = internalBalances[address(this)][token];
        require(availableAmount >= claimAmount, "ClaimHelper: No tokens available for initial claim");

        internalBalances[address(this)][token] -= claimAmount;
        internalBalances[msg.sender][token] += claimAmount;

        hasClaimedInitial[msg.sender] = true;

        emit InitialTokensClaimed(msg.sender, claimAmount);
    }

    /**
     * @dev claim initial tokens for testnet onboarding with referral
     * @notice initial claim can only be performed once
     * @notice referral bonus is +10% of claim amount to both accounts
     * @param token address of token to claim
     * @param referredBy address of account that referred the user
     */
    function claimInitialWithReferral(address token, address referredBy) external {
        // you can only claim once, nice try...
        require(!hasClaimedInitial[msg.sender], "ClaimHelper: Already claimed initial tokens");
        require(referredBy != msg.sender, "ClaimHelper: Cannot refer yourself");

        uint256 availableAmount = internalBalances[address(this)][token];
        // 10% bonus for referrals, tell your friends!
        uint256 referralBonus = claimAmount / 10; // 10% bonus
        uint256 totalClaimAmount = claimAmount + referralBonus;

        require(
            availableAmount >= totalClaimAmount + referralBonus, "ClaimHelper: No tokens available for initial claim"
        );

        internalBalances[address(this)][token] -= totalClaimAmount;
        internalBalances[msg.sender][token] += claimAmount;

        if (referredBy != address(0)) {
            internalBalances[address(this)][token] -= referralBonus;
            internalBalances[referredBy][token] += referralBonus;
            referrals[referredBy].push(msg.sender);
            referrerOf[msg.sender] = referredBy;
            referralCount[referredBy]++;
            emit ReferralReward(referredBy, msg.sender, referralBonus);
        }

        hasClaimedInitial[msg.sender] = true;

        emit InitialTokensClaimedWithReferral(msg.sender, referredBy, claimAmount, referralBonus);
    }

    // users claim tokens (generic)
    function claimTokens(address token) external {
        require(block.timestamp >= lastClaimTime[msg.sender] + 1 weeks, "ClaimHelper: Claim only allowed once per week");
        lastClaimTime[msg.sender] = block.timestamp;

        uint256 amount = claimAmount;
        if (internalBalances[address(this)][token] < amount) {
            MockERC20(token).mint(address(this), amount);
        }

        internalBalances[address(this)][token] -= amount;
        require(IERC20(token).transfer(msg.sender, amount), "ClaimHelper: Transfer failed");

        emit TokensClaimed(msg.sender, token, amount);
    }

    // admin function to deposit tokens to the contract
    function depositTokens(address token, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "ClaimHelper: Transfer failed");
        internalBalances[address(this)][token] += amount;
    }

    // admin function to manually airdrop tokens to a user
    function airdropTokens(address user, address token, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(internalBalances[address(this)][token] >= amount, "ClaimHelper: Insufficient balance");

        internalBalances[address(this)][token] -= amount;
        internalBalances[user][token] += amount;

        emit TokensClaimed(user, token, amount);
    }

    // get the balance of a specific token for a user
    function getTokenBalance(address user, address token) external view returns (uint256) {
        return internalBalances[user][token];
    }

    // check if a user has claimed their initial tokens
    function hasUserClaimedInitial(address user) external view returns (bool) {
        return hasClaimedInitial[user];
    }

    // get referral count for a user
    function getReferralCount(address user) external view returns (uint256) {
        return referralCount[user];
    }

    // get list of addresses an account has referred
    function getReferrals(address user) external view returns (address[] memory) {
        return referrals[user];
    }

    // get the address that referred an account
    function getReferrer(address user) external view returns (address) {
        return referrerOf[user];
    }
}
