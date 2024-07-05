import { Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson2 from "@/assets/animations/planet_orbit2.json";

function ScrollCard() {
  return (
    <div className="flex flex-col relative mt-10 gap-6 md:gap-12 lg:mt-20 md:flex-row items-start justify-between px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full md:w-[40%] lg:w-full lg:mt-20  lg:w-1/2 md:sticky md:top-1/2 md:transform md:-translate-y-1/2">
        <h1 className="text-lime md:text-lg lg:text-xl">{`{ O5 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          How it
          <span className="text-lime md:hidden"> Works</span>
        </h1>
        <h1 className="text-lime text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          Works
        </h1>
        <Lottie
          className="w-[40%] absolute top-[155px] right-[10%] hidden opacity-20 lg:block"
          loop
          animationData={lottieJson2}
          play
        />
      </div>
      <div className="w-full lg:w-1/2 lg:px-10 relative">
        <div className="border-2 border-[#6c6c6c] rounded-3xl text-grey p-4">
          <Image
            borderRadius={"2xl"}
            src="/engineFlowDark5.png"
            alt="container"
            className="relative "
          />
        </div>
        <div className="w-full h-full md:text-justify">
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            This is an OTC protocol, that accepts deposits of any ERC20 and then
            allows you to write a Hedge or Loan request using those ERC20 tokens
            as underlying assets or collateral.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            <span className="text-lime"> Step 1</span>: Deposit desired ERC20
            tokens into protocol.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            <span className="text-lime"> Step 2:</span> Go to the dApp OTC
            marketplace, write: Options, Equity Swaps, Loans.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            <span className="text-lime"> Step 3</span>: Once created it then
            appears on the OTC timeline, which displays all deal cards in real
            time. Wait for someone to come and buy the deal on offer.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            <span className="text-lime"> Step 4:</span> On expiry, the deal is
            settled either by the parties, or mined by third party miners. The
            proceeds are credited to the deposit balances of each party.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            <span className="text-lime">Step 5:</span> Write or buy some more,
            or simply withdraw proceeds to your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScrollCard;
