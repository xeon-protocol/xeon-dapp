
import { CONSTANTS, fromBigIntNumberToDecimal, getCurrentEthUsdcPriceFromUniswapV2 } from './constants.js';
//*======================================================*/
// Functions to update the sections with the new values
//*======================================================*/

// 1. Update Section Values - Traffic Panel
//----------------------------------------------------
async function updateSectionValues_Traffic(activeWallets, activeERC20S, activeTrades, totalDEXvolumeUSD, totalOTCvolumeUSD, totalCashierVolumeUSD, totalDepositWeth, totalDepositUSDT, totalDepositUSDC, totalDepositERC20, totalWithdrawalWeth, totalWithdrawalUSDT, totalWithdrawalUSDC, totalWithdrawalERC20, totalOTCvolume, otcVolumeWETHDecimal, otcVolumeUSDTDecimal, otcVolumeUSDCDecimal) {
    
  // Format Amounts
  const formatAmount = (amount) => {
      return amount.toFixed(2);
  };

  // Format values
  const formatValue = (value) => {
      return `$${value.toFixed(2)}`;
  };

  // Fetch current ETH price in USD
  const ethUsdcPrice = getCurrentEthUsdcPriceFromUniswapV2();

  // Update active wallets value
  document.getElementById("activeWalletsValue").textContent = activeWallets.toString();

  // Update active ERC20s value
  document.getElementById("activeTokensValue").textContent = activeERC20S.toString();

  // Update transaction volume value
  document.getElementById("tradesCountValue").textContent = activeTrades.toString();

  // Update cashier & hedges volume value
  document.getElementById("cashierVolumeValue").textContent = formatValue(totalCashierVolumeUSD);
  document.getElementById("otcVolumeValue").textContent = formatValue(totalOTCvolumeUSD);
  document.getElementById("dexVolumeValue").textContent = formatValue(totalDEXvolumeUSD);

  // Update total deposits
  const totalDepositWethUSD = totalDepositWeth * ethUsdcPrice;
  const totalDeposits = totalDepositWethUSD + totalDepositUSDT + totalDepositUSDC + totalDepositERC20;
  document.getElementById("totalDepositsValue").textContent = formatValue(totalDeposits);

  // Update individual deposit amounts
  document.getElementById("deposits_wethAmnt").textContent = formatAmount(totalDepositWeth);
  document.getElementById("deposits_wethValue").textContent = formatValue(totalDepositWethUSD);

  document.getElementById("deposits_usdcAmnt").textContent = formatAmount(totalDepositUSDC);
  document.getElementById("deposits_usdcValue").textContent = formatValue(totalDepositUSDC);

  document.getElementById("deposits_usdtAmnt").textContent = formatAmount(totalDepositUSDT);
  document.getElementById("deposits_usdtValue").textContent = formatValue(totalDepositUSDT);

  document.getElementById("deposits_erc20Amnt").textContent = formatAmount(totalDepositERC20);
  document.getElementById("deposits_erc20Value").textContent = formatValue(totalDepositERC20);

  // Update total withdrawals
  const totalWithdrawalWethUSD = totalWithdrawalWeth * ethUsdcPrice;
  const totalWithdrawals = totalWithdrawalWethUSD + totalWithdrawalUSDT + totalWithdrawalUSDC + totalWithdrawalERC20;
  document.getElementById("totalWithdrawalsValue").textContent = formatValue(totalWithdrawals);

  // Update individual withdrawal amounts
  document.getElementById("withdrawals_wethAmnt").textContent = formatAmount(totalWithdrawalWeth);
  document.getElementById("withdrawals_wethValue").textContent = formatValue(totalWithdrawalWethUSD);

  document.getElementById("withdrawals_usdcAmnt").textContent = formatAmount(totalWithdrawalUSDC);
  document.getElementById("withdrawals_usdcValue").textContent = formatValue(totalWithdrawalUSDC);

  document.getElementById("withdrawals_usdtAmnt").textContent = formatAmount(totalWithdrawalUSDT);
  document.getElementById("withdrawals_usdtValue").textContent = formatValue(totalWithdrawalUSDT);

  document.getElementById("withdrawals_erc20Amnt").textContent = formatAmount(totalWithdrawalERC20);
  document.getElementById("withdrawals_erc20Value").textContent = formatValue(totalWithdrawalERC20);

  // Update OTC volume
  const otcVolumeWETHUSD = otcVolumeWETHDecimal * ethUsdcPrice;
  document.getElementById("totalOTCVolume").textContent = formatValue(totalOTCvolumeUSD);
  document.getElementById("otcVol_wethAmnt").textContent = formatAmount(otcVolumeWETHDecimal);
  document.getElementById("otcVol_wethValue").textContent = formatValue(otcVolumeWETHUSD);
  document.getElementById("otcVol_usdtAmnt").textContent = formatAmount(otcVolumeUSDTDecimal);
  document.getElementById("otcVol_usdtValue").textContent = formatValue(otcVolumeUSDTDecimal);
  document.getElementById("otcVol_usdcAmnt").textContent = formatAmount(otcVolumeUSDCDecimal);
  document.getElementById("otcVol_usdcValue").textContent = formatValue(otcVolumeUSDCDecimal);

}

// 2. Update Section Values - Hedges Panel
//----------------------------------------------------
function updateSectionValues_hedges(activeTokensCount, totalTakenCount, swapsTakenCount, hedgesTakenCount, hedgesTraded, hedgesCreated, swapsVolume, optionsVolume, settledVolume, hedgeCostsTotal, hedgeProfits, hedgeFees) {
  // Format values
  const formatValue = (value) => {
    return `$${value.toFixed(2)}`;
  };

  // Volume
  document.getElementById("hedgeVolumeValue").textContent = formatValue(hedgesTraded);
  document.getElementById("buyVolumeValue").textContent = formatValue(hedgeCostsTotal);
  document.getElementById("settleVolumeValue").textContent = formatValue(settledVolume);
  document.getElementById("feeVolumeValue").textContent = formatValue(hedgeFees);

  // Counters
  document.getElementById("activeTokensCount").textContent = activeTokensCount;
  document.getElementById("tradedHedgesCount").textContent = totalTakenCount;
  document.getElementById("optionsCountValue").textContent = hedgesTakenCount;
  document.getElementById("swapsCountValue").textContent = swapsTakenCount;

  // Update hedges traded and created
  document.getElementById("hedgesTraded").textContent = formatValue(hedgesTraded);
  document.getElementById("hedgesCreated").textContent = formatValue(hedgesCreated);

  // Update swaps volume and options volume
  document.getElementById("swapsVolume").textContent = formatValue(swapsVolume);
  document.getElementById("optionsVolume").textContent = formatValue(optionsVolume);

  // Update hedge costs total
  document.getElementById("hedgeCostsTotal").textContent = formatValue(hedgeCostsTotal);
  document.getElementById("hedgeValueTotal").textContent = formatValue(hedgesTraded);

  // Update hedge profits and losses
  document.getElementById("hedgeProfits").textContent = formatValue(hedgeProfits);
  document.getElementById("hedgeFees").textContent = formatValue(hedgeFees);
}

// 3. Update Section Values - Earnings Panel
//----------------------------------------------------
function updateSectionValues_Earnings(
  totalRevenueEth,
  totalRevenueUsd,
  cashierRevenueEth,
  cashierRevenueUsd,
  hedgeRevenueEth,
  hedgeRevenueUsd,
  tokenTaxRevenueEth,
  tokenTaxRevenueUsd,
  farmingFeesEth,
  farmingFeesUsd,
  minerFeesEth,
  minerFeesUsd,
  distributedEth,
  distributedUsd,
  undistributedEth,
  undistributedUsd,
  totalClaimedEth,
  totalClaimedUsd,
  totalUnclaimedEth,
  totalUnclaimedUsd,
  minedHedgesCount,
  minedHedgesUsd,
  minersCount,
  totalStakers
){
  // Format amounts
  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  // Format values
  const formatValue = (value) => {
    return `$${value.toFixed(2)}`;
  };

  // Update cashier fees
  document.getElementById("cashierRevenueAmnt").textContent = formatAmount(cashierRevenueEth);
  document.getElementById("cashierRevenueValue").textContent = formatValue(cashierRevenueUsd);

  // Update hedge revenue
  document.getElementById("hedgeRevenueAmnt").textContent = formatAmount(hedgeRevenueEth);
  document.getElementById("hedgeRevenueValue").textContent = formatValue(hedgeRevenueUsd);

  // Update tax revenue
  document.getElementById("taxRevenueAmnt").textContent = formatAmount(tokenTaxRevenueEth);
  document.getElementById("taxRevenueValue").textContent = formatValue(tokenTaxRevenueUsd);

  // Update farming revenues    
  document.getElementById("farmingRevenueAmnt").textContent = formatAmount(farmingFeesEth);
  document.getElementById("farmingRevenueValue").textContent = formatValue(farmingFeesUsd);

  // Update total revenues    
  //document.getElementById("totalRevenueAmnt").textContent = formatAmount(totalRevenueEth);
  document.getElementById("totalRevenueValue").textContent = formatValue(totalRevenueUsd);

  // Update distributed
  document.getElementById("totalRevenueDistrAmnt").textContent = formatValue(distributedEth);
  document.getElementById("totalRevenueDistrValue").textContent = formatValue(distributedUsd);

  // Update undistributed
  document.getElementById("totalRevenueUndistrAmnt").textContent = formatValue(undistributedEth);
  document.getElementById("totalRevenueUndistrValue").textContent = formatValue(undistributedUsd);

  // Update total claimed
  document.getElementById("totalClaimedAmnt").textContent = formatAmount(totalClaimedEth);
  document.getElementById("totalClaimedValue").textContent = formatValue(totalClaimedUsd);

  // Update total unclaimed
  document.getElementById("totalUnclaimedAmnt").textContent = formatAmount(totalUnclaimedEth);
  document.getElementById("totalUnclaimedValue").textContent = formatValue(totalUnclaimedUsd);

  // Update miner fees
  document.getElementById("minerFeesAmnt").textContent = formatAmount(minerFeesEth);
  document.getElementById("minerFeesValue").textContent = formatValue(minerFeesUsd);

  // Update miners stats  
  document.getElementById("minedHedgesCount").textContent = minedHedgesCount;
  document.getElementById("minedHedgesValue").textContent = formatValue(minedHedgesUsd);
  document.getElementById("minersCount").textContent = minersCount;

  // Update total stakers
  document.getElementById("totalStakers").textContent = totalStakers;

  // Calculate and update total fees
  const totalFeesEth = minerFeesEth + totalRevenueEth;
  const totalFeesUsd = minerFeesUsd + totalRevenueUsd;
  document.getElementById("totalFeesValue").textContent = formatValue(totalFeesUsd);
}

function updateSectionValues_Staking(
  totalStakers,
  totalStaked,
  totalStakedUSDT,
  circulatingSupply,
  circulatingSupplyUSDT,
  totalAssigned,
  totalAssignedUSDT,
  totalUnassigned,
  totalUnassignedUSDT,
  totalAssignmentsRewardsEth,
  totalAssignmentRewardsUSDT,
  AssignedRewardsMin,
  AssignedRewardsMinUSDT,
  AssignedRewardsCol,
  AssignedRewardsColUSDT,
  AssignedRewardsLiq,
  AssignedRewardsLiqUSDT
) {
  // Format amounts
  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  // Format values
  const formatValue = (value) => {
    return `$${value.toFixed(2)}`;
  };

  // Update staked versus circulating totals
  document.getElementById("stakedAmount").textContent = formatAmount(totalStaked);
  document.getElementById("stakedValue").textContent = formatValue(totalStakedUSDT);
  document.getElementById("circAmount").textContent = formatAmount(circulatingSupply);
  document.getElementById("circValue").textContent = formatValue(circulatingSupplyUSDT);
  document.getElementById("stakersCount").textContent = totalStakers;

  // Update assigned totals
  document.getElementById("assignedStakesAmnt").textContent = formatAmount(totalAssigned);
  document.getElementById("assignedStakesValue").textContent = formatValue(totalAssignedUSDT);

  // Update unassigned totals
  document.getElementById("unAssignedStakesAmnt").textContent = formatAmount(totalUnassigned);
  document.getElementById("unAssignedStakesValue").textContent = formatValue(totalUnassignedUSDT);

  // Update assignment rewards
  document.getElementById("assignmentRewardsAmnt").textContent = formatAmount(totalAssignmentsRewardsEth);
  document.getElementById("assignmentRewardsValue").textContent = formatAmount(totalAssignmentRewardsUSDT);

  // Update assignment pools
  document.getElementById("assignedLiquidityAmnt").textContent = formatValue(AssignedRewardsLiq);
  document.getElementById("assignedLiquidityValue").textContent = formatValue(AssignedRewardsLiqUSDT);
  document.getElementById("assignedCollateralAmnt").textContent = formatValue(AssignedRewardsCol);
  document.getElementById("assignedCollateralValue").textContent = formatValue(AssignedRewardsColUSDT);
  document.getElementById("assignedMiningAmnt").textContent = formatValue(AssignedRewardsMin);
  document.getElementById("assignedMiningValue").textContent = formatValue(AssignedRewardsMinUSDT);

}

function updateSectionValues_Tokenomics(symbol, decimals, contractAddress, buyTax, sellTax, priceTWETH, priceTUSD, burntSupply, circulatingSupply, totalSupply) {
  // Format amounts
  const formatAmount = (amount) => {
      return amount.toFixed(2);
  };
  
  // Format values
  const formatValue = (value) => {
      return `$${value.toFixed(2)}`;
  };

  const formatStringDecimal = (number) => {
		const options = {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 7,
		};
		return number.toLocaleString('en-US', options);
	};

    // Update
    document.getElementById("tokenoSymbol").textContent = symbol;
    document.getElementById("tokenoDecimals").textContent = decimals;
    document.getElementById("tokenoCA").textContent = contractAddress;
    document.getElementById("tokenoTaxes").textContent = buyTax + '/' + sellTax;
  
    // Update price
    document.getElementById("tokenoPriceUSD").textContent = formatStringDecimal(priceTUSD);
  
    // Update supply  
    document.getElementById("tokenoBurnt").textContent = formatValue(burntSupply);
    document.getElementById("tokenoCirculating").textContent = formatValue(circulatingSupply);
    document.getElementById("tokenoTotalSupply").textContent = formatValue(totalSupply);
}

// Export the fetch functions
export { updateSectionValues_Traffic, updateSectionValues_hedges, updateSectionValues_Earnings, updateSectionValues_Staking, updateSectionValues_Tokenomics };