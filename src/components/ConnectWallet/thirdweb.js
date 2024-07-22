import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const sdk = new ThirdwebSDK(signer);

export default sdk;
