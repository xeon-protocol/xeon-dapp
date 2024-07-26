"use client";
import Header from "@/components/Header";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "@/assets/animations/blue_planet.json";
import lottieJson2 from "@/assets/animations/planet_orbit1.json";
import TestNetCard from "@/components/guide/Testnet";
import { Image } from "@chakra-ui/react";

import TokenTable from "@/components/testing/TokenTable";

import WriteHedges from "@/components/testing/WriteHedges";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";

function Page() {
  const glitchVariants = {
    visible: {
      textShadow: [
        "1px 1px 0px lime",
        "-1px -1px 0px purple",
        "1px -1px 0px lime",
        "-1px 1px 0px lime",
        "2px 2px 2px lime",
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };
  const connectToBaseSepolia = () => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x14a34",
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
  };
  return (
    <>
      <div className="bg-[#000] lg:min-h-[100vh] 2xl:min-h-[50vh] px-8 pt-8 max-w-screen-2xl mx-auto relative">
        <Header />
        <div className="flex flex-col md:gap-12 md:flex-row justify-between 2xl:mt-[20%] mt-[18%]">
          <div className="md:w-[40%] lg:w-[100%] md:px-0 lg:px-18 flex items-center md:block">
            <motion.h3
              className="text-light-purple text-3xl md:text-5xl lg:text-7xl  lg:mt-14"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              transition={{ duration: 0.6 }}
            >
              Xeon
            </motion.h3>
            <motion.h3
              className="text-grey text-3xl ml-1 md:ml-0  md:text-5xl lg:text-7xl"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Testnet
            </motion.h3>
            <motion.h3
              className="text-grey text-3xl md:text-5xl ml-1 md:ml-0 lg:text-7xl"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Guide
            </motion.h3>

            <Image
              src="/dotted.webp"
              alt="container"
              className="md:absolute top-[10%] w-[40%] left-[-10%] hidden lg:block"
            />
            <Lottie
              className=" md:absolute top-[150px] w-[12%] 2xl:left-12  left-12 hidden lg:block"
              loop
              animationData={lottieJson}
              play
            />
            <Lottie
              className="w-[40%] md:absolute bottom-[-55px] lg:bottom-[50px] xl:bottom-[-55px] 2xl:bottom-[-50px] right-[56%] hidden opacity-10 lg:block"
              loop
              animationData={lottieJson2}
              play
            />
          </div>
          <div className="relative">
            <div className="md:absolute md:top-10 lg:top-10 md:left-[30px] lg:left-5 w-full h-full z-[5]">
              <p className="text-grey text-lg w-[85%] mt-4">
                What to know about testing
              </p>
              <p className="text-grey md:text-justify text-lg mt-5 md:w-[86%]">
                Thorough testing is an integral part of building a DeFi
                protocol. Our testnet app is designed to test our full suite of
                contracts in a live testnet environment that mimics mainnet, but
                without real funds. Xeon Protocol is comprised of two core
                contracts: hedging and staking. Hedging comes with three OTC
                tools: Call Options, Put Options, and Equity Swaps. Make sure
                you have a wallet connected and switched to Base Sepolia
                testnet.
              </p>
              <div className="flex justify-center  mt-3 w-[86%]">
                <button
                  className="text-white bg-button-gradient mx-auto rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
                  onClick={connectToBaseSepolia}
                >
                  Connect to Base Sepolia
                </button>
              </div>

              <motion.div
                className="flex md:mt-40 z-5 mt-5 gap-4 ml-[-20px] md:ml-[-30px] px-5 md:flex-row md:justify-start lg:flex-row lg:justify-start lg:gap-x-4 md:mt-5 2xl:justify-evenly 2xl:ml-[-100px]"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                transition={{ duration: 0.6 }}
              >
                <motion.a
                  href="https://docs.xeon-protocol.io/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey text-xs md:text-base"
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Read Manual
                </motion.a>
                <motion.a
                  href="/guide"
                  className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey text-xs md:text-base"
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Jump to Guide Page
                </motion.a>
                <motion.a
                  href="https://t.me/XeonProtocolPortal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey text-xs md:text-base"
                  variants={itemVariants}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Telegram Support
                </motion.a>
              </motion.div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-grey md:text-lg md:ml-[-20px] mt-5">{`{  Welcome to the Instruction Portal for the Neon Hedge test platform  }`}</p>
              </motion.div>
            </div>
            <Image
              src="/card-109.svg"
              // w={"100%"}

              h={{
                base: "150px",
                md: "300px",
                lg: "330px",
                xl: "360px",
              }}
              alt="container"
              className="relative hidden  md:block ml-[-30px]"
            />
          </div>
        </div>
      </div>
      <TokenTable />
      <div className="my-5 px-8 pt-8 md:px-20 max-w-screen-2xl mx-auto">
        <motion.p className="text-grey text-3xl mt-5 md:w-[85%]">
          <motion.span
            variants={glitchVariants}
            initial="hidden"
            animate="visible"
          >
            Token
          </motion.span>{" "}
          Use Cases
        </motion.p>
      </div>

      <WriteHedges />

      <Footer />
    </>
  );
}

export default Page;
