import { Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson2 from "@/assets/animations/PE1.json";
function ScrollCard() {
  return (
    <div className="flex flex-col gap-6 md:gap-12 lg:gap-0 lg:pb-20 relative md:flex-row justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full md:w-[40%] lg:w-full lg:pl-16">
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Deposit Tokens
        </h1>
        <h1 className="text-lime mt-5 md:w-[80%]">
          Go to the Cashier under the Wallet page to deposit tokens into the
          testnet Vault.
        </h1>
      </div>
      <div className="w-[100%] relative">
        <div className=" top-16 md:left-[30px] w-full h-full">
          <Image
            borderRadius={"md"}
            src="https://dapp.xeon-protocol.io/imgs/screenshots/cashier-deposit.webp"
            // w={"100%"}

            alt="container"
            className="relative lg:ml-[-20px] md:w-[87%] lg:w-auto"
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
      </div>
    </div>
  );
}

export default ScrollCard;
