import { CONSTANTS, getAccounts, fromBigIntNumberToDecimal, getCurrentEthUsdcPriceFromUniswapV2, getTokenETHValue, getTokenUSDValue } from './constants.js';
import { updateSectionValues_Networth, updateSectionValues_Hedges, updateSectionValues_Rewards, updateSectionValues_Staking } from './module-wallet-section-updaters.js';
import { getCurrentBalancesValue, calculateStakedTokensValueETH, calculateRewardsDue, calculateCommissionDueETH } from './module-wallet-networth-dependencies.js';
import { userTokenList, cashierErc20List } from './module-wallet-tokenlist-dependencies.js';
import { getUserHedgeVolume, getUserProfitLoss } from './module-wallet-hedgePanel-dependencies.js';

// 1. Fetch Section Values - Net Worth
//-----------------------------------------
async function fetchSection_Networth(){
    try {
		const accounts = await getAccounts();
        const userAddress = accounts[0];
        
        const walletBalanceRaw = await neonInstance.balanceOf(userAddress);
        const stakedBalanceRaw = await stakingInstance.getStakedBalance(userAddress);

        const transactedTokensArrayList = await hedgingInstance.getUserHistory(userAddress, 0, CONSTANTS.tokenLimit);
        const transactedTokensCount = transactedTokensArrayList.length;
        
        // Human Readable
		
        const walletBalance = fromBigIntNumberToDecimal(walletBalanceRaw, CONSTANTS.decimals);
		const stakedBalance = fromBigIntNumberToDecimal(stakedBalanceRaw, CONSTANTS.decimals);

        // ETH USD price
        const ethUsdcPrice = getCurrentEthUsdcPriceFromUniswapV2();

        // ETH values
        const rewardsDue = await calculateRewardsDue(userAddress);
        const commissionDue = await calculateCommissionDueETH(userAddress);
        const totalCommissionDueETH = commissionDue[0]; //already formated
        const stakedTokensETH = await calculateStakedTokensValueETH(userAddress); //already formated
        const [walletTokensETH, pairedSymbol] = await getTokenETHValue(CONSTANTS.neonAddress, walletBalanceRaw); //input in wei, output already formated

        //USD values
        const totalDepositsUSD = await getCurrentBalancesValue(userAddress); //already formated
        const totalRewardsDueUSD = rewardsDue * ethUsdcPrice; //already formated
        const totalCommissionDueUSD = commissionDue[0] * ethUsdcPrice; //already formated
        const stakedTokensUSD = stakedTokensETH * ethUsdcPrice;
        const walletTokensUSD = walletTokensETH * ethUsdcPrice;
        const netWorthUSD = walletTokensUSD + stakedTokensUSD + totalCommissionDueUSD + totalRewardsDueUSD + totalDepositsUSD;	

		console.log("totalDepositsUSD: " + totalDepositsUSD + ", stakedTokensUSD: " + stakedTokensUSD + ", walletTokensUSD: " + walletTokensUSD + ", totalRewardsDueUSD: " + totalRewardsDueUSD + ", totalCommissionDueUSD " + totalCommissionDueUSD + ", netWorthUSD " + netWorthUSD);

        updateSectionValues_Networth(
            userAddress,
            walletBalance,
            stakedBalance,
            totalDepositsUSD,
            totalRewardsDueUSD,
            totalCommissionDueETH,
            totalCommissionDueUSD,
			walletTokensUSD,
            transactedTokensCount,
            netWorthUSD
        );
    } catch (error) {
        console.error("Error fetching Hedge Panel section data:", error);
    }
}

// 2. Fetch Section Values - ERC20 DEPOSIT BALANCES LIST
//---------------------------------------------------
async function fetchSection_BalanceList(){
	const accounts = await getAccounts();
	const userAddress = accounts[0];

	await userTokenList(userAddress);
	return;
}

// 3. Fetch Section Values - HEDGING PANEL
//----------------------------------------------------
async function fetchSection_HedgePanel(){

	const accounts = await getAccounts();
    const userAddress = accounts[0];
	// Fetch arrays
	const userOptionsCreated = await hedgingInstance.getUserOptionsCreated(userAddress, 0, CONSTANTS.tokenLimit);
	const userSwapsCreated = await hedgingInstance.getUserSwapsCreated(userAddress, 0, CONSTANTS.tokenLimit);
	const userOptionsTaken = await hedgingInstance.getUserOptionsTaken(userAddress, 0, CONSTANTS.tokenLimit);
	const userSwapsTaken = await hedgingInstance.getUserSwapsTaken(userAddress, 0, CONSTANTS.tokenLimit);
	// Fetch volume
	// Manually fetch these: get hedges created + taken IDs, then compile createValue & startValue volumes from each ID
	const userHedgeVolume = await getUserHedgeVolume(userAddress);

	// Fetch profits and losses: WETH, USDT, USDC support only for now
	const userProfitLoss = await getUserProfitLoss(userAddress);

	// Fetch ETH to USD conversion rate
	const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();

	// Step 1: Convert lengths
	const userOptionsCreatedCount = userOptionsCreated.length;
	const userSwapsCreatedCount = userSwapsCreated.length;
	const userHedgesCreated = userOptionsCreatedCount + userSwapsCreatedCount;

	const userOptionsTakenCount = userOptionsTaken.length;
	const userSwapsTakenCount = userSwapsTaken.length;
	const userHedgesTaken = userOptionsTakenCount + userSwapsTakenCount;
	
	const userOptionsHistoryCount = userOptionsCreated.length + userOptionsTaken.length;
	const userSwapsHistoryCount = userSwapsCreated.length + userSwapsTaken.length;
	
	// Step 2: Convert amounts
	const userCreateVolumeWETH = Number(userHedgeVolume.costSumUSDC);
	const userCreateVolumeUSDT = Number(userHedgeVolume.costSumUSDT);
	const userCreateVolumeUSDC = Number(userHedgeVolume.costSumUSDC);
	const userBuyVolumeWETH = Number(userHedgeVolume.startValueSumWETH);
	const userBuyVolumeUSDT = Number(userHedgeVolume.startValueSumUSDT);
	const userBuyVolumeUSDC = Number(userHedgeVolume.startValueSumUSDC);

	const userProfitWETH = Number(userProfitLoss.profitsWETH);
	const userProfitUSDT = Number(userProfitLoss.profitsUSDT);
	const userProfitUSDC = Number(userProfitLoss.profitsUSDC);
	const userLossWETH = Number(userProfitLoss.lossesWETH);
	const userLossUSDT = Number(userProfitLoss.lossesUSDT);
	const userLossUSDC = Number(userProfitLoss.lossesUSDC);

	const totalCreatedWETH = userCreateVolumeWETH + (userCreateVolumeUSDT / ethUsdPrice) + (userCreateVolumeUSDC / ethUsdPrice);
	const totalTakenWETH = userBuyVolumeWETH + (userBuyVolumeUSDT / ethUsdPrice) + (userBuyVolumeUSDC / ethUsdPrice);
	const totalProfitTWETH = userProfitWETH + (userProfitUSDT / ethUsdPrice) + (userProfitUSDC / ethUsdPrice);
	const totalLossTWETH = userLossWETH + (userLossUSDT / ethUsdPrice) + (userLossUSDC / ethUsdPrice);

	updateSectionValues_Hedges(
		userHedgesCreated,
		userHedgesTaken,
		totalCreatedWETH,
		totalTakenWETH,
		userOptionsHistoryCount,
		userSwapsHistoryCount,
		totalProfitTWETH,
		totalLossTWETH
	);

}

// 4. Fetch Section Values - REWARDS PANEL
//----------------------------------------------------
async function fetchSection_RewardsPanel(){
	const accounts = await getAccounts();
    const userAddress = accounts[0];
	// Fetch rewards due
	const userRewardsDue = await stakingInstance.getRewardsDue();
	const userLiqRewardsDue = await stakingInstance.getLiquidityRewardsDue();
	const userColRewardsDue = await stakingInstance.getCollateralRewardsDue();
	// ~ mining rewards are automatically credited to miner on every hedge settlement.
	// ~ mining rewards are accumulated in the token addresses of underlying & pair, endless erc20 fee types
	// ~ mining rewards are not automatically loaded to wallet page as they need to be populated from past events
	
	// Fetch rewards claimed
	const userRewardsClaimed = await stakingInstance.claimedRewardsStaking(userAddress);
	const userLiqRewardsClaimed = await stakingInstance.claimedRewardsLiquidity(userAddress);
	const userColRewardsClaimed = await stakingInstance.claimedRewardsCollateral(userAddress);
	
	// Fetch ETH to USD conversion rate
	const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();

	// Step 1: Convert amounts
	const wethDecimals = 18; const usdtDecimals = 6; const usdcDecimals = 6;

	// Step 2: Convert eth values
	const userRewardsDueEth = fromBigIntNumberToDecimal(userRewardsDue, wethDecimals);
	const userLiqRewardsDueEth = fromBigIntNumberToDecimal(userLiqRewardsDue, wethDecimals);
	const userColRewardsDueEth = fromBigIntNumberToDecimal(userColRewardsDue, wethDecimals);
	const totalRewardsDueWETH = userRewardsDueEth + userLiqRewardsDueEth + userColRewardsDueEth;

	const userRewardsClaimedEth = fromBigIntNumberToDecimal(userRewardsClaimed, wethDecimals);
	const userLiqRewardsClaimedEth = fromBigIntNumberToDecimal(userLiqRewardsClaimed, wethDecimals);
	const userColRewardsClaimedEth = fromBigIntNumberToDecimal(userColRewardsClaimed, wethDecimals);
	const totalRewardsClaimedWETH = userRewardsClaimedEth + userLiqRewardsClaimedEth + userColRewardsClaimedEth;

	// Step 3: Convert usdt values
	const userRewardsDueUSDT = userRewardsDueEth * ethUsdPrice;
	const userLiqRewardsDueUSDT = userLiqRewardsDueEth * ethUsdPrice;
	const userColRewardsDueUSDT = userColRewardsDueEth * ethUsdPrice;	
	const totalRewardsDueUSDT = userRewardsDueUSDT + userLiqRewardsDueUSDT + userColRewardsDueUSDT;

	const userRewardsClaimedUSDT = userRewardsClaimedEth * ethUsdPrice;
	const userLiqRewardsClaimedUSDT = userLiqRewardsClaimedEth * ethUsdPrice;
	const userColRewardsClaimedUSDT = userColRewardsClaimedEth * ethUsdPrice;
	const totalRewardsClaimedUSDT = userRewardsClaimedUSDT + userLiqRewardsClaimedUSDT + userColRewardsClaimedUSDT;

	updateSectionValues_Rewards(
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
	);

}

// 5. Fetch Section Values - STAKING PANEL
//----------------------------------------------------
async function fetchSection_StakingPanel() {
    const accounts = await getAccounts();
    const userAddress = accounts[0];

    const walletBalanceRaw = await neonInstance.balanceOf(userAddress);
    const stakedBalanceRaw = await stakingInstance.getStakedBalance(userAddress);
    const depositedBalanceRaw = await hedgingInstance.getUserTokenBalances(CONSTANTS.neonAddress, userAddress);
    const deposited = depositedBalanceRaw.deposited;
    const withdrawn = depositedBalanceRaw.withdrawn;

    const totalStakedRaw = await stakingInstance.getTotalStaked();
    const totalSupplyBig = ethers.BigNumber.from(await neonInstance.totalSupply());
    const burntBalanceBig = ethers.BigNumber.from(await neonInstance.balanceOf(CONSTANTS.burnAddress));
    const circulatingSupplyRaw = totalSupplyBig.sub(burntBalanceBig);

    const distributedRewards = await stakingInstance.ethRewardBasis();
    const distributedRewardsLiqu = await stakingInstance.ethLiquidityRewardBasis();
    const distributedRewardsColl = await stakingInstance.ethCollateralRewardBasis();

    const claimedRewards = await stakingInstance.claimedRewardsStaking(userAddress);
    const claimedRewardsLiqu = await stakingInstance.claimedRewardsLiquidity(userAddress);
    const claimedRewardsColl = await stakingInstance.claimedRewardsCollateral(userAddress);

    const assignmentsRaw = await stakingInstance.getAssignedAndUnassignedAmounts(userAddress);
    const assignedMiningRaw = assignmentsRaw.assignedForMining;
    const assignedLiquidityRaw = assignmentsRaw.assignedForLiquidity;
    const assignedCollateralRaw = assignmentsRaw.assignedForCollateral;
    const unassignedRaw = assignmentsRaw.unassigned;

    const wethDecimals = 18;

    const walletBalance = fromBigIntNumberToDecimal(walletBalanceRaw, CONSTANTS.decimals);
    const stakedBalance = fromBigIntNumberToDecimal(stakedBalanceRaw, CONSTANTS.decimals);
    const depositedBalance = fromBigIntNumberToDecimal(deposited, CONSTANTS.decimals);
    const withdrawnBalance = fromBigIntNumberToDecimal(withdrawn, CONSTANTS.decimals);
    const totalHoldings = walletBalance + stakedBalance + (depositedBalance - withdrawnBalance);

    const totalStaked = fromBigIntNumberToDecimal(totalStakedRaw, CONSTANTS.decimals);
    const circulatingSupply = fromBigIntNumberToDecimal(circulatingSupplyRaw, CONSTANTS.decimals);

    const distributedRewardsEth = fromBigIntNumberToDecimal(distributedRewards, wethDecimals);
    const distributedRewardsLiquEth = fromBigIntNumberToDecimal(distributedRewardsLiqu, wethDecimals);
    const distributedRewardsCollEth = fromBigIntNumberToDecimal(distributedRewardsColl, wethDecimals);
    const distributedRewardsTotalEth = distributedRewardsEth + distributedRewardsLiquEth + distributedRewardsCollEth;

    const claimedRewardsEth = fromBigIntNumberToDecimal(claimedRewards, wethDecimals);
    const claimedRewardsLiquEth = fromBigIntNumberToDecimal(claimedRewardsLiqu, wethDecimals);
    const claimedRewardsCollEth = fromBigIntNumberToDecimal(claimedRewardsColl, wethDecimals);
    const claimedRewardsTotalEth = claimedRewardsEth + claimedRewardsLiquEth + claimedRewardsCollEth;

    const assignedMining = fromBigIntNumberToDecimal(assignedMiningRaw, CONSTANTS.decimals);
    const assignedLiquidity = fromBigIntNumberToDecimal(assignedLiquidityRaw, CONSTANTS.decimals);
    const assignedCollateral = fromBigIntNumberToDecimal(assignedCollateralRaw, CONSTANTS.decimals);
    const unassigned = fromBigIntNumberToDecimal(unassignedRaw, CONSTANTS.decimals);
    const totalAssigned = assignedMining + assignedLiquidity + assignedCollateral;

    const xeonAddress = CONSTANTS.neonAddress;
    const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();

    const walletBalanceUSDT = await getTokenUSDValue(xeonAddress, walletBalance);
    const stakedBalanceUSDT = await getTokenUSDValue(xeonAddress, stakedBalance);
    const depositedBalanceUSDT = await getTokenUSDValue(xeonAddress, depositedBalance);
    const withdrawnBalanceUSDT = await getTokenUSDValue(xeonAddress, withdrawnBalance);
    const totalHoldingsUSDT = await getTokenUSDValue(xeonAddress, totalHoldings);

    const totalStakedUSDT = await getTokenUSDValue(xeonAddress, totalStaked);
    const circulatingSupplyUSDT = await getTokenUSDValue(xeonAddress, circulatingSupply);

    const distributedRewardsUSDT = distributedRewardsEth * ethUsdPrice;
    const distributedRewardsLiqUSDT = distributedRewardsLiquEth * ethUsdPrice;
    const distributedRewardsColUSDT = distributedRewardsCollEth * ethUsdPrice;
    const distributedRewardsTotalUSDT = distributedRewardsTotalEth * ethUsdPrice;

    const claimedRewardsUSDT = claimedRewardsEth * ethUsdPrice;
    const claimedRewardsLiqUSDT = claimedRewardsLiquEth * ethUsdPrice;
    const claimedRewardsColUSDT = claimedRewardsCollEth * ethUsdPrice;
    const claimedRewardsTotalUSDT = claimedRewardsTotalEth * ethUsdPrice;

    const assignedMiningUSDT = await getTokenUSDValue(xeonAddress, assignedMining);
    const assignedLiquidityUSDT = await getTokenUSDValue(xeonAddress, assignedLiquidity);
    const assignedCollateralUSDT = await getTokenUSDValue(xeonAddress, assignedCollateral);
    const unassignedUSDT = await getTokenUSDValue(xeonAddress, unassigned);
    const totalAssignedUSDT = assignedMiningUSDT + assignedLiquidityUSDT + assignedCollateralUSDT;

    updateSectionValues_Staking(
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
    );
}

// Export the fetch functions
export { fetchSection_Networth, fetchSection_BalanceList, fetchSection_HedgePanel, fetchSection_RewardsPanel, fetchSection_StakingPanel };