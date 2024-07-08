"use client";
import Header from "@/components/Header";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "@/assets/animations/blue_planet.json";
import lottieJson2 from "@/assets/animations/planet_orbit1.json";
import TestNetCard from "@/components/guide/Testnet";
import { Image } from "@chakra-ui/react";
import ScrollCard from "@/components/guide/IntroCard";
import Deposit from "@/components/guide/Deposit";
import UseCases from "@/components/guide/UseCases";
import HowItWorks from "@/components/guide/HowItWorks";
import WhyOTC from "@/components/guide/WhyOTC";
import TokenTable from "@/components/testing/TokenTable";
import TokenDeposit from "@/components/testing/TokenDeposits";
import WriteHedges from "@/components/testing/WriteHedges";
import WithdrawTokens from "@/components/testing/WithdrawTokens";
import SoftwareVersions from "@/components/testing/Versions";
import { motion } from "framer-motion";
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
  return (
    <>
      <div className="bg-[#000] lg:min-h-[100vh] 2xl:min-h-[50vh] px-8 pt-8 max-w-screen-2xl mx-auto relative">
        <Header />
        <div className="flex flex-col md:gap-12 md:flex-row justify-between 2xl:mt-[20%] mt-[18%]">
          <div className="md:w-[40%] lg:w-[100%] md:px-0 lg:px-18 flex items-center md:block">
            <motion.h1
              className="text-light-purple text-3xl md:text-5xl lg:text-7xl  lg:mt-14"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              transition={{ duration: 0.6 }}
            >
              Neon
            </motion.h1>
            <motion.h1
              className="text-grey text-3xl ml-1 md:ml-0  md:text-5xl lg:text-7xl"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Testnet
            </motion.h1>
            <motion.h1
              className="text-grey text-3xl md:text-5xl ml-1 md:ml-0 lg:text-7xl"
              initial="hidden"
              animate="visible"
              variants={headingVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Guide
            </motion.h1>

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
            <div className="md:absolute md:top-10 lg:top-10 md:left-[30px] lg:left-5 w-full h-full">
              <p className="text-grey text-lg w-[85%] mt-4">
                What to know about testing
              </p>
              <p className="text-grey md:text-justify text-lg mt-5 md:w-[86%]">
                This involves usage of our Dapp to interact with our
                protocol/smart contracts. All Testnet Versions are listed at the
                bottom of this page for the public to inspect. Neon Hedge comes
                with 3 OTC tools: Call Options, Put Options, Equity Swaps. Test
                Blockchain is Seporlia Testnet. Install MetaMask on your Browser
                to use our Dapp. When done, proceed to below section and claim
                our mock ERC20 tokens.
              </p>
            </div>
            <Image
              src="/card-109.svg"
              // w={"100%"}

              h={{
                base: "150px",
                md: "300px",
                lg: "330px",
                xl: "310px",
              }}
              alt="container"
              className="relative hidden  md:block ml-[-20px]"
            />
            <motion.div
              className="flex md:mt-40 z-5 mt-5 gap-4 ml-[-20px] md:ml-[-30px] px-5 md:flex-row md:justify-start lg:flex-row lg:justify-start lg:gap-x-4 md:mt-5 2xl:justify-evenly 2xl:ml-[-100px]"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              transition={{ duration: 0.6 }}
            >
              <motion.a
                href="https://neon-hedge.gitbook.io/xeon-protocol-documentation/"
                className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey"
                variants={itemVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Read Manual
              </motion.a>
              <motion.a
                href="/guide"
                className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey"
                variants={itemVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Jump to Dapp
              </motion.a>
              <motion.a
                href="https://t.me/xeon_protocol"
                className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey"
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
              <p className="text-grey md:text-lg mt-5">{`{  Welcome to the Instruction Portal for the Neon Hedge test platform  }`}</p>
            </motion.div>
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

      <TokenDeposit />
      <WriteHedges />
      <WithdrawTokens />
      <SoftwareVersions />
    </>
  );
}

export default Page;
