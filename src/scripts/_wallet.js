/*=========================================================================
    Import modules
==========================================================================*/
import { CONSTANTS, getAccounts, isValidEthereumAddress, getUserBalancesForToken, getSymbol, fromBigIntNumberToDecimal, commaNumbering } from './constants.js';
import { initializeConnection, chainCheck, unlockedWallet, reqConnect, handleAccountChange, handleNetworkChange} from './web3-walletstatus-module.js';
import { approvalDepositInterface, withdrawInterface } from './module-wallet-writer.js';
import { fetchSection_Networth, fetchSection_BalanceList, fetchSection_HedgePanel, fetchSection_RewardsPanel, fetchSection_StakingPanel } from './module-wallet-section-fetchers.js';
import { loadHedgesModule } from './module-wallet-section-hedgesList.js';

/*=========================================================================
    Wallet Page Main Functions
==========================================================================*/
// This is the main loading script for the page
// It first checks if a wallet is connected || initialization passes
// Initialization always returns boolean on whether it passes to load page scripts or not
// Scouter == wallect readiness check. If wallet check passes & sets all wallet dependencies, then we can load all other scripts below
// if conditions to continueLoading change the script stops at scouter, event listeners at bottom of page to help with alerts & state changes

// Start making calls to Dapp modules
export const checkAndCallPageTries = async () => {
    const scouter = await pageModulesLoadingScript();
    console.log('connection Scout: '+ scouter);

    if (scouter) {
        const asyncFunctions = [fetchSection_Networth, fetchSection_BalanceList, fetchSection_HedgePanel, myHedgesList, fetchSection_RewardsPanel, fetchSection_StakingPanel];
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
    // hedge list globals
    window.startIndex = 0;
    window.limit = 50;
    window.dataType = 'Options Created'; //changed on tab click
    window.executed = false; //hedge list scroll trigger once only

    // load sections periodically
    setatmIntervalAsync(async () => {
        checkAndCallPageTries();
    }, 45000);
});

// Checks if all wallet checks pass before calling page modules
async function pageModulesLoadingScript() {
    let continueLoad = false;
    try {
        continueLoad = initializeConnection();
		if (continueLoad) {
            // Set up event listeners related to the wallet
            setupToggleElements();
			return true;
		} else {
			return false;
		}
    } catch (error) {
        console.log(error);
		return false;
    }
}

// Deprecated - Lazy loading implementation for Hedges Panel
export async function fetchHedgeList() {
    const accounts = await getAccounts();
    const userAddress = accounts[0];

    // Load more sections manually not automatically & periodically
    // Create an IntersectionObserver to load hedges when #hedgingSection is in view    
    const loadHedgesSection = async (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                // Call the loadHedgesModule function
                await loadHedgesModule(userAddress);
                // Remove the observer once the section has been loaded
                observer.unobserve(entry.target);
            }
        }
    };
    
    // Now, Load the hedges section
    const hedgingSection = document.getElementById('hedgingSection');
    const observer = new IntersectionObserver(loadHedgesSection, { root: null, threshold: 0.1 });
    observer.observe(hedgingSection);
}

async function myHedgesList() {
    const accounts = await getAccounts();
    const userAddress = accounts[0];
    await loadHedgesModule(userAddress);
}

/*=========================================================================
    INITIALIZE OTHER MODULES
==========================================================================*/

// Event listener for the cashier balances expand/hide
export function setupToggleElements() {
    const toggleBalancesContainer = () => {
        const balancesContainer = document.getElementById('balancesSection');
        balancesContainer.classList.toggle('expanded');
        const expandHeight = balancesContainer.classList.contains('expanded') ? balancesContainer.scrollHeight + 'px' : '0';
        balancesContainer.style.maxHeight = expandHeight;
    };
    document.getElementById('expandClose').addEventListener('click', toggleBalancesContainer);

    // Cashier Modes
    document.addEventListener('change', function (e) {
        if (e.target && e.target.matches('input[type="checkbox"]')) {
            const modeSpan = document.querySelector('.mode');
            const submitButton = document.getElementById('transactSubmit');
    
            if (e.target.checked) {
                // Withdraw mode
                modeSpan.textContent = 'Withdrawing Mode';
                submitButton.textContent = 'Withdraw';
    
                // Change styling for withdrawal mode
                submitButton.style.backgroundColor = '#d6188a';
                submitButton.style.color = '#FFF';
                submitButton.style.border = '1px solid #d6188a';
    
                // Other styling changes if needed
                document.getElementById('erc20-address').style.color = '#F6F';
                document.getElementById('erc20-amount').style.color = '#F6F';
            } else {
                // Deposit mode
                modeSpan.textContent = 'Depositing Mode';
                submitButton.textContent = 'Deposit';
    
                // Change styling for deposit mode
                submitButton.style.backgroundColor = '#1f92ce';
                submitButton.style.color = '#FFF';
                submitButton.style.border = '1px solid #1f92ce';
    
                // Reset other styles for deposit mode
                document.getElementById('erc20-address').style.color = '';
                document.getElementById('erc20-amount').style.color = '';
            }
        }
    });

    // Hedges Panel - toggle active class on button click
    const buttons = document.querySelectorAll('.list-toggle button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((button) => button.classList.remove('active'));
            button.classList.add('active');
        });
    }); 

    // Cashier Token Address paste listener
    document.getElementById('erc20-address').addEventListener('paste', async (event) => {
        const pastedAddress = event.clipboardData.getData('text/plain');
        const accounts = await getAccounts();
        const userAddress = accounts[0];
        let mybalances = {};
        if (!isValidEthereumAddress(pastedAddress)) {
            alert('Please enter a valid Ethereum wallet address.');
            return;
        }
        try {
            // show address indicators
            const tokenSymbol = await getSymbol(pastedAddress);
            const addressDataSpan = document.getElementById("addressData");
            // replace **** with name. escape the stars with \
            addressDataSpan.innerHTML = addressDataSpan.innerHTML.replace(/\*\*\*\*/g, tokenSymbol);
            // get wallet balances
            mybalances = await getUserBalancesForToken(pastedAddress, userAddress);

            // Display balances in the HTML form
            document.getElementById('depositedBalance').textContent = commaNumbering(mybalances.deposited);
            document.getElementById('withdrawnBalance').textContent = commaNumbering(mybalances.withdrawn);
            document.getElementById('lockedInUseBalance').textContent = commaNumbering(mybalances.lockedInUse);
            document.getElementById('withdrawableBalance').textContent = commaNumbering(mybalances.withdrawableBalance);

            // Check if the container is already expanded
            const balancesContainer = document.getElementById('balancesSection');
            const isExpanded = balancesContainer.classList.contains('expanded');
            if (!isExpanded) {
                // If not expanded, toggle to expand
                balancesContainer.classList.add('expanded');
                const expandHeight = balancesContainer.scrollHeight + 'px';
                balancesContainer.style.maxHeight = expandHeight;
            }
        } catch (error) {
            console.error("Error processing wallet address:", error);
        }
    });

    // Cashier Amount paste listener
    document.getElementById('erc20-amount').addEventListener('input', async (event) => {
        const tokenAddress = document.getElementById('erc20-address').value.trim();
        const tokenAmount = event.target.value.trim();

        if (isNaN(tokenAmount) || parseFloat(tokenAmount) < 0) {
            alert('Please enter a valid amount.');
            return;
        }
        if (!isValidEthereumAddress(tokenAddress)) {
            alert('Please enter a valid ERC20 token address.');
            return;
        }

        const accounts = await getAccounts();
        const userAddress = accounts[0];

        try {
            // Fetch balance for ERC20 token address provided using ERC20 balance ABI
            const erc20ABI = [
                { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
                { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'pure', type: 'function' },
            ];

            const pairedContract = new ethers.Contract(tokenAddress, erc20ABI, window.provider);

            const [walletBalance, tokenDecimals] = await Promise.all([
                pairedContract.balanceOf(userAddress),
                pairedContract.decimals(),
            ]);

            // Display balances in the HTML form
            const balance = fromBigIntNumberToDecimal(walletBalance, tokenDecimals);
            const displayBalance = commaNumbering(balance);
            const walletDataSpan = document.getElementById("inWalletBalance");

            // Replace
            walletDataSpan.innerHTML = displayBalance;

        } catch (error) {
            console.error("Error processing wallet address:", error);
        }
    });
}

/* ========================================================================
    Write Function Code starts here
======================================================================== */

document.querySelector('#cashierForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);
  
    // Prepare the form values
    const values = {};
    for (let [key, value] of formData.entries()) {
      values[key] = value;
    }
    // Add the checkbox value to object
    values['checkbox'] = form.querySelector('input[type="checkbox"]').checked;
  
    console.log(values);
  
    // pass to setup deposits fr prep
    setupCashingModule(values);
});

export function setupCashingModule(formValues) {

    //const tokenAddress = formValues['erc20-address'] ? formValues['erc20-address'] : formValues['erc20-select'];
    const tokenAddress = formValues['erc20-address'];
    const tokenAmount = formValues['erc20-amount'];
    const checkboxValue = formValues['checkbox'];

    if (tokenAmount <= 0 || tokenAddress == '' || !isValidEthereumAddress(tokenAddress)) {
        swal(
            {
                title: 'Invalid Tx Inputs...',
                text: 'Please enter a valid token address and amount.',
                type: 'info',
                html: false,
                dangerMode: false,
                confirmButtonText: 'Okay',
                showConfirmButton: true,
                showCancelButton: false,
                animation: 'Pop',
            }, function () {
                console.log('invalid token address...');
            });
        return;
    }

    try {
        if (!tokenAddress || !isValidEthereumAddress(tokenAddress)) {
            //throw new Error('Please enter a valid ERC20 token address.');
            swal(
                {
                    title: 'Invalid ERC20 address pasted...',
                    text: 'Please enter a valid ERC20 token address.',
                    type: 'info',
                    html: false,
                    dangerMode: false,
                    confirmButtonText: 'Okay',
                    showConfirmButton: true,
                    showCancelButton: false,
                    animation: 'Pop',
                }, function () {
                    console.log('incorrect token address...');
                }); 
            return;
        }

        if (isNaN(tokenAmount) || parseFloat(tokenAmount) <= 0) {
            //throw new Error('Please enter a valid token amount greater than 0.');
            swal(
                {
                    title: 'Invalid token amount pasted...',
                    text: 'Please enter an amount greater than 0.',
                    type: 'info',
                    html: false,
                    dangerMode: false,
                    confirmButtonText: 'Okay',
                    showConfirmButton: true,
                    showCancelButton: false,
                    animation: 'Pop',
                }, function () {
                    console.log('invalid token amount...');
                });
            return;
        }

        // If validation passes, proceed to approval first
        if (!checkboxValue) {
            approvalDepositInterface(tokenAmount, tokenAddress);
        } else {
            withdrawInterface(tokenAddress, tokenAmount);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// address indicator spans
$(document).ready(function () {
    $('#erc20-address').on('focus', function () {
        $('#addressData').addClass('expandedData');
    });
    $('#erc20-amount').on('focus', function () {
        $('#walletData').addClass('expandedData');
    });
});

// Copy text to clipboard
document.addEventListener('click', function (event) {
    const copyIcon = event.target.closest('.copy-icon');

    if (copyIcon) {
        const nearestParent = copyIcon.closest('.token-info');
        const textToCopyElement = nearestParent.querySelector('.text-to-copy');

        if (textToCopyElement) {
            const textToCopy = textToCopyElement.innerText.trim();

            // Create a temporary input element
            const tempInput = document.createElement('textarea');
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);

            // Select and copy the text
            tempInput.select();
            document.execCommand('copy');

            // Remove the temporary input element
            document.body.removeChild(tempInput);

            swal ({
                title: 'Copied!',
                text: 'Address copied to clipboard.',
                type: 'success',
                html: false,
                dangerMode: false,
                showConfirmButton: false,
                showCancelButton: false,
                animation: "Pop",
                allowOutsideClick: true,
                timer: 2000,
            })
        } else {
            console.error('No text-to-copy element found.');
        }
    }
});

/*---------------------------------------
    BOTTOM OF EVERY MAIN SCRIPT MODULE 
----------------------------------------*/
// Provider Listeners
ethereum.on("connect", (chainID) => {
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

