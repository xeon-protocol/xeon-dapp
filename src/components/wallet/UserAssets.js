'use client';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import AssetsValues from './AssetsValues';

function UserAssets() {
  const [isSwitched, setIsSwitched] = useState(false);

  const switchHandler = () => {
    setIsSwitched(!isSwitched);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-12 lg:gap-12 lg:pb-20 relative md:flex-row justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="border-2 rounded-xl border-grey w-full p-4 hover:border-animate">
        <FormControl display="flex" alignItems="center">
          <Switch
            isChecked={isSwitched}
            onChange={switchHandler}
            id="mode-switch"
          />
          <FormLabel htmlFor="mode-switch" mb="0" ml={2} className="text-grey">
            {isSwitched ? 'Withdrawing mode' : 'Depositing mode'}
          </FormLabel>
        </FormControl>

        {isSwitched ? (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="text-grey text-3xl md:text-5xl lg:text-7xl mt-5">
              Withdraw Tokens
            </div>
            <div className="text-grey mt-5 md:w-[100%]">
              <input
                type="text"
                placeholder="Paste Address"
                className="border-[1px] bg-[#71637f4d] rounded-xl border-grey p-2 focus:outline-lime w-full"
              />
              <input
                type="text"
                placeholder="Amount..."
                className="border-[1px] bg-[#71637f4d] mt-5 rounded-xl border-grey p-2 focus:outline-lime w-full"
              />
              <div className="text-grey bg-[#71637f4d] rounded p-1 mt-5 flex justify-between md:w-[100%]">
                <p className="w-full text-lime">Deposited:</p>
                <p className="w-full text-floral">Withdrawn:</p>
              </div>
              <div className="flex w-full">
                <button className="text-white bg-floral mx-auto mt-5 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime">
                  Withdraw
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="text-grey text-3xl md:text-5xl lg:text-7xl">
              Deposit Tokens
            </div>
            <div className="text-grey mt-5 md:w-[100%]">
              <input
                type="text"
                placeholder="Paste Address"
                className="border-[1px] bg-[#71637f4d] rounded-xl border-grey p-2 focus:outline-lime w-full"
              />
              <input
                type="text"
                placeholder="Amount..."
                className="border-[1px] bg-[#71637f4d] mt-5 rounded-xl border-grey p-2 focus:outline-lime w-full"
              />
              <div className="text-grey bg-[#71637f4d] rounded p-1 mt-5 flex justify-between md:w-[100%]">
                <p className="w-full text-lime">Deposited:</p>
                <p className="w-full text-floral">Withdrawn:</p>
              </div>
              <div className="flex w-full">
                <button className="text-white bg-[#71637f4d] mx-auto mt-5 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime">
                  Deposit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div className="w-full border-2 rounded-xl border-grey lg:py-9 p-4 flex gap-2 hover:border-animate">
        <div className="w-full">
          <div className="w-full flex justify-between gap-5">
            {' '}
            <div className="flex justify-between w-full mb-5">
              {' '}
              <p className="text-lime text-3xl">Net Worth</p>
              <p className="text-grey text-3xl">$0.00</p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-grey text-3xl"></p>
              <p className="text-light-purple">0xa92..ce7</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <AssetsValues label="Deposits" value="0.00" />
              <AssetsValues label="Dividents" value="0.00" />
              <AssetsValues label="Commision" value="0.00" />
              <AssetsValues label="Xeon" value="0.00" />
            </div>
            <div className="w-full ">
              <div className="flex justify-between my-2">
                <p className="text-lg text-grey">Staked</p>
                <div className="flex items-center gap-2">
                  <FaEthereum className="text-light-purple" />
                  <p className="text-grey">0.00</p>
                </div>
              </div>

              <div className="flex justify-between my-2">
                <p className="text-lg text-grey">Wallet</p>
                <div className="flex items-center gap-2">
                  <FaEthereum className="text-light-purple" />
                  <p className="text-grey">0.00</p>
                </div>
              </div>
              <div className="flex justify-between my-2">
                <p className="text-lg text-grey">Airdrop</p>
                <div className="flex items-center gap-2">
                  <FaEthereum className="text-light-purple" />
                  <p className="text-grey">0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAssets;
