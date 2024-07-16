// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MockERC20, MockERC20Factory} from "../src/MockERC20Factory.sol";

/**
 * @notice unit tests for MockERC20 implementation in MockERC20Factory
 */
contract MockERC20Test is Test {
    MockERC20 public token;
    address public admin = address(0x1);

    /**
     * @notice initialize, set token params + admin
     */
    function setUp() public {
        token = new MockERC20("MockToken", "MTK", 18, 1_000_000 * 10 ** 18, admin);
    }

    /**
     * @notice verify initial supply
     */
    function test_initialSupply() public {
        console2.log("Testing initial supply...");
        uint256 expectedSupply = 1_000_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Initial supply should be 1_000_000 MTK");
    }

    /**
     * @notice test minting functionality
     */
    function test_minting() public {
        console2.log("Testing minting...");
        token.grantRole(token.MINTER_ROLE(), admin);
        vm.prank(admin);
        token.mint(admin, 500_000 * 10 ** 18);
        uint256 expectedSupply = 1_500_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Total supply should be 1_500_000 MTK after minting");
    }

    /**
     * @notice test transfer
     */
    function test_transfer() public {
        console2.log("Testing transfer...");
        address to = address(0x2);
        vm.prank(admin);
        token.transfer(to, 100_000 * 10 ** 18);
        uint256 expectedBalance = 100_000 * 10 ** 18;
        uint256 actualBalance = token.balanceOf(to);
        assertEq(expectedBalance, actualBalance, "Balance should be 100_000 MTK after transfer");
    }
}

contract MockERC20FactoryTest is Test {
    MockERC20Factory public mockERC20Factory;
    address public admin = address(0x1);
    address public nonAdmin = address(0x2);

    function setUp() public {
        mockERC20Factory = new MockERC20Factory();
        vm.startPrank(admin);
        mockERC20Factory.addAdmin(admin);
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
}
