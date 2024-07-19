// Import the helper functions from main.js
import { CONSTANTS } from './constants.js';

// Initialize Web3
async function initWeb3() {

  let signer = null;
  let provider;

  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed,
    // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
    swal({
        title: "Hold on!",
        type: "error",
        confirmButtonColor: "#F27474",
        text: "Web3 Wallet is missing, full functionality is not available."
    });
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    //provider = new ethers.BrowserProvider(window.ethereum)
    provider = new ethers.providers.Web3Provider(ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
  }

  // Announce authority
  window.signer = signer;
  window.provider = provider;

  // Create a contract; connected to a Provider, so it may
  // only access read-only methods (like view and pure)
  window.neonInstance = new ethers.Contract(CONSTANTS.neonAddress, CONSTANTS.neonContractABI, window.provider);
  window.hedgingInstance = new ethers.Contract(CONSTANTS.hedgingAddress, CONSTANTS.hedgingContractABI, window.provider);
  window.stakingInstance = new ethers.Contract(CONSTANTS.stakingAddress, CONSTANTS.stakingContractABI, window.provider);

  
}

export { initWeb3 };
