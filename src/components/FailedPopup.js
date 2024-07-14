import { Image } from "@chakra-ui/react";
import React from "react";

function FailedPopup() {
  return (
    <div
      className={"bg-black text-grey flex flex-col justify-center items-center"}
    >
      <Image src="/fail.webp" alt="failed popup" className="" />
      <p className="text-xl mt-5">Failed</p>
      <p className="mt-5">{`{ Transaction error: }`}</p>
      <p className="mt-5 w-[80%]">
        {`cannot estimate gas; transaction may fail or may require manual gas
        limit (error= ["code"-32603, " message" "execution reverted:
        Insufficient free pair currency balance", "data": ["originalError":
        ["code":3,"
        data":"0x08c379a000000000000000000000000000000000000000000000000000000000
        reverted: Insufficient free pair currency balance}}],
        method="estimateGas", transaction=
        ["from":"0x3A96f32D142C0c8e0E8cdc74d1c5B5D39a5029d8", "to":
        "Oxa50E605f76661d4C0e36a78C588 code=UNPREDICTABLE_GAS_LIMIT,
        version=providers/5.0.24)`}
      </p>
      <button className="text-white w-[70%] mt-5 px-8 py-2 mr-4  bg-button-gradient rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
        Ok
      </button>
    </div>
  );
}

export default FailedPopup;
