/*=========================================================================
    Import modules
==========================================================================*/
import { CONSTANTS, getUserBalancesForToken, truncateAddress, getPairToken, getSymbol, getAccounts, isValidEthereumAddress, fromBigIntNumberToDecimal, fromDecimalToBigInt, getTokenDecimals, getTokenETHValue, commaNumbering} from './constants.js';
import { initializeConnection, chainCheck, reqConnect, handleAccountChange, handleNetworkChange, popupSuccess} from './web3-walletstatus-module.js';
import { refreshDataOnElements, loadOptions, fetchOptionStrip,  prepareTimestamp, noOptionsSwal } from './module-market-card-fetchers.js';
import { loadSidebar, loadSidebarVolume_All, loadSidebarVolume_Token, loadPastEvents, prepareEventListItem } from './module-market-sidebar-fetchers.js';
import { setupWritingModule, createForm, submitWriting, purchaseInterface, deleteInterface } from './module-silkroad-writer.js';
import { MyGlobals } from './_silkroad_globals.js';
/*=========================================================================
    Wallet Page Main Functions
==========================================================================*/
// This is the main loading script for the page
// It first checks if a wallet is connected || initialization passes
// Initialization always returns boolean on whether it passes to load page scripts or not
// scouter == wallect readiness check. If wallet check passes & sets all wallet dependencies, then we can load all other scripts below
// if conditions to continueLoading change the script stops at scouter, event listeners at bottom of page to help with alerts & state changes

// Start making calls to Dapp modules
export const checkAndCallPageTries = async () => {
    const scouter = await pageModulesLoadingScript();
    
	console.log('connection Scout: '+ scouter);  
    if (scouter) {
        const asyncFunctions = [refreshDataOnElements, loadSidebar ];
        for (const func of asyncFunctions) {
            func();
        }
    }  
	
};

const setatmIntervalAsync = (fn, ms) => {
    fn().then(() => {
        setTimeout(() => setatmIntervalAsync(fn, ms), ms);
    });
};


// Ready all incl wallet display
$(document).ready(async function () {
    $('.waiting_init').css('display', 'inline-block');

    // load sections periodically
    setatmIntervalAsync(async () => {
        checkAndCallPageTries();
    }, 45000);
	
});

//Initiate time picker
function readyTimePicker() {
	$('input#expiryTime').timepicker({});
}


// Checks if all wallet checks pass before calling page modules
async function pageModulesLoadingScript() {
    let continueLoad = false;
    try {
        continueLoad = initializeConnection();
		if (continueLoad) {
			return true;
		} else {
			return false;
		}
    } catch (error) {
        console.log(error);
		return false;
    }
}

//notes:
//looping script to update options card
//script takes a global new array of optionIDs at any time then uses those IDs to update value, settlement state
//option cards are fetched on nav or tab click or results subset tabs in sets of 30
//each subset fetch stores the last array index to know where it left when fetching more results

/*========================================================================
    On page load
==========================================================================*/

//define tab is highlighted
$(document).ready(async function(){
	$('#erc20Options').css({'background' : 'rgba(214, 24, 138,0.1)','border' : '1px solid #62006b'});//left panel
	$('#discoverTab').css({'background' : 'rgba(214, 24, 138, 0.1)','border' : '1px solid #62006b'});//try rgb(8, 231, 254) - bright blue
	//set global
	window.nav = 1;
	window.filters = 1;
	window.readLimit = 30;
	window.sidebarTab = 1; // stats
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;

	const scouter = await pageModulesLoadingScript();
	if(scouter){
		loadOptions(MyGlobals.startIndex, window.readLimit);

		//load sidebar
		loadSidebar();

		//load past events
		loadPastEvents();
	}
});
$(document).on('click', '#erc20Options', async function(e){
	$('.asideNavsinside').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138,0.1)'});//set style
	//set global
	window.nav = 1;
	window.filters = 1;
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;

	const scouter = await pageModulesLoadingScript();
	if(scouter){
		loadOptions(MyGlobals.startIndex, window.readLimit);
	}
});
$(document).on('click', '#equitySwaps', async function(e){
	$('.asideNavsinside').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138,0.1)'});//set style
	//set global
	window.nav = 2;
	window.filters = 1;
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;
	//scout
	const scouter = await pageModulesLoadingScript();
	if(scouter){
		loadOptions(MyGlobals.startIndex, window.readLimit);
	}
});
$(document).on('click', '#erc20Loans', async function(e){
	$('.asideNavsinside').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138,0.1)'});//set style
	//set global
	window.nav = 3;
	window.filters = 1;
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;
	//scout
	const scouter = await pageModulesLoadingScript();
	if(scouter){
		loadOptions(MyGlobals.startIndex, window.readLimit);
	}
});
$(document).on('click', '#socialstream', function(e){
	$('.asideNavsinside').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138, 0.15)'});//set style
	//set global
	swal(
		{
			title: 'Coming...',
			text: 'Social will be introduced later together with AI sentiment trackers from other providers. \nIt will provide a live feed of opinions on tokens. \nAI intergration is primarily intended to help in advising trades before or during their lifespan.',
			type: 'info',
			html: false,
			dangerMode: false,
			confirmButtonText: 'okay',
			showConfirmButton: true,
			showCancelButton: false,
			animation: 'slide-from-top',
		}, function () {
			console.log('social feed coming soon...');
		}); 
});
//filters
$(document).on('click', '#discoverTab', function(e){
	$('.streamtype').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138, 0.1)'});//set style
	//set global
	window.filters = 1;
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;
	loadOptions(MyGlobals.startIndex, window.readLimit);
});
$(document).on('click', '#mypositionsTabs', function(e){
	$('.streamtype').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138, 0.1)'});//set style
	//set global
	window.filters = 2;
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;
	loadOptions(MyGlobals.startIndex, window.readLimit);
});
$(document).on('click', '#bookmarksTab', function(e){
	$('.streamtype').removeAttr('style'); //reset styles
	$(this).css({'border' : '1px solid #62006b', 'background' : 'rgba(214, 24, 138, 0.1)'});//set style
	//set global
	window.filters = 3;
	//check load continuation
	MyGlobals.outputArray = [];
	MyGlobals.startIndex = 0;
	MyGlobals.lastItemIndex = 0;
	loadOptions(MyGlobals.startIndex, window.readLimit);
});


/*=========================================================================
    HELPER FUNCTIONS
==========================================================================*/

// Filter hedges using token address or token id
async function onSearchSubmit(event) {
	event.preventDefault();
	var inputText = $('#searchBar').val();
	// Check if token address pasted
	if (inputText.length >= 40 && isValidEthereumAddress(inputText)) {
		
		// Set global filters
		window.nav = 1;
		window.filters = 4;

		// Check load continuation
		MyGlobals.outputArray = [];
		MyGlobals.startIndex = 0;
		MyGlobals.lastItemIndex = 0;

		// A - Fetch Options matching address
		await loadOptions(MyGlobals.startIndex, readLimit);

		// B - Update sidebar with token infor: hedge volume and listen to events
		// function determines what to load based on searchBar input
		// events are constantly loaded all but filtered only when searchBar contains erc20 address
		await loadSidebar();
	}
	// if option ID pasted 
	else if (Number.isInteger(inputText)) {
		console.log('fetching hedge by ID provided...');	
		await fetchOptionStrip(inputText);
	}
	else {
		const privatize = `Only token address or option ID accepted when filtering storage!`;
  
	swal({
		title: "Invalid Prompt",
		text: privatize,
		type: "error",
		html: true,
		confirmButtonColor: "#171716",
		closeOnConfirm: true,
		showConfirmButton: true,
		showCancelButton: false,
		timer: 2000,
		animation: "slide-from-top"
	},async function(){//on confirm click
		//clear search bar
		document.getElementById("searchBar").value = "";

	});
	}
}

// Listeners: create button click, sidebar tab click
$(document).on('click', '#create_button', function(e){
	createForm();
});


// Listeners: set sidebar globals
$(document).on('click', '#statsLabel', async function(e){
	window.sidebarTab = 1;
	// quick one: refresh sidebar
	const searchInput = $('#searchBar').val();
    if (searchInput.length >= 40 && isValidEthereumAddress(searchInput)) {
        // filter sidebar infor for token
        await loadSidebarVolume_Token(searchInput);
    } else {
        await loadSidebarVolume_All();
    }
});

$(document).on('click', '#eventsLabel', async function(e){
	window.sidebarTab = 2;
	// quick one: refresh sidebar
	await loadPastEvents();
});

// Attach event handler to document object for event delegation
document.addEventListener('paste', async function(event) {
    if (event.target.id === 'tokenAddy') {
        await handlePaste(event);
    }
	if (event.target.id === 'searchBar') {
		await onSearchSubmit(event);
	}
});

async function handlePaste(event) {
    event.preventDefault();
    // Get the pasted text from the clipboard
    var clipboardData = event.clipboardData || window.clipboardData;
    var pastedText = clipboardData.getData('text');

    // Check if the pasted text is a valid ERC20 token address
    if (isValidEthereumAddress(pastedText)) {
        // update the input field value with the pasted token address
        event.target.value = pastedText;
		await fetchUserTokenBalance(pastedText);
		
    } else {
        console.log('Invalid ERC20 token address pasted:', pastedText);
    }
}

async function fetchUserTokenBalance(tokenAddress) {
    try {
        const accounts = await getAccounts();
        const userAddress = accounts[0];
        // fetch balances for user under token address
        const mybalances = await getUserBalancesForToken(tokenAddress, userAddress);

        // Handle undefined mybalances
        if (!mybalances) {
            // Set the displayed values to 0 if mybalances is undefined
            document.getElementById('depositedBalance').textContent = '0.00';
            document.getElementById('withdrawnBalance').textContent = '0.00';
            document.getElementById('lockedInUseBalance').textContent = '0.00';
            document.getElementById('withdrawableBalance').textContent = '0.00';
            return;
        }

        // Format output
        const formatStringDecimal = (number) => {
            const options = {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            };
            return number.toLocaleString('en-US', options);
        };

        // Display balances in the HTML form
        document.getElementById('depositedBalance').textContent = formatStringDecimal(mybalances.deposited || 0);
        document.getElementById('withdrawnBalance').textContent = formatStringDecimal(mybalances.withdrawn || 0);
        document.getElementById('lockedInUseBalance').textContent = formatStringDecimal(mybalances.lockedInUse || 0);
        document.getElementById('withdrawableBalance').textContent = formatStringDecimal(mybalances.withdrawableBalance || 0);
    } catch (error) {
        console.error('Error fetching user token balance:', error);
    }
}

//==============================================================
// DEPRECATED
//==============================================================

// Listen to live events
// Eg: HEDGE created - to be used for live transactions on sidebar
// Accepts only events 
/* DEPRECATED
async function createEventListItem(event) {
	console.log('raw event: ' + event);
	const tokenAddress = event.returnValues.token;
	const tokenAddressExists = false;
    if (isValidEthereumAddress(tokenAddress)) {
		tokenAddressExists = true;
	}

	// If the token address exists, display only matching list items
	if (tokenAddressExists) {
		const listItem = document.createElement('li');
		listItem.classList.add('event-item');

		const title = document.createElement('span');
		title.textContent = event.event;
		listItem.appendChild(title);

		// display cost/premium/value with pair symbol
		const pairToken = await getPairToken(event.returnValues.optionId);
		const pairTokenSymbol = await getSymbol(pairToken);

		const amount = document.createElement('span');
		amount.textContent = (event.returnValues.createValue || event.returnValues.startValue || event.returnValues.endValue || event.returnValues.payOff) + ' ' + pairTokenSymbol;
		listItem.appendChild(amount);

		// trim address
		const truncatedAddress = truncateAddress((event.returnValues.writer || event.returnValues.buyer || event.returnValues.miner));
		const dealer = document.createElement('span');
		dealer.textContent = truncatedAddress;
		listItem.appendChild(dealer);
		
		// tx link
		const linkSpan = document.createElement('span'); 
		const link = document.createElement('a');
		link.href = 'https://etherscan.io/tx/' + event.transactionHash;
		link.textContent = 'View Transaction';
		linkSpan.appendChild(link);
		listItem.appendChild(linkSpan);

		return listItem;
  	}

	// If the token address doesn't exist in the search bar, display all list items
	const listItem = document.createElement('li');
	listItem.classList.add('event-item');

	const title = document.createElement('span');
	title.textContent = event.event;
	listItem.appendChild(title);

	// display cost/premium/value with pair symbol
	const pairToken = await getPairToken(event.returnValues.optionId);
	const pairTokenSymbol = await getSymbol(pairToken);

	const amount = document.createElement('span');
	amount.textContent = (event.returnValues.createValue || event.returnValues.startValue || event.returnValues.endValue || event.returnValues.payOff) + ' ' + pairTokenSymbol;
	listItem.appendChild(amount);

	// trim address
	const truncatedAddress = truncateAddress((event.returnValues.writer || event.returnValues.buyer || event.returnValues.miner));
	const dealer = document.createElement('span');
	dealer.textContent = truncatedAddress;
	listItem.appendChild(dealer);

	const link = document.createElement('a');
	link.href = 'https://etherscan.io/tx/' + event.transactionHash;
	link.textContent = 'View Transaction';
	listItem.appendChild(link);

  return listItem;
}
*/


/*  ---------------------------------------
    HEDGING EVENT LISTENING
-------------------------------------- */
$(document).ready(async function () {

    setupEventListening();

});

async function setupEventListening() {
	let hedgingInstance = window.hedgingInstance;
	
	// Hedging Events
	try {
        const filter_hedgeCreated = await hedgingInstance.filters.hedgeCreated();
        hedgingInstance.on(filter_hedgeCreated, handleHedgeCreatedEvent);

        const filter_hedgePurchased = await hedgingInstance.filters.hedgePurchased();
        hedgingInstance.on(filter_hedgePurchased, handleHedgePurchasedEvent);

        const filter_hedgeSettled = await hedgingInstance.filters.hedgeSettled();
        hedgingInstance.on(filter_hedgeSettled, handleHedgeSettledEvent);

        const filter_minedHedge = await hedgingInstance.filters.minedHedge();
        hedgingInstance.on(filter_minedHedge, handleMinedHedgeEvent);

    } catch (error) {
        console.error('Error setting up event listening:', error);
    }
}
/* GitHub https://github.com/ethers-io/ethers.js/issues/1307
hedgingInstance.on(filter_hedgeCreated, async (...args) => {
	console.log(args[args.length - 1].transactionHash);
});
*/
async function handleHedgeCreatedEvent(token, optionId, createValue, type, writer, transactionHash) {
	
	const event = { 
		returnValues: { token, optionId, createValue, type, writer },
		event: 'hedgeCreated',
		transactionHash: transactionHash.transactionHash
	};
	//console.log(transactionHash.transactionHash);
	const listItem = await prepareEventListItem(event, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
}
  
async function handleHedgePurchasedEvent(token, optionId, startValue, type, buyer, transactionHash) {
	const event = {
		returnValues: { token, optionId, startValue, type, buyer },
		event: 'hedgePurchased',
		transactionHash: transactionHash.transactionHash
	};
	const listItem = await prepareEventListItem(event, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
}

async function handleHedgeSettledEvent(token, optionId, endValue, payOff, miner, transactionHash) {
	const event = {
		returnValues: { token, optionId, endValue, payOff, miner },
		event: 'hedgeSettled',
		transactionHash: transactionHash.transactionHash
	};
	const listItem = await prepareEventListItem(event, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
}

async function handleMinedHedgeEvent(optionId, miner, token, paired, tokenFee, pairFee, transactionHash) {
	const event = {
		returnValues: { optionId, miner, token, paired, tokenFee, pairFee },
		event: 'minedHedge',
		transactionHash: transactionHash.transactionHash
	};
	const listItem = await prepareEventListItem(event, "0x123456789abcdef");
}

function handleHedgeCreatedSuccessEvent(token, optionId, amount, hedgeType, cost, tx_hash) {
    const outputCurrency = ''; // using nonTxBased message with empty currency
    const type = 'success'; // or error
    const wallet = '';
    const message = 'Hedge Created Successfully';
    const nonTxAction = 'Token: ' + truncateAddress(token) + '<br>Hedge ID: ' + optionId + '<br>Amount: ' + amount + '<br>Hedge Type: ' + hedgeType + '<br>Premium: ' + cost;
    popupSuccess(type, outputCurrency, tx_hash, message, 0, 0, wallet, nonTxAction);
}


/*  ---------------------------------------
    BOTTOM OF EVERY MAIN SCRIPT MODULE 
-------------------------------------- */
// Provider Listeners
ethereum.on("connect", (chainID) => {
	// Update chainID on connect
	CONSTANTS.chainID = chainID.chainId;
	console.log("Connected to chain:", CONSTANTS.chainID);
	handleNetworkChange(chainID.chainId)
	chainCheck();
});

ethereum.on("accountsChanged", async (accounts) => {
    console.log("Account changed:", accounts);
	if(accounts.length > 0) {
		handleAccountChange(accounts);
		// Refresh accounts & page Feed
		checkAndCallPageTries();
		loadOptions();
	} else {
		handleAccountChange(accounts);
		// Refresh wallet widget directly, force wallet initialization check first		
		window.currentAccount = null;
		checkAndCallPageTries();
	}
});

ethereum.on("chainChanged", (chainID) => {
	console.log("Network changed:", chainID);
	handleNetworkChange(chainID);
	window.location.reload();
});



export { readyTimePicker };