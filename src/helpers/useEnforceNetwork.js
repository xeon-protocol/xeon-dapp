"use client";
import { useEffect } from "react";

const BASE_SEPOLIA_CHAIN_ID = "0x14a34";

const useEnforceNetwork = () => {
  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length === 0) {
            console.log("Please connect to MetaMask.");
            return;
          }

          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
            });
          }
        } catch (error) {
          if (error.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: BASE_SEPOLIA_CHAIN_ID,
                  rpcUrls: ["https://sepolia.base.org"],
                  chainName: "Base Sepolia Testnet",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.basescan.org/"],
                },
              ],
            });
          } else {
            console.error(error);
          }
        }
      } else {
        console.error("MetaMask is not installed");
      }
    };

    checkNetwork();
  }, []);
};

export default useEnforceNetwork;
