import { Image } from "@chakra-ui/react";
import React from "react";

function FailedPopup() {
  return (
    <div
      className={"bg-black text-grey flex flex-col justify-center items-center"}
    >
      <Image src="/fail.webp" alt="failed popup" className="" />
      <p className="text-xl mt-5">Web3 Provider Missing!</p>
      <p className="mt-5">
        MetaMask is not installed. Please consider installing it:
      </p>
      <a
        href="https://metamask.io/download.html"
        target="_blank"
        className="mt-5 w-[80%] text-light-purple hover:text-purple"
      >
        https://metamask.io/download.html
      </a>
      <button className="text-white w-[70%] mt-5 px-8 py-2 mr-4  bg-button-gradient rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
        Ok
      </button>
    </div>
  );
}

export default FailedPopup;
