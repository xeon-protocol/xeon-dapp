import { Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson2 from "@/assets/animations/PE1.json";
function ScrollCard() {
  return (
    <div className="flex flex-col gap-6 md:gap-12 lg:gap-0 lg:pb-20 relative md:flex-row justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full md:w-[40%] lg:w-full lg:pl-16">
        <h1 className="text-lime md:text-lg lg:text-xl">{`{ O3 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Make a<span className="text-lime md:hidden"> Deposit</span>
        </h1>
        <h1 className="text-lime text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          Deposit
        </h1>
      </div>
      <div className="w-[100%] relative">
        <Lottie
          className="w-[40%] md:absolute top-[-40px] left-[-29%] hidden lg:block"
          loop
          animationData={lottieJson2}
          play
        />
        <div className="md:absolute top-16 md:left-[30px] w-full h-full">
          <Image
            borderRadius={"md"}
            src="/deposit-tokens.png"
            // w={"100%"}

            alt="container"
            className="relative lg:ml-[-20px] md:w-[87%] lg:w-[90%]"
          />
        </div>
        <Image
          src="/card-109.svg"
          // w={"100%"}
          h={{
            base: "150px",
            md: "300px",
            lg: "400px",
          }}
          alt="container"
          className="relative hidden md:block lg:ml-[-20px]"
        />
      </div>
    </div>
  );
}

export default ScrollCard;
