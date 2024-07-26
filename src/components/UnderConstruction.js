import { Button, Image } from "@chakra-ui/react";
import React from "react";

function UnderConstruction() {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#000000eb] z-[30] fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
      <div className="relative flex justify-center items-center h-full w-full">
        <Image
          src="/Social.webp"
          alt="popup"
          className="absolute z-[1] hidden md:block"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <Image
          src="/pop-up.webp"
          alt="popup"
          className="absolute z-[1]  md:hidden"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="absolute z-[2] flex flex-col items-center">
          <p className="text-3xl text-center text-grey">Coming Soon...</p>
          <p className="text-grey w-[80%] lg:w-[90%] md:w-[80%] mt-5 text-xs md:text-sm lg:text-lg text-center mb-5">
            This page is under construction
          </p>
        </div>
      </div>
    </div>
  );
}

export default UnderConstruction;
