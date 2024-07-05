import { Image } from "@chakra-ui/react";
import React from "react";

function ScrollCard() {
  return (
    <div className="flex flex-col relative mt-10 lg:mt-20 lg:flex-row justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full ">
        <h1 className="text-lime md:text-lg lg:text-xl">{`{ O2 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          How it
          <span className="text-lime md:hidden"> Testnet</span>
        </h1>
        <h1 className="text-lime text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          Works
        </h1>
      </div>
      <div className="w-full lg:px-10 relative">
        <div className="border-2 border-[#6c6c6c] rounded-3xl text-grey p-4">
          <Image
            borderRadius={"md"}
            src="/engineFlowDark5.png"
            alt="container"
            className="relative "
          />
        </div>
        <div className="  w-full h-full">
          <p className="text-grey text-lg mt-5 md:w-[85%]"></p>
        </div>
      </div>
    </div>
  );
}

export default ScrollCard;
