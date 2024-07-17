// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MockERC20, MockERC20Factory} from "../src/MockERC20Factory.sol";
import {ClaimHelper} from "../src/ClaimHelper.sol";

/**
 * @dev tests for ClaimHelper and MockERC20Factory contracts
 * @notice normal testnet workflow handles minting tokens through the ClaimHelper contract
 */
contract OnboardingTest is Test {
    MockERC20Factory public mockERC20Factory;
    ClaimHelper public claimHelper;
    MockERC20 public mockERC20;
    address public admin = address(0x1);
    address public nonAdmin = address(0x2);
    address public user1 = address(0x3);
    address public user2 = address(0x4);

    function setUp() public {
        mockERC20Factory = new MockERC20Factory();
        claimHelper = new ClaimHelper(mockERC20Factory);

        // Add admin role to deployer
        vm.startPrank(admin);
        mockERC20Factory.addAdmin(admin);
        claimHelper.addAdmin(admin);
        vm.stopPrank();

        // Deploy mock ERC20 token
        vm.startPrank(admin);
        address tokenAddress = mockERC20Factory.deploy("MockToken", "MTK", 18, 0); // Initial supply is 0
        mockERC20 = MockERC20(tokenAddress);
        mockERC20Factory.grantMinterRole(tokenAddress, address(claimHelper)); // Grant MINTER_ROLE to ClaimHelper
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

        MockERC20Factory.TokenInfo[] memory tokens = mockERC20Factory.getTokens();
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

    // ClaimHelper Tests

    function test_claimInitialWithReferral() public {
        console2.log("Testing user claiming initial tokens with referral...");
        vm.startPrank(user1);
        claimHelper.claimInitialWithReferral(address(mockERC20), admin);
        uint256 expectedBalance = 10_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user1);
        assertEq(expectedBalance, actualBalance, "User1 balance should be 10_000 MTK after initial claim with referral");
        vm.stopPrank();

        vm.startPrank(admin);
        uint256 referralBonus = 10_000 * 10 ** 18 / 10; // 10% bonus
        uint256 adminBalance = mockERC20.balanceOf(admin);
        console2.log("Admin balance after referral bonus:", adminBalance);
        assertEq(referralBonus, adminBalance, "Admin balance should have 10% referral bonus");
        vm.stopPrank();
    }

    function test_claimInitial() public {
        console2.log("Testing user claiming initial tokens without referral...");
        vm.startPrank(user2);
        claimHelper.claimInitial(address(mockERC20));
        uint256 expectedBalance = 10_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 10_000 MTK after initial claim");
        vm.stopPrank();
    }

    function test_claimInitialAlreadyClaimed() public {
        console2.log("Testing user trying to claim initial tokens after already claiming...");
        vm.startPrank(user1);
        claimHelper.claimInitial(address(mockERC20));
        vm.expectRevert("ClaimHelper: Already claimed initial tokens");
        claimHelper.claimInitial(address(mockERC20));
        vm.stopPrank();
    }

    function test_adminFunctions() public {
        console2.log("Testing admin functions...");
        vm.startPrank(admin);

        // Add new admin
        claimHelper.addAdmin(user1);
        bool isAdmin = claimHelper.hasRole(claimHelper.ADMIN_ROLE(), user1);
        assertTrue(isAdmin, "User1 should be an admin");

        // Remove admin
        claimHelper.removeAdmin(user1);
        isAdmin = claimHelper.hasRole(claimHelper.ADMIN_ROLE(), user1);
        assertFalse(isAdmin, "User1 should not be an admin");

        vm.stopPrank();
    }

    function test_getterMethods() public {
        console2.log("Testing getter methods...");
        vm.startPrank(admin);

        // Set up initial claims with referral
        claimHelper.claimInitialWithReferral(address(mockERC20), admin);

        // Test getReferrals
        address[] memory referrals = claimHelper.getReferrals(admin);
        assertEq(referrals.length, 1, "Admin should have 1 referral");
        assertEq(referrals[0], user1, "Admin's referral should be User1");

        // Test getReferrer
        address referrer = claimHelper.getReferrer(user1);
        assertEq(referrer, admin, "User1's referrer should be Admin");

        // Test hasUserClaimedInitial
        bool hasClaimed = claimHelper.hasUserClaimedInitial(user1);
        assertTrue(hasClaimed, "User1 should have claimed initial tokens");

        // Test getReferralCount
        uint256 referralCount = claimHelper.getReferralCount(admin);
        assertEq(referralCount, 1, "Admin should have 1 referral");

        vm.stopPrank();
    }

    function test_claimTokens() public {
        console2.log("Testing claiming tokens once per week...");
        vm.startPrank(user1);
        claimHelper.claimTokens(address(mockERC20));
        uint256 expectedBalance = 10_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user1);
        assertEq(expectedBalance, actualBalance, "User1 balance should be 10_000 MTK after claiming tokens");

        vm.expectRevert("ClaimHelper: Claim only allowed once per week");
        claimHelper.claimTokens(address(mockERC20));
        vm.stopPrank();
    }

    function test_airdropTokens() public {
        console2.log("Testing admin airdropping tokens...");
        uint256 amount = 20_000 * 10 ** 18;

        vm.startPrank(admin);
        claimHelper.airdropTokens(user2, address(mockERC20), amount);

        uint256 expectedBalance = 20_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 20_000 MTK after airdrop");
        vm.stopPrank();
    }

    function test_setTokenFactory() public {
        console2.log("Testing setting new MockERC20Factory address...");
        MockERC20Factory newFactory = new MockERC20Factory();

        vm.startPrank(admin);
        claimHelper.setTokenFactory(newFactory);
        assertEq(address(claimHelper.tokenFactory()), address(newFactory), "Token factory address should be updated");
        vm.stopPrank();
    }
}
