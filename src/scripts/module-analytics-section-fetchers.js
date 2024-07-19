import { CONSTANTS, fromBigIntNumberToDecimal, fromDecimalToBigInt, getCurrentEthUsdcPriceFromUniswapV2, getTokenETHValue, getTokenUSDValue } from './constants.js';
import { updateSectionValues_Traffic, updateSectionValues_hedges, updateSectionValues_Earnings, updateSectionValues_Staking, updateSectionValues_Tokenomics } from './module-analytics-section-updaters.js';
import { updateChartValues_Cashier, updateChartValues_Currencies, updateChartValues_hedges, updateChartValues_Revenue, updateChartValues_Dividents, updateChartValues_Claims, updateChartValues_Staking, updateChartValues_Tokenomics } from './module-analytics-chart-updaters.js';

async function setCurrent_TrafficSection() {   
    
    const wethDecimals = 18; const usdtDecimals = 6; const usdcDecimals = 6;
    const ethUsdcPrice = getCurrentEthUsdcPriceFromUniswapV2();

    // Step 1: Fetch Deposit Withdrawal Volume from Vault mappings
    const wethBalances = await hedgingInstance.protocolBalanceMap(CONSTANTS.wethAddress);
    const wethDeposits = wethBalances[0];
    const wethWithdrawals = wethBalances[1];
    const usdtBalances = await hedgingInstance.protocolBalanceMap(CONSTANTS.usdtAddress);
    const usdtDeposits = usdtBalances[0];
    const usdtWithdrawals = usdtBalances[1];
    const usdcBalances = await hedgingInstance.protocolBalanceMap(CONSTANTS.usdcAddress);
    const usdcDeposits = usdcBalances[0];
    const usdcWithdrawals = usdcBalances[1];

    // Fetch equivalents
    const erc20DepositsInWETH = await hedgingInstance.wethEquivDeposits();
    const erc20DepositsInUSDT = await hedgingInstance.usdtEquivDeposits();
    const erc20DepositsInUSDC = await hedgingInstance.usdcEquivDeposits();

    const erc20WithdrawalsInWETH = await hedgingInstance.wethEquivWithdrawals();
    const erc20WithdrawalsInUSDT = await hedgingInstance.usdtEquivWithdrawals();
    const erc20WithdrawalsInUSDC = await hedgingInstance.usdcEquivWithdrawals();

    // OTC Volume
    const hedgeVolumeWETH = await hedgingInstance.hedgesCreatedVolume(CONSTANTS.wethAddress);
    const hedgeVolumeUSDT = await hedgingInstance.hedgesCreatedVolume(CONSTANTS.usdtAddress);
    const hedgeVolumeUSDC = await hedgingInstance.hedgesCreatedVolume(CONSTANTS.usdcAddress);

    const hedgeVolumeWETHDecimal = fromBigIntNumberToDecimal(hedgeVolumeWETH, wethDecimals);
    const hedgeVolumeUSDTDecimal = fromBigIntNumberToDecimal(hedgeVolumeUSDT, usdtDecimals);
    const hedgeVolumeUSDCDecimal = fromBigIntNumberToDecimal(hedgeVolumeUSDC, usdcDecimals);

    const totalOTCvolumeUSD = (hedgeVolumeWETHDecimal * ethUsdcPrice) + hedgeVolumeUSDTDecimal + hedgeVolumeUSDCDecimal;
    const totalOTCvolumeWETH = (hedgeVolumeWETHDecimal + (hedgeVolumeUSDTDecimal / ethUsdcPrice) + (hedgeVolumeUSDCDecimal / ethUsdcPrice));

    // Dex volume, needs an API
    const totalDEXvolumeWETH = 0;

    // Step 2: Convert WETH amounts    
    const totalDepositWeth = fromBigIntNumberToDecimal(wethDeposits, wethDecimals);
    const totalWithdrawalWeth = fromBigIntNumberToDecimal(wethWithdrawals, wethDecimals);
    const totalDepositWethUSD = totalDepositWeth * ethUsdcPrice;
    const totalWithdrawalWethUSD = totalWithdrawalWeth * ethUsdcPrice;

    // Step 4: Convert USDT amounts
    const totalDepositUSDT = fromBigIntNumberToDecimal(usdtDeposits, usdtDecimals);
    const totalWithdrawalUSDT = fromBigIntNumberToDecimal(usdtWithdrawals, usdtDecimals);

    // Step 5: Convert USDC amounts
    const totalDepositUSDC = fromBigIntNumberToDecimal(usdcDeposits, usdcDecimals);
    const totalWithdrawalUSDC = fromBigIntNumberToDecimal(usdcWithdrawals, usdcDecimals);

    // Step 6: Convert ERC20 amounts
    const totalDepositERC20weth = fromBigIntNumberToDecimal(erc20DepositsInWETH, wethDecimals);
    const totalWithdrawalERC20weth = fromBigIntNumberToDecimal(erc20WithdrawalsInWETH, wethDecimals);
    const totalDepositERC20usdt = fromBigIntNumberToDecimal(erc20DepositsInUSDT, usdtDecimals);
    const totalWithdrawalERC20usdt = fromBigIntNumberToDecimal(erc20WithdrawalsInUSDT, usdtDecimals);
    const totalDepositERC20usdc = fromBigIntNumberToDecimal(erc20DepositsInUSDC, usdcDecimals);
    const totalWithdrawalERC20usdc = fromBigIntNumberToDecimal(erc20WithdrawalsInUSDC, usdcDecimals);

    // Step 7: Calculate the total deposit amount in USD
    const totalDepositAmountUsd = (
        totalDepositWethUSD +
        totalDepositUSDT +
        totalDepositUSDC +
        totalDepositERC20weth * ethUsdcPrice
    );

    // Step 8: Calculate the total withdrawal amount in USD
    const totalWithdrawalAmountUsd = (
        totalWithdrawalWethUSD +
        totalWithdrawalUSDT +
        totalWithdrawalUSDC +
        totalWithdrawalERC20weth * ethUsdcPrice
    );

    // Step X: Calculate ERC20 total deposits
    const totalDepositERC20_weth =
        totalDepositERC20weth + totalDepositERC20usdt / ethUsdcPrice + totalDepositERC20usdc / ethUsdcPrice;
    const totalDepositERC20 = totalDepositERC20_weth * ethUsdcPrice;

    const totalWithdrawalERC20_weth =
        totalWithdrawalERC20weth + totalWithdrawalERC20usdt / ethUsdcPrice + totalWithdrawalERC20usdc / ethUsdcPrice;
    const totalWithdrawalERC20 = totalWithdrawalERC20_weth * ethUsdcPrice;

    // Step X: Calculate the total transaction volume in USD
    const totalCashierVolumeUSD = totalDepositAmountUsd + totalWithdrawalAmountUsd;

    // Counters
    const activeOptions = await hedgingInstance.optionsTakenLength(); 
    const activeSwaps = await hedgingInstance.equityswapsTakenLength();
    const activeTrades = BigInt(activeOptions) + BigInt(activeSwaps);
    const activeERC20S = await hedgingInstance.depositedTokensLength();
    const activeWallets = 0; // await hedgingInstance.depositedWalletsLength();

    // Traffic Split: calculate the share of each currency in the totalVolume(in USD) using USD value
    const usdShareOWETH = ethUsdcPrice * (totalDepositWeth + totalWithdrawalWeth + hedgeVolumeWETHDecimal + totalDEXvolumeWETH);
    const usdShareOUSDT = totalDepositUSDT + totalWithdrawalUSDT + hedgeVolumeUSDTDecimal;
    const usdShareOUSDC = totalDepositUSDC + totalWithdrawalUSDC + hedgeVolumeUSDCDecimal;
    const usdShareOERC20 = ethUsdcPrice * (totalDepositERC20weth + totalWithdrawalERC20weth) + totalDepositERC20usdt + totalWithdrawalERC20usdt + totalDepositERC20usdc + totalWithdrawalERC20usdc;
    // Total 
    const totalVolumeUSD = usdShareOWETH + usdShareOUSDT + usdShareOUSDC + usdShareOERC20;
    
    // Calculate share percentages
    const shareWETH = usdShareOWETH / totalVolumeUSD * 100;
    const shareUSDT = usdShareOUSDT / totalVolumeUSD * 100;
    const shareUSDC = usdShareOUSDC / totalVolumeUSD * 100;
    const shareERC20 = usdShareOERC20 / totalVolumeUSD * 100;

    // Update the section with current values from protocol
    updateSectionValues_Traffic(
        activeWallets, 
        activeERC20S, 
        activeTrades,
        totalDEXvolumeWETH,
        totalOTCvolumeUSD,
        totalCashierVolumeUSD,
        totalDepositWeth, 
        totalDepositUSDT, 
        totalDepositUSDC, 
        totalDepositERC20, 
        totalWithdrawalWeth, 
        totalWithdrawalUSDT, 
        totalWithdrawalUSDC, 
        totalWithdrawalERC20,
        totalOTCvolumeWETH,
        hedgeVolumeWETHDecimal,
        hedgeVolumeUSDTDecimal,
        hedgeVolumeUSDCDecimal,
    );

    // Update the section charts
    updateChartValues_Cashier(totalDepositAmountUsd, totalWithdrawalAmountUsd);
    updateChartValues_Currencies(shareWETH, shareUSDT, shareUSDC, shareERC20)
}

async function setCurrent_HedgeSection() {
    // Fetch manually base address by base address. erc20s are sold at 10% discount in weth
    // Reading direct from solidity mappings
    const hedgesCreatedWETH = await hedgingInstance.hedgesCreatedVolume(CONSTANTS.wethAddress);
    const hedgesCreatedUSDT = await hedgingInstance.hedgesCreatedVolume(CONSTANTS.usdtAddress);
    const hedgesCreatedUSDC = await hedgingInstance.hedgesCreatedVolume(CONSTANTS.usdcAddress);

    const hedgesTradedWETH = await hedgingInstance.hedgesTakenVolume(CONSTANTS.wethAddress);
    const hedgesTradedUSDT = await hedgingInstance.hedgesTakenVolume(CONSTANTS.usdtAddress);
    const hedgesTradedUSDC = await hedgingInstance.hedgesTakenVolume(CONSTANTS.usdcAddress);

    const hedgeCostsWETH = await hedgingInstance.hedgesCostVolume(CONSTANTS.wethAddress);
    const hedgeCostsUSDT = await hedgingInstance.hedgesCostVolume(CONSTANTS.usdtAddress);
    const hedgeCostsUSDC = await hedgingInstance.hedgesCostVolume(CONSTANTS.usdcAddress);

    const optionsVolumeWETH = await hedgingInstance.optionsVolume(CONSTANTS.wethAddress);
    const optionsVolumeUSDT = await hedgingInstance.optionsVolume(CONSTANTS.usdtAddress);
    const optionsVolumeUSDC = await hedgingInstance.optionsVolume(CONSTANTS.usdcAddress);

    const swapsVolumeWETH = await hedgingInstance.swapsVolume(CONSTANTS.wethAddress);
    const swapsVolumeUSDT = await hedgingInstance.swapsVolume(CONSTANTS.usdtAddress);
    const swapsVolumeUSDC = await hedgingInstance.swapsVolume(CONSTANTS.usdcAddress);
    
    const settledVolumeWETH = await hedgingInstance.settledVolume(CONSTANTS.wethAddress);
    const settledVolumeUSDT = await hedgingInstance.settledVolume(CONSTANTS.usdtAddress);
    const settledVolumeUSDC = await hedgingInstance.settledVolume(CONSTANTS.usdcAddress);
    
    const hedgeProfitsWETH = await hedgingInstance.protocolPairProfits(CONSTANTS.wethAddress);
    const hedgeProfitsUSDT = await hedgingInstance.protocolPairProfits(CONSTANTS.usdtAddress);
    const hedgeProfitsUSDC = await hedgingInstance.protocolPairProfits(CONSTANTS.usdcAddress);

    const hedgeFeesWETH = await hedgingInstance.protocolPairedFees(CONSTANTS.wethAddress);
    const hedgeFeesUSDT = await hedgingInstance.protocolPairedFees(CONSTANTS.usdtAddress);
    const hedgeFeesUSDC = await hedgingInstance.protocolPairedFees(CONSTANTS.usdcAddress);

    // Counters
    const activeERC20S = await hedgingInstance.depositedTokensLength();
    const swapsTakenCount = await hedgingInstance.equityswapsTakenLength();
    const hedgesTakenCount = await hedgingInstance.optionsTakenLength();
    const totalTakenCount = BigInt(swapsTakenCount) + BigInt(hedgesTakenCount);
  
    // Fetch ETH to USD conversion rate
    const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();

    // Step 3: Convert WETH amounts
    const wethDecimals = 18; const usdtDecimals = 6; const usdcDecimals = 6;

    const hedgesCreatedEth = fromBigIntNumberToDecimal(hedgesCreatedWETH, wethDecimals);
    const hedgesCreatedUsdt = fromBigIntNumberToDecimal(hedgesCreatedUSDT, usdtDecimals);
    const hedgesCreatedUsdc = fromBigIntNumberToDecimal(hedgesCreatedUSDC, usdcDecimals);
    const hedgesCreatedTUSD = (hedgesCreatedEth * ethUsdPrice) + hedgesCreatedUsdt + hedgesCreatedUsdc;
    
    const hedgesTradedEth = fromBigIntNumberToDecimal(hedgesTradedWETH, wethDecimals);
    const hedgesTradedUsdt = fromBigIntNumberToDecimal(hedgesTradedUSDT, usdtDecimals);
    const hedgesTradedUsdc = fromBigIntNumberToDecimal(hedgesTradedUSDC, usdcDecimals);
    const hedgesTradedTUSD = (hedgesTradedEth * ethUsdPrice) + hedgesTradedUsdt + hedgesTradedUsdc;

    const hedgeCostsEth = fromBigIntNumberToDecimal(hedgeCostsWETH, wethDecimals);
    const hedgeCostsUsdt = fromBigIntNumberToDecimal(hedgeCostsUSDT, usdtDecimals);
    const hedgeCostsUsdc = fromBigIntNumberToDecimal(hedgeCostsUSDC, usdcDecimals);
    const hedgeCostsTUSD = (hedgeCostsEth * ethUsdPrice) + hedgeCostsUsdt + hedgeCostsUsdc;

    const optionsVolumeEth = fromBigIntNumberToDecimal(optionsVolumeWETH, wethDecimals);
    const optionsVolumeUsdt = fromBigIntNumberToDecimal(optionsVolumeUSDT, usdtDecimals);
    const optionsVolumeUsdc = fromBigIntNumberToDecimal(optionsVolumeUSDC, usdcDecimals);
    const optionsVolumeTUSD = (optionsVolumeEth * ethUsdPrice) + optionsVolumeUsdt + optionsVolumeUsdc;

    const swapsVolumeEth = fromBigIntNumberToDecimal(swapsVolumeWETH, wethDecimals);
    const swapsVolumeUsdt = fromBigIntNumberToDecimal(swapsVolumeUSDT, usdtDecimals);
    const swapsVolumeUsdc = fromBigIntNumberToDecimal(swapsVolumeUSDC, usdcDecimals);
    const swapsVolumeTUSD = (swapsVolumeEth * ethUsdPrice) + swapsVolumeUsdt + swapsVolumeUsdc; 
    
    const settledVolumeEth = fromBigIntNumberToDecimal(settledVolumeWETH, wethDecimals);
    const settledVolumeUsdt = fromBigIntNumberToDecimal(settledVolumeUSDT, usdtDecimals);
    const settledVolumeUsdc = fromBigIntNumberToDecimal(settledVolumeUSDC, usdcDecimals);
    const settledVolumeTUSD = (settledVolumeEth * ethUsdPrice) + settledVolumeUsdt + settledVolumeUsdc; 

    const hedgeProfitsEth = fromBigIntNumberToDecimal(hedgeProfitsWETH, wethDecimals);
    const hedgeProfitsUsdt = fromBigIntNumberToDecimal(hedgeProfitsUSDT, usdtDecimals);
    const hedgeProfitsUsdc = fromBigIntNumberToDecimal(hedgeProfitsUSDC, usdcDecimals);
    const hedgeProfitsTUSD = (hedgeProfitsEth * ethUsdPrice) + hedgeProfitsUsdt + hedgeProfitsUsdc;

    const hedgeFeesEth = fromBigIntNumberToDecimal(hedgeFeesWETH, wethDecimals);
    const hedgeFeesUsdt = fromBigIntNumberToDecimal(hedgeFeesUSDT, usdtDecimals);
    const hedgeFeesUsdc = fromBigIntNumberToDecimal(hedgeFeesUSDC, usdcDecimals);
    const hedgeFeesTUSD = (hedgeFeesEth * ethUsdPrice) + hedgeFeesUsdt + hedgeFeesUsdc;
  
    // Convert ETH values to USD
    const hedgesTradedTWETH = hedgesTradedTUSD / ethUsdPrice;
    const hedgesCreatedTWETH = hedgesCreatedTUSD / ethUsdPrice;
    const swapsVolumeTWETH = swapsVolumeTUSD / ethUsdPrice;
    const optionsVolumeTWETH = optionsVolumeTUSD / ethUsdPrice;
    const settledVolumeTWETH = settledVolumeTUSD / ethUsdPrice;
    const hedgeCostsTWETH = hedgeCostsTUSD / ethUsdPrice;
    const hedgeProfitsTWETH = hedgeProfitsTUSD / ethUsdPrice;
    const hedgeFeesTWETH = hedgeFeesTUSD / ethUsdPrice;
  
    // Call the updateSectionValues_hedges function
    updateSectionValues_hedges(
        activeERC20S,
        totalTakenCount,
        swapsTakenCount,
        hedgesTakenCount,
        hedgesTradedTUSD,
        hedgesCreatedTUSD,
        swapsVolumeTUSD,
        optionsVolumeTUSD,        
        settledVolumeTUSD,
        hedgeCostsTUSD,
        hedgeProfitsTUSD,
        hedgeFeesTUSD
    );

    updateChartValues_hedges(1, hedgesTradedTUSD, hedgesCreatedTUSD);
    updateChartValues_hedges(2, swapsVolumeTUSD, optionsVolumeTUSD);
    updateChartValues_hedges(3, hedgeCostsTUSD, hedgesTradedTUSD);
    updateChartValues_hedges(4, hedgeProfitsTUSD, hedgeFeesTUSD);
}

async function setCurrent_EarningsSection() {
    // Settlement revenue: erc20s are sold at 10% discount in weth, to be accounted for in future
    const revenueWETHraw = await hedgingInstance.userBalanceMap(CONSTANTS.wethAddress, CONSTANTS.hedgingAddress);
    const revenueWETH = revenueWETHraw.deposited;
    const revenueUSDTraw = await hedgingInstance.userBalanceMap(CONSTANTS.usdtAddress, CONSTANTS.hedgingAddress);
    const revenueUSDT = revenueUSDTraw.deposited;
    const revenueUSDCraw = await hedgingInstance.userBalanceMap(CONSTANTS.usdcAddress, CONSTANTS.hedgingAddress);
    const revenueUSDC = revenueUSDCraw.deposited;
    // Cashier revenue
    const cashierFeesWETH = await hedgingInstance.protocolCashierFees(CONSTANTS.wethAddress);
    const cashierFeesUSDT = await hedgingInstance.protocolCashierFees(CONSTANTS.usdtAddress);
    const cashierFeesUSDC = await hedgingInstance.protocolCashierFees(CONSTANTS.usdcAddress);

    const hedgeFeesWETH = await hedgingInstance.protocolPairedFees(CONSTANTS.wethAddress);
    const hedgeFeesUSDT = await hedgingInstance.protocolPairedFees(CONSTANTS.usdtAddress);
    const hedgeFeesUSDC = await hedgingInstance.protocolPairedFees(CONSTANTS.usdcAddress);

    // Farming revenue
    const farmingFees = 0;//await hedgingInstance.farmingFees(CONSTANTS.wethAddress);
  
    // Claims
    const totalDistributed = await stakingInstance.ethRewardBasis(); // all rewards converted to WETH, deposited to staking contract
    const tokentaxRevenue = await neonInstance._ethRewardBasis(); // tax from NEON Dex Swaps, returns ETH only, revenue to rewardsWallet
    const totalClaimedStaking = await stakingInstance.claimedRewards(); // withdrawn to staking contract for claiming. pie chart with: withdrawn Vs claimed
    const totalClaimedLiquidity = await stakingInstance.claimedRewardsLiq();
    const totalClaimedFarming = await stakingInstance.claimedRewardsCol();

    const totalClaimedWei = BigInt(totalClaimedStaking) + BigInt(totalClaimedLiquidity)  + BigInt(totalClaimedFarming);
    const totalUnclaimedWei = BigInt(totalDistributed) - BigInt(totalClaimedWei);// = deposited - withdrawn.

    const totalStakers = await stakingInstance.getStakers();
    const minedHedgesCount = await hedgingInstance.settledTradesCount();
    const minersCount = await hedgingInstance.miners();
  
    // Ready ETH to USD conversion rate
    const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();

    // Decimals
    const wethDecimals = 18; const usdtDecimals = 6; const usdcDecimals = 6;
  
    // - Hedge Revenue = 5% Settlement Fee on profits
    // - Miner Fees = 15% of above, to miners settling hedges in real time manually
    // - Token Tax Revenue is Buy/Sell tax on NEON token
    // - Cashier Revenue is withdrawal charges on major base pairs; WETH, USDT, USDC
    const revenueTWETH = fromBigIntNumberToDecimal(revenueWETH, wethDecimals);
    const revenueTUSDT = fromBigIntNumberToDecimal(revenueUSDT, usdtDecimals);
    const revenueTUSDC = fromBigIntNumberToDecimal(revenueUSDC, usdcDecimals);
    const totalRevenueTUSD = (revenueTWETH * ethUsdPrice) + revenueTUSDT + revenueTUSDC;

    const cashierFeesEth = fromBigIntNumberToDecimal(cashierFeesWETH, wethDecimals);
    const cashierFeesUsdt = fromBigIntNumberToDecimal(cashierFeesUSDT, usdtDecimals);
    const cashierFeesUsdc = fromBigIntNumberToDecimal(cashierFeesUSDC, usdcDecimals);
    const cashierRevenueTUSD = (cashierFeesEth * ethUsdPrice) + cashierFeesUsdt + cashierFeesUsdc;

    const hedgeFeesEth = fromBigIntNumberToDecimal(hedgeFeesWETH, wethDecimals);
    const hedgeFeesUsdt = fromBigIntNumberToDecimal(hedgeFeesUSDT, usdtDecimals);
    const hedgeFeesUsdc = fromBigIntNumberToDecimal(hedgeFeesUSDC, usdcDecimals);
    const hedgeRevenueTUSD = (hedgeFeesEth * ethUsdPrice) + hedgeFeesUsdt + hedgeFeesUsdc;

    const tokenTaxRevenueEth = fromBigIntNumberToDecimal(tokentaxRevenue, wethDecimals);
    const tokenTaxRevenueTUSD = (tokenTaxRevenueEth * ethUsdPrice);

    const farmingFeesUSD = fromBigIntNumberToDecimal(farmingFees, wethDecimals);
    // Convert remaining
    const distributedTWETH = fromBigIntNumberToDecimal(totalDistributed, wethDecimals);
    const totalClaimedTWETH = fromBigIntNumberToDecimal(totalClaimedWei, CONSTANTS.decimals);
    const totalUnclaimedTWETH = fromBigIntNumberToDecimal(totalUnclaimedWei, wethDecimals);  
    const undistributedTWETH = tokenTaxRevenueEth - distributedTWETH;
    // Convert USD values to WETH
    const minerFeesTWETH = (hedgeRevenueTUSD * 0.05) / ethUsdPrice;
    const totalRevenueTWETH = totalRevenueTUSD / ethUsdPrice;
    const cashierRevenueTWETH = cashierRevenueTUSD / ethUsdPrice;
    const hedgeRevenueTWETH = hedgeRevenueTUSD / ethUsdPrice;
    const tokenTaxRevenueTWETH = tokenTaxRevenueTUSD / ethUsdPrice;
    const farmingFeesTWETH = farmingFeesUSD / ethUsdPrice;
    // Convert WETH values to USD
    const minerFeesTUSD = minerFeesTWETH * ethUsdPrice; 
    const distributedTUSD = distributedTWETH / ethUsdPrice;
    const undistributedTUSD = undistributedTWETH / ethUsdPrice;
    const totalClaimedTUSD = totalClaimedTWETH / ethUsdPrice;
    const totalUnclaimedTUSD = totalUnclaimedTWETH / ethUsdPrice;
    const minedHedgesTUSD = (minerFeesTUSD / 0.05) / 0.15; //reverse settlement fees & miner fees

  // Call the updateSectionValues_Earnings function to update the HTML
  updateSectionValues_Earnings(
    totalRevenueTWETH,
    totalRevenueTUSD,
    cashierRevenueTWETH,
    cashierRevenueTUSD,
    hedgeRevenueTWETH,
    hedgeRevenueTUSD,
    tokenTaxRevenueTWETH,
    tokenTaxRevenueTUSD,
    farmingFeesTWETH,
    farmingFeesUSD,
    minerFeesTWETH,
    minerFeesTUSD,
    distributedTWETH,
    distributedTUSD,
    undistributedTWETH,
    undistributedTUSD,
    totalUnclaimedTWETH,
    totalClaimedTUSD,
    totalUnclaimedTWETH,
    totalUnclaimedTUSD,
    minedHedgesCount,
    minedHedgesTUSD,
    minersCount,
    totalStakers
  );

  updateChartValues_Revenue(cashierRevenueTUSD, hedgeRevenueTUSD, tokenTaxRevenueTUSD);
  updateChartValues_Dividents(totalRevenueTUSD, distributedTUSD);
  updateChartValues_Claims(totalClaimedTUSD, totalUnclaimedTUSD);
  
}

async function setCurrent_StakedSection(){

	// Staked & circulating supply
    const totalSupplyBig = ethers.BigNumber.from(await neonInstance.totalSupply());
    const burntBalanceBig = ethers.BigNumber.from(await neonInstance.balanceOf(CONSTANTS.burnAddress));
    const circulatingSupplyRaw = totalSupplyBig.sub(burntBalanceBig);
	const totalStakedRaw = await stakingInstance.getTotalStaked();
    const totalStakersRaw = await stakingInstance.getStakers(); 
    // Assigned staked tokens
	const totalAssignedRaw = await stakingInstance.getTotalAssigned();
    const totalUnassignedRaw = await stakingInstance.getTotalUnassigned();
    // Assignement rewards
    const distributedRewards = await stakingInstance.ethRewardBasis();
	const distributedRewardsLiqu = await stakingInstance.ethLiquidityRewardBasis();
	const distributedRewardsColl = await stakingInstance.ethCollateralRewardBasis();
	// Assignment pools tokens
	const AssignedRewardsMinRaw = await stakingInstance.totalAssignedForMining();
	const AssignedRewardsColRaw = await stakingInstance.totalAssignedForCollateral();
	const AssignedRewardsLiqRaw = await stakingInstance.totalAssignedForLiquidity();
	
	// Fetch ETH to USD conversion rate
	const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();    

	// Step 1: Convert amounts
	const wethDecimals = 18; const usdtDecimals = 6; const usdcDecimals = 6;
	
	// Step 2: Convert from BN to normal values
	const totalStaked = fromBigIntNumberToDecimal(totalStakedRaw, CONSTANTS.decimals);
	const circulatingSupply = fromBigIntNumberToDecimal(circulatingSupplyRaw, CONSTANTS.decimals);
        const totalStakersString = totalStakersRaw.toString();
        const totalStakers = Number(totalStakersRaw);
    const totalAssigned = fromBigIntNumberToDecimal(totalAssignedRaw, CONSTANTS.decimals);
    const totalUnassigned = fromBigIntNumberToDecimal(totalUnassignedRaw, CONSTANTS.decimals);
    // Assignment breakdown
    const AssignedRewardsMin = fromBigIntNumberToDecimal(AssignedRewardsMinRaw, CONSTANTS.decimals);
    const AssignedRewardsCol = fromBigIntNumberToDecimal(AssignedRewardsColRaw, CONSTANTS.decimals);
    const AssignedRewardsLiq = fromBigIntNumberToDecimal(AssignedRewardsLiqRaw, CONSTANTS.decimals);
    // Get XEON token USD price: input decimal output decimal
    const tokenUsdPrice = await getTokenUSDValue(CONSTANTS.neonAddress, 1);
	
    // Step 3: Convert ETH values
    const distributedRewardsEth = fromBigIntNumberToDecimal(distributedRewards, wethDecimals);
	const distributedRewardsLiquEth = fromBigIntNumberToDecimal(distributedRewardsLiqu, wethDecimals);
	const distributedRewardsCollEth = fromBigIntNumberToDecimal(distributedRewardsColl, wethDecimals);
	const totalAssignmentsRewardsEth = distributedRewardsEth + distributedRewardsLiquEth + distributedRewardsCollEth;

	// Step 4: Convert usdt values
    const totalStakedUSDT = totalStaked * tokenUsdPrice;
    const circulatingSupplyUSDT = circulatingSupply * tokenUsdPrice;
	const totalAssignedUSDT = totalAssigned * tokenUsdPrice;
	const totalUnassignedUSDT = totalUnassigned * tokenUsdPrice;
	const totalAssignmentRewardsUSDT = totalAssignmentsRewardsEth * ethUsdPrice;
	const AssignedRewardsMinUSDT = AssignedRewardsMin * tokenUsdPrice;
	const AssignedRewardsColUSDT = AssignedRewardsCol * tokenUsdPrice;
	const AssignedRewardsLiqUSDT = AssignedRewardsLiq * tokenUsdPrice;

	updateSectionValues_Staking(
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
	);

    updateChartValues_Staking(
        totalStakedUSDT, 
        circulatingSupplyUSDT        
    );
}

async function setCurrent_TokenomicsSection() {
    //neonInstance instead of contractInst
    const symbol = await neonInstance.symbol();
    const decimals = await neonInstance.decimals();
    const contractAddress = CONSTANTS.neonAddress;
    const buyTax = await neonInstance._initialBuyTax(); 
    const sellTax = await neonInstance._initialSellTax();
    const BigIntInput = fromDecimalToBigInt(1, decimals);
    const [priceTWETH, pairedSymbol] = await getTokenETHValue(CONSTANTS.neonAddress, BigIntInput);

    const totalStakedRaw = await stakingInstance.getTotalStaked();
    const totalSupplyBig = await neonInstance.totalSupply();
    const burntBalanceBig = await neonInstance.balanceOf(CONSTANTS.burnAddress);
    const circSupply = BigInt(totalSupplyBig) - BigInt(burntBalanceBig);

    const totalSupplyRaw = await neonInstance.totalSupply(); 
    
    // Fetch ETH to USD conversion rate
    const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();

    // Convert WETH to human readable
    const circulatingSupply = fromBigIntNumberToDecimal(circSupply, decimals);
    const totalSupply = fromBigIntNumberToDecimal(totalSupplyRaw, decimals);
    const burntSupply = totalSupply - circulatingSupply;
    
    // Convert USD values to WETH
    const priceTUSD = priceTWETH * ethUsdPrice;
  
    // Call the updateSectionValues_Tokenomics function to update the HTML
    updateSectionValues_Tokenomics(
        symbol,
        decimals,
        contractAddress,
        buyTax,
        sellTax,
        priceTWETH,
        priceTUSD,
        burntSupply,
        circulatingSupply,
        totalSupply
    );

    updateChartValues_Tokenomics(burntSupply, circulatingSupply);
    
}
// Export the fetch functions
export { setCurrent_TrafficSection, setCurrent_HedgeSection, setCurrent_EarningsSection, setCurrent_StakedSection, setCurrent_TokenomicsSection };