/*=========================================================================
    Import Modules
==========================================================================*/

import { CONSTANTS } from './constants.js';
import { initializeConnection, chainCheck, unlockedWallet, reqConnect, handleAccountChange, handleNetworkChange, popupSuccess} from './web3-walletstatus-module.js';
import { fetchSection_HedgeCard, fetchSection_HedgeCardDefault } from './module-hedge-fetchers.js';
import { purchaseInterface, deleteInterface, toggleBookmark, zapInterface, topupInterface } from './module-silkroad-writer.js';

/*=========================================================================
    Hedge Page Main Scripts
==========================================================================*/
// This is the main loading script for the page
// It first checks if a wallet is connected || initialization passes
// Initialization always returns boolean on whether it passes to load page scripts or not
// scouter == wallect readiness check. If wallet check passes & sets all wallet dependencies, then we can load all other scripts below
// if conditions to continueLoading change the script stops at scouter, event listeners at bottom of page to help with alerts & state changes

// Start making calls to Dapp modules
export const verifyAndCallPageTries = async () => {

  let scouter = await hedgeLoaderScript();  
  console.log('connection Scout: '+ scouter);  
  
  if (scouter) {
    // Load sections automatically & periodically
    const asyncFunctions = [fetchSection_HedgeCard];
    
    // Check if the webpage URL has '?id='
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (idParam) {
        for (const func of asyncFunctions) {
            await func();
        }
    } else {
        await fetchSection_HedgeCardDefault();
        // Get the page-title section
        const pageTitleSection = document.getElementById('page-title');
        pageTitleSection.innerHTML = '';
        // Create the rewardsInformer div with the specified text and icon
        const rewardsInformerDiv = document.createElement('div');
        rewardsInformerDiv.classList.add('rewardsInformer');
        // Create the icon element
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-exclamation-triangle');
        icon.setAttribute('aria-hidden', 'true');
        // Create the text element
        const text = document.createTextNode(' Hedge ID not found in URL, sample data displayed instead as default');
        // Append the icon and text elements to the rewardsInformer div
        rewardsInformerDiv.appendChild(icon);
        rewardsInformerDiv.appendChild(text);

        if (pageTitleSection) {
            // Append the rewardsInformer div to the page-title section
            pageTitleSection.appendChild(rewardsInformerDiv);
        }
    }
  }
};

$(document).ready(async function () {

  // Countdown timer refresh
  const setRefreshInterval = (fn, ms) => {
    let countdown = ms / 1000;
    const refreshCounter = document.getElementById('refreshCounter');
    const updateCountdown = () => {
      countdown--;
      refreshCounter.innerText = countdown;
    };

    // Update the countdown in real time
    fn().then(() => {
      updateCountdown();
      const intervalId = setInterval(() => {
        updateCountdown();
        if (countdown === 0) {
          clearInterval(intervalId);
          setRefreshInterval(fn, ms);
        }
      }, 1000);
    });
  };

  // Load sections periodically
  setRefreshInterval(async () => {
    verifyAndCallPageTries();
  }, 45000);

  // Update optionId
  // Check if the webpage URL has '?id='
  const urlParams = new URLSearchParams(window.location.search);
  window.optionID = urlParams.get('id');
});


// Checks if all wallet checks pass before calling page modules
async function hedgeLoaderScript() {
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


/*=========================================================================
    INITIALIZE OTHER MODULES
==========================================================================*/
// Button Listeners: buy
$(document).on('click', '#takeHedge', function(e){
  const optionId = parseInt(window.optionID);
  if (optionId) {
    purchaseInterface(optionId);
  }
});
$(document).on('click', '#deleteHedge', function(e){
  const optionId = parseInt(window.optionID);
  if (optionId) {
    deleteInterface(optionId);
  }
});
$(document).on('click', '#viewHedge', function(e){
    swal({
        title: "View Mode Enabled",
        type: "warning",
        text: "You are not part of this deal..",
        html: true,
        showCancelButton: false,
        confirmButtonColor: "#04C86C",
        confirmButtonText: "Oops..",
        closeOnConfirm: true,
        allowOutsideClick: true
    }, async function(isConfirm) {  }); // close swal
    return;
});
$(document).on('click', '#zapHedge, #requestZap', function(e){
  const optionId = parseInt(window.optionID);
  if (optionId) {
    zapInterface(optionId);
  }
});
$(document).on('click', '#requestTopup', function(e){
  const optionId = parseInt(window.optionID);
  if (optionId) {
    topupInterface(optionId);
  }
});
$(document).on('click', '#settleHedge', function(e){
  
});
$(document).on('click', '#toggleBookmark', function(e){
  const optionId = parseInt(window.optionID);
  if (optionId) {
    toggleBookmark(optionId);
  }
});

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
    verifyAndCallPageTries();
  } else {
    handleAccountChange(accounts);
    // Refresh wallet widget directly, force wallet initialization check first		
    window.currentAccount = null;
    verifyAndCallPageTries();
  }
});

ethereum.on("chainChanged", (chainID) => {
  console.log("Network changed:", chainID);
  handleNetworkChange(chainID);
  window.location.reload();
});
