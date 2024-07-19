/*=========================================================================
    Import modules
==========================================================================*/
import { CONSTANTS, getUserBalancesForToken, truncateAddress, fromBigIntNumberToDecimal, fromDecimalToBigInt, getAccounts, getTokenDecimalSymbolName, getSymbol, getTokenDecimals, tokenWalletBalance } from './constants.js';
import { initializeConnection } from './web3-walletstatus-module.js';

/*======================================================
    WRITE FUNCTION CALLS for the wallet module
======================================================*/
async function allowanceCheck(tokenAddress) {
    const vaultAddress = CONSTANTS.hedgingAddress;
    const accounts = await getAccounts();

    if (accounts.length === 0) {
        console.error('No wallet connected. Please connect a wallet.');
        return;
    }

    const tokenContract = new ethers.Contract(tokenAddress, [
        { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
        { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "pure", "type": "function" },
        { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" },
    ], provider);

    const [allowanceResult, decimals, symbol] = await Promise.all([
        tokenContract.allowance(accounts[0], vaultAddress),
        tokenContract.decimals(),
        tokenContract.symbol(),
    ]);
    
    console.log('allowance: '+allowanceResult+' decimal: '+decimals+' symbol: '+symbol)

    const allowanceDecimal = fromBigIntNumberToDecimal(allowanceResult, decimals);

    return { allowance: allowanceDecimal, symbol: symbol, decimals: decimals };
}

async function approvalDepositInterface(tokenAmount, tokenAddress) {
    
    $("#transactSubmit").html('<i class="fa fa-spinner fa-spin"></i> transacting...');
    
    // Prepare addresses
    const accounts = await getAccounts();
    const walletAddress = accounts[0];
    const walletAddressTrunc = truncateAddress(walletAddress);
    const vaultAddress = CONSTANTS.hedgingAddress;
    const vaultAddressTrunc = truncateAddress(vaultAddress);

    // token allowance from wallet to Vault
    const allowanceResult = await allowanceCheck(tokenAddress);
    const allowance = Number(allowanceResult.allowance);
    const decimals = Number(allowanceResult.decimals);
    const symbol = allowanceResult.symbol;
    tokenAmount = Number(tokenAmount);

    // Format output
    const formatStringDecimal = (number) => {
        const options = {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
        };
        return number.toLocaleString('en-US', options);
    };
    // token balance check
    const walletBalanceRaw = await tokenWalletBalance(tokenAddress, walletAddress);
    const walletBalance = fromBigIntNumberToDecimal(walletBalanceRaw, decimals);
    const tokenAmountString = formatStringDecimal(tokenAmount);
    const walletBalanceString = formatStringDecimal(walletBalance);

    // Check sufficient funds
    if (tokenAmount > walletBalance) {
        console.log('Insufficient Wallet Balance.');
        swal({
            title: "Insufficient Wallet Balance",
            type: "warning",
            text: "You don't have enough tokens to continue..",
            html: true,
            showCancelButton: false,
            confirmButtonColor: "#04C86C",
            confirmButtonText: "Ooops",
            closeOnConfirm: true
        }, async function(isConfirm) {  }); // close swal
        return;
    }

    let transactionMessage = '';
    let proceedButtonText = 'checking ...';
    // prepare approved info panel for swal below
    // classes on left are for size, on right are for coloring & font
    // interfaceWindow is displayed once in a swal popup, then changes messages on transaction status
    transactionMessage = `
            <div id="approvalRequired" class="interfaceWindow">  
                <span class="txStatus">Approval Required</span>
                <div class="approvalInfo">
                    <p>
                        <span class="txInfoHead txInfoAmount">${tokenAmountString}</span>
                        <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                    <p>
                        <span class="txInfoBody txInfoAddress">${walletAddressTrunc} <a href="https://etherscan.io/address/${walletAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>                    
                        <span class="txInfoBody txActionTitle">To:</span>
                        <span class="txInfoBody txInfoAddress">${vaultAddressTrunc} <a href="https://etherscan.io/address/${vaultAddress}" target="_blank"><i class="fa fa-external-link"></i></a></span>  
                    </p>
                </div>

                <div class="explainer">
                    <span> 
                        <i class="fa fa-info-circle"></i>
                        Vault requires token Approval. Proceed to sign the Approval Transaction with your wallet.
                    </span>
                </div>
            </div>

            <div id="approvalInProgress" class="interfaceWindow">
                <span class="txStatus">Approval in progress</span>
                <div class="approvalInfo">
                    <p>Please confirm the transaction in your wallet.</p>
                </div>
                <span class="walletbalanceSpan">Approving ${tokenAmountString} ${symbol} to <a href="https://etherscan.io/token/${vaultAddress}" target="_blank">Vault <i class="fa fa-external-link"></i></a></span>
            </div>

            <div id="depositInProgress" class="interfaceWindow">
                <span class="txStatus">Deposit in progress</span>
                <div class="approvalInfo">
                    <p>Please confirm the transaction in your wallet.</p>
                </div>
                <span class="walletbalanceSpan">Depositing ${tokenAmountString} ${symbol} to <a href="https://etherscan.io/token/${vaultAddress}" target="_blank">Vault <i class="fa fa-external-link"></i></a></span>
            </div>

            <div id="withdrawInProgress" class="interfaceWindow">
                <span class="txStatus">Withdrawal in progress</span>
                <div class="approvalInfo">
                    <p>Please confirm the transaction in your wallet.</p>
                </div>
                <span class="walletbalanceSpan">Withdrawing ${tokenAmountString} ${symbol} from <a href="https://etherscan.io/token/${vaultAddress}" target="_blank">Vault <i class="fa fa-external-link"></i></a></span>
            </div>

            <div id="depositRequired" class="interfaceWindow ">  
                <span class="txStatus">Proceed to Deposit</span>
                <div class="approvalInfo">
                    <p>
                        <span class="txInfoHead txInfoAmount">${tokenAmountString}</span>
                        <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                    <p>
                        <span class="txInfoBody txActionTitle">Deposit To Vault:</span>
                        <span class="txInfoBody txInfoAddress">${vaultAddressTrunc} <a href="https://etherscan.io/address/${vaultAddress}" target="_blank"><i class="fa fa-external-link"></i></a></span>  
                    </p>
                </div>

                <div class="explainer">
                    <span> 
                        <i class="fa fa-info-circle"></i>
                        Click deposit below, your wallet will be prompted to Sign the Deposit Transaction. 
                    </span>
                </div>
            </div>

            <div id="insufficientBalance" class="interfaceWindow">  
                <span class="txStatus">Insufficient Balance</span>
                <div class="approvalInfo">
                    <p> 
                        <span class="txInfoHead txInfoAmount">${walletBalance}</span>
                        <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                    <p>
                        <span class="txInfoBody txActionTitle">Required:</span>
                        <span class="txInfoBody txInfoAmount">${tokenAmountString}</span>
                        <span class="txInfoBody txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                </div>
            </div>

            <div id="allowanceSuccess" class="interfaceWindow">
                <span class="txStatus">Allowance</span>
                <div class="approvalInfo">
                    <p>
                        <span class="txInfoHead txInfoAmount">${tokenAmountString}</span>
                        <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                    <p>
                        <span class="txInfoBody txInfoAddress">${walletAddressTrunc} <a href="https://etherscan.io/address/${walletAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>                    
                        <span class="txInfoBody txActionTitle">To:</span>
                        <span class="txInfoBody txInfoAddress">${vaultAddressTrunc} <a href="https://etherscan.io/address/${vaultAddress}" target="_blank"><i class="fa fa-external-link"></i></a></span>  
                    </p>
                </div>

                <div class="explainer">
                    <span> 
                        <i class="fa fa-info-circle"></i>
                        Token allowance set. Click proceed below to deposit.
                    </span>
                </div>
            </div>

            <div id="depositSuccess" class="interfaceWindow">
                <span class="txStatus">Deposit Success</span>
                <div class="approvalInfo">
                    <p>
                        <span class="txInfoHead txInfoAmount">${tokenAmountString}</span>
                        <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                    <p>                   
                        <span class="txActionTitle">To:</span>
                        <span class="txInfoAddress">${vaultAddressTrunc} <a href="https://etherscan.io/address/${vaultAddress}" target="_blank"><i class="fa fa-external-link"></i></a></span>  
                    </p>
                </div>
                <div class="explainer">
                    <span> 
                        <i class="fa fa-info-circle"></i>
                        Tokens deposited and ready to use.
                    </span>
                </div>
            </div>
            <div id="withdrawSuccess" class="interfaceWindow">
                <span class="txStatus">Withdrawal Success</span>
                <div class="approvalInfo">
                    <p>
                        <span class="txInfoHead txInfoAmount">${tokenAmountString}</span>
                        <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                    </p>
                    <p>                   
                        <span class="txActionTitle">From:</span>
                        <span class="txInfoAddress">${vaultAddressTrunc} <a href="https://etherscan.io/address/${vaultAddress}" target="_blank"><i class="fa fa-external-link"></i></a></span>  
                    </p>
                </div>
                <div class="explainer">
                    <span> 
                        <i class="fa fa-info-circle"></i>
                        Tokens withdrawn back to wallet.
                    </span>
                </div>
            </div>
        `;

    // Prepare deposit states
    let allowanceRequired = allowance < tokenAmount && walletBalance >= tokenAmount;
    let depositRequired = allowance >= tokenAmount && walletBalance >= tokenAmount;
    let approved = allowance >= tokenAmount && walletBalance >= tokenAmount;
    swal({
        type: "info",
        title: "Vault Deposit",
        text: transactionMessage,
        html: true,
        showCancelButton: true,
        confirmButtonColor: "#04C86C",
        confirmButtonText: proceedButtonText,
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
    }, async function(isConfirm) {
        if (isConfirm) {
            // Check if wallet has enough permissions
            if (!allowanceRequired && !depositRequired && !approved) {
                $('.confirm').prop("disabled", true);
            } else {
                $('.confirm').prop("disabled", false);
                $('.confirm').html('<i class="fa fa-spinner fa-spin"></i> Processing...');
        
                if (allowanceRequired) {
                    tokenApprovingMessage();
                    // Submit Transaction to Vault
                    await vaultApprove(tokenAddress, tokenAmount);
                } else if (depositRequired) {         
                    tokenDepositingMessage();
                    // Submit Transaction to Vault
                    await vaultDeposit(tokenAddress, tokenAmount);
                }
            }
        }  else {
            // User clicked the cancel button
            swal("Cancelled", "Your money is safe :)", "error");
            $('#transactSubmit').html('Deposit');
        }       
    });

    // Run display changes after swal load
    console.log("allowance: " + allowance + ", tokenAmount: " + tokenAmount + ", walletBalance: " + walletBalance);

    if (allowance < tokenAmount) {
        // Slide out current message
        $(".interfaceWindow").hide();
        // Slide in approval success
        $("#approvalRequired").fadeIn("slow");
        // Proceed button text
        $('.confirm').html('Approve');

    } else if (allowance >= tokenAmount) {
        // Slide out current message
        $(".interfaceWindow").hide();
        // Slide in approval success
        $("#depositRequired").fadeIn("slow");
       // Proceed button text
       $('.confirm').html('Deposit');
    }
    // if insufficient balance inform user
    if (walletBalance < tokenAmount) {
       // Disable confirm button
       $("#confirmButton").prop("disabled", true);
       // Slide out current message
       $(".interfaceWindow").hide();
       // Slide in approval success
       $("#insufficientBalance").fadeIn("slow");
       // Proceed button text
       $('.confirm').html('<i class="fa fa-spinner fa-spin"></i> Wait...');
    }

}

async function vaultApprove(tokenAddress, tokenAmount) {
    try {
        // Retrieve wallet connected
        const accounts = await getAccounts();
        if (accounts.length === 0) {
            console.log('No wallet connected. Please connect a wallet.');
            return;
        }
        const walletAddress = accounts[0];
        const vaultAddress = CONSTANTS.hedgingAddress;

        const [, decimals, symbol] = await getTokenDecimalSymbolName(tokenAddress);
        const approveAmountWei = fromDecimalToBigInt(tokenAmount, decimals);

        // ERC20 ABI & instance
        const erc20ABI = [
            { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" },
        ];
        
        const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, window.provider);
        
        // Prepare Tx
        const transaction = await tokenContract.connect(signer).approve(vaultAddress, approveAmountWei);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        if (receipt.status === 1) {
            // Show success message
            tokenApprovedMessage(tokenAmount, tokenAddress);
            console.log('Approval successful.');
        } else {
            // Transaction failed
            console.log('Approval failed. Receipt status: ' + receipt.status);
            swal({ title: "Failed.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Transaction failed. Receipt status: " + receipt.status });
        }

        // Enable confirm button again
        $('.confirm').prop("disabled", false);
    } catch (error) {
        console.error('Approval error:', error);
        swal({ title: "Failed.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Transaction error: " + error.message });
    }
}

async function vaultDeposit(tokenAddress, tokenAmount) {
    try {
        // Retrieve wallet connected
        const accounts = await getAccounts();
        if (accounts.length === 0) {
            console.log('No wallet connected. Please connect a wallet.');
            return;
        }
        const walletAddress = accounts[0];
        const vaultAddress = CONSTANTS.hedgingAddress;

        const [, decimals, symbol] = await getTokenDecimalSymbolName(tokenAddress);
        const depositAmountWei = fromDecimalToBigInt(tokenAmount, decimals);

        // Prepare Tx
        const transaction = await hedgingInstance.connect(signer).depositToken(tokenAddress, depositAmountWei);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        if (receipt.status === 1) {
            // Call functions on success
            tokenDepositedMessage(receipt.transactionHash);
            console.log('Deposit successful...');
            console.log('Transaction Hash: '+ receipt.transactionHash);
        } else {
            // Transaction failed
            console.log('Deposit failed. Receipt status: ' + receipt.status);
            swal({ title: "Failed.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Transaction failed. Receipt status: " + receipt.status });
        }
    } catch (error) {
        console.error('Deposit error:', error);
        swal({ title: "Failed.", type: "error", allowOutsideClick: true, confirmButtonColor: "#F27474", text: "Transaction error: " + error.message });
    }
}

// Withdrawal process handler
// Receives decimals 
async function withdrawInterface(tokenAddress, tokenAmount) {
    
    $("#transactSubmit").html('<i class="fa fa-spinner fa-spin"></i> transacting...');

    tokenAmount = Number(tokenAmount);
    const accounts = await getAccounts();
    const walletAddress = accounts[0];
    const vaultAddress = CONSTANTS.hedgingAddress;
    const vaultAddressTrunc = truncateAddress(vaultAddress);

    if (accounts.length === 0) {
        console.log('No wallet connected. Please connect a wallet.');
        swal({
            title: "Connect Wallet",
            text: "Please connect your wallet to proceed..",
            html: true,
            showCancelButton: false,
            confirmButtonColor: "#04C86C",
            confirmButtonText: "Ooops",
            closeOnConfirm: true
        }, async function(isConfirm) {
            $("#transactSubmit").html('Withdraw');
        }); // close swal
        return;
    }

    // Format output
    const formatStringDecimal = (number) => {
        const options = {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
        };
        return number.toLocaleString('en-US', options);
    };
    
    try {
        // check if wallet has enough balance in Vault: return decimal
        const mybalances = await getUserBalancesForToken(tokenAddress, walletAddress);
        const walletBalance = mybalances.withdrawableBalance;
        const tokenAmountString = formatStringDecimal(tokenAmount);
        const walletBalanceString = formatStringDecimal(walletBalance);

        const tokenDecimals = await getTokenDecimals(tokenAddress);
        const tokenAmountBigInt = fromDecimalToBigInt(tokenAmount, tokenDecimals);
        // symbol for messages
        const symbol = await getSymbol(tokenAddress);

        // Check sufficient funds
        /* deprecated
        if (tokenAmount > walletBalance) {
            console.log('Insufficient funds to withdraw.');
            swal({
                title: "Insufficient Vault Balances",
                type: "warning",
                text: "You are attempting to withdraw amount > balance.",
                html: true,
                showCancelButton: false,
                confirmButtonColor: "#04C86C",
                confirmButtonText: "Ooops",
                closeOnConfirm: true
            }, async function(isConfirm) {  }); // close swal
            return;
        }
        */

        // classes on left are for size, on right are for coloring & font
        // interfaceWindow is displayed once in a swal popup, then changes messages on transaction status
        let transactionMessage = '';
        let proceedButtonText = 'checking ...';
        transactionMessage = `
                <div id="withdrawConfirm" class="interfaceWindow">
                    <span class="txStatus">You are about to withdraw</span>
                    <span class="walletbalanceSpan">${tokenAmountString} ${symbol} from <a href="https://etherscan.io/token/${vaultAddress}" target="_blank">Vault <i class="fa fa-external-link"></i></a></span>
                    <div class="approvalInfo">
                        <p>Proceed and confirm the transaction in your wallet.</p>
                    </div>
                </div>
                <div id="withdrawInProgress" class="interfaceWindow">
                    <span class="txStatus">Withdrawal in progress</span>
                    <div class="approvalInfo">
                        <p>Please confirm the transaction in your wallet.</p>
                    </div>
                    <span class="walletbalanceSpan">Withdrawing ${tokenAmountString} ${symbol} from <a href="https://etherscan.io/token/${vaultAddress}" target="_blank">Vault <i class="fa fa-external-link"></i></a></span>
                </div>

                <div id="insufficientBalance" class="interfaceWindow">  
                    <span class="txStatus">Insufficient Balance</span>
                    <div class="approvalInfo">
                        <p> 
                            <span class="txInfoBody txActionTitle">Available: </span>
                            <span class="txInfoHead txInfoAmount">${walletBalanceString}</span>
                            <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                        </p>
                        <p>
                            <span class="txInfoBody txActionTitle">Required: </span>
                            <span class="txInfoBody txInfoAmount">${tokenAmountString}</span>
                            <span class="txInfoBody txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                        </p>
                    </div>
                </div>
                <div id="withdrawSuccess" class="interfaceWindow">
                    <span class="txStatus">Withdrawal Success</span>
                    <div class="approvalInfo">
                        <p>
                            <span class="txInfoHead txInfoAmount">${tokenAmountString}</span>
                            <span class="txInfoHead txInfoSymbol"> ${symbol} <a href="https://etherscan.io/token/${tokenAddress}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                        </p>
                        <p>                   
                            <span class="txActionTitle">From:</span>
                            <span class="txInfoAddress">${vaultAddressTrunc} <a href="https://etherscan.io/address/${vaultAddress}" target="_blank"><i class="fa fa-external-link"></i></a></span>  
                        </p>
                    </div>
                    <div class="explainer">
                        <span> 
                            <i class="fa fa-info-circle"></i>
                            Tokens withdrawn back to wallet.
                        </span>
                    </div>
                </div>
            `;

        // Prepare withdraw states
        let insufficientBalance = walletBalance < tokenAmount;
        // Scenarios with closing and proceeding
        let swalType = "info";
        let closeOnConfirm = false, showCancelButton = true;

        if (insufficientBalance) {
            closeOnConfirm = true;
            showCancelButton = false;
            swalType = "warning";
        }

        swal({
            type: swalType,
            title: "Vault Withdrawal",
            text: transactionMessage,
            html: true,
            showCancelButton: showCancelButton,
            confirmButtonColor: "#04C86C",
            confirmButtonText: proceedButtonText,
            cancelButtonText: "Cancel",
            closeOnConfirm: closeOnConfirm,
            closeOnCancel: true
        }, async function (isConfirm) {
            if (isConfirm) {
                // Check if wallet has enough balance
                if (insufficientBalance) {
                    $('.confirm').prop("disabled", true);
                } else {
                    $('.confirm').prop("disabled", false);
                    $('.confirm').html('<i class="fa fa-spinner fa-spin"></i> Processing...');
                    // Progress notification
                    tokenWithdrawingMessage(tokenAddress, tokenAmount, symbol);
                    // Call proceed function
                    await vaultWithdraw(tokenAddress, tokenAmountBigInt, symbol);
                }
            } else {
                // User clicked the cancel button
                swal("Cancelled", "Your money is safe :)", "error");
                $("#transactSubmit").html('Withdraw');
            }
        });

        // Run display scrips on swal load
        console.log("request: " + tokenAmount + ", walletBalance: " + walletBalance);
        if (walletBalance < tokenAmount) {
            $(".interfaceWindow").hide();
            $("#insufficientBalance").fadeIn("slow");
            $('.confirm').html('Oops!');
        } else {
            $(".interfaceWindow").hide();
            $("#withdrawConfirm").fadeIn("slow");
            $('.confirm').html('Withdraw...');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function vaultWithdraw(tokenAddress, tokenAmount, tokenSymbol) {
    try {
        const accounts = await getAccounts();        
        const walletAddress = accounts[0];
        // Gas Tx
        /*
        const functionSelector = hedgingInstance.withdrawToken(tokenAddress, tokenAmount).encodeABI();
        const transactionObject = {
            to: CONSTANTS.neonAddress,
            data: functionSelector,
            from: walletAddress
        };
        const gasEstimate = await window.provider.estimateGas(transactionObject);
        transactionObject.gasLimit = gasEstimate;
        */

        // Submit Tx
        const transaction = await hedgingInstance.connect(signer).withdrawToken(tokenAddress, tokenAmount);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        if (receipt.status === 1) {
            console.log('Withdrawal successful. Transaction hash:', receipt.transactionHash);
            // Progress notification
            tokenWithdrawnMessage(receipt.transactionHash);
            // Call refresh function
            refreshBalances();
        } else {
            console.log('Withdrawal failed. Receipt status:', receipt.status);
            swal({
                title: "Withhdrawal Failed.",
                type: "error",
                allowOutsideClick: true,
                confirmButtonColor: "#F27474",
                text: "Transaction Failed. Receipt status: " + receipt.status
            });
        }
    } catch (error) {
        console.error('Withdrawal error:', error.message);
        swal({
            title: "Failed.",
            type: "error",
            allowOutsideClick: true,
            confirmButtonColor: "#F27474",
            text: "Transaction error: " + error.message
        });
        $('#transactSubmit').html('Withdraw');
    }
}

async function tokenApprovingMessage() {
    // Slide out the existing content
    $(".interfaceWindow").hide();
    // Slide in the new content
    $("#approvalInProgress").fadeIn(2);

    // Disable confirm button
    $('.confirm').prop("disabled", true);
}

function tokenApprovedMessage(tokenAmount, tokenAddress) {
    // Slide out approval in progress
    $(".interfaceWindow").hide();
    // Slide in approval success
    $("#allowanceSuccess").fadeIn("slow");

    setTimeout(function() {
        approvalDepositInterface(tokenAmount, tokenAddress); 
    }, 4000);  
}

function tokenDepositingMessage() {

    // Slide out the existing content
    $(".interfaceWindow").hide();
    // Slide in the new content
    $("#depositInProgress").fadeIn("slow");

    // Disable confirm button
    $('.confirm').prop("disabled", true);
}

function tokenDepositedMessage(transactionHash) {
    // Slide out approval in progress
    $(".interfaceWindow").hide();
    // Slide in approval success
    $("#depositSuccess").fadeIn("slow");
    // Reset cashier button
    $('#transactSubmit').html('Deposit Again..');
    // Disable all buttons
    $('.cancel').prop("disabled", true);

    // Wait for 3 seconds
    setTimeout(function() {
        // Disable confirm button again
        $('.confirm').prop("disabled", true);

        const transactionMessage = `
        <div class="interfaceWindow">  
            <div class="approvalInfo">
                <p>
                <span class="txInfoHead txInfoSymbol"> view transaction... <a href="https://sepolia.etherscan.io/tx/${transactionHash}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                <span class="txInfoHead txInfoSymbol"> trade on silkroad... <a href="./index.html" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                </p>
            </div>
        </div>`;

        swal({
            title: "Deposit Successful",
            type: "success",
            text: transactionMessage,
            html: true,
            showCancelButton: false,
            confirmButtonColor: "#04C86C",
            confirmButtonText: "Wow!",
            cancelButtonText: "Cancel",
            closeOnConfirm: true
        }, async function(isConfirm) {
            if (isConfirm) {
                await initializeConnection();
            }  else {
                // User clicked the cancel button
                swal("Cancelled", "Your money is safe :)", "error");
                $('#transactSubmit').html('Deposit Again..');
            }       
        }); // close swal
    }, 3000); 
}

function tokenWithdrawingMessage() {

    // Slide out the existing content
    $(".interfaceWindow").hide();
    // Slide in the new content
    $("#withdrawInProgress").fadeIn("slow");

    // Disable confirm button
    $('.confirm').prop("disabled", true);
}

function tokenWithdrawnMessage(transactionHash) {

    // Slide out approval in progress
    $(".interfaceWindow").hide();
    // Slide in approval success
    $("#withdrawSuccess").fadeIn("slow");
    $('#transactSubmit').html('Withdraw Again..');
    // Disable all buttons
    $('.cancel').prop("disabled", true);
    $('.confirm').prop("disabled", true);

    // Wait for 3 seconds
    setTimeout(function() {
        const transactionMessage = `
        <div class="interfaceWindow">  
            <div class="approvalInfo">
                <p>
                    <span class="txInfoHead txInfoSymbol"> view transaction... <a href="https://sepolia.etherscan.io/tx/${transactionHash}" target="_blank"><i class="fa fa-external-link"></i></a> </span>
                </p>
            </div>
        </div>`;

        swal({
            title: "Withdrawal Successful",
            type: "success",
            text: transactionMessage,
            html: true,
            showCancelButton: false,
            confirmButtonColor: "#04C86C",
            confirmButtonText: "Wow!",
            cancelButtonText: "Cancel",
            closeOnConfirm: true
        }, async function(isConfirm) {
            if (isConfirm) {
                await initializeConnection();
            }  else {
                // User clicked the cancel button
                swal("Cancelled", "Your money is safe :)", "error");
                $('#transactSubmit').html('Deposit Again..');
            }       
        }); // close swal
    }, 3000); 
}








/* WITHDRAWALs */











/* Deprecated Deposit Function

async function proceedDepositTx(tokenAddress, tokenAmount, tokenSymbol) {
    try {
        const accounts = await getAccounts();

        if (accounts.length === 0) {
            throw new Error('No wallet connected. Please connect a wallet.');
        }

        const walletAddress = accounts[0];
        const functionSelector = hedgingInstance.depositToken(tokenAddress, tokenAmount).encodeABI();
        const transactionObject = {
            to: CONSTANTS.neonAddress,
            data: functionSelector,
            from: walletAddress
        };
        const gasEstimate = await window.provider.estimateGas(transactionObject);
        transactionObject.gasLimit = gasEstimate;

        // Submit deposit Tx & Listen for the transaction to be mined
        const transaction = await window.ethereum.sendTransaction(transactionObject);
        const receipt = await transaction.wait();

        if (receipt.status === 1) {
            console.log('Deposit status: ' + receipt.status);
            console.log('Transaction hash:', receipt.transactionHash);
            // Progress notification
            tokenDepositedMessage(tokenAddress, tokenAmount, tokenSymbol);
            // Call refresh function
            refreshBalances();
        } else {
            console.log('Deposit Failed Receipt status: ' + receipt.status);
            swal({
                title: "Failed.",
                type: "error",
                allowOutsideClick: true,
                confirmButtonColor: "#F27474",
                text: "Transaction Failed Receipt status: " + receipt.status
            });
        }
    } catch (error) {
        console.error('Deposit error:', error);
        swal({
            title: "Failed.",
            type: "error",
            allowOutsideClick: true,
            confirmButtonColor: "#F27474",
            text: "Transaction error: " + error.message
        });
    }
}
*/

// Event listener for modal being hidden
/*
Swal.fire({
    onClose: () => {
        $("#transactSubmit").html('Transact');
    },
});
*/

// Dummy refresh balances on networth card & append <li> to token list
function refreshBalances() {
    console.log('Refreshing balances...');
}

export { allowanceCheck, approvalDepositInterface, withdrawInterface };
  