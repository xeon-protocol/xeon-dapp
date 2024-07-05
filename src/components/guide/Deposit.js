import { Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson2 from "../../../public/animations/pe1.json";
function ScrollCard() {
  return (
    <div className="flex flex-col relative lg:flex-row justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full lg:pl-16">
        <h1 className="text-lime md:text-lg lg:text-xl">{`{ O3 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Make a<span className="text-lime md:hidden"> Deposit</span>
        </h1>
        <h1 className="text-lime text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          Deposit
        </h1>
      </div>
      <div className="w-full relative">
        <Lottie
          className="w-[40%] absolute top-[-40px] left-[-29%] hidden lg:block"
          loop
          animationData={lottieJson2}
          play
        />
        <div className="absolute top-16 md:left-[30px] w-full h-full">
          <Image
            borderRadius={"md"}
            src="/animations/xeon-testnet.gif"
            // w={"100%"}

            alt="container"
            className="relative ml-[-20px] "
          />
          {/* <p className="text-grey text-lg mt-5 md:w-[85%]">
            We built an entire protocol from scratch to enable users to deposit
            and create OTC trades using any ERC20 token. Most of the development
            work for Neon Hedge is complete, we will only test, fine tune and
            experiment with monetary concepts that we think can be ground
            breaking. This is where you come in as the community to help in
            manifesting the cause: universal ERC20 hedging and lending. To test
            this platform, you need testnet tokens.
          </p> */}
        </div>
        <Image
          src="/card-109.svg"
          // w={"100%"}
          h={"400px"}
          alt="container"
          className="relative hidden md:block ml-[-20px]"
        />
      </div>
    </div>
  );
}

export default ScrollCard;
