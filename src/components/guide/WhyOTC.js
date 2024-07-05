import { Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson2 from "@/assets/animations/blue_planet.json";
function ScrollCard() {
  return (
    <div className="flex flex-col-reverse relative mt-10 lg:mt-20 md:flex-row-reverse gap-6 md:gap-12 lg:flex-row justify-between items-start px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full lg:px-10 relative">
        <div className=" text-grey md:p-4">
          <p className="text-grey text-lg md:mt-5 md:w-[100%] lg:text-justify ">
            ERC20 standard legacy support. This is a simple approach to a very
            basic need. The solution needed to be direct in addressing the
            issues investors face with risk management & unlocking liquidity
            from their ERC20 tokens.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[100%] lg:text-justify ">
            At the inception of this project, most developers were focused on
            bulding the most cutting edge new technology, whilst overlooking the
            opportunity to develop basic solutions for basic needs.
          </p>

          <p className="text-grey text-lg mt-5 md:w-[100%] lg:text-justify ">
            We built the protocol from the ground up, customizing every function
            to create a powerful core, which we can then add new features onto
            by simply intergrating more smart contract modules.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[100%] lg:text-justify ">
            This simple approach to development enables us to leverage new
            technologies like AI in bulding more features into the protocol.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[100%] lg:text-justify ">
            For instance, leveraging AI smart contract protocols, we can enable
            users to write their custom functions using AI generators and
            implement them in their OTC trades. All this can be built on top of
            our core protocol.
          </p>

          <p className="text-grey text-lg mt-5 md:w-[100%] lg:text-justify  ">
            Custom made OTC solutions cover the basic fundamentals first, then
            evolve as new features are added on top of the base layer. Case in
            sight; Uniswap protocol in 2017, versus Uniswap protocol in 2024 and
            beyond.
          </p>
        </div>
      </div>
      <div className="w-full md:w-[40%] lg:w-full lg:mt-20 lg:w-full lg:sticky lg:top-3/4 lg:transform lg:-translate-y-1/2">
        <h1 className="text-grey md:text-lg lg:text-xl">{`{ O4 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Why
          <span className="text-light-purple md:hidden"> OTC</span>
        </h1>
        <h1 className="text-light-purple text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          OTC
        </h1>
        <Lottie
          className="w-[40%] md:absolute top-[-55px] right-[5%] hidden opacity-20 lg:block"
          loop
          animationData={lottieJson2}
          play
        />
      </div>
    </div>
  );
}

export default ScrollCard;
