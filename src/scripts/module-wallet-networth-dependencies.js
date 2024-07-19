import { CONSTANTS, getCurrentEthUsdcPriceFromUniswapV2, getTokenUSDValue, getTokenETHValue, fromBigIntNumberToDecimal, getTokenDecimals } from "./constants.js";
import { getWalletTokenList } from "./module-wallet-tokenlist-dependencies.js";
  
// Function to calculate the total USD value of all token balances
async function getCurrentBalancesValue(walletAddress) {
    const transactedTokensArray = await getWalletTokenList(walletAddress);
    let totalUSDValue = 0;
    for (const underlyingTokenAddr of transactedTokensArray) {
        const result = await hedgingInstance.getUserTokenBalances(underlyingTokenAddr, walletAddress);
        const deposited = ethers.BigNumber.from(result[0]);
        const withdrawn = ethers.BigNumber.from(result[1]);
        // Safe way to math BigInts coz of overflow issues
        const currentBalance = deposited.sub(withdrawn);
        // ETHUSD price        
        const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();
        // Get the USD value for the token balance
        // Convert from BigNumber to Number
        const pairedAddressDecimal = await getTokenDecimals(underlyingTokenAddr);
        const balance = fromBigIntNumberToDecimal(currentBalance, pairedAddressDecimal);
		const usdValue = await getTokenUSDValue(underlyingTokenAddr, balance);
        totalUSDValue += usdValue;
		console.log("underlying "+underlyingTokenAddr+", balance "+currentBalance+", usd "+usdValue+", total "+totalUSDValue+", ethusd "+ethUsdPrice+" -- from array: "+transactedTokensArray);
    }
    return totalUSDValue;
}

// Function to calculate staked tokens value
async function calculateStakedTokensValueETH(walletAddress) {
	const stakedBalanceRaw = await stakingInstance.getStakedBalance(walletAddress);
	const [stakedTokensValueETH, pairedSymbol] = await getTokenETHValue(CONSTANTS.wethAddress, stakedBalanceRaw);
  
	return stakedTokensValueETH;
}

// Function to calculate dividents due for claiming
async function calculateRewardsDue() {
    const rewardsDue = await stakingInstance.getRewardsDue();
    const rewardsDueETH = fromBigIntNumberToDecimal(rewardsDue, "ether");
    
    return rewardsDueETH;
}


// Function to calculate commission
async function calculateCommissionDueETH() {
	const liquidityRewardsDue = await stakingInstance.getLiquidityRewardsDue();
	const collateralRewardsDue = await stakingInstance.getCollateralRewardsDue();
	const liquidityRewardsDueETH = fromBigIntNumberToDecimal(liquidityRewardsDue, "ether");
	const collateralRewardsDueETH = fromBigIntNumberToDecimal(collateralRewardsDue, "ether");
	const commissionDueETH = (liquidityRewardsDueETH + collateralRewardsDueETH);
	return [commissionDueETH, liquidityRewardsDueETH, collateralRewardsDueETH];
}

// Export the fetch functions
export { getCurrentBalancesValue, calculateStakedTokensValueETH, calculateRewardsDue, calculateCommissionDueETH };