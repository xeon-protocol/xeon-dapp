"use client";
import Header from "@/components/Header";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/animations/pe2.json";
import lottieJson2 from "../../../public/animations/planet_orbit1.json";
import TestNetCard from "@/components/guide/Testnet";
import { Image } from "@chakra-ui/react";
import ScrollCard from "@/components/guide/IntroCard";
import Deposit from "@/components/guide/Deposit";
import UseCases from "@/components/guide/UseCases";
import HowItWorks from "@/components/guide/HowItWorks";
function Page() {
  return (
    <>
      <div className="bg-[#000] min-h-[100vh] px-8 pt-8 max-w-screen-2xl mx-auto relative">
        <Header />
        <div className="flex flex-col md:flex-row justify-between 2xl:mt-[20%] mt-[18%]">
          <div className=" md:px-14 md:px-18 flex items-center md:block">
            <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">Dapp</h1>
            <h1 className="text-floral text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10">
              Guide
            </h1>

            <Image
              src="/dotted.webp"
              alt="container"
              className="absolute top-[10%] w-[40%] left-[-10%] hidden lg:block"
            />
            <Lottie
              className="w-[40%] absolute top-[-55px] right-[46%] hidden lg:block"
              loop
              animationData={lottieJson}
              play
            />
            <Lottie
              className="w-[40%] absolute bottom-[-55px] right-[56%] hidden opacity-10 lg:block"
              loop
              animationData={lottieJson2}
              play
            />
          </div>
          <div className="relative">
            <p className="text-grey text-lg w-[85%] my-4">
              Learn how to nagivate – Equity Swaps, Call Options, Put Options,
              Crypto Lending.
            </p>
            <div className="absolute top-24 md:left-[30px] w-full h-full">
              <p className="text-grey text-lg mt-5 md:w-[80%]">
                This is the user guide page for the current testnet. Note: this
                protocol is developed recursively. Features will be altered with
                each testnet release. Scroll down to learn how to navigate our
                protocol and dApp.
              </p>
            </div>
            <Image
              src="/card-109.svg"
              // w={"100%"}
              h={"150px"}
              alt="container"
              className="relative hidden md:block ml-[-20px]"
            />
            <div className="flex mt-40 gap-4 ml-[-30px] px-5 md:flex-row md:justify-start lg:flex-row lg:justify-start lg:gap-x-4 md:mt-5 2xl:justify-evenly  2xl:ml-[-100px]">
              <a
                href="https://xeon-protocol.io/ecosystem"
                className="border-2 p-2 border-dashed border-light-purple rounded-md text-grey"
              >
                Neon Hedge
              </a>
              <a
                href="https://xeon-protocol.io/ecosystem"
                className="border-2 p-2 border-dashed border-light-purple rounded-md text-grey"
              >
                Neon Lend
              </a>
              <a
                href="https://xeon-protocol.io/ecosystem"
                className="border-2 p-2 border-dashed border-light-purple rounded-md text-grey"
              >
                Neon Farm
              </a>
            </div>
            <div>
              <p className="text-grey mt-5">{`{  This testnet introduces Neon Hedge Platform to the
            Ecosystem  }`}</p>
            </div>
          </div>
        </div>
      </div>
      <ScrollCard />
      <TestNetCard />
      <Deposit />
      <UseCases />
      <HowItWorks />
    </>
  );
}

export default Page;
