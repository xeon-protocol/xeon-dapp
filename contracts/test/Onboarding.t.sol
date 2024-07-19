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
        console2.log("Setting up the environment...");

        // deploy MockERC20Factory contract
        mockERC20Factory = new MockERC20Factory();
        console2.log("Deployed MockERC20Factory contract");

        // set deployer as admin
        mockERC20Factory.grantRole(mockERC20Factory.DEFAULT_ADMIN_ROLE(), address(this));
        console2.log("Granted DEFAULT_ADMIN_ROLE to deployer");

        // initialize with token factory
        onboardingUtils = new OnboardingUtils(mockERC20Factory);
        console2.log("Initialized OnboardingUtils with MockERC20Factory");

        // set admin address
        vm.startPrank(address(this));
        mockERC20Factory.addAdmin(admin);
        onboardingUtils.addAdmin(admin);
        console2.log("Added admin address:", admin);

        // grant DEFAULT_ADMIN_ROLE to admin
        mockERC20Factory.grantRole(mockERC20Factory.DEFAULT_ADMIN_ROLE(), admin);
        onboardingUtils.grantRole(onboardingUtils.ADMIN_ROLE(), admin); // Grant ADMIN_ROLE in OnboardingUtils
        console2.log("Granted DEFAULT_ADMIN_ROLE and ADMIN_ROLE to admin");

        vm.stopPrank();

        // deploy ERC20 token
        vm.startPrank(admin);
        address tokenAddress = mockERC20Factory.deploy("MockToken", "MTK", 18, 0); // Initial supply is 0
        mockERC20 = MockERC20(tokenAddress);
        console2.log("Deployed MockERC20 token at:", tokenAddress);

        // grant minter role to OnboardingUtils
        mockERC20.grantRole(mockERC20.MINTER_ROLE(), address(onboardingUtils));
        console2.log("Granted MINTER_ROLE to OnboardingUtils");
        vm.stopPrank();
    }

    /**
     * @notice test creating token from factory
     */
    function test_createToken() public {
        console2.log("Testing create token...");
        vm.startPrank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);

        console2.log("Token created at:", tokenAddress);
        uint256 expectedSupply = 1_000_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        console2.log("Expected Supply:", expectedSupply);
        console2.log("Actual Supply:", actualSupply);
        assertEq(expectedSupply, actualSupply, "Initial supply should be 1_000_000 TTK");
        vm.stopPrank();
    }

    /**
     * @notice test minting more tokens after initial supply
     */
    function test_mintAdditionalTokens() public {
        uint256 mintAmount = 500_000 * 10 ** 18;
        console2.log("Testing mint additional tokens...");

        // Deploy Token Contract
        vm.startPrank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);
        console2.log("Token deployed at:", tokenAddress);

        // Set Admin Role
        token.grantRole(token.MINTER_ROLE(), admin);
        console2.log("Granted MINTER_ROLE to admin");

        // Mint Additional Tokens
        token.mint(admin, mintAmount);
        console2.log("Minted additional tokens:", mintAmount);
        vm.stopPrank();

        // Ensure Updated Supply Matches
        uint256 expectedSupply = 1_500_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        console2.log("Expected Supply:", expectedSupply);
        console2.log("Actual Supply:", actualSupply);
        assertEq(expectedSupply, actualSupply, "Total supply should be 1_500_000 TTK after minting additional tokens");
    }

    /**
     * @notice test setting admin
     */
    function test_setAdminRole() public {
        console2.log("Testing set admin role...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);
        mockERC20Factory.addAdmin(nonAdmin);
        console2.log("Added nonAdmin address as admin:", nonAdmin);

        bool hasAdminRole = mockERC20Factory.hasRole(mockERC20Factory.ADMIN_ROLE(), nonAdmin);
        console2.log("nonAdmin has admin role:", hasAdminRole);
        assertTrue(hasAdminRole, "Non-admin should be granted admin role");
        vm.stopPrank();
    }

    /**
     * @notice test that only admin can mint
     * @notice expect revert if non-admin tries to mint
     */
    function test_onlyAdminCanMint() public {
        console2.log("Testing only admin can mint...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);
        console2.log("Token deployed at:", tokenAddress);
        vm.stopPrank();

        vm.startPrank(nonAdmin);
        console2.log("Current account:", nonAdmin);
        vm.expectRevert("MockERC20: must have minter role to mint");
        token.mint(nonAdmin, 500_000 * 10 ** 18);
        vm.stopPrank();
    }

    /**
     * @notice test that only admin can deploy token
     * @notice expect revert if non-admin tries to deploy
     */
    function test_nonAdminCannotCreateToken() public {
        console2.log("Testing non-admin cannot create token...");
        vm.startPrank(nonAdmin);
        console2.log("Current account:", nonAdmin);
        vm.expectRevert("MockERC20Factory: must have admin role to deploy token");
        mockERC20Factory.deploy("FailToken", "FTK", 18, 1_000_000 * 10 ** 18);
        vm.stopPrank();
    }

    /**
     * @notice test getting admin addresses
     */
    function test_getAdmins() public {
        console2.log("Testing get admins...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);
        mockERC20Factory.addAdmin(nonAdmin);
        console2.log("Added nonAdmin as admin:", nonAdmin);

        address[] memory admins = mockERC20Factory.getAdmins();
        console2.log("Number of admins:", admins.length);
        assertEq(admins.length, 3, "There should be 3 admins");
        console2.log("First admin:", admins[0]);
        assertEq(admins[0], address(this), "First admin should be the deployer");
        console2.log("Second admin:", admins[1]);
        assertEq(admins[1], admin, "Second admin should be the original admin");
        console2.log("Third admin:", admins[2]);
        assertEq(admins[2], nonAdmin, "Third admin should be the newly added admin");
        vm.stopPrank();
    }

    /**
     * @notice test getting tokens
     */
    function test_getTokens() public {
        console2.log("Testing get tokens...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);

        // Deploy one additional token
        address tokenAddress1 = mockERC20Factory.deploy("TestToken1", "TTK1", 18, 1_000_000 * 10 ** 18);
        console2.log("Token1 deployed at:", tokenAddress1);

        // Get all deployed tokens
        MockERC20Factory.TokenInfo[] memory tokens = mockERC20Factory.getDeployedTokens();
        console2.log("Number of tokens:", tokens.length);
        assertEq(tokens.length, 2, "There should be 2 tokens");

        // List the token addresses and info, including the address from setup
        console2.log("Setup token address:", address(mockERC20));
        console2.log("Token 1 address:", tokens[0].tokenAddress);
        console2.log("Token 1 name:", tokens[0].name);
        console2.log("Token 1 symbol:", tokens[0].symbol);
        console2.log("Token 1 decimals:", tokens[0].decimals);
        console2.log("Token 1 total supply:", tokens[0].totalSupply);

        console2.log("Token 2 address:", tokens[1].tokenAddress);
        console2.log("Token 2 name:", tokens[1].name);
        console2.log("Token 2 symbol:", tokens[1].symbol);
        console2.log("Token 2 decimals:", tokens[1].decimals);
        console2.log("Token 2 total supply:", tokens[1].totalSupply);

        // Assertions for the setup token
        assertEq(tokens[0].tokenAddress, address(mockERC20), "First token address should match the setup token");
        assertEq(tokens[0].name, "MockToken", "First token name should be 'MockToken'");
        assertEq(tokens[0].symbol, "MTK", "First token symbol should be 'MTK'");
        assertEq(tokens[0].decimals, 18, "First token decimals should be 18");
        assertEq(tokens[0].totalSupply, 0, "First token total supply should be 0");

        // Assertions for the newly deployed token
        assertEq(tokens[1].tokenAddress, tokenAddress1, "Second token address should match");
        assertEq(tokens[1].name, "TestToken1", "Second token name should be 'TestToken1'");
        assertEq(tokens[1].symbol, "TTK1", "Second token symbol should be 'TTK1'");
        assertEq(tokens[1].decimals, 18, "Second token decimals should be 18");
        assertEq(tokens[1].totalSupply, 1_000_000 * 10 ** 18, "Second token total supply should be 1_000_000 TTK1");

        vm.stopPrank();
    }

    /**
     * @notice test getting total supply for a token
     */
    function test_getTotalSupply() public {
        console2.log("Testing get total supply...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);

        // Get total supply for the token deployed during setup
        uint256 totalSupply = mockERC20Factory.getTotalSupply(address(mockERC20));
        console2.log("Total supply of setup token:", totalSupply);

        assertEq(totalSupply, 0, "Total supply should be 0 for the setup token");
        vm.stopPrank();
    }

    /**
     * @notice test getting token holders
     */
    function test_getTokenHolders() public {
        console2.log("Testing get token holders...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);
        console2.log("Token deployed at:", tokenAddress);

        uint256 transferAmount = 500_000 * 10 ** 18;
        token.transfer(nonAdmin, transferAmount);
        console2.log("Transferred tokens to nonAdmin", transferAmount);

        address[] memory holders = mockERC20Factory.getTokenHolders(tokenAddress);
        console2.log("Number of token holders:", holders.length);
        assertEq(holders.length, 2, "There should be 2 token holders");
        console2.log("First holder:", holders[0]);
        assertEq(holders[0], admin, "First holder should be the admin");
        console2.log("Second holder:", holders[1]);
        assertEq(holders[1], nonAdmin, "Second holder should be the non-admin");
        vm.stopPrank();
    }

    // OnboardingUtils Tests

    function test_claimInitialWithReferral() public {
        console2.log("Testing user claiming initial tokens with referral...");

        vm.startPrank(user1);
        console2.log("Current account:", user1);
        onboardingUtils.claimInitialWithReferral(address(mockERC20), admin);
        uint256 expectedUserBalance = 110_000 * 10 ** 18; // 100,000 initial + 10,000 referral bonus
        uint256 actualUserBalance = mockERC20.balanceOf(user1);
        console2.log("Expected user balance:", expectedUserBalance);
        console2.log("Actual user balance:", actualUserBalance);
        assertEq(
            expectedUserBalance,
            actualUserBalance,
            "User1 balance should be 110_000 MTK after initial claim with referral"
        );
        vm.stopPrank();

        vm.startPrank(admin);
        console2.log("Current account:", admin);
        uint256 expectedAdminBalance = 10_000 * 10 ** 18; // 10,000 referral bonus
        uint256 actualAdminBalance = mockERC20.balanceOf(admin);
        console2.log("Expected admin balance:", expectedAdminBalance);
        console2.log("Actual admin balance:", actualAdminBalance);
        assertEq(expectedAdminBalance, actualAdminBalance, "Admin balance should be 10_000 MTK as referral bonus");
        vm.stopPrank();
    }

    function test_claimInitial() public {
        console2.log("Testing user claiming initial tokens without referral...");
        vm.startPrank(user2);
        console2.log("Current account:", user2);
        onboardingUtils.claimInitial(address(mockERC20));
        uint256 expectedBalance = 100_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        console2.log("Expected balance:", expectedBalance);
        console2.log("Actual balance:", actualBalance);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 100_000 MTK after initial claim");
        vm.stopPrank();
    }

    function test_claimInitialAlreadyClaimed() public {
        console2.log("Testing user trying to claim initial tokens after already claiming...");
        vm.startPrank(user1);
        console2.log("Current account:", user1);
        onboardingUtils.claimInitial(address(mockERC20));
        vm.expectRevert("OnboardingUtils: Already claimed initial tokens");
        onboardingUtils.claimInitial(address(mockERC20));
        vm.stopPrank();
    }

    function test_adminFunctions() public {
        console2.log("Testing admin functions...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);

        // Add new admin
        onboardingUtils.addAdmin(user1);
        bool isAdmin = onboardingUtils.hasRole(onboardingUtils.ADMIN_ROLE(), user1);
        console2.log("User1 is admin:", isAdmin);
        assertTrue(isAdmin, "User1 should be an admin");

        // Remove admin
        onboardingUtils.removeAdmin(user1);
        isAdmin = onboardingUtils.hasRole(onboardingUtils.ADMIN_ROLE(), user1);
        console2.log("User1 is admin after removal:", isAdmin);
        assertFalse(isAdmin, "User1 should not be an admin");
        vm.stopPrank();
    }

    function test_getterMethods() public {
        console2.log("Testing getter methods...");
        vm.startPrank(admin);
        console2.log("Current account:", admin);

        // Set up initial claims with referral
        onboardingUtils.claimInitialWithReferral(address(mockERC20), admin);

        // Test getReferrals
        address[] memory referrals = onboardingUtils.getReferralsBy(admin);
        console2.log("Number of referrals by admin:", referrals.length);
        assertEq(referrals.length, 1, "Admin should have 1 referral");
        console2.log("Admin's referral:", referrals[0]);
        assertEq(referrals[0], user1, "Admin's referral should be User1");

        // Test getReferrer
        address referrer = onboardingUtils.getReferrerOf(user1);
        console2.log("User1's referrer:", referrer);
        assertEq(referrer, admin, "User1's referrer should be Admin");

        // Test hasUserClaimedInitial
        bool hasClaimed = onboardingUtils.hasUserClaimedInitial(user1);
        console2.log("User1 has claimed initial tokens:", hasClaimed);
        assertTrue(hasClaimed, "User1 should have claimed initial tokens");

        // Test getReferralCount
        uint256 referralCount = onboardingUtils.getReferralCount(admin);
        console2.log("Admin's referral count:", referralCount);
        assertEq(referralCount, 1, "Admin should have 1 referral");
        vm.stopPrank();
    }

    function test_claimTokens() public {
        console2.log("Testing claiming tokens once per week...");

        // Try to claim tokens without performing initial claim
        vm.startPrank(user1);
        console2.log("Current account:", user1);
        vm.expectRevert("OnboardingUtils: Must perform initial claim first");
        onboardingUtils.claimTokens(address(mockERC20));
        vm.stopPrank();

        // Perform initial claim
        vm.startPrank(user1);
        console2.log("Performing initial claim for user1");
        onboardingUtils.claimInitial(address(mockERC20));
        vm.stopPrank();

        vm.warp(block.timestamp + 1 weeks);

        // Claim tokens after initial claim
        vm.startPrank(user1);
        console2.log("Claiming tokens after initial claim for user1");
        onboardingUtils.claimTokens(address(mockERC20));
        uint256 expectedBalance = 110_000 * 10 ** 18; // 100,000 initial + 10,000 weekly
        uint256 actualBalance = mockERC20.balanceOf(user1);
        console2.log("Expected balance:", expectedBalance);
        console2.log("Actual balance:", actualBalance);
        assertEq(expectedBalance, actualBalance, "User1 balance should be 110_000 MTK after claiming tokens");
        vm.stopPrank();

        // Attempt to claim again immediately, expecting a revert
        vm.startPrank(user1);
        console2.log("Attempting to claim again immediately, expecting a revert");
        vm.expectRevert("OnboardingUtils: Claim only allowed once per week");
        onboardingUtils.claimTokens(address(mockERC20));
        vm.stopPrank();

        // Simulate the passage of one week
        vm.warp(block.timestamp + 1 weeks);

        // Claim tokens again after one week
        vm.startPrank(user1);
        console2.log("Claiming tokens again after one week for user1");
        onboardingUtils.claimTokens(address(mockERC20));
        uint256 newExpectedBalance = 120_000 * 10 ** 18; // 110,000 previous + 10,000 weekly
        uint256 newActualBalance = mockERC20.balanceOf(user1);
        console2.log("New expected balance:", newExpectedBalance);
        console2.log("New actual balance:", newActualBalance);
        assertEq(
            newExpectedBalance, newActualBalance, "User1 balance should be 120_000 MTK after claiming tokens again"
        );
        vm.stopPrank();
    }

    function test_airdropTokens() public {
        console2.log("Testing admin airdropping tokens...");
        uint256 amount = 20_000 * 10 ** 18;

        vm.startPrank(admin);
        console2.log("Current account:", admin);
        onboardingUtils.airdropTokens(user2, address(mockERC20), amount);

        uint256 expectedBalance = amount;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        console2.log("Expected balance after airdrop:", expectedBalance);
        console2.log("Actual balance after airdrop:", actualBalance);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 20_000 MTK after airdrop");
        vm.stopPrank();
    }

    function test_setTokenFactory() public {
        console2.log("Testing setting new MockERC20Factory address...");
        MockERC20Factory newFactory = new MockERC20Factory();

        vm.startPrank(admin);
        console2.log("Current account:", admin);
        onboardingUtils.setTokenFactory(newFactory);
        console2.log("Token factory address updated to:", address(newFactory));
        assertEq(
            address(onboardingUtils.tokenFactory()), address(newFactory), "Token factory address should be updated"
        );
        vm.stopPrank();
    }
}
