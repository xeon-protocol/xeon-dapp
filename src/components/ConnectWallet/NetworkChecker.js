"use client";
import lottieJson from "@/assets/animations/planet_orbit3.json";
import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import Lottie from "react-lottie-player";
import {baseSepolia} from "thirdweb/chains";
import {
  ConnectButton,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useConnect,
  useSwitchActiveWalletChain,
} from "thirdweb/react";

import {client} from "./client";
import {createWallet, inAppWallet} from "thirdweb/wallets";

const NetworkChecker = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const connectionStatus = useActiveWalletConnectionStatus();
  const {connect, isConnecting, error} = useConnect();
  const [loading, setLoading] = useState(true);
  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "farcaster",
          "google",
          "apple",
          "facebook",
          "phone",
          "email",
          "passkey",
        ],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.zerion.wallet"),
  ];

  useEffect(() => {
    if (connectionStatus === "unknown" || connectionStatus === "connecting") {
      return;
    }

    if (connectionStatus === "disconnected") {
      setLoading(false);
      return;
    }

    if (activeChain?.id !== baseSepolia.id) {
      switchChain(baseSepolia.id);
    }

    setLoading(false);
  }, [activeChain, connectionStatus, switchChain]);

  if (
    connectionStatus === "unknown" ||
    connectionStatus === "connecting" ||
    loading
  ) {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        justifyContent="center"
        alignItems="center"
        bg="rgba(0, 0, 0, 0.5)"
        zIndex="1000"
      >
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (connectionStatus === "disconnected") {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom={0}
        bg="#000000c4"
        p="4"
        zIndex="1000"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Lottie className="" loop animationData={lottieJson} play />
        <Text className="text-center text-grey text-lg">
          Please connect your wallet to use this application.
        </Text>

        <ConnectButton
          wallets={wallets}
          connectButton={{
            className:
              "text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue",
            style: {
              borderRadius: "50px",
              backgroundColor: "#3253FB",
              color: "white",
            },
          }}
          client={client}
        />
      </Box>
    );
  }

  if (activeChain?.id !== baseSepolia.id) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom={0}
        bg="#000000c4"
        p="4"
        zIndex="1000"
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Lottie className="" loop animationData={lottieJson} play />
        <Text className="text-center text-grey text-lg">
          Please switch to base sepolia network to use thus application.
        </Text>

        <button
          onClick={() => switchChain(baseSepolia)}
          className="text-white bg-button-gradient mt-5 rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
        >
          Connect to Base Sepolia
        </button>
      </Box>
    );
  }

  return null;
};

export default NetworkChecker;
