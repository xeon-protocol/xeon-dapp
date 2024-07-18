// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MockERC20, MockERC20Factory} from "../src/MockERC20Factory.sol";
import {OnboardingUtils} from "../src/OnboardingUtils.sol";

contract TokenFactoryScript is Script {
    address public deployer = 0x56557c3266d11541c2D939BF6C05BFD29e881e55;

    address[] public admin = [
        0xFc09CA87a0E58C8d9e01bC3060CBEB60Ad434cd4, // jon
        0x212dB369d8C032c3D319e2136eA85F34742Ea399, // welly
        0x5Fb8EfD425C3eBB85C0773CE33820abC28d1b858 // byte
    ];

    // base sepolia
    // simulate: forge script script/Onboarding.s.sol:TokenFactoryScript --rpc-url $BASE_SEPOLIA_RPC_URL --chain-id 84532 -vv
    // broadcast: forge script script/Onboarding.s.sol:TokenFactoryScript --rpc-url $BASE_SEPOLIA_RPC_URL --chain-id 84532 -vv --broadcast

    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy token factory
        console2.log("deploying MockERC20Factory contract...");
        MockERC20Factory tokenFactory = new MockERC20Factory();

        // deploy onboarding utils
        console2.log("deploying OnboardingUtils contract...");
        OnboardingUtils onboardingUtils = new OnboardingUtils(tokenFactory);

        // add admin accounts to token factory
        console2.log("adding admin accounts to token factory...");
        for (uint256 i = 0; i < admin.length; i++) {
            tokenFactory.addAdmin(admin[i]);
        }

        // add admin accounts to claim helper
        console2.log("adding admin accounts to claim helper...");
        for (uint256 i = 0; i < admin.length; i++) {
            onboardingUtils.addAdmin(admin[i]);
        }

        // deploy tokens, mint to deployer address
        string[] memory tokenNames = new string[](6);
        string[] memory tokenSymbols = new string[](6);
        tokenNames[0] = "TestROR";
        tokenSymbols[0] = "tROR";
        tokenNames[1] = "TestDegen";
        tokenSymbols[1] = "tDEGEN";
        tokenNames[2] = "TestPepe";
        tokenSymbols[2] = "tPEPE";
        tokenNames[3] = "JonToken";
        tokenSymbols[3] = "tJON";
        tokenNames[4] = "WellyToken";
        tokenSymbols[4] = "tWELLY";
        tokenNames[5] = "ByteToken";
        tokenSymbols[5] = "tBYTE";

        for (uint256 i = 0; i < tokenNames.length; i++) {
            console2.log(string(abi.encodePacked("deploying token: ", tokenNames[i], " (", tokenSymbols[i], ")")));
            address tokenAddress = tokenFactory.deploy(tokenNames[i], tokenSymbols[i], 18, 0);
            console2.log(string(abi.encodePacked("token deployed at: ", address(tokenAddress))));
            MockERC20 token = MockERC20(tokenAddress);
            token.grantRole(token.MINTER_ROLE(), address(onboardingUtils));
            token.mint(address(deployer), 1_000_000 * 10 ** 18);
        }

        vm.stopBroadcast();
    }
}
