// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./MockERC20.sol";

contract MockERC20Factory {
    event NewTokenDeployed(address indexed token, string name, string symbol, uint8 decimals);

    function deploy(string memory name, string memory symbol) external returns (address) {
        MockERC20 token = new MockERC20(name, symbol);
        token.mint(address, 1_000_000_000_000 * 10 ** 18);
        emit NewTokenDeployed(address(token), name, symbol, 18);
        return address(token);
    }
}
