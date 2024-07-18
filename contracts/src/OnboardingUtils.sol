// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin/contracts/token/ERC20/IERC20.sol";
import "openzeppelin/contracts/access/AccessControl.sol";
import "./MockERC20Factory.sol";

contract OnboardingUtils is AccessControl {
    /* ============ State Variables ============ */
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    MockERC20Factory public tokenFactory;
    uint256 public claimAmount = 10_000 * 10 ** 18;
    mapping(address => bool) public hasClaimedInitial;
    mapping(address => uint256) public referralCount;
    mapping(address => uint256) public lastClaimTime;
    mapping(address => address[]) public referrals;
    mapping(address => address) public referrerOf;

    /* ============ Events ============ */

    event TokensAirdropped(address indexed user, address indexed token, uint256 amount);
    event TokensClaimed(address indexed user, address indexed token, uint256 amount);
    event InitialTokensClaimed(address indexed user, uint256 amount);
    event InitialTokensClaimedWithReferral(
        address indexed user, address indexed referrer, uint256 amount, uint256 referralBonus
    );
    event ReferralReward(address indexed referrer, address indexed referee, uint256 amount);
    event MockERC20FactoryUpdated(address indexed oldFactory, address indexed newFactory);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    /* ============ Constructor ============ */
    constructor(MockERC20Factory _tokenFactory) {
        tokenFactory = _tokenFactory;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /* ============ External Functions ============ */
    function addAdmin(address admin) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, admin);
        emit AdminAdded(admin);
    }

    function removeAdmin(address admin) external onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, admin);
        emit AdminRemoved(admin);
    }

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
        require(!hasClaimedInitial[msg.sender], "OnboardingUtils: Already claimed initial tokens");

        MockERC20(token).mint(msg.sender, claimAmount);

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
        require(!hasClaimedInitial[msg.sender], "OnboardingUtils: Already claimed initial tokens");
        require(referredBy != msg.sender, "OnboardingUtils: Cannot refer yourself");

        // 10% bonus for referrals, tell your friends!
        uint256 referralBonus = claimAmount / 10;
        uint256 totalClaimAmount = claimAmount + referralBonus;

        MockERC20(token).mint(msg.sender, claimAmount);
        MockERC20(token).mint(referredBy, referralBonus);

        referrals[referredBy].push(msg.sender);
        referrerOf[msg.sender] = referredBy;
        referralCount[referredBy]++;

        hasClaimedInitial[msg.sender] = true;

        emit InitialTokensClaimedWithReferral(msg.sender, referredBy, claimAmount, referralBonus);
    }

    /**
     * @dev after initial claim, users can claim additional tokens weekly
     */
    function claimTokens(address token) external {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + 1 weeks, "OnboardingUtils: Claim only allowed once per week"
        );
        lastClaimTime[msg.sender] = block.timestamp;

        MockERC20(token).mint(msg.sender, claimAmount);

        emit TokensClaimed(msg.sender, token, claimAmount);
    }

    /**
     * @dev allow admins to manually distrubute tokens to users
     */
    function airdropTokens(address user, address token, uint256 amount) external onlyRole(ADMIN_ROLE) {
        MockERC20(token).mint(user, amount);

        emit TokensAirdropped(user, token, amount);
    }

    /* ============ Getters ============ */

    function hasUserClaimedInitial(address user) external view returns (bool) {
        return hasClaimedInitial[user];
    }

    function getReferralCount(address user) external view returns (uint256) {
        return referralCount[user];
    }

    function getReferralsBy(address user) external view returns (address[] memory) {
        return referrals[user];
    }

    function getReferrerOf(address user) external view returns (address) {
        return referrerOf[user];
    }
}
