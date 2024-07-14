"use client";
import React from "react";
import Table from "./Table";
import { FaStackExchange } from "react-icons/fa";
function VaultBalances() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 px-8 pt-8 md:px-10 max-w-screen-2xl mx-auto">
      <div className="md:w-[70%]">
        <Table />
      </div>
      <div className=" md:flex md:flex-row md:justify-between lg:flex-col lg:w-[30%]">
        <div className="border-0 rounded-xl border-grey w-full p-4 hover:border-animate text-left">
          <p className="text-lime text-3xl">Stake $XEON</p>
          <p className="text-grey text-left mt-2">
            XEON, our native token, is crucial to supporting our ecosystem. As
            such, we reward you through revenue sharing for buying and staking
            it. Protocol revenue from fees and taxes is distributed to all
            stakers.
          </p>
          <button className="text-white bg-button-gradient mx-auto mt-5 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime">
            Stake Now
          </button>
        </div>
        <div className="border-0 rounded-xl border-grey w-full p-4 hover:border-animate text-left">
          <p className="text-lime text-3xl">Mine | Farm ERC20s</p>
          <p className="text-grey text-left mt-2">
            Settle hedges and earn a share of the settlement fees, in
            underlying-or-paired currency. Provide hedge liquidity, or protocol
            collateral and earn a share of the farming revenue.
          </p>
          <button className="text-white bg-floral mx-auto mt-5 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}

export default VaultBalances;
