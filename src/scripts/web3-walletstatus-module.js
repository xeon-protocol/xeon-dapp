/*=========================================================================
    Import modules
==========================================================================*/

import {
  CONSTANTS,
  commaNumbering,
  fromBigIntNumberToDecimal,
  getAccounts,
  isValidEthereumAddress,
  truncateAddress,
} from "./constants.js";
import { initWeb3 } from "./dapp-web3-utils.js";

/*=========================================================================
    wallet module functions
==========================================================================*/

// Checks and Returns status(bool) if wallet is ready for data scripts
// All checks have to pass or it returns false immidietly, displaying the swal for the level it failed at
async function initializeConnection() {
  // 1. Set Provider and Contract instances
  await initWeb3();
  // 2. Check Chain
  let correctChain = false,
    unlockedWal = false;
  try {
    correctChain = await chainCheck();
    console.log("initializing correct blockchain..." + correctChain);
    if (correctChain) {
      //3. Start syncying block number
      await currentBlock();

      //4. Initialize Wallet
      unlockedWal = await unlockedWallet();
      if (!unlockedWal) {
        console.log("initializing failed, wallet locked..");
        window.currentAccount = null;
        return false; // Failed regardless
      } else {
        console.log("initializing success, wallet unlocked..");
        // not crucial to await, slows page coz of price api
        walletCheckProceed();
        return true; // Passed all Checks
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Called after scripts pass initialization to continue loading
// Just checks if any accounts are connected to website
// This is also called constantly by event listerners if no internet, hence always poppin this swal over all others,
//...so check initialization again, redundant but only way to verify
async function handleAccountChange(wallets) {
  if (wallets.length === 0) {
    $(".wallets").css("display", "none");
    $(".wallet_connect").css("display", "inline-block");
    console.log("Please connect to MetaMask.");

    swal(
      {
        type: "warning",
        title: "Wallet Required",
        text: "Please connect a wallet to use the Dapp.",
        html: true,
        showCancelButton: true,
        confirmButtonColor: "#04C86C",
        confirmButtonText: "Connect..",
        cancelButtonText: "Nay.",
        closeOnConfirm: true,
      },
      async function (isConfirm) {
        if (isConfirm) {
          reqConnect(wallets);
        }
      }
    );
  }
  if (wallets.length !== 0 || wallets[0] !== window.currentAccount) {
    // global variable..sets to empty array if initialization fails wallet check above,
    window.currentAccount = wallets[0];
    // Refresh connection message
    console.log("Wallet Connected:", wallets);
    swal({
      type: "success",
      title: "Wallet Connected",
      text: `${truncateAddress(wallets[0])}`,
      html: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "Close",
      closeOnConfirm: true,
      timer: 2000,
    });
  }
}

async function handleNetworkChange(chainID) {
  if (chainID !== CONSTANTS.network) {
    console.log(
      "Reading chain:" + chainID + ", instead of, " + CONSTANTS.network
    );
    swal(
      {
        type: "error",
        title: "Wrong Blockchain",
        text: "Please connect to: " + CONSTANTS.network,
        html: true,
        showCancelButton: false,
        confirmButtonColor: "#04C86C",
        confirmButtonText: "Ooops",
        closeOnConfirm: true,
      },
      async function () {
        // request network change
        $(".wallets, .walletpur").css("display", "none");
        $(".network_switch").css("display", "inline-block");
        switchNetwork();
      }
    );

    $(".wallets, .walletpur").css("display", "none");
    $(".network_switch").css("display", "inline-block");
  } else {
    console.log("Reading from mainnet: ", chainID);
    $(".wallets, .network_switch").css("display", "none");
    await initializeConnection();
  }
}

async function unlockedWallet() {
  let accounts = await provider.listAccounts();
  try {
    if (accounts.length > 0) {
      $(".wallets").css("display", "none");
      $(".walletpur").css("display", "inline-block");
      return true;
    } else {
      $(".wallets").css("display", "none");
      $(".wallet_connect").css("display", "inline-block");
      console.log("Please connect to MetaMask.");
      swal(
        {
          type: "warning",
          title: "Wallet Required",
          text: "Please connect wallet to use the Dapp.",
          html: true,
          showCancelButton: true,
          confirmButtonColor: "#04C86C",
          confirmButtonText: "Connect..",
          cancelButtonText: "Nay.",
          closeOnConfirm: true,
        },
        async function (isConfirm) {
          if (isConfirm) {
            reqConnect(accounts);
          }
        }
      );
      return false;
    }
  } catch (error) {
    console.error("Unlocked wallet error:", error);
    return false;
  }
}

async function balanceOf(account) {
  if (isValidEthereumAddress(account)) {
    try {
      const result = await neonInstance.balanceOf(account);
      const decimals = CONSTANTS.decimals;
      const balance = fromBigIntNumberToDecimal(result, decimals).toString();
      const balance_toLocale = commaNumbering(balance);
      // Update global balance variable
      CONSTANTS.tokenBalance = balance;

      if (result) {
        const first = account.substring(0, 5);
        const last = account.slice(account.length - 3);
        const privatize = `${first}..${last}`;

        $("#wallet_id").empty().append(privatize);
        $("#wallet_balance").empty().append(`${balance_toLocale} XEON`);
        $(".dot").css({ "background-color": "rgb(39, 174, 96)" });
        return balance;
      } else {
        console.log(result);
        swal({
          title: "Failed to compute XEON balance.",
          type: "error",
          allowOutsideClick: true,
          confirmButtonColor: "#F27474",
          animation: "Pop",
          text: "Issue: " + result,
        });
      }
    } catch (error) {
      console.log("Balance Fetch Failed..." + error);
    }
  }
  // default value
  return 0;
}

async function currentBlock() {
  try {
    const block = await provider.getBlockNumber();
    document.getElementById(
      "blocknumber"
    ).innerHTML = `<a href="${CONSTANTS.etherScan}/block/${block}" target="_blank">${block}</a>`;
    console.log("block number: ", block);
    return true;
  } catch (error) {
    console.log("block error:" + error);
    $(".dot").css({ "background-color": "#ec0624" });
    return false;
  } finally {
    // Schedule the next execution after a delay to avoid overlaps
    setTimeout(() => currentBlock(), 20000);
  }
}

async function chainCheck() {
  try {
    const chainID = await provider.getNetwork();
    const networkId = CONSTANTS.network;

    // Returned as HEX from getChainId so Convert to string
    // const chainIDString = '0x' + chainID.toString(16);
    const chainIDString = "0x" + chainID.chainId.toString(16);

    console.log(
      "chainString: " + chainIDString + " & networkString: " + networkId
    );

    if (networkId === chainIDString) {
      console.log("correct chain: ", chainIDString);
      $(".wallets").css("display", "none");
      $(".waiting_init").css("display", "inline-block");

      return true;
    } else {
      console.log("wrong chain: ", chainIDString);
      swal(
        {
          type: "warning",
          title: "Switch to Sepolia Testnet",
          text: "Wrong galaxy dude... \nCowboys & Aliens",
          html: true,
          showCancelButton: true,
          confirmButtonColor: "#04C86C",
          confirmButtonText: "Connect..",
          cancelButtonText: "Nay.",
          closeOnConfirm: true,
          customClass: {
            title: "alien-cowboy-title",
          },
        },
        async function (isConfirm) {
          if (isConfirm) {
            console.log("initialize retry...");
            switchNetwork();
          }
        }
      );

      $(".wallets").css("display", "none");
      $(".network_switch").css("display", "inline-block");

      return false;
    }
  } catch (error) {
    // This is the first check to the blockchain,
    // If it cant even connect then you're offline
    // Official Connection/Internet Offline Swal
    console.error("chain ID retrieval failed:", error);
    swal({
      title: "Neon Hedge Disconnected.",
      type: "error",
      allowOutsideClick: true,
      confirmButtonColor: "#F27474",
      animation: "Pop",
      text: `> Internet or Provider Offline. \nPlease Check Connection.`,
    });

    return false;
  }
}

async function switchNetwork() {
  try {
    if (!window.ethereum) {
      showProviderMissingAlert();
      return false;
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // not hex
    });

    console.log("Connected to chain:", CONSTANTS.chainID);
    console.log("Successfully switched to the Sepolia Testnet");
    await initializeConnection();

    return true;
  } catch (error) {
    return handleSwitchNetworkError(error);
  }
}

async function handleSwitchNetworkError(error) {
  console.log("Switch network error:", error);

  if (error.code === 4902) {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaa36a7", // using the Sepolia testnet chain ID
            chainName: "Sepolia Testnet",
            nativeCurrency: {
              name: "Sepolia",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: [CONSTANTS.etherScan],
            rpcUrls: ["https://sepolia.infura.io/v3/"], // using the Sepolia testnet RPC URL
          },
        ],
      });

      // Success in adding the new chain, reinitialize
      await initializeConnection();
      return true;
    } catch (addError) {
      // Handle the add error
      return handleAddEthereumChainError(addError);
    }
  } else {
    // Request denied by user or other errors
    showNetworkSwitchErrorAlert();
    return false;
  }
}

function handleAddEthereumChainError(error) {
  console.log("Add Ethereum chain error:", error);
  showNetworkSwitchErrorAlert();
  return false;
}

function showProviderMissingAlert() {
  swal({
    title: "Web3 Provider Missing!",
    type: "error",
    confirmButtonColor: "#F27474",
    animation: "Pop",
    text: "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html",
  });
}

function showNetworkSwitchErrorAlert() {
  $(".wallets").css("display", "none");
  $(".network_switch").css("display", "inline-block");

  swal(
    {
      title: "Failed to Switch Network",
      type: "error",
      text: "Try again to switch to the Sepolia Testnet.",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Switch...",
      cancelButtonText: "Nay.",
      animation: "Pop",
    },
    function () {
      console.log("Switch network retry...");
      switchNetwork();
    }
  );
}

async function reqConnect() {
  try {
    // requesting the user to connect or switch accounts using the Ethereum provider
    await window.ethereum.request({ method: "eth_requestAccounts" });

    if (window.ethereum) {
      // List currently connected accounts
      const accounts = await provider.listAccounts();
      console.log(accounts);
      // Change the wallet tab appearance
      if (accounts.length > 0) {
        $(".wallets").css("display", "none");
        $(".walletpur").css("display", "inline-block");
        return true;
      } else {
        // Accounts not available
        $(".wallets").css("display", "none");
        $(".wallet_connect").css("display", "inline-block");
        return false;
      }
    } else {
      console.error("MetaMask is not installed.");
      return false;
    }
  } catch (error) {
    console.error("Connection error:", error);

    if (error.code === 4001) {
      // 4001 indicates that the user rejected the request
      console.log("Permissions needed to continue.");
      await swal({
        title: "",
        text: "Permissions needed here..",
        type: "info",
        html: false,
        dangerMode: false,
        confirmButtonText: "Try again",
        cancelButtonText: "Cancel",
        showConfirmButton: true,
        showCancelButton: true,
        timer: 4000,
        animation: "Pop",
      });

      console.log("Permissions retry...");
      return reqConnect(); // Retry connection
    } else if (error.code === 100) {
      // 100 indicates that the user has not made a request yet
      console.log("Already requested permissions.");
    }

    return false;
  }
}
//Dont await this, they are not crucial dependencies to compromise perfomance
async function walletCheckProceed() {
  try {
    CONSTANTS.decimals = await neonInstance.decimals();
  } catch (error) {
    console.log(error);
  }

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"
    );
    const data = await response.json();
    CONSTANTS.ethUsdcPrice = data.ethereum.usd;
  } catch (error) {
    console.log(error);
  }

  try {
    const accounts = await provider.listAccounts();
    balanceOf(accounts[0]);
  } catch (error) {
    console.log("Metamask Locked");
  }
}

// Function to show popup and initiate countdown animation
async function popupSuccess(
  type,
  currency,
  Txhash,
  title,
  amountEth,
  amountTokens,
  wallet,
  nonTxAction
) {
  // Reset pop-up timer and styling
  CONSTANTS.popuptimer = 20;
  $("#popupNotify, #pNt").removeAttr("style");
  $("#pNt").css({ width: "100% !important" });
  $("#pNotifyX").click();

  // Set title and amount based on currency
  $("#popupTitle").empty().append(title);
  if (currency === "NEON") {
    $("#popupAmounts")
      .empty()
      .append(Number(amountTokens).toLocaleString() + " " + currency);
  } else if (currency === "ETH") {
    $("#popupAmounts")
      .empty()
      .append(amountEth + " " + currency);
  } else {
    if (nonTxAction.length > 2) {
      $("#popupAmounts").empty().append(nonTxAction);
    }
  }

  // Set transaction hash link and display pop-up
  $("#popupTxhash")
    .empty()
    .append(
      '<a href="' +
        CONSTANTS.etherScan +
        "/tx/" +
        Txhash +
        '" target="_blank">View Transaction on Etherscan..</a>'
    );
  $("#popupNotify").css("display", "flex");

  // Initiate countdown animation
  CONSTANTS.resumeclock = CONSTANTS.popuptimer * 1000;
  $("#pNt").animate(
    { width: "0px" },
    CONSTANTS.resumeclock,
    "swing",
    function () {
      $("#pNotifyX").click();
    }
  );
}

// Function to decrement the pop-up timer
function decrementSeconds() {
  if (CONSTANTS.popuptimer > 0) {
    CONSTANTS.popuptimer -= 1;
  }
}

$(document).on("click", "#pNotifyX", function (e) {
  // Stop animation and reset pop-up styling
  $("#pNt").stop(true, true);
  $("#popupNotify, #pNt").removeAttr("style");
  $("#popupNotify").css({ display: "none" });
});

$(document).ready(function () {
  const popup = $("#popupNotify");

  popup.on("mouseover", function (event) {
    if (typeof window.pauseCount === "undefined") {
      $("#pNt").stop(true);
      const x = $("#pNt").width();
      CONSTANTS.popuptimer = (x / 280) * 10;
    }
  });

  popup.on("mouseleave", function (event) {
    const resumeclock = CONSTANTS.popuptimer * 1000;
    if (CONSTANTS.popuptimer > 0) {
      $("#pNt").animate({ width: "0px" }, resumeclock, "swing", function () {
        $("#pNotifyX").click();
      });
    }
    window.pauseCount = 1;
  });
});

$(document).on("click", ".wallet_connect", function () {
  reqConnect();
});

$(document).on("click", ".network_switch", function () {
  switchNetwork();
});

$(document).on("click", "#wallet_id", function () {
  disconnectwallet();
});

$(document).on("click", "#discon", function () {
  // Handle disconnect logic here, if it exists in etherjs
});

export {
  initializeConnection,
  unlockedWallet,
  chainCheck,
  reqConnect,
  handleAccountChange,
  handleNetworkChange,
  popupSuccess,
};
