// Update Section Values - Networth
function updateSectionValues_Networth(
    userAddress,
    walletBalance,
    stakedBalance,
    totalDepositsUSD,
    totalRewardsDueUSD,
    totalCommissionDueETH,
    totalCommissionDueUSD,
    walletBalanceUSD,
    transactedTokensCount,
    netWorthUSD
    ) {
    try {
        const formatValue = (value) => {
        return `$${value.toFixed(2)}`;
        };

        const formatString = (number) => {
            return number.toLocaleString();
        };

        const formatStringDecimal = (number) => {
            const options = {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            };
            return '$' + number.toLocaleString('en-US', options);
        };          

        var first = userAddress.substring(0, 5);//get first chars
        var last = userAddress.slice(userAddress.length - 3);//get last chars
        var privatize = first+'..'+last;
    
        // Update wallet address
        document.getElementById("walletAddress").textContent = privatize;
        document.getElementById("stakedBalance").textContent = formatString(stakedBalance);
        document.getElementById("walletBalance").textContent = formatString(walletBalance);
        document.getElementById("netWorthUSD").textContent = formatStringDecimal(netWorthUSD);
        document.getElementById("netDepositsUSD").textContent = formatStringDecimal(totalDepositsUSD);
        document.getElementById("netRewardsUSD").textContent = formatStringDecimal(totalRewardsDueUSD);
        document.getElementById("netCommissionUSD").textContent = formatStringDecimal(totalCommissionDueUSD);
        document.getElementById("walletBalanceUSD").textContent = formatStringDecimal(walletBalanceUSD);
        document.getElementById("tokensCount").textContent = Number(transactedTokensCount);

        // Remove the 'is-loading' class after loading
        const nwTextValues = document.querySelectorAll('.nw-text-value, .volume-count');
        nwTextValues.forEach(element => {
            element.classList.remove('is-loading');
        });
    } catch (error) {
        console.error("Error Updating Net Worth section data:", error);
    }
}

// Update Section Values - Networth
function updateSectionValues_Hedges(
	userHedgesCreated,
	userHedgesTaken,
	totalWriteTWETH,
	totalTakeTWETH,
	userOptionsHistoryCount,
	userSwapsHistoryCount,
	totalProfitTWETH,
	totalLossTWETH
	) {
    
    const formatValue = (value) => {
      return `$${value.toFixed(2)}`;
    };

	const formatString = (number) => {
		return number.toLocaleString();
	};

	const formatStringDecimal = (number) => {
		const options = {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		};
		return number.toLocaleString('en-US', options);
	};
  
    // Update panel
    document.getElementById("hedgesCreatedCount").textContent = userHedgesCreated;
    document.getElementById("hedgesTakenCount").textContent = userHedgesTaken;
	document.getElementById("writeVolume").textContent = formatString(totalWriteTWETH);
    document.getElementById("takeVolume").textContent = formatString(totalTakeTWETH);
    document.getElementById("optionsCount").textContent = userOptionsHistoryCount;
    document.getElementById("swapsCount").textContent = userSwapsHistoryCount;
    document.getElementById("profitsETH").textContent = formatString(totalProfitTWETH);
    document.getElementById("lossesETH").textContent = formatString(totalLossTWETH);
}

function updateSectionValues_Rewards(
    totalRewardsDueWETH,
    totalRewardsDueUSDT,
    totalRewardsClaimedWETH,
    totalRewardsClaimedUSDT,
    userRewardsDueEth,
    userRewardsDueUSDT,
    userLiqRewardsDueEth,
    userLiqRewardsDueUSDT,
    userColRewardsDueEth,
    userColRewardsDueUSDT,
    userRewardsClaimedEth,
    userRewardsClaimedUSDT,
    userLiqRewardsClaimedEth,
    userLiqRewardsClaimedUSDT,
    userColRewardsClaimedEth,
    userColRewardsClaimedUSDT
) {

    console.log('totalRewardsDueWETH', totalRewardsDueWETH + 'totalRewardsClaimedWETH', totalRewardsClaimedWETH);
    const formatValue = (value) => {
        return `$${value.toFixed(2)}`;
    };

    const formatString = (number) => {
        return number.toLocaleString();
    };

    const formatStringDecimal = (number) => {
        const options = {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        return number.toLocaleString('en-US', options);
    };

    // Update rewards due panel
    document.getElementById("totalRewardsDueAmnt").textContent = totalRewardsDueWETH;
    document.getElementById("rewardsDueAmnt").textContent = userRewardsDueEth;
    document.getElementById("rewardsDueAmntLiq").textContent = userLiqRewardsDueEth;
    document.getElementById("rewardsDueAmntLend").textContent = userColRewardsDueEth;
    
	document.getElementById("totalRewardsDueValue").textContent = formatString(totalRewardsDueUSDT);
    document.getElementById("rewardsDueValue").textContent = formatString(userRewardsDueUSDT);
    document.getElementById("rewardsDueValueLend").textContent = formatString(userLiqRewardsDueUSDT);
    document.getElementById("rewardsDueValueLiq").textContent = formatString(userColRewardsDueUSDT);

    // Update rewards claimed panel
    document.getElementById("totalRewardsClaimedAmnt").textContent = totalRewardsClaimedWETH;
    document.getElementById("rewardsClaimedAmnt").textContent = userRewardsClaimedEth;
    document.getElementById("rewardsClaimedAmntLiq").textContent = userLiqRewardsClaimedEth;
    document.getElementById("rewardsClaimedAmntLend").textContent = userColRewardsClaimedEth;

    document.getElementById("totalRewardsClaimedValue").textContent = formatString(totalRewardsClaimedUSDT);
    document.getElementById("rewardsClaimedValue").textContent = formatString(userRewardsClaimedUSDT);
    document.getElementById("rewardsClaimedValueLend").textContent = formatString(userLiqRewardsClaimedUSDT);
    document.getElementById("rewardsClaimedValueLiq").textContent = formatString(userColRewardsClaimedUSDT);
}

function updateSectionValues_Staking(
    walletBalance,
    stakedBalance,
    depositedBalance,
    withdrawnBalance,
    totalHoldings,
    totalStaked,
    circulatingSupply,
    distributedRewardsEth,
    distributedRewardsLiquEth,
    distributedRewardsCollEth,
    distributedRewardsTotalEth,
    claimedRewardsEth,
    claimedRewardsLiquEth,
    claimedRewardsCollEth,
    claimedRewardsTotalEth,
    assignedMining,
    assignedLiquidity,
    assignedCollateral,
    unassigned,
    totalAssigned,
    walletBalanceUSDT,
    stakedBalanceUSDT,
    depositedBalanceUSDT,
    withdrawnBalanceUSDT,
    totalHoldingsUSDT,
    totalStakedUSDT,
    circulatingSupplyUSDT,
    distributedRewardsUSDT,
    distributedRewardsLiqUSDT,
    distributedRewardsColUSDT,
    distributedRewardsTotalUSDT,
    claimedRewardsUSDT,
    claimedRewardsLiqUSDT,
    claimedRewardsColUSDT,
    claimedRewardsTotalUSDT,
    assignedMiningUSDT,
    assignedLiquidityUSDT,
    assignedCollateralUSDT,
    unassignedUSDT,
    totalAssignedUSDT
) {
    const formatValue = (value) => {
        return `($${value.toFixed(2)})`;
    };

    const formatString = (number) => {
        return number.toLocaleString();
    };

    const formatStringDecimal = (number) => {
        const options = {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };
        return number.toLocaleString('en-US', options);
    };

    // Update staking panel
    document.getElementById("stakedBalanceAmnt").textContent = formatString(stakedBalance);
    document.getElementById("stakedBalanceValue").textContent = formatValue(stakedBalanceUSDT);
    document.getElementById("totalBalanceAmnt").textContent = formatString(totalHoldings);
    document.getElementById("totalBalanceValue").textContent = formatValue(totalHoldingsUSDT);
    document.getElementById("stakedSupplyAmnt").textContent = formatString(totalStaked);
	document.getElementById("stakedSupplyValue").textContent = formatValue(totalStakedUSDT);
    document.getElementById("circSupplyAmnt").textContent = formatString(circulatingSupply);
    document.getElementById("circSupplyValue").textContent = formatValue(circulatingSupplyUSDT);
    document.getElementById("divDistributedAmnt").textContent = formatString(distributedRewardsTotalEth);
    document.getElementById("divDistributedValue").textContent = formatValue(distributedRewardsTotalUSDT);
    document.getElementById("divClaimedAmnt").textContent = formatString(claimedRewardsTotalEth);
    document.getElementById("divClaimedValue").textContent = formatValue(claimedRewardsTotalUSDT);

    document.getElementById("tokensAvailableWallet").textContent = formatString(walletBalance);
    document.getElementById("tokensStakedWallet").textContent = formatString(stakedBalance);
    
    // Update assignments panel
    document.getElementById("mystakedTokensAmnt").textContent = formatString(stakedBalance);
    document.getElementById("myStakedTokensValue").textContent = formatValue(stakedBalanceUSDT);
    document.getElementById("myAssignedAmnt").textContent = formatString(totalAssigned);
    document.getElementById("myAssignedValue").textContent = formatValue(totalAssignedUSDT);
    document.getElementById("myUnassignedAmnt").textContent = formatString(unassigned);
    document.getElementById("myUnassignedValue").textContent = formatValue(unassignedUSDT);

    document.getElementById("assignedToLiquidityAmnt").textContent = formatString(assignedLiquidity);
    document.getElementById("assignedToLiquidityValue").textContent = formatValue(assignedLiquidityUSDT);
    document.getElementById("assignedToCollateralAmnt").textContent = formatString(assignedCollateral);
    document.getElementById("assignedToCollateralValue").textContent = formatValue(assignedCollateralUSDT);
    document.getElementById("assignedToMiningAmnt").textContent = formatString(assignedMining);
    document.getElementById("assignedToMiningValue").textContent = formatValue(assignedMiningUSDT);

    // Update charts
    let percentage;
    if (totalHoldings !== 0) {
        percentage = (stakedBalance / totalHoldings) * 100;
    } else {
        percentage = 0; // Set percentage to zero if totalHoldings is zero to avoid NaN error when we devide by zero above^
    }
    // ==========================================
    const circle = document.querySelector('#stakedVsMyBalanceDash');
    const percentageText = document.querySelector('#stakedVsMyBalancePercent');
    // ==========================================
    circle.setAttribute('stroke-dasharray', `${percentage}, 100`);
    percentageText.textContent = `${percentage.toFixed(2)}%`;

    const percentageStakedSup = (totalStaked / circulatingSupply) * 100;
    // ==========================================
    const circleStakedSup = document.querySelector('#stakedVsCirculatingDash');
    const percentageTextStakedSup = document.querySelector('#stakedVsCirculatingPercent');
    // ==========================================
    circleStakedSup.setAttribute('stroke-dasharray', `${percentageStakedSup}, 100`);
    percentageTextStakedSup.textContent = `${percentageStakedSup.toFixed(2)}%`;

    const percentageDividentsDash = (totalStaked / circulatingSupply) * 100;
    // ==========================================
    const circleDividentsDash = document.querySelector('#dividentsDash');
    const percentageTextDividentsDash = document.querySelector('#dividentsDashPercent');
    // ==========================================
    circleDividentsDash.setAttribute('stroke-dasharray', `${percentageDividentsDash}, 100`);
    percentageTextDividentsDash.textContent = `${percentageDividentsDash.toFixed(2)}%`;

}
// Export the fetch functions
export { updateSectionValues_Networth, updateSectionValues_Hedges, updateSectionValues_Rewards, updateSectionValues_Staking };