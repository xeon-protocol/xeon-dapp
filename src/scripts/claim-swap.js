
import { fromBigIntNumberToDecimal, fromDecimalToBigInt, getAccounts, getTokenDecimalSymbolName, getTokenDecimals, tokenWalletBalance } from './constants.js';


// Uniswap V2 Router address, Sepolia testnet
let uniswapRouterAddress = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008';

// Uniswap V2 Router ABI
let uniswapRouterABI = [
    {inputs: [{internalType: 'uint', name: 'amountOutMin', type: 'uint'}, {internalType: 'address[]', name: 'path', type: 'address[]'}, {internalType: 'address', name: 'to', type: 'address'}, {internalType: 'uint', name: 'deadline', type: 'uint'}], name: 'swapExactETHForTokensSupportingFeeOnTransferTokens', outputs: [{internalType: 'uint[]', name: 'amounts', type: 'uint[]'}], stateMutability: 'payable', type: 'function'},
    {inputs: [{internalType: 'uint', name: 'amountIn', type: 'uint'}, {internalType: 'uint', name: 'amountOutMin', type: 'uint'}, {internalType: 'address[]', name: 'path', type: 'address[]'}, {internalType: 'address', name: 'to', type: 'address'}, {internalType: 'uint', name: 'deadline', type: 'uint'}], name: 'swapExactTokensForETHSupportingFeeOnTransferTokens', outputs: [{internalType: 'uint[]', name: 'amounts', type: 'uint[]'}], stateMutability: 'nonpayable', type: 'function'},
    {inputs: [{internalType: 'uint', name: 'amountIn', type: 'uint'}, {internalType: 'address[]', name: 'path', type: 'address[]'}], name: 'getAmountsOut', outputs: [{internalType: 'uint[]', name: 'amounts', type: 'uint[]'}], stateMutability: 'view', type: 'function'}
];

// Initialize Uniswap V2 Router contract
let deadAddress = '0x000000000000000000000000000000000000dEaD';
let wethAddress = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
let wethDecimal = 18;

// Format output
const formatStringDecimal = (number) => {
    const options = {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };
    return number.toLocaleString('en-US', options);
};

// Function to estimate output amount for a given input amount
async function estimateOutputAmount(inputAmount, inputTokenAddress, outputTokenAddress) {
    
    let uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, window.provider);
    const path = [inputTokenAddress, outputTokenAddress];
    const amountsOut = await uniswapRouterContract.getAmountsOut(inputAmount, path);
    const amountConsole1 = parseInt(amountsOut[1], 16).toString();
    const amountConsole0 = parseInt(amountsOut[0], 16).toString();
    //console.log('amount console1',amountConsole1);
    //console.log('amount console0',amountConsole0);
    return amountsOut[1];
}

// Function to calculate adjusted amountOutMin considering slippage
async function calculateAdjustedAmountOutMin(inputAmount, inputTokenAddress, outputTokenAddress, slippagePercentage) {
    const outputAmount = await estimateOutputAmount(inputAmount, inputTokenAddress, outputTokenAddress);
    const slippageFactor = 100 - slippagePercentage;
    const adjustedAmountOutMin = outputAmount.mul(slippageFactor).div(100);
    return adjustedAmountOutMin;
}

// Function to buy ERC20 tokens using ETH
async function buyTokens(tokenAddress, amountInETH, slippagePercentage) {
    try {
        const userAddress = await getAccounts();
        const walletAddress = userAddress[0];
        let uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, window.provider);

        // Convert the amountInETH value to a BigNumber
        const amountIn = await fromDecimalToBigInt(amountInETH, wethDecimal);
        const adjustedAmountOutMin = await calculateAdjustedAmountOutMin(amountIn, wethAddress, tokenAddress, slippagePercentage);
        const path = [wethAddress, tokenAddress]; // WETH to token
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

        // Prep 
        const [, decimals, symbol] = await getTokenDecimalSymbolName(tokenAddress);
        const amountOut = fromBigIntNumberToDecimal(adjustedAmountOutMin, decimals);
        const amountDisplay = formatStringDecimal(amountOut);
        // Throw swal
        claimingSwal(amountDisplay, symbol);

        // Send transaction
        const signer = window.signer;
        const tx = await uniswapRouterContract.connect(signer).swapExactETHForTokensSupportingFeeOnTransferTokens(
            adjustedAmountOutMin,
            path,
            walletAddress,
            deadline,
            { value: amountIn }
        );

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        if (receipt.status === 1) {
            // Swal
            const transactionMessage = `
            <div><p>${amountDisplay} ${symbol} Claimed'</p></div>
            <div><p>Proceed to the `+ '<a href="./wallet.html">Wallet Page</a>' +` to make a Deposit into our Testnet Vault to get started with trading.</p></div>`;
            swal({
                type: "success",
                title: "Tokens Claimed",
                text: transactionMessage,
                html: true,
                showCancelButton: false,
                confirmButtonColor: "#04C86C",
                confirmButtonText: "Done!",
                closeOnConfirm: true
            }, async function (isConfirm) {
                
            });
        } else {
            // Transaction failed
            console.log('Claim failed. Receipt status: ' + receipt.status);
            swal({ title: "Failed to Claim.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Receipt status: " + receipt.status });
        }    
    } catch (error) {
        console.error('Error:', error.message);
        swal({ title: "Failed to Claim.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Receipt status: " + error.message });
    }
}

async function claimingSwal(amountDisp, symbol) {
    const transactionMessage = amountDisp + ' ' + symbol;
    swal({
        type: "info",
        title: "Claiming Testnet Tokens",
        text: transactionMessage,
        html: true,
        showCancelButton: false,
        confirmButtonColor: "#04C86C",
        confirmButtonText: "Confirm",
        closeOnConfirm: true
    }, async function (isConfirm) {
        
    });
}


// Function to sell ERC20 tokens for ETH
async function sellTokens(tokenAddress, amountInTokens, slippagePercentage) {
    try {
        //wallet is connected if you made it this far, check balance
        const userAddress = await getAccounts();
        const walletAddress = userAddress[0];
        const walletBalance = await tokenWalletBalance(tokenAddress, walletAddress);

        //quick check    
        const [, tokenDecimal, symbol] = await getTokenDecimalSymbolName(tokenAddress);
        const amountInTokensBN = fromDecimalToBigInt(amountInTokens, tokenDecimal);
        let amountIn = walletBalance;
        if (walletBalance > amountInTokensBN) {
            amountIn = amountInTokensBN;
        }
        if (walletBalance === 0) {
            swal ({ title: "No Tokens in Wallet", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Please add some " + symbol + " tokens to your wallet." });
        }
        
        const amountOutDecimal = fromBigIntNumberToDecimal(amountIn, tokenDecimal);
        const amountDisplay = formatStringDecimal(amountOutDecimal);

        // Approve tokens
        approvingSwal(amountDisplay, symbol);
        const allowance = await tokenAllowance(tokenAddress, walletAddress, uniswapRouterAddress);
        if (allowance < amountIn) {
            await approveTokens(tokenAddress, amountIn);
        }

        let uniswapRouterContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, window.provider);
        const path = [tokenAddress, wethAddress]; // Token to ETH
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

        // throw returning swal
        sellingSwal(amountDisplay, symbol);

        const signer = provider.getSigner();
        const tx = await uniswapRouterContract.connect(signer).swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            0,
            path,
            walletAddress,
            deadline
        );

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        if (receipt.status === 1) {
            // Swal
            const transactionMessage = `
            <div><p>${amountDisplay} ${symbol} Returned.</p></div>
            <div><p>Thank you for keeping the testnet LPs healthy!</p></div>`;
            swal({
                type: "success",
                title: "Tokens Returned",
                text: transactionMessage,
                html: true,
                showCancelButton: false,
                confirmButtonColor: "#04C86C",
                confirmButtonText: "Done!",
                closeOnConfirm: true
            }, async function (isConfirm) {
                
            });
        } else {
            // Transaction failed
            console.log('Return failed. Receipt status: ' + receipt.status);
            swal({ title: "Failed to Return.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Receipt status: " + receipt.status });
        }    
    } catch (error) {
        console.error('Error:', error.message);
        swal({ title: "Failed to Return.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Receipt status: " + error.message });
    }
    
}

const erc20ABI = [
    {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
    {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"type":"function"}
];

async function tokenAllowance(tokenAddress, ownerAddress, spenderAddress) {
    try {
        // Get the signer
        const signer = provider.getSigner();
        
        // Load ERC20 token contract
        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        
        // Fetch allowance
        const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
        
        return allowance;
    } catch (error) {
        console.error('Error fetching allowance:', error);
        return 0; // Return 0 in case of error
    }
}

async function approveTokens(tokenAddress, amount) {
    try {
        // Get the signer
        const signer = provider.getSigner();
        
        // Load ERC20 token contract
        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
        
        // Approve tokens for spending
        const tx = await tokenContract.approve(uniswapRouterAddress, amount);
        
        // Wait for transaction confirmation
        await tx.wait();
        
        console.log('Tokens approved successfully.');
    } catch (error) {
        console.error('Error approving tokens:', error);
    }
}

async function approvingSwal(amountDisp, symbol) {
    const transactionMessage = amountDisp + ' ' + symbol;
    swal({
        type: "info",
        title: "1/2. Approving Testnet Tokens",
        text: transactionMessage,
        html: true,
        showCancelButton: false,
        confirmButtonColor: "#04C86C",
        confirmButtonText: "Confirm",
        closeOnConfirm: true
    }, async function (isConfirm) {
        
    });
}
async function sellingSwal(amountDisp, symbol) {
    const transactionMessage = amountDisp + ' ' + symbol;
    swal({
        type: "info",
        title: "2/2. Returning Testnet Tokens",
        text: transactionMessage,
        html: true,
        showCancelButton: false,
        confirmButtonColor: "#04C86C",
        confirmButtonText: "Confirm",
        closeOnConfirm: true
    }, async function (isConfirm) {
        
    });
}
export { buyTokens, sellTokens };
