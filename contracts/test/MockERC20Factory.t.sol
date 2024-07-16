// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MockERC20, MockERC20Factory} from "../src/MockERC20Factory.sol";
//import {ClaimHelper} from "../src/ClaimHelper.sol";

contract MockERC20Test is Test {
    MockERC20 public token;
    address public admin = address(0x1);

    function setUp() public {
        token = new MockERC20("MockToken", "MTK", 18, 1_000_000 * 10 ** 18, admin);
    }

    function test_initialSupply() public {
        console2.log("Testing initial supply...");
        uint256 expectedSupply = 1_000_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Initial supply should be 1_000_000 MTK");
    }

    function test_minting() public {
        console2.log("Testing minting...");
        token.grantRole(token.MINTER_ROLE(), admin);
        vm.prank(admin);
        token.mint(admin, 500_000 * 10 ** 18);
        uint256 expectedSupply = 1_500_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Total supply should be 1_500_000 MTK after minting");
    }

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

    function test_mintAdditionalTokens() public {
        console2.log("Testing mint additional tokens...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);

        token.grantRole(token.MINTER_ROLE(), admin);
        vm.prank(admin);
        token.mint(admin, 500_000 * 10 ** 18);

        uint256 expectedSupply = 1_500_000 * 10 ** 18;
        uint256 actualSupply = token.totalSupply();
        assertEq(expectedSupply, actualSupply, "Total supply should be 1_500_000 TTK after minting additional tokens");
    }

    function test_setAdminRole() public {
        console2.log("Testing set admin role...");
        vm.prank(admin);
        mockERC20Factory.addAdmin(nonAdmin);

        bool hasAdminRole = mockERC20Factory.hasRole(mockERC20Factory.ADMIN_ROLE(), nonAdmin);
        assertTrue(hasAdminRole, "Non-admin should be granted admin role");
    }

    function test_onlyAdminCanMint() public {
        console2.log("Testing only admin can mint...");
        vm.prank(admin);
        address tokenAddress = mockERC20Factory.deploy("TestToken", "TTK", 18, 1_000_000 * 10 ** 18);
        MockERC20 token = MockERC20(tokenAddress);

        vm.prank(nonAdmin);
        vm.expectRevert("MockERC20: must have minter role to mint");
        token.mint(nonAdmin, 500_000 * 10 ** 18);
    }

    function test_nonAdminCannotCreateToken() public {
        console2.log("Testing non-admin cannot create token...");
        vm.prank(nonAdmin);
        vm.expectRevert("MockERC20Factory: must have admin role to deploy token");
        mockERC20Factory.deploy("FailToken", "FTK", 18, 1_000_000 * 10 ** 18);
    }
}
