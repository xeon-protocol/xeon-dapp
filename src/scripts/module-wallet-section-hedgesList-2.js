export function loadHedgesModule(userAddress) {
  let startIndex = 0;
  const limit = 50;
  let dataType = 'Options Created';

  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = 'Load More';
  loadMoreButton.classList.add('load-more-button');
  loadMoreButton.style.display = 'none';

  const hedgesList = document.querySelector('.hedges-trade-list');

  async function fetchDataAndPopulateList() {
    let data;

    switch (dataType) {
      case 'Options Created':
        data = await hedgingInstance.methods.getUserOptionsCreated(userAddress, startIndex, limit).call();
        break;
      case 'Options Taken':
        data = await hedgingInstance.methods.getUserOptionsTaken(userAddress, startIndex, limit).call();
        break;
      // Handle other cases
      default:
        break;
    }

    const fragment = document.createDocumentFragment();

    // For works better than foreach inside async function
    for (const item of data) {
      const listItem = document.createElement('li');
      listItem.classList.add('hedge-item');

      const hedgeType = document.createElement('div');
      hedgeType.classList.add('hedge-type', 'hedge-i-cat');
      hedgeType.textContent = item.hedgeType;
      listItem.appendChild(hedgeType);

      const tokenInfo = document.createElement('div');
      tokenInfo.classList.add('token-info');

      const hedgeSymbol = document.createElement('div');
      hedgeSymbol.classList.add('hedge-symbol', 'hedge-i-cat');
      hedgeSymbol.textContent = item.hedgeSymbol;
      tokenInfo.appendChild(hedgeSymbol);

      const hedgeValue = document.createElement('div');
      hedgeValue.classList.add('hedge-value', 'hedge-i-cat');
      hedgeValue.textContent = item.hedgeValue; 
      tokenInfo.appendChild(hedgeValue);

      const tokenAddress = document.createElement('div');
      tokenAddress.classList.add('token-address');
      tokenAddress.textContent = item.tokenAddress; 
      tokenInfo.appendChild(tokenAddress);

      listItem.appendChild(tokenInfo);

      const hedgeTxBtn = document.createElement('button');
      hedgeTxBtn.classList.add('hedgeTxBtn');
      hedgeTxBtn.textContent = 'Tx';
      listItem.appendChild(hedgeTxBtn);

      //Use fragments instead of adding elements one by one
      fragment.appendChild(listItem);
    }

    hedgesList.appendChild(fragment);

    startIndex += data.length;

    loadMoreButton.style.display = data.length === limit ? 'block' : 'none';
  }

  // Event listerner, check efficiency
  loadMoreButton.addEventListener('click', fetchDataAndPopulateList);

  const buttons = document.querySelectorAll('.list-toggle button');
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      startIndex = 0;
      dataType = button.getAttribute('data-type');

      hedgesList.innerHTML = '';
      loadMoreButton.style.display = 'none';

      fetchDataAndPopulateList();
    });
  });
}
