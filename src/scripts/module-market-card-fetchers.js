import { MyGlobals } from './_silkroad_globals.js';
import { CONSTANTS, getAccounts, getUserBalancesForToken, truncateAddress, commaNumbering, cardCommaFormat, fromWeiToFixed5, getTokenDecimals, getTokenDecimalSymbolName, isValidEthereumAddress, fromDecimalToBigInt, fromBigIntNumberToDecimal } from './constants.js';
import { purchaseInterface, toggleBookmark } from './module-silkroad-writer.js';

async function refreshDataOnElements() {
	// Fetch data for all items in MyGlobals.outputArray concurrently
	const promises = MyGlobals.outputArray.map(async (optionId) => {
		console.log('refreshing data for hedge: ' + optionId);
		let result = await hedgingInstance.getHedgeDetails(optionId);
		// token address
		let tokenAddress = result.token;
		let tokenPairAddress = result.paired;
		// Convert timestamp to human-readable dates
		let dt_created = new Date(result.dt_created * 1000).toLocaleString();
		let dt_started = new Date(result.dt_started * 1000).toLocaleString();
		let dt_expiry = new Date(result.dt_expiry * 1000).toLocaleString();

		// Calculate time left for dt_expiry
		let timeNow = new Date().getTime();
		let timeDiff = result.dt_expiry * 1000 - timeNow;
		let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

		// Assign the data to HTML elements using element IDs
		$(`#${optionId}owner`).text(result.owner);
		$(`#${optionId}taker`).text(result.taker);
		// ... (assign other data to HTML elements here)
		$(`#${optionId}dt_created`).text(dt_created);
		$(`#${optionId}dt_started`).text(dt_started);
		$(`#${optionId}dt_expiry`).text(dt_expiry);
		$(`#${optionId}time_left`).text(`${days}d ${hours}h ${minutes}m`);

		// Values 
		//..if option available then show market & current strike price
		//..if option is taken then show start and market price
		const element = $(`#${optionId}buyButton`);

		//market value current
		const [marketvalueCurrent, pairedAddress] = await hedgingInstance.getUnderlyingValue(tokenAddress, result.amount);
		const pairedAddressDecimal = await getTokenDecimals(tokenPairAddress);
		const marketvalue = fromBigIntNumberToDecimal(marketvalueCurrent, pairedAddressDecimal);

		
		let startvalue, endvalue, cost, strikevalue;
		//start value in BN - before fromBigIntNumberToDecimal conversion
		let startValueBN = ethers.BigNumber.from(result.startValue);
		let endValueBN = ethers.BigNumber.from(result.endValue);
		let costBN = ethers.BigNumber.from(result.cost);
		let marketvalueBN = ethers.BigNumber.from(marketvalueCurrent);

		//start value, based on token decimals
		if (tokenPairAddress === CONSTANTS.usdtAddress || tokenPairAddress === CONSTANTS.usdcAddress) { //USDT or USDC
			startvalue = fromBigIntNumberToDecimal(startValueBN, 6);
			endvalue = fromBigIntNumberToDecimal(endValueBN, 6);
			cost = fromBigIntNumberToDecimal(costBN, 6);
		} else if (tokenPairAddress === CONSTANTS.wethAddress) { //WETH
			startvalue = fromBigIntNumberToDecimal(startValueBN, 18);
			endvalue = fromBigIntNumberToDecimal(endValueBN, 18);
			cost = fromBigIntNumberToDecimal(costBN, 18);
		}

		let profit;
		if (result.hedgeType === 0) {
			profit = marketvalueBN - (startValueBN + costBN);
		} else if (result.hedgeType === 1) {
			profit = (startValueBN + costBN) - marketvalueBN;
		} else if (result.hedgeType === 2) {
			profit = marketvalueBN - (startValueBN + costBN);
		} else {
			console.log('Hedge type is unknown');
		}
		
		let borderColor = '';
		let boxShadowColor = '';
		let textColor = '';
		let backgroundImage = '';
		let newText = '';

		if (result.status === 2) {
			const neonGlow = Math.round(profit / 10); // Adjust neon glow proportionally
			borderColor = marketvalueBN >= startValueBN + costBN ? '#00ff00' : '#ff0000';
			boxShadowColor = borderColor;
			textColor = borderColor;
			backgroundImage = marketvalueBN >= startValueBN + costBN ? `url(${MyGlobals.profitBg})` : `url(${MyGlobals.lossBg})`;
			newText = profit >= 0 ? `+${profit}` : `-${profit}`; // Add "+" sign for positive profit, remove for negative profit
			element.css({
				'background-image': backgroundImage,
				'background-repeat': 'no-repeat',
				'background-position': 'left center',
				'padding-left': '20px',
				'border': `0.5px solid ${borderColor}`, // Update border thickness
				'box-shadow': `0 0 ${neonGlow}px ${boxShadowColor}, 0 0 ${neonGlow * 4}px ${boxShadowColor}, 0 0 ${neonGlow * 6}px ${boxShadowColor}`, // Update neon glow
				'color': textColor
			});

			element.text(newText); // Set the new text 
		}
	});
	await Promise.all(promises); // wait for all promises to resolve
}

/*=========================================================================
	LOAD OPTION CARDS BASED ON TIMELINE FILTERS
==========================================================================*/
//consider fetching from index X - Y i.e. 30 max each load
//will load from last index only to a certain limit

async function loadOptions(){

	const accounts = await getAccounts();
    const userAddress = accounts[0];

	// Show loading animation on timeline
	const timelineContainer = $('#hedgesTimeline');
	timelineContainer.empty();
	timelineContainer.append('<i class="loading"></i>');

	// 1. ALL OPTIONS
	if (window.nav === 1 && window.filters === 1) { // Get vacant call options, exclude taken
		// Filter by token address
		let filterAddress = $('#searchBar').val();
		if(window.nav == 1 && window.filters == 4 && filterAddress.length >= 40 && isValidEthereumAddress(filterAddress) == true){//filter by token address
			if (MyGlobals.lastItemIndex !== 0) {
				if (window.readLimit + 1 > MyGlobals.lastItemIndex) {
					window.readLimit = MyGlobals.lastItemIndex - 1;
				}
				MyGlobals.startIndex = MyGlobals.lastItemIndex - 1 - window.readLimit;
			} else { // Start from the latest item in the array, our solidity reads incrementally so subtract window.readLimit -1 point to pick correct starting point for reads
				let allHedgesLength = await hedgingInstance.getCountTokenOptions(filterAddress);
				MyGlobals.startIndex = allHedgesLength - 1 - window.readLimit;
				if(MyGlobals.startIndex < 0){MyGlobals.startIndex = 0;}
			}
				
			let optionsArray = await hedgingInstance.getOptionsForToken(filterAddress, MyGlobals.startIndex, window.readLimit);

			if (optionsArray.length > 0) {
				$('#hedgesTimeline').empty();		
				// Update MyGlobals.outputArray directly
				MyGlobals.outputArray.push(...optionsArray);		
				for (const hedgeID of optionsArray) {
					await fetchOptionCard(hedgeID);
				}		
				// Update last result index
				MyGlobals.lastItemIndex = MyGlobals.startIndex;
			} else {
				noOptionsSwal();
			}
		}
		else { // UNFILTERED FETCH ALL OPTIONS - EXCLUDE TAKEN
			if (MyGlobals.lastItemIndex !== 0) {
				if (window.readLimit + 1 > MyGlobals.lastItemIndex) {
				  window.readLimit = MyGlobals.lastItemIndex - 1;
				}
				MyGlobals.startIndex = MyGlobals.lastItemIndex - window.readLimit - 1;
			} else { // Start from the latest item in the array, our solidity reads incrementally so subtract window.readLimit -1 point to pick correct starting point for reads
				let optionsCreatedLength = await hedgingInstance.optionsCreatedLength();
				MyGlobals.startIndex = optionsCreatedLength - window.readLimit - 1;
				if(MyGlobals.startIndex < 0){MyGlobals.startIndex = 0;}
			}
			
			let optionsArray = await hedgingInstance.getAllOptions(MyGlobals.startIndex, window.readLimit);
			let takenArray = await hedgingInstance.getAllOptionsTaken(MyGlobals.startIndex, 1000);
			
			// Use filter() method to get vacant options
			let vacantOptionsArray = optionsArray.filter(hedgeID => !takenArray.includes(hedgeID));
			
			if (vacantOptionsArray.length > 0) {
				$('#hedgesTimeline').empty();
			
				// Update MyGlobals.outputArray directly
				MyGlobals.outputArray.push(...vacantOptionsArray);
			
				for (const hedgeID of vacantOptionsArray) {
				  await fetchOptionCard(hedgeID);
				}
			
				// Update last result index
				MyGlobals.lastItemIndex = MyGlobals.startIndex;
			} else {
				noOptionsSwal();
			}
		}
	}
	  
	//ALL OPTIONS, MY POSITIONS
	if (window.nav === 1 && window.filters === 2) { // Get my positions; mix of taken and created
		if (MyGlobals.lastItemIndex !== 0) {
			if (window.readLimit + 1 > MyGlobals.lastItemIndex) {
				window.readLimit = MyGlobals.lastItemIndex - 1;
			}
			MyGlobals.startIndex = MyGlobals.lastItemIndex - 1 - window.readLimit;
		} else {
			
			//deprecating this until we add a dedicated array fetcher in Vault, might not be needed - 12 April 2024
			// needs a array lenght helper function that accepts address only
			/*
			let myhedgesCreatedArray = await hedgingInstance.myoptionsCreated(userAddress);
			let myhedgesCreatedLength = myhedgesCreatedArray.length;
			let myhedgesTakenArray = await hedgingInstance.myoptionsTaken(userAddress);
			let myhedgesTakenLength = myhedgesTakenArray.length;
		
			MyGlobals.startIndex = parseInt(Math.max(myhedgesCreatedLength, myhedgesTakenLength) - 1 - window.readLimit);
			if(MyGlobals.startIndex <= 0){MyGlobals.startIndex = 0;}
			*/
			MyGlobals.startIndex = 0;
		}
		
		// Fetch both created and taken options for use in combined array
		let optionsCreatedArray = await hedgingInstance.getUserOptionsCreated(userAddress, MyGlobals.startIndex, window.readLimit);
		let optionsTakenArray = await hedgingInstance.getUserOptionsTaken(userAddress, MyGlobals.startIndex, window.readLimit);
		
		// Combine and sort the arrays
		let allOptionsArray = [...optionsCreatedArray, ...optionsTakenArray].sort((a, b) => a - b);
		
		// Output
		if (allOptionsArray.length > 0) {
			$('#hedgesTimeline').empty();
		
			// Update MyGlobals.outputArray directly
			MyGlobals.outputArray.push(...allOptionsArray);
		
			for (const hedgeID of allOptionsArray) {
				await fetchOptionCard(hedgeID);
			}
		
			// Update last result index
			MyGlobals.lastItemIndex = MyGlobals.startIndex;
		} else {
			noOptionsSwal();
		}
	}
	

	//BOOKMARKED HEDGES
	if(window.nav === 1 && window.filters === 3){//get my bookmarks
		let optionsArray = await hedgingInstance.getmyBookmarks(userAddress);
		if(optionsArray.length > 0){
			$('#hedgesTimeline').empty();
			// Update MyGlobals.outputArray directly
			MyGlobals.outputArray.push(...optionsArray);

			//for each element in array
			let array = optionsArray;
			for (const hedgeID of array){
				await fetchOptionCard(hedgeID);
			}
		}else {//no hedges
			noOptionsSwal();
		}
	}


	/*===================================================================================================

	====================================================================================================*/
	//EQUITY SWAPS
	if (window.nav === 2 && window.filters === 1) { // Get vacant equity swaps, exclude taken

		//FILTER BY TOKEN ADDRESS
		let filterAddress2 = $('#searchBar').val();
		if(window.nav == 1 && window.filters == 4 && filterAddress2.length >= 40 && isValidEthereumAddress(filterAddress2) == true){//filter by token address
			if (MyGlobals.lastItemIndex !== 0) {
				if (window.readLimit + 1 > MyGlobals.lastItemIndex) {
					window.readLimit = MyGlobals.lastItemIndex - 1;
				}
				MyGlobals.startIndex = MyGlobals.lastItemIndex - 1 - window.readLimit;
			} else { // Start from the latest item in the array, our solidity reads incrementally so subtract window.readLimit -1 point to pick correct starting point for reads
				let allSwapsLength = await hedgingInstance.getSwapsForTokenCount(filterAddress2);
				MyGlobals.startIndex = allSwapsLength - 1 - window.readLimit;
			}
				
			let optionsArray = await hedgingInstance.getSwapsForToken(filterAddress2, MyGlobals.startIndex, window.readLimit);

			if (optionsArray.length > 0) {
				$('#hedgesTimeline').empty();		
				// Update MyGlobals.outputArray directly
				MyGlobals.outputArray.push(...optionsArray);		
				for (const hedgeID of optionsArray) {
					await fetchOptionCard(hedgeID);
				}		
				// Update last result index
				MyGlobals.lastItemIndex = MyGlobals.startIndex;
			} else {
				noOptionsSwal();
			}
		}// UNFILTERED - FETCH ALL SWAPS - EXCLUDE TAKEN
		else {
			if (MyGlobals.lastItemIndex !== 0) {
				if (window.readLimit + 1 > MyGlobals.lastItemIndex) {
				  window.readLimit = MyGlobals.lastItemIndex - 1;
				}
				MyGlobals.startIndex = MyGlobals.lastItemIndex - window.readLimit - 1;
			} else { // Start from the latest item in the array, our solidity reads incrementally so subtract window.readLimit -1 point to pick correct starting point for reads
				let allSwapsLength = await hedgingInstance.equityswapsCreatedLength();
				MyGlobals.startIndex = allSwapsLength - window.readLimit - 1;
				if(MyGlobals.startIndex < 0){MyGlobals.startIndex = 0;}
			}
			
			let optionsArray = await hedgingInstance.getAllSwaps(MyGlobals.startIndex, window.readLimit);
			let takenArray = await hedgingInstance.getAllSwapsTaken(MyGlobals.startIndex, 1000);
			
			// Use filter() method to get vacant swaps
			let vacantOptionsArray = optionsArray.filter(hedgeID => !takenArray.includes(hedgeID));
			
			if (vacantOptionsArray.length > 0) {
				$('#hedgesTimeline').empty();
			
				// Update MyGlobals.outputArray directly
				MyGlobals.outputArray.push(...vacantOptionsArray);
			
				for (const hedgeID of vacantOptionsArray) {
				  await fetchOptionCard(hedgeID);
				}
			
				// Update last result index
				MyGlobals.lastItemIndex = MyGlobals.startIndex;
			} else {
				noOptionsSwal();
			}
		}
	}
	//EQUITY SWAPS, MY POSITIONS
	if (window.nav === 2 && window.filters === 2) { // Get my positions; mix of taken and created
		if (MyGlobals.lastItemIndex !== 0) {
			if (window.readLimit + 1 > MyGlobals.lastItemIndex) {
				window.readLimit = MyGlobals.lastItemIndex - 1;
			}
			MyGlobals.startIndex = MyGlobals.lastItemIndex - 1 - window.readLimit;
		} else {
			//deprecating this until we add a dedicated array fetcher in Vault, might not be needed - 12 April 2024
			// needs a array lenght helper function that accepts address only
			/*
			let myhedgesCreatedArray = await hedgingInstance.myswapsCreated(userAddress);
			let myhedgesCreatedLength = myhedgesCreatedArray.length;
			let myhedgesTakenArray = await hedgingInstance.myswapsTaken(userAddress);
			let myhedgesTakenLength = myhedgesTakenArray.length;
		
			MyGlobals.startIndex = parseInt(Math.max(myhedgesCreatedLength, myhedgesTakenLength) - 1 - window.readLimit);
			if(MyGlobals.startIndex <= 0){MyGlobals.startIndex = 0;}
			*/
			MyGlobals.startIndex = 0;
		}
		
		// Fetch both created and taken swaps
		let combinedArray = 0;
		try {
			let swapsCreatedArray = await hedgingInstance.getUserSwapsCreated(userAddress, MyGlobals.startIndex, window.readLimit);
			let swapsTakenArray = await hedgingInstance.getUserSwapsTaken(userAddress, MyGlobals.startIndex, window.readLimit);
			
			// Combine and sort the arrays
			let allSwapsArray = [...swapsCreatedArray, ...swapsTakenArray].sort((a, b) => a - b);
			
			// Combine both types of swaps
			//let combinedArray = [...allOptionsArray, ...allSwapsArray]; if we need both
			combinedArray = allSwapsArray;
		} catch (error) {
			noOptionsSwal();
		}		
		
		if (combinedArray.length > 0) {
			$('#hedgesTimeline').empty();
		
			// Update MyGlobals.outputArray directly
			MyGlobals.outputArray.push(...combinedArray);
		
			for (const hedgeID of combinedArray) {
				await fetchOptionCard(hedgeID);
			}
		
			// Update last result index
			MyGlobals.lastItemIndex = MyGlobals.startIndex;
		} else {
			noOptionsSwal();
		}		
	}
	//BOOKMARKED EQUITY SWAPS
	if(window.nav === 2 && window.filters === 3){//get my bookmarks
		let optionsArray = await hedgingInstance.getmyBookmarks(userAddress);
		if(optionsArray.length > 0){
			$('#hedgesTimeline').empty();
			// Update MyGlobals.outputArray directly
			MyGlobals.outputArray.push(...optionsArray);

			//for each element in array
			let array = optionsArray;
			for (const hedgeID of array){
				await fetchOptionCard(hedgeID);
			}
		}else {//no hedges
			noOptionsSwal();
		}
	}
	/*===================================================================================================

	====================================================================================================*/
	// ERC20 LOANS
	if (window.nav === 3 && window.filters === 1) { // Get vacant loans, exclude taken
		comingSoonSwal();		
	}
	// ERC20 LOANS, MY POSITIONS
	if (window.nav === 3 && window.filters === 2) { // Get my positions; mix of taken and created
		comingSoonSwal();	
	}
	//BOOKMARKED EQUITY SWAPS
	if(window.nav === 3 && window.filters === 3){//get my bookmarks
		comingSoonSwal();
	}
	
	//SOCIAL TWITTER FEED #neonhedge
	

	// Hide loading animation on timeline
	timelineContainer.find('.loading').remove();

	// Button Listeners: buyButton
	document.querySelectorAll('.buyButton').forEach(button => {
		button.addEventListener('click', function() {
			// retrieve the optionId from the data-optionid attribute
			const optionId = this.dataset.optionid;
			purchaseInterface(optionId);
		});
	});
	// Bookmark button
	document.querySelectorAll('._bookmarkjump').forEach(button => {
		button.addEventListener('click', function() {
			// retrieve the optionId from the data-optionid attribute
			const optionId = parseInt(this.dataset.optionid);
			toggleBookmark(optionId);
		});
	});
}

async function fetchOptionCard(optionId){

	const accounts = await getAccounts();
    const userAddress = accounts[0];

    try{
		let result = await hedgingInstance.getHedgeDetails(optionId);
		//name and symbol
		let name, decimals, symbol;
		[name, decimals, symbol] = await getTokenDecimalSymbolName(result.token);
		//token & pair address
		let tokenAddress = result.token;
		let truncatedTokenAdd = truncateAddress(tokenAddress);
		let tokenPairAddress = result.paired;
		let truncatedPairAdd = truncateAddress(tokenPairAddress);
		//owner
		let owner = result.owner;
        let truncatedOwner = truncateAddress(owner);
		//taker
		let taker = result.taker;
        let truncatedTaker = truncateAddress(taker);
		//hedge status
		let status = parseFloat(result.status);
		
		//amount
		let amountRaw = fromBigIntNumberToDecimal(result.amount, decimals);
		let amount = cardCommaFormat(amountRaw);		

		//hedge type
		let hedgeType;
		if (result.hedgeType === 0) {
			hedgeType = 'CALL';
		} else if (result.hedgeType === 1) {
			hedgeType = 'PUT';
		} else if (result.hedgeType === 2) {
			hedgeType = 'SWAP';
		} else {
			console.log('Hedge type is unknown');
		}

		//paired symbol
		let pairSymbol;
		if (tokenPairAddress === CONSTANTS.usdtAddress) {
			pairSymbol = 'USDT';
		} else if (tokenPairAddress === CONSTANTS.usdcAddress) {
			pairSymbol = 'USDC';
		} else if (tokenPairAddress === CONSTANTS.wethAddress) {
			pairSymbol = 'WETH';
		}
		
		//market value current
		const [marketvalueCurrent, pairedAddress] = await hedgingInstance.getUnderlyingValue(tokenAddress, result.amount);
		const pairedAddressDecimal = await getTokenDecimals(tokenPairAddress);
		const marketvalue = fromBigIntNumberToDecimal(marketvalueCurrent, pairedAddressDecimal);

		let startvalue, endvalue, cost, strikevalue;
		//start value in BN - before fromBigIntNumberToDecimal conversion
		let startValueBN = ethers.BigNumber.from(result.startValue);
		let endValueBN = ethers.BigNumber.from(result.endValue);
		let costBN = ethers.BigNumber.from(result.cost);
		//start value, based on token decimals
		if (tokenPairAddress === CONSTANTS.usdtAddress || tokenPairAddress === CONSTANTS.usdcAddress) { //USDT or USDC
			startvalue = fromBigIntNumberToDecimal(startValueBN, 6);
			endvalue = fromBigIntNumberToDecimal(endValueBN, 6);
			cost = fromBigIntNumberToDecimal(costBN, 6);
		} else if (tokenPairAddress === CONSTANTS.wethAddress) { //WETH
			startvalue = fromBigIntNumberToDecimal(startValueBN, 18);
			endvalue = fromBigIntNumberToDecimal(endValueBN, 18);
			cost = fromBigIntNumberToDecimal(costBN, 18);
		}
		//strike value
		if(startvalue>0){
			strikevalue = cost + startvalue;
		}else{
			strikevalue = cost + marketvalue;
		}

		//format outputs
		let marketvalueFormatted = cardCommaFormat(marketvalue);
		let startvalueFormatted = cardCommaFormat(startvalue);
		let endvalueFormatted = cardCommaFormat(endvalue);
		let costFormatted = cardCommaFormat(cost);
		let strikevalueFormatted = cardCommaFormat(strikevalue);
		
		//logourl
		let logourl = result.logourl;
		//dates to human-readable dates
		let dt_created = new Date(result.dt_created * 1000).toLocaleString();
		let dt_started = new Date(result.dt_started * 1000).toLocaleString();
		let dt_expiry = new Date(result.dt_expiry * 1000).toLocaleString();
		// Calculate time left for dt_expiry
		// Calculate time left for dt_expiry
		let timeNow = new Date().getTime();
		let timeDiff = result.dt_expiry * 1000 - timeNow;
		let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
		let timeToExpiry = days + "d " + hours + "h " + minutes + "m ";

		//strategy description for the option
		let strategyWidget, description, typeClass, typeClassValue, buttonText, priceText = 'Strike', costText = 'Premium';
		if(hedgeType == 'CALL') {
			typeClass = 'aType-call-option';
			description = `on ${timeToExpiry}\nTaker will be in profit when market price is ABOVE strike price. Market - Strike = Profit Margin. \nTaker's max loss is ${costFormatted}${pairSymbol} if market price is ABOVE strike price.`;
			strategyWidget = `
			<div class="strategyHold" title="`+description+`">
				<img class="strategyImage" src="./imgs/call-option.svg" />
				<div class="strategyDataHold">
					<div class="topValue-call">profit zone</div>
					<div class="bottomValue-call">max loss `+costFormatted+` `+pairSymbol+`</div>
				</div>
			</div>`;
			buttonText = 'Buy Option';
		}
		if(hedgeType == 'PUT') {
			typeClass = 'aType-put-option';
			description = `on ${timeToExpiry}\nTaker is in profit when market price is BELOW strike price. Strike - Market = Profit Margin. \nTakers max loss is ${costFormatted}${pairSymbol} if market price is ABOVE strike price.`;
			strategyWidget = `
			<div class="strategyHold" title="`+description+`">
				<img class="strategyImage" src="./imgs/put-option.svg" />
				<div class="strategyDataHold">
					<div class="topValue-put">max loss `+costFormatted+` `+pairSymbol+`</div>
					<div class="bottomValue-put">profit zone</div>
				</div>
			</div>`;
			buttonText = 'Buy Option';
		}
		if(hedgeType == 'SWAP') {
			typeClass = 'aType-swap-option';
			//typeClassValue = 'style="background: none !important;"';
			description = `Taker is in profit when price is above the start price. Writer is in proportional loss. If writer profit is more than Taker collateral then all of the Takers collateral is liquidated as max loss.`;
			strategyWidget = `
			<div class="strategyHold" title="`+description+`">
				<img class="strategyImage" src="./imgs/equityswap.svg" />
				<div class="strategyDataHold">
					<div class="topValue-swap">profit zone</div>
					<div class="bottomValue-swap">loss zone</div>
				</div>
			</div>`;
			buttonText = 'Take Swap';
			priceText = 'Start Price';
			costText = 'Swap Cost';
		}
		//option action button: buy, running/settle, expired
		let action_btn, activity_btn;
		if(status == 1){
			action_btn = "<div id='"+optionId+"buyButton' class='option_S_tab actionButton buyButton' data-optionid="+optionId+">"+buttonText+"</div>";
			activity_btn = `
			<div class="option_S_tab _bullbear">
				<span class="status-dot inprogress"><svg stroke="currentColor" fill="#188dd6" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"></circle></svg><span style="white-space: nowrap;">Vacant</span></span>
			</div>`;
		}
		if(status == 2){
			action_btn = "<div id='"+optionId+"buyButton' class='option_S_tab actionButton activeButton'>Active</div>";
			activity_btn = `
			<div class="option_S_tab _bullbear">
				<span class="status-dot inprogress"><svg stroke="currentColor" fill="#089353" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"></circle></svg><span style="white-space: nowrap;">Running</span></span>
			</div>`;
		}
		if(status == 3){
			action_btn = "<div id='"+optionId+"buyButton' class='option_S_tab actionButton expiredButton'  onclick='settleInterface(" + optionId + ")'>Settle</div>";
			activity_btn = `
			<div class="option_S_tab _bullbear">
				<span class="status-dot ended"><svg stroke="currentColor" fill="orange" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"></circle></svg><span style="white-space: nowrap;">Expired</span></span>
			</div>`;
		}
		if(owner == userAddress){
			action_btn = "<div id='"+optionId+"buyButton' class='option_S_tab actionButton expiredButton'>"+truncatedOwner+"</div>";
			activity_btn = `
			<div class="option_S_tab _bullbear">
				<span class="status-dot ended"><svg stroke="currentColor" fill="orange" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8"></circle></svg><span style="white-space: nowrap;">Yours</span></span>
			</div>`;
		}
		
		//bookmark check
		var bookmarkState = await hedgingInstance.getBookmark(userAddress, optionId);
		if(!bookmarkState){
			var bookmark_btn = "<div class='raise_S_tab _bookmarkjump'  data-optionid="+optionId+"><img src='./imgs/bookmark_.png' width='18px'/></div>";
		}
		if(bookmarkState){
			var bookmark_btn = "<div class='raise_S_tab _bookmarkjump'  data-optionid="+optionId+"><img src='./imgs/unbookmark_.png' width='18px'/></div>";
		}
		
		var projectCard = `
		<div class="tl_hedgeCard statemark_ill_wish" id="`+optionId+`">				
					<div class="tl_hedgeGrid">
						<div class="projectLogo" style="background-image:url('./imgs/erc20-uniswap-tr.png')"></div>
						<div class="projectName">
							<div>`+name+`<a class="blockexplorer" href="https://sepolia.etherscan.io/address/`+tokenAddress+`" target="_blank" alt="SC" title="Go to Etherscan">`+truncatedTokenAdd+`</a></div>
							<div class="tl_bagsize">`+amount+` `+symbol+`</div>
						</div>
					</div>
					
					<div class="valueHold">
						<div class="assetsValue">
							<div class="valueTitle"></div>
							<div class="assetsMarketValue highlightOption">`+marketvalueFormatted+` `+pairSymbol+`</div>
						</div>
						<div class="assetsType `+typeClass+`">
							<div class="typeTitle">HEDGE</div>
							<div class="assetsTypeValue highlightOption `+typeClassValue+`">`+hedgeType+`</div>
						</div>
					</div>
					
					<div class="strategyContainer">
						<div class="optionMarksHold">
							<div class="optionMark"><span>`+priceText+`:</span><span class="oMfigure">`+strikevalueFormatted+` `+pairSymbol+`</span></div>
							<div class="optionMark"><span>`+costText+`:</span><span class="oMfigure">`+costFormatted+` `+pairSymbol+`</span></div>
							<div class="optionMark"><span>Expires:</span><span class="oMfigure">`+timeToExpiry+`</span></div>
						</div>
						`+strategyWidget+`
					</div>
					<div class="optionSummary">
						`+activity_btn+`
						`+action_btn+`
						<div class="option_S_tab _bookmarkjump">
							<a class="view_project" href="hedge.html?id=`+optionId+`" target="_blank" alt="View" title="full details">view</a>
							`+bookmark_btn+`
						</div>
					</div>
				</div>`;
		
		//add to timeline, with smooth transition
		$('#hedgesTimeline').prepend(projectCard);
		$("#interfaceWindow" + optionId).slideDown(1000);
		
	}catch(error) {
		console.log(error);
	}
}

async function fetchOptionStrip(optionId) {
    try{
		let result = await hedgingInstance.getHedgeDetails(optionId);
		//name and symbol
		let name, decimals, symbol;
		[name, decimals, symbol] = await getTokenDecimalSymbolName(hedgeResult.token);
		//token & pair address
		let tokenAddress = result.token;
		let truncatedTokenAdd = truncateAddress(tokenAddress);
		let tokenPairAddress = result.paired;
		let truncatedPairAdd = truncateAddress(tokenPairAddress);
		//owner
		let owner = result.owner;
        let truncatedOwner = truncateAddress(owner);
		//taker
		let taker = result.taker;
        let truncatedTaker = truncateAddress(taker);
		//hedge status
		let status = parseFloat(result.status);
		//amount
		let amountBN = ethers.BigNumber.from(result.amount);
		let amountRaw = fromBigIntNumberToDecimal(amountBN, decimals);
		let amount = cardCommaFormat(amountRaw);
		//hedge type
		let hedgeType;
		if (result.hedgeType === 0) {
			hedgeType = 'CALL';
		} else if (result.hedgeType === 1) {
			hedgeType = 'PUT';
		} else if (result.hedgeType === 2) {
			hedgeType = 'SWAP';
		} else {
			console.log('Hedge type is unknown');
		}
		//paired symbol
		let pairSymbol;
		if (tokenPairAddress === CONSTANTS.usdtAddress) {
			pairSymbol = 'USDT';
		} else if (tokenPairAddress === CONSTANTS.usdcAddress) {
			pairSymbol = 'USDC';
		} else if (tokenPairAddress === CONSTANTS.wethAddress) {
			pairSymbol = 'WETH';
		}
		//market value current
		const [marketvalueCurrent, pairedAddress] = await hedgingInstance.getUnderlyingValue(tokenAddress, result.amount);
		const pairedAddressDecimal = await getTokenDecimals(tokenPairAddress);
		const marketvalue = fromBigIntNumberToDecimal(marketvalueCurrent, pairedAddressDecimal);

		//start value, based on token decimals
		let startvalue, endvalue, cost, strikevalue;
		//start value in BN - before fromBigIntNumberToDecimal conversion
		let startValueBN = ethers.BigNumber.from(result.startValue);
		let endValueBN = ethers.BigNumber.from(result.endValue);
		let costBN = ethers.BigNumber.from(result.cost);

		if (tokenPairAddress === CONSTANTS.usdtAddress || tokenPairAddress === CONSTANTS.usdcAddress) { //USDT or USDC
			startvalue = fromBigIntNumberToDecimal(startValueBN, 6);
			endvalue = fromBigIntNumberToDecimal(endValueBN, 6);
			cost = fromBigIntNumberToDecimal(costBN, 6);
		} else if (tokenPairAddress === CONSTANTS.wethAddress) { //WETH
			startvalue = fromBigIntNumberToDecimal(startValueBN, 18);
			endvalue = fromBigIntNumberToDecimal(endValueBN, 18);
			cost = fromBigIntNumberToDecimal(costBN, 18);
		}
		//strike value
		if(startvalue>0){
			strikevalue = cost + startvalue;
		}else{
			strikevalue = cost + marketvalue;
		}
		//format amounts
		const formattedAmount = amount.toLocaleString();
		const formattedMarketValue = marketvalue.toLocaleString();
		const formattedCost = cost.toLocaleString();
		const formattedStrikeValue = strikevalue.toLocaleString();
		//logourl
		let logourl = result.logourl;
		//dates to human-readable dates
		let dt_created = new Date(result.dt_created * 1000).toLocaleString();
		let dt_started = new Date(result.dt_started * 1000).toLocaleString();
		let dt_expiry = new Date(result.dt_expiry * 1000).toLocaleString();
		// Calculate time left for dt_expiry
		// Calculate time left for dt_expiry
		let timeNow = new Date().getTime();
		let timeDiff = result.dt_expiry * 1000 - timeNow;
		let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
		let timeToExpiry = days + "d " + hours + "h " + minutes + "m ";
		//prepare strip
		var resultStrip = '<a href="hedge.html?id='+optionId+'" class="searchresultStrip"><div class="projectLogoLeft" style="background-image:url(' + logourl + ')"></div><div class="projectName">' + symbol + '</div><div class="projectName">' + formattedAmount + '</div><div class="projectName"> Value: ' + formattedMarketValue + ' '+ pairSymbol +'</div></a>';
		
		$('#searchresult').empty().append(resultStrip);
		
	}catch(error) {
		console.log(error);
	}
}

async function prepareTimestamp(timeprint){
	//timestamps
	if(timeprint > 0){
		var start = new Date(timeprint * 1000).toLocaleString();
	}else{
		var start = '0/0/0000, 00:00:00';
	}
	return start;
}
async function noOptionsSwal(){
	// add message to timeline
	$('#hedgesTimeline').empty().append('<div class="no-hedges-message sl_refresh">No Events Found. Write or Buy OTC hedges to populate this area...</span>');

	//proceed to swal
	setTimeout(function() {
		var privatize = '<div class="clms_case">nothing to find here...</div>';
		swal({
				title: "No OTC Trades Found",
				text: privatize,
				type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
				html: true,
						dangerMode: true,
						confirmButtonText: "Okay",
						confirmButtonColor: "#d6188a", //site pink
				showConfirmButton: true,
				showCancelButton: false,
				allowOutsideClick: true,
				timer: 2500,
				animation: "slide-from-top"
		},function(){//on confirm click
		
		});//confirm swal close
	}, 4500);
}

async function comingSoonSwal(){
	// add message to timeline
	$('#hedgesTimeline').empty().append('<div class="no-hedges-message sl_refresh">Neon Lend is currently under development. Coming Soon...</span>');

	//proceed to swal
	setTimeout(function() {
		var privatize = '<div class="clms_case">visit the <a href="./ecosystem.html" target="_blank">ecosystem page</a> to check out our platforms...</div>';
		swal({
				title: "Neon Lend is Under Construction",
				text: privatize,
				type: "info",  //var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];
				html: true,
						dangerMode: true,
						confirmButtonText: "Okay",
						confirmButtonColor: "#d6188a", //site pink
				showConfirmButton: true,
				showCancelButton: false,
				allowOutsideClick: true,
				timer: 2500,
				animation: "slide-from-top"
		},function(){//on confirm click
		
		});//confirm swal close
	}, 4500);
}

export { refreshDataOnElements, loadOptions, fetchOptionCard, fetchOptionStrip, prepareTimestamp, noOptionsSwal };