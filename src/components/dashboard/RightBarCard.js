import React from "react";
import { FaEthereum } from "react-icons/fa";

function RightBarCard({ amount }) {
  return (
    <div className="my-2 w-full">
      <div className="rounded-xl p-2 md:w-[88%] boder-[#1F1F1F] mt-5 ml-8 mr-6 border-[1px]">
        <div className="flex justify-between items-center text-sm">
          <p className="text-light-purple text-lg">${amount}</p>
          <div className="flex ml-2 items-center">
            <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
              <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                <FaEthereum className="text-lime" size={14} />
              </div>
            </div>
            <p className="text-lime ext-lg ml-2 font-medium">WETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightBarCard;
