import { CONSTANTS, getTokenDecimals, cardCommaFormat, fromBigIntNumberToDecimal, fromDecimalToBigInt, getTokenDecimalSymbolName, getAccounts, truncateAddress } from './constants.js';

export async function loadHedgesModule() {

  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = 'Load More';
  loadMoreButton.classList.add('load-more-button');
  loadMoreButton.style.display = 'none';

  async function fetchDataAndPopulateList() {
    let data;
    const userAddressArray = await getAccounts();
    const userAddress = userAddressArray[0];

    // Clear container
    const hedgesList = document.querySelector('#hedges-trade-list');
    while (hedgesList.firstChild) {
        hedgesList.removeChild(hedgesList.firstChild);
    }
    // Loading animation
    const loading = document.createElement('i');
    loading.classList.add('loading');
    hedgesList.appendChild(loading);

    // Proceed to fetch hedge structs
    console.log('fetching hedges for wallet: ' + userAddress);
    switch (dataType) {
      case 'Options Created':
        data = await hedgingInstance.getUserOptionsCreated(userAddress, startIndex, limit);
        break;
      case 'Options Taken':
        data = await hedgingInstance.getUserOptionsTaken(userAddress, startIndex, limit);
        break;
      case 'Swaps Created':
        data = await hedgingInstance.getUserSwapsTaken(userAddress, startIndex, limit);
        break;
      case 'Swaps Taken':
        data = await hedgingInstance.getUserSwapsTaken(userAddress, startIndex, limit);
        break;
      case 'My Bookmarks':
        data = await hedgingInstance.getmyBookmarks(userAddress);
        break;
      // Handle other cases
      default:
        break;
    }

    const fragment = document.createDocumentFragment();
    if (data.length == 0 && startIndex > 0) {
      // If data is empty, append a message to inform the user
      const noHedgesMessage = document.createElement('div');
      noHedgesMessage.textContent = 'No Hedges to Load';
      noHedgesMessage.classList.add('no-hedges-message');
      hedgesList.appendChild(noHedgesMessage);
    } else if (data.length == 0 && startIndex == 0) {
      // Clear existing content in hedgesList
      hedgesList.innerHTML = '';
      const noHedgesMessage = document.createElement('div');
      noHedgesMessage.textContent = 'No Hedges Found. Write or buy Options and Swaps to populate this area.';
      noHedgesMessage.classList.add('no-hedges-message');
      hedgesList.prepend(noHedgesMessage);
    }
     else {
      // If data is not empty, populate the list as before
      // For works better than foreach inside async function
      for (const item of data) {
          const result = await hedgingInstance.getHedgeDetails(item); 

          //prep hedge type in text
          const typeInt = parseFloat(result.hedgeType);
          let hedgeTypeTxt;
          if (typeInt === 0) {
            hedgeTypeTxt = 'Call';
          } else if (typeInt === 1) {
            hedgeTypeTxt = 'Put';
          } else if (typeInt === 2) {
            hedgeTypeTxt = 'Swap';
          }

          const listItem = document.createElement('li');
          listItem.classList.add('hedge-item');

          const hedgeType = document.createElement('div');
          hedgeType.classList.add('hedge-type', 'hedge-i-cat');
          hedgeType.textContent = hedgeTypeTxt;
          listItem.appendChild(hedgeType);

          const tokenInfo = document.createElement('div');
          tokenInfo.classList.add('token-info');

           // token symbol
          const tokenLink = document.createElement('a');
          tokenLink.href = 'https://sepolia.etherscan.io/address/' + result.token;
          tokenLink.target = '_blank';

          const hedgeSymbol = document.createElement('span');
          tokenLink.classList.add('hedge-symbol', 'hedge-i-cat');
          const [, , symbol] = await getTokenDecimalSymbolName(result.token);
          hedgeSymbol.textContent = symbol;
          tokenLink.appendChild(hedgeSymbol);
          tokenInfo.appendChild(tokenLink);
                

          // market value
          const hedgeValue = document.createElement('div');
          hedgeValue.classList.add('hedge-value', 'hedge-i-cat');
          let hedgeValues, pairedAddress, pairedSymbol;
          [hedgeValues, pairedAddress] = hedgeValue.textContent = await hedgingInstance.getUnderlyingValue(result.token, result.amount); 
          const hedgeValueDecimal = fromBigIntNumberToDecimal(hedgeValues, await getTokenDecimals(result.token));
          [, , pairedSymbol] = await getTokenDecimalSymbolName(pairedAddress);
          hedgeValue.textContent = cardCommaFormat(hedgeValueDecimal) + ' ' + pairedSymbol;
          tokenInfo.appendChild(hedgeValue);

          // cost
          const hedgeCost = document.createElement('div');
          hedgeCost.classList.add('hedge-cost', 'hedge-i-cat');
          let costValues = result.cost; 
          const hedgeCostDecimal = fromBigIntNumberToDecimal(costValues, await getTokenDecimals(pairedAddress));
          hedgeCost.textContent = cardCommaFormat(hedgeCostDecimal) + ' ' + pairedSymbol;
          tokenInfo.appendChild(hedgeCost);
          
          //status
          const hedgeState = document.createElement('div');
          hedgeState.classList.add('hedge-state', 'hedge-i-cat');
          const hedgeStatus = parseFloat(result.status);
          if (hedgeStatus === 1) {
            hedgeState.textContent = 'Open';
          } else if (hedgeStatus === 2) {
            hedgeState.textContent = 'Taken';
          } else if (hedgeStatus === 3) {
            hedgeState.textContent = 'Settled';
          }
          tokenInfo.appendChild(hedgeState);

          function formatDate(date) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const year = date.getFullYear().toString().slice(-2);
            const month = months[date.getMonth()];
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day} ${month}'${year} ${hours}:${minutes}`;
          }
          // start
          const hedgeStart = document.createElement('div');
          hedgeStart.classList.add('hedge-date', 'hedge-i-cat');
          hedgeStart.textContent = formatDate(new Date(result.dt_created * 1000));
          tokenInfo.appendChild(hedgeStart);
          // expiry
          const hedgeEnd = document.createElement('div');
          hedgeEnd.classList.add('hedge-date', 'hedge-i-cat');
          hedgeEnd.textContent = formatDate(new Date(result.dt_expiry * 1000));
          tokenInfo.appendChild(hedgeEnd);
          // taker
          const hedgeTaker = document.createElement('div');
          hedgeTaker.classList.add('hedge-taker', 'hedge-i-cat');
          const takerLink = document.createElement('a');
          takerLink.href = 'https://sepolia.etherscan.io/address/' + result.taker;
          takerLink.target = '_blank';
          takerLink.textContent = truncateAddress(result.taker);
          hedgeTaker.appendChild(takerLink);
          tokenInfo.appendChild(hedgeTaker);
          // add to list item
          listItem.appendChild(tokenInfo);
          // action button
          const hedgeTxBtn = document.createElement('button');
          hedgeTxBtn.classList.add('hedgeTxBtn');
          hedgeTxBtn.textContent = 'Tx';
          listItem.appendChild(hedgeTxBtn);
          // Use fragments instead of adding elements one by one
          fragment.appendChild(listItem);
      }
      // Hide loading animation if available      
      hedgesList.removeChild(loading);

      // Append the fragment to the list
      hedgesList.appendChild(fragment);
    }

    startIndex += data.length;

    loadMoreButton.style.display = data.length === limit ? 'block' : 'none';
  }

  // Event listener, check efficiency
  loadMoreButton.addEventListener('click', fetchDataAndPopulateList);

  const buttons = document.querySelectorAll('.list-toggle button');
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      dataType = button.getAttribute('data-type');

      //reset start index
      window.startIndex = 0;

      // reinitilize trade list
      const hedgesList = document.querySelector('#hedges-trade-list');
      hedgesList.innerHTML = '';
      loadMoreButton.style.display = 'none';

      fetchDataAndPopulateList();
    });
  });

  function throttle(callback, delay) {
    let lastTime = 0;
    return function () {
      const currentTime = new Date();
      if (currentTime - lastTime >= delay) {
        callback.apply(null, arguments);
        lastTime = currentTime;
      }
    };
  }

  // Function to check if an element is in view
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= window.innerHeight;
  }

  // Function to execute only once when the element is in view
  function executeOnceInView(element, callback) {
    return function () {
      if (!executed && isInViewport(element)) {
        callback();
        executed = true;
      }
    };
  }

  // Attach scroll event listener to the window
  window.addEventListener('scroll', () => {
    const hedgesList = document.querySelector('#hedges-trade-list');
    const executeOnce = executeOnceInView(hedgesList, async () => {
      startIndex = 0;
      fetchDataAndPopulateList();
      window.removeEventListener('scroll', onScroll);
    });

    const onScroll = throttle(executeOnce, 2000); // Adjust delay (in milliseconds) for responsiveness
    onScroll();
  });

}