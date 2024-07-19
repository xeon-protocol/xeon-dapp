// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {MockERC20, MockERC20Factory} from "../src/MockERC20Factory.sol";
import {OnboardingUtils} from "../src/OnboardingUtils.sol";

/**
 * @dev tests for OnboardingUtils and MockERC20Factory contracts
 * @notice normal testnet workflow handles minting tokens through the OnboardingUtils contract
 */
contract OnboardingTest is Test {
    // forge test --match-contract OnboardingTest
    MockERC20Factory public mockERC20Factory;
    OnboardingUtils public onboardingUtils;
    MockERC20 public mockERC20;
    address public admin = address(0x1);
    address public nonAdmin = address(0x2);
    address public user1 = address(0x3);
    address public user2 = address(0x4);

    function setUp() public {
        // deploy MockERC20Factory contract
        mockERC20Factory = new MockERC20Factory();

        // set deployer as admin
        mockERC20Factory.grantRole(mockERC20Factory.DEFAULT_ADMIN_ROLE(), address(this));

        // initialize with token factory
        onboardingUtils = new OnboardingUtils(mockERC20Factory);

        // set admin address
        vm.startPrank(address(this));
        mockERC20Factory.addAdmin(admin);
        onboardingUtils.addAdmin(admin);
        vm.stopPrank();

        // deploy ERC20 token
        vm.startPrank(admin);
        address tokenAddress = mockERC20Factory.deploy("MockToken", "MTK", 18, 0); // Initial supply is 0
        mockERC20 = MockERC20(tokenAddress);

        // grant minter role to OnboardingUtils
        mockERC20.grantRole(mockERC20.MINTER_ROLE(), address(onboardingUtils));
        vm.stopPrank();
    }

    /**
     * @notice test creating token from factory
     */
    function test_createToken() public {
        console2.log("Testing create token...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);

        uint256 expectedSupply = 1_000_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Initial supply should be 1_000_000 TTK");
        console2.log("Token created at:", tokenAddress);
    }

    /**
     * @notice test minting more tokens after initial supply
     */
    function test_mintAdditionalTokens() public {
        console2.log("Testing mint additional tokens...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);
        // set admin
        token.grantRole(token.MINTER_ROLE(), admin);
        vm.prank(admin);
        token.mint(admin, 500_000 * 10 ** 18);
        // ensure updated supply matches
        uint256 expectedSupply = 1_500_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Total supply should be 1_500_000 TTK after minting additional tokens");
    }

    /**
     * @notice test setting admin
     */
    function test_setAdminRole() public {
        console2.log("Testing set admin role...");
        vm.prank(admin);
        mockERC20Factory.addAdmin(nonAdmin);

        bool hasAdminRole = mockERC20Factory.hasRole(mockERC20Factory.ADMIN_ROLE(), nonAdmin);
        assertTrue(hasAdminRole, "Non-admin should be granted admin role");
    }

    /**
     * @notice test that only admin can mint
     * @notice expect revert if non-admin tries to mint
     */
    function test_onlyAdminCanMint() public {
        console2.log("Testing only admin can mint...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);

        vm.prank(nonAdmin);
        vm.expectRevert("MockERC20: must have minter role to mint");
        token.mint(nonAdmin, 500_000 * 10 ** 18);
    }

    /**
     * @notice test that only admin can deploy token
     * @notice expect revert if non-admin tries to deploy
     */
    function test_nonAdminCannotCreateToken() public {
        console2.log("Testing non-admin cannot create token...");
        vm.prank(nonAdmin);
        vm.expectRevert("MockERC20Factory: must have admin role to deploy token");
        mockERC20Factory.deploy("FailToken", "FTK", 18, 1_000_000 * 10 ** 18);
    }

    /**
     * @notice test getting admin addresses
     */
    function test_getAdmins() public {
        console2.log("Testing get admins...");
        vm.prank(admin);
        mockERC20Factory.addAdmin(nonAdmin);

        address[] memory admins = mockERC20Factory.getAdmins();
        assertEq(admins.length, 2, "There should be 2 admins");
        assertEq(admins[0], admin, "First admin should be the original admin");
        assertEq(admins[1], nonAdmin, "Second admin should be the newly added admin");
    }

    /**
     * @notice test getting tokens
     */
    function test_getTokens() public {
        console2.log("Testing get tokens...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken1", "TTK1", 18, 1_000_000 * 10 ** 18);
        mockERC20Factory.deploy("TestToken2", "TTK2", 18, 2_000_000 * 10 ** 18);

        MockERC20Factory.TokenInfo[] memory tokens = mockERC20Factory.getDeployedTokens();
        assertEq(tokens.length, 2, "There should be 2 tokens");
        assertEq(tokens[0].tokenAddress, tokenAddress, "First token address should match");
        assertEq(tokens[0].name, "TestToken1", "First token name should be 'TestToken1'");
        assertEq(tokens[0].symbol, "TTK1", "First token symbol should be 'TTK1'");
        assertEq(tokens[0].decimals, 18, "First token decimals should be 18");
        assertEq(tokens[0].totalSupply, 1_000_000 * 10 ** 18, "First token total supply should be 1_000_000 TTK1");

        assertEq(tokens[1].name, "TestToken2", "Second token name should be 'TestToken2'");
        assertEq(tokens[1].symbol, "TTK2", "Second token symbol should be 'TTK2'");
        assertEq(tokens[1].totalSupply, 2_000_000 * 10 ** 18, "Second token total supply should be 2_000_000 TTK2");
    }

    /**
     * @notice test getting total supply for a token
     */
    function test_getTotalSupply() public {
        console2.log("Testing get total supply...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);

        uint256 totalSupply = mockERC20Factory.getTotalSupply(tokenAddress);
        assertEq(totalSupply, 1_000_000 * 10 ** 18, "Total supply should be 1_000_000 TTK");
    }

    /**
     * @notice test getting token holders
     */
    function test_getTokenHolders() public {
        console2.log("Testing get token holders...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);

        vm.prank(admin);
        token.transfer(nonAdmin, 500_000 * 10 ** 18);

        address[] memory holders = mockERC20Factory.getTokenHolders(tokenAddress);
        assertEq(holders.length, 2, "There should be 2 token holders");
        assertEq(holders[0], admin, "First holder should be the admin");
        assertEq(holders[1], nonAdmin, "Second holder should be the non-admin");
    }

    // OnboardingUtils Tests

    function test_claimInitialWithReferral() public {
        console2.log("Testing user claiming initial tokens with referral...");

        vm.startPrank(user1);
        onboardingUtils.claimInitialWithReferral(address(mockERC20), admin);
        uint256 expectedUserBalance = 110_000 * 10 ** 18; // 100,000 initial + 10,000 referral bonus
        uint256 actualUserBalance = mockERC20.balanceOf(user1);
        assertEq(
            expectedUserBalance,
            actualUserBalance,
            "User1 balance should be 110_000 MTK after initial claim with referral"
        );

        vm.stopPrank();

        vm.startPrank(admin);
        uint256 expectedAdminBalance = 10_000 * 10 ** 18; // 10,000 referral bonus
        uint256 actualAdminBalance = mockERC20.balanceOf(admin);
        assertEq(expectedAdminBalance, actualAdminBalance, "Admin balance should be 10_000 MTK as referral bonus");
        vm.stopPrank();
    }

    function test_claimInitial() public {
        console2.log("Testing user claiming initial tokens without referral...");
        vm.startPrank(user2);
        onboardingUtils.claimInitial(address(mockERC20));
        uint256 expectedBalance = 100_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 100_000 MTK after initial claim");
        vm.stopPrank();
    }

    function test_claimInitialAlreadyClaimed() public {
        console2.log("Testing user trying to claim initial tokens after already claiming...");
        vm.startPrank(user1);
        onboardingUtils.claimInitial(address(mockERC20));
        vm.expectRevert("OnboardingUtils: Already claimed initial tokens");
        onboardingUtils.claimInitial(address(mockERC20));
        vm.stopPrank();
    }

    function test_adminFunctions() public {
        console2.log("Testing admin functions...");
        vm.startPrank(admin);

        // Add new admin
        onboardingUtils.addAdmin(user1);
        bool isAdmin = onboardingUtils.hasRole(onboardingUtils.ADMIN_ROLE(), user1);
        assertTrue(isAdmin, "User1 should be an admin");

        // Remove admin
        onboardingUtils.removeAdmin(user1);
        isAdmin = onboardingUtils.hasRole(onboardingUtils.ADMIN_ROLE(), user1);
        assertFalse(isAdmin, "User1 should not be an admin");

        vm.stopPrank();
    }

    function test_getterMethods() public {
        console2.log("Testing getter methods...");
        vm.startPrank(admin);

        // Set up initial claims with referral
        onboardingUtils.claimInitialWithReferral(address(mockERC20), admin);

        // Test getReferrals
        address[] memory referrals = onboardingUtils.getReferralsBy(admin);
        assertEq(referrals.length, 1, "Admin should have 1 referral");
        assertEq(referrals[0], user1, "Admin's referral should be User1");

        // Test getReferrer
        address referrer = onboardingUtils.getReferrerOf(user1);
        assertEq(referrer, admin, "User1's referrer should be Admin");

        // Test hasUserClaimedInitial
        bool hasClaimed = onboardingUtils.hasUserClaimedInitial(user1);
        assertTrue(hasClaimed, "User1 should have claimed initial tokens");

        // Test getReferralCount
        uint256 referralCount = onboardingUtils.getReferralCount(admin);
        assertEq(referralCount, 1, "Admin should have 1 referral");

        vm.stopPrank();
    }

    function test_claimTokens() public {
        console2.log("Testing claiming tokens once per week...");

        // Try to claim tokens without performing initial claim
        vm.startPrank(user1);
        vm.expectRevert("OnboardingUtils: Must perform initial claim first");
        onboardingUtils.claimTokens(address(mockERC20));
        vm.stopPrank();

        // Perform initial claim
        vm.startPrank(user1);
        onboardingUtils.claimInitial(address(mockERC20));
        vm.stopPrank();

        vm.warp(block.timestamp + 1 weeks);

        // Claim tokens after initial claim
        vm.startPrank(user1);
        onboardingUtils.claimTokens(address(mockERC20));
        uint256 expectedBalance = 110_000 * 10 ** 18; // 100,000 initial + 10,000 weekly
        uint256 actualBalance = mockERC20.balanceOf(user1);
        assertEq(expectedBalance, actualBalance, "User1 balance should be 110_000 MTK after claiming tokens");
        vm.stopPrank();

        // Attempt to claim again immediately, expecting a revert
        vm.startPrank(user1);
        vm.expectRevert("OnboardingUtils: Claim only allowed once per week");
        onboardingUtils.claimTokens(address(mockERC20));
        vm.stopPrank();

        // Simulate the passage of one week
        vm.warp(block.timestamp + 1 weeks);

        // Claim tokens again after one week
        vm.startPrank(user1);
        onboardingUtils.claimTokens(address(mockERC20));
        uint256 newExpectedBalance = 120_000 * 10 ** 18; // 110,000 previous + 10,000 weekly
        uint256 newActualBalance = mockERC20.balanceOf(user1);
        assertEq(
            newExpectedBalance, newActualBalance, "User1 balance should be 120_000 MTK after claiming tokens again"
        );
        vm.stopPrank();
    }

    function test_airdropTokens() public {
        console2.log("Testing admin airdropping tokens...");
        uint256 amount = 20_000 * 10 ** 18;

        vm.startPrank(admin);
        onboardingUtils.airdropTokens(user2, address(mockERC20), amount);

        uint256 expectedBalance = 20_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 20_000 MTK after airdrop");
        vm.stopPrank();
    }

    function test_setTokenFactory() public {
        console2.log("Testing setting new MockERC20Factory address...");
        MockERC20Factory newFactory = new MockERC20Factory();

        vm.startPrank(admin);
        onboardingUtils.setTokenFactory(newFactory);
        assertEq(
            address(onboardingUtils.tokenFactory()), address(newFactory), "Token factory address should be updated"
        );
        vm.stopPrank();
    }
}
