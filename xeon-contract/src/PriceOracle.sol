// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.6;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";

contract PriceOracle {
    // Fetch the time-weighted average price (TWAP) from the Uniswap V3 pool
    function getTWAP(address pool, uint32 interval) external view returns (uint256) {
        (int24 tick, ) = OracleLibrary.consult(pool, interval);
        return OracleLibrary.getQuoteAtTick(tick, 1 << 96, IUniswapV3Pool(pool).token0(), IUniswapV3Pool(pool).token1());
    }
}
