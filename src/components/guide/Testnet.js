import { Image } from "@chakra-ui/react";
import React from "react";

function ScrollCard() {
  return (
    <div className="flex flex-col relative mt-10 lg:mt-20 lg:flex-row-reverse justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full ">
        <h1 className="text-grey md:text-lg lg:text-xl">{`{ O2 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Go to
          <span className="text-light-purple md:hidden"> Testnet</span>
        </h1>
        <h1 className="text-light-purple text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          Testnet
        </h1>
      </div>
      <div className="w-full lg:px-10 relative">
        <div className="border-2 border-[#6c6c6c] rounded-3xl text-grey p-4">
          <Image
            borderRadius={"md"}
            src="/animations/xeon-testnet.gif"
            // w={"100%"}
            h={"350px"}
            alt="container"
            className="relative "
          />
        </div>
        <div className="  w-full h-full">
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            The testnet page will tell you all you need about the test
            enviroment and network. goto testnet
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScrollCard;
