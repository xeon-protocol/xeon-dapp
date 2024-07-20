// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC20, MockERC20Factory, MockWETH} from "../src/MockERC20Factory.sol";
import {OnboardingUtils} from "../src/OnboardingUtils.sol";

/**
 * @dev give OnboardingUtils MINTER_ROLE to all MockERC20 tokens
 * @notice this script is intended for testnet use only
 * @notice used if minting roles were not granted on deployment
 */
contract SetOnboardingAdminScript is Script {
    address public deployer = 0x56557c3266d11541c2D939BF6C05BFD29e881e55;
    address public onboardingUtilsAddress = 0xF527B037e30D8764E8e24B7Ed7a6158488C6a758;
    address public tokenFactoryAddress = 0xF46DFcf4eD6AF3b07f2e5a17A6261256A012da05;
    address public wethAddress = 0x395cB7753B02A15ed1C099DFc36bF00171F18218;

    address[] public admin = [
        0xFc09CA87a0E58C8d9e01bC3060CBEB60Ad434cd4,
        0x212dB369d8C032c3D319e2136eA85F34742Ea399,
        0x5Fb8EfD425C3eBB85C0773CE33820abC28d1b858
    ];

    address[] public tokenAddresses = [
        0xb7E16D46f26B1615Dcc501931F28F07fD4b0D7F4, // oVELA
        0x7dC9ecE25dcCA41D8a627cb47ded4a9322f7722b, // oPEPE
        0x9B9852A943a570685c3704d70C4F1ebD5EdE109B, // oDEGEN
        0x9855d38b7E6270B9f22F283A0C62330b16Ac909C, // oHIGHER
        0xEb2DCAFFFf1b0d5BA76F14Fe6bB8348126339FcB // oROR
    ];

    // base sepolia
    // simulate: forge script script/SetOnboardingAdmin.s.sol:SetOnboardingAdminScript --rpc-url $BASE_SEPOLIA_RPC_URL --chain-id 84532 -vvvv
    // broadcast: forge script script/SetOnboardingAdmin.s.sol:SetOnboardingAdminScript --rpc-url $BASE_SEPOLIA_RPC_URL --chain-id 84532 -vv --broadcast --verify

    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        console2.log("Granting MINTER_ROLE to OnboardingUtils for WETH...");
        grantMinterRole(wethAddress);

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            console2.log("Granting MINTER_ROLE to OnboardingUtils for token:", tokenAddresses[i]);
            grantMinterRole(tokenAddresses[i]);
        }

        vm.stopBroadcast();
    }

    function grantMinterRole(address tokenAddress) internal {
        MockERC20 token = MockERC20(tokenAddress);
        token.grantRole(token.MINTER_ROLE(), onboardingUtilsAddress);
    }
}
