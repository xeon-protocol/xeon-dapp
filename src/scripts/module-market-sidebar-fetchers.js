import { CONSTANTS, getCurrentEthUsdcPriceFromUniswapV2, getTokenETHValue, getTokenUSDValue, truncateAddress, getPairToken, getSymbol, fromBigIntNumberToDecimal, isValidEthereumAddress, } from './constants.js';
import { updateSectionValues_volumes, updateSectionValues_volumesERC20 } from './module-market-sidebar-updaters.js';
// Load hedge volume: created, bought, settled, payouts, fees
// Load token stats and information when searchBar contains token address
async function loadSidebar() {
  // Check if searchBar exists on the page
  const searchBar = $('#searchBar');
  
  if (searchBar.length > 0) {
      const searchInput = searchBar.val();

      // check if address exists in search bar
      if (searchInput.length >= 40 && isValidEthereumAddress(searchInput)) {
          // filter sidebar info for token
          await loadSidebarVolume_Token(searchInput);
      } else {
          // fetch all
          await loadSidebarVolume_All();
      }
  }
}

async function loadSidebarVolume_All() {
    
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

    const cashierFeesWETH = await hedgingInstance.protocolCashierFees(CONSTANTS.wethAddress);
    const cashierFeesUSDT = await hedgingInstance.protocolCashierFees(CONSTANTS.usdtAddress);
    const cashierFeesUSDC = await hedgingInstance.protocolCashierFees(CONSTANTS.usdcAddress);
  
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

    const cashierFeesEth = fromBigIntNumberToDecimal(cashierFeesWETH, wethDecimals);
    const cashierFeesUsdt = fromBigIntNumberToDecimal(cashierFeesUSDT, usdtDecimals);
    const cashierFeesUsdc = fromBigIntNumberToDecimal(cashierFeesUSDC, usdcDecimals);
    const cashierFeesTUSD = (cashierFeesEth * ethUsdPrice) + cashierFeesUsdt + cashierFeesUsdc;
  
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
    updateSectionValues_volumes(
        hedgesTradedTUSD,
        hedgesCreatedTUSD,
        swapsVolumeTUSD,
        optionsVolumeTUSD,        
        settledVolumeTUSD,
        hedgeCostsTUSD,
        hedgeProfitsTUSD,
        hedgeFeesTUSD,
        cashierFeesTUSD
    );
}

async function loadSidebarVolume_Token(tokenAddress) {
    let startIndex, limit = 10000;

    // reading direct from public mappings
    // get volume in paired value
    const pairAddress = await getPairToken(tokenAddress);
    const boughtOptions = await contract.hedgesTakenVolume(pairAddress);
    const boughtSwaps = await contract.swapsVolume(pairAddress);

    const boughtOptionsCR = await contract.methods.getAllOptionsTaken(tokenAddress, startIndex, limit).call();
    const boughtSwapsCR = await contract.methods.getAllSwapsTaken(tokenAddress, startIndex, limit).call();
    const settledOptionsCR = await contract.methods.getSettledOptionsERC20(tokenAddress, startIndex, limit).call();
    const settledSwapsCR = await contract.methods.getSettledSwapsERC20(tokenAddress, startIndex, limit).call();
    const optionsCR = await contract.methods.getOptionsForToken(tokenAddress, startIndex, limit).call();
    const swapsCR = await contract.methods.getSwapsForToken(tokenAddress, startIndex, limit).call();

    // token price in paired currency
    const [tokenPrice, pairedSymbol] = await getTokenETHValue(tokenAddress);

    // fetch more infor
    // standard ERC20 ABI
	  const erc20ABI = [
		{
		  constant: true,
		  inputs: [],
		  name: 'name',
		  outputs: [{ name: '', type: 'string' }],
		  type: 'function',
		},
		{
		  constant: true,
		  inputs: [],
		  name: 'symbol', // Add the symbol function
		  outputs: [{ name: '', type: 'string' }],
		  type: 'function',
		},
	];
	
	let tokenContract = new ethers.Contract(tokenAddress, erc20ABI, window.provider);
	let tokenName = await tokenContract.methods.name().call(); 
  
    const boughtOptionsCount = boughtOptionsCR.length;
    const boughtSwapsCount = boughtSwapsCR.length;
    const settledOptionsCount = settledOptionsCR.length;
    const settledSwapsCount = settledSwapsCR.length;
    const optionsCount = optionsCR.length;
    const swapsCount = swapsCR.length;
  
    // Call the updateSectionValues_hedges function
    updateSectionValues_volumesERC20(
        tokenAddress,
        tokenName,
        tokenPrice,
        pairedSymbol,
        boughtOptionsCount,
        boughtSwapsCount,
        settledOptionsCount,
        settledSwapsCount,
        optionsCount,
        swapsCount
    );
  }

  // Function to fetch the past events: 
  // hedgeCreated, hedgePurchased, hedgeSettled, minedHedge  
  async function loadPastEvents() {

    // Show loading animation
    const pastEventsContainer = $('#scifiUI');
	  pastEventsContainer.empty();
	  pastEventsContainer.append('<i class="loading"></i>');
    
    const fromBlock = 0;
    const toBlock = "latest";
  
    const filter_hedgeCreated = await hedgingInstance.filters.hedgeCreated();
    const filter_hedgePurchased = await hedgingInstance.filters.hedgePurchased();
    const filter_hedgeSettled = await hedgingInstance.filters.hedgeSettled();
    const filter_minedHedge = await hedgingInstance.filters.minedHedge();
  
    // Set fromBlock and toBlock for filters
    filter_hedgeCreated.fromBlock = fromBlock;
    filter_hedgeCreated.toBlock = toBlock;
  
    filter_hedgePurchased.fromBlock = fromBlock;
    filter_hedgePurchased.toBlock = toBlock;
  
    filter_hedgeSettled.fromBlock = fromBlock;
    filter_hedgeSettled.toBlock = toBlock;
  
    filter_minedHedge.fromBlock = fromBlock;
    filter_minedHedge.toBlock = toBlock;
  
    try {
        const events_hedgeCreated = await hedgingInstance.queryFilter(filter_hedgeCreated);
        const events_hedgePurchased = await hedgingInstance.queryFilter(filter_hedgePurchased);
        const events_hedgeSettled = await hedgingInstance.queryFilter(filter_hedgeSettled);
        const events_minedHedge = await hedgingInstance.queryFilter(filter_minedHedge);
        
        // Process the events as needed
        events_hedgeCreated.slice(0, 100).forEach((event) => {
            prepareEventListItem(event, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
        });
  
        events_hedgePurchased.slice(0, 100).forEach((event) => {
            prepareEventListItem(event, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
        });
  
        events_hedgeSettled.slice(0, 100).forEach((event) => {
            prepareEventListItem(event, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
        });
  
        events_minedHedge.slice(0, 100).forEach((event) => {
            prepareEventListItem(event, "0x123456789abcdef");
        });

        if(events_hedgeCreated.length === 0 && events_hedgePurchased.length === 0 && events_hedgeSettled.length === 0 && events_minedHedge.length === 0) {
            // empty results output
            $('#scifiUI').empty().append('<div class="no-hedges-message sl_refresh">No Events Found. Write or Buy OTC hedges to populate this area...</span>');
        }
  
    } catch (error) {
      console.error('Error fetching past events:', error);
      // Handle the error or display an error message
    }

    // Hide animation
    pastEventsContainer.find('.loading').remove();
}

async function decodeEvent(event, hedgingInstance) {
  // Decode the event using ethers.js
  const parsedLog = await hedgingInstance.interface.parseLog(event);

  // Access the decoded values
  const decodedValues = parsedLog.values;

  return decodedValues;
}
// Accepts Object & eventTopic
// Objects from past events and live events
// Live events use custom object: {returnedValues: {optionId, user, token, paired, event: event}, past events: {event: event, event:data, event:topics}}
async function prepareEventListItem(event, eventTopic) {
  //console.log(`Preparing event list item: ${event}, ${eventTopic}`);

	// Display the events in the sidebar div
	const sidebarDiv = document.getElementById('scifiUI');
  if (sidebarDiv === null) { return; }
  
	// Create the list item
	const listItem = document.createElement('li');

	// Event title
	const titleSpan = document.createElement('span');
	titleSpan.textContent = event.event || ''; // Check if event.event is present
	titleSpan.title = 'Event Topic: ' + eventTopic;
	listItem.appendChild(titleSpan);

	let decodedValues;
	if (event.returnValues) {
    //console.log('returnValues: ', event.returnValues);
		// Use returnValues directly if available
		decodedValues = event.returnValues;
	} else {
		// Decode event data using ABI
		decodedValues = await hedgingInstance.interface.decodeEventLog(
			event.event,
			event.data,
			event.topics
		);
	}
  
  //console.log('decodedValues: ', decodedValues);

	// Prep dependencies
	const pairToken = await getPairToken(decodedValues.token); // returns array
	const pairedCurrency = pairToken[1];
	const pairTokenSymbol = await getSymbol(pairedCurrency);
	let tokenDecimals;
	if (pairedCurrency == CONSTANTS.wethAddress) {
		tokenDecimals = 18;
	} else if (pairedCurrency == CONSTANTS.usdtAddress || pairedCurrency == CONSTANTS.usdcAddress) {
		tokenDecimals = 6;
	}
	const optionId = decodedValues.optionId._hex; // Access _hex property if available
	const optionIdDecimal = optionId ? parseInt(optionId, 16).toString() : 0; // Convert hex to decimal if available

	// Convert amounts and values
	const amountSpan = document.createElement('span');
	amountSpan.title = 'Hover for details';

	switch (event.event) {
		case 'hedgeCreated':
			const createValueHex = decodedValues.createValue._hex;
			const createValueDecimal = fromBigIntNumberToDecimal(createValueHex, tokenDecimals);
			amountSpan.textContent = createValueDecimal + ' ' + pairTokenSymbol;
			amountSpan.title = 'Create Value: ' + createValueDecimal + ' ' + pairTokenSymbol;
			break;
		case 'hedgePurchased':
			const payOffHex = decodedValues.startValue._hex;
			const payOffDecimal = fromBigIntNumberToDecimal(payOffHex, tokenDecimals);
			amountSpan.textContent = payOffDecimal + ' ' + pairTokenSymbol;
			amountSpan.title = 'Pay Off: ' + payOffDecimal + ' ' + pairTokenSymbol;
			break;
		case 'hedgeSettled':
			const endValueHex = decodedValues.endValue._hex;
			const endValueDecimal = fromBigIntNumberToDecimal(endValueHex, tokenDecimals);
			amountSpan.textContent = endValueDecimal + ' ' + pairTokenSymbol;
			amountSpan.title = 'End Value: ' + endValueDecimal + ' ' + pairTokenSymbol;
			break;
		case 'minedHedge':
			const minedPayOffHex = decodedValues.payOff._hex;
			const minedPayOffDecimal = fromBigIntNumberToDecimal(minedPayOffHex, tokenDecimals);
			amountSpan.textContent = minedPayOffDecimal + ' ' + pairTokenSymbol;
			amountSpan.title = 'Pay Off: ' + minedPayOffDecimal + ' ' + pairTokenSymbol;
			break;
		default:
			break;
	}

	listItem.appendChild(amountSpan);

	/* Dealer
  const dealerSpan = document.createElement('span');
  const dealerAddress = decodedValues.writer || decodedValues.buyer || decodedValues.miner;
  dealerSpan.textContent = truncateAddress(dealerAddress);
  dealerSpan.title = 'ERC20 Asset';
  listItem.appendChild(dealerSpan);
  */

	// Link
	const txSpan = document.createElement('span');
	const link = document.createElement('a');
	link.href = 'https://sepolia.etherscan.io/tx/' + event.transactionHash;
	link.textContent = 'Transaction';
	link.target = '_blank'; // Add this line to set the target attribute
	txSpan.appendChild(link);
	txSpan.title = 'Transaction Link';
	listItem.appendChild(txSpan);

	// Add list item to the top of the sidebar
  sidebarDiv.insertBefore(listItem, sidebarDiv.firstChild);

}


export { loadSidebar, loadSidebarVolume_All, loadSidebarVolume_Token, loadPastEvents, prepareEventListItem }