import { getTokenUSDValue, getCurrentEthUsdcPriceFromUniswapV2, getTokenETHValue, CONSTANTS, fromBigIntNumberToDecimal } from './constants.js';

// Function to fetch the number of deposited tokens by a wallet
async function getWalletTokenList(walletAddress) {
	try {
      const transactedTokensArray = await hedgingInstance.getUserHistory(walletAddress, 0, CONSTANTS.tokenLimit);
	  return transactedTokensArray;
	} catch (error) {
	  console.error("Error fetching deposited tokens:", error);
	  return [];
	}
}

// Function to update the HTML with the ERC20 token list
async function userTokenList(walletAddress) {

    const tokenListContainer = $('#token-list');
    tokenListContainer.empty();

    // Show animation
    tokenListContainer.append('<i class="loading"></i>');

    // Fetch the token list
    const tokenAddresses = await getWalletTokenList(walletAddress);

    // Check if the array is empty
    if (tokenAddresses.length === 0) {
        tokenListContainer.find('.loading').remove();

        // Clear existing content 
        tokenListContainer.html(''); // Changed innerHTML to html()
        const noTokensMessage = $('<div></div>'); // Changed to jQuery object creation
        noTokensMessage.text('No ERC20 Deposits Found. Visit Cashier.');
        noTokensMessage.addClass('no-hedges-message'); // Changed to addClass()
        tokenListContainer.prepend(noTokensMessage);        
    
        console.log("No tokens found for the given wallet address.");
        return;
    }

    // Formatter for displaying the token value
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

    for (const tokenAddress of tokenAddresses) {
        console.log("balance for token address:", tokenAddress + ", wallet address: " + walletAddress);
        const result = await hedgingInstance.getUserTokenBalances(tokenAddress, walletAddress);
        const depositedBalance = ethers.BigNumber.from(result[0]);
        const withdrawnBalance = ethers.BigNumber.from(result[1]);

        // Check for underflow or overflow
        if (depositedBalance.lt(withdrawnBalance)) {
            console.log("Error: Withdrawn balance is greater than deposited balance.");
            continue; // Skip this token and proceed to the next one
        }

        // Convert deposited and withdrawn balances to BigNumber and handle 1e18 format
        const currentBalance = depositedBalance.sub(withdrawnBalance);
        const tokenInfo = await getTokenInfo(tokenAddress, currentBalance);

        if (tokenInfo) {
            const listItem = $('<li></li>'); // Use jQuery to create a new list item
            listItem.addClass('trade-item');
            listItem.html(`
                <div class="token-icon" style="background: url('./imgs/tokens/${tokenInfo.symbol.toLowerCase()}.webp');"></div>
                <div class="token-info">
                    <div class="token-name">${tokenInfo.name}</div>
                    <div class="token-symbol">${tokenInfo.symbol}</div>
                    <div class="token-address text-to-copy">${tokenInfo.address}</div>
                    <div class="token-copy"><i class="copy-icon far fa-copy"></i></div>
                    <div class="token-tamount">${tokenInfo.amount}</div>
                </div>
                <div class="trade-amount">${formatValue(tokenInfo.valueInUSD)}</div>
            `);
            // Hide the loading animation
            tokenListContainer.find('.loading').remove();
            // Jquery append output
            tokenListContainer.append(listItem); 
            console.log("deposits info:", tokenInfo);
        }
    }
}


// Function to calculate ERC20 token information
async function getTokenInfo(tokenAddress, balanceBN) {
    const erc20ABI = [
		{ constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], type: 'function' },
		{ constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], type: 'function' },
		{ constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], type: 'function' },
	];
    try {
        // Fetch token name, symbol, and decimals from the ERC20 contract
		const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, window.provider);
        const [tokenName, tokenSymbol, tokenDecimals] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.decimals(),
        ]);

        // Format from BigNumber to human-readable: accepts bigNumber only
        // Fetch decimal value after
        const balanceBig = ethers.BigNumber.from(balanceBN);
        const trueValue = fromBigIntNumberToDecimal(balanceBig, tokenDecimals);

        // Fetch the USD value of the token balance: accepts decimal
        const usdValue = await getTokenUSDValue(tokenAddress, trueValue);
        const tokenInfo = {
            name: tokenName,
            symbol: tokenSymbol,
            address: tokenAddress,
            amount: trueValue,
            valueInUSD: usdValue,
        };
        return tokenInfo;
    } catch (error) {
        console.error("Error getting token information:", error);
        return null;
    }
}



// Function to update the HTML with the ERC20 token list
async function cashierErc20List(walletAddress) {
    const selectElement = document.getElementById('erc20-select');
    selectElement.innerHTML = '<option value="">Select token...</option>'; // Reset select option
    try {
        const depositedTokens = await getDepositedTokens();
        //const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();
        // Fetch token information for each deposited token and add them as options
        for (const tokenAddress of depositedTokens) {
            const [deposited, withdrawn, , ,] = await hedgingInstance.getuserTokenBalances(tokenAddress, walletAddress);
            // Convert deposited and withdrawn balances to BigNumber and handle 1e18 format
            const depositedBalance = new BigNumber(deposited).div(new BigNumber(10).pow(18));
            const withdrawnBalance = new BigNumber(withdrawn).div(new BigNumber(10).pow(18));
            const currentBalance = depositedBalance.minus(withdrawnBalance);
            const tokenInfo = await getTokenInfo(tokenAddress, currentBalance);
            if (tokenInfo) {
                const optionElement = document.createElement('option');
                optionElement.value = tokenInfo.address;
                optionElement.textContent = `${tokenInfo.name} (${truncateAddress(tokenInfo.address)})`;
                selectElement.appendChild(optionElement);
            }
        }
    } catch (error) {
        console.error("Error populating ERC20 options:", error);
    }
}

// Function to get deposited ERC20 tokens
async function getDepositedTokens() {
	try {
		const depositedTokens = await hedgingInstance.getProtocolTokenList();
		return depositedTokens;
	} catch (error) {
		console.error("Error fetching deposited tokens:", error);
		return [];
	}
}


// Export the fetch functions
export { getWalletTokenList, userTokenList, getTokenInfo, cashierErc20List, getDepositedTokens };