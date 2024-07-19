import React from "react";
import { FaCopy } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TokenTable = () => {
  const tokens = [
    {
      name: "oVela Exchange",
      symbol: "oVELA",
      address: "0xF9e5b8c7cd97BFAa5A953008aC93a4D6625737A4",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "oPepe",
      symbol: "oPEPE",
      address: "0x3eC775BC49AdE1f42fD0C76f99544C3af5f21504",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "Degen",
      symbol: "oDEGEN",
      address: "0x68a2C41C368799fEAaAb93C2C22d2A849D3f4760",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "Higher",
      symbol: "oHIGHER",
      address: "0x0E3a79da8C1472937B2e5D1E52aA51d57976E437",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "Rorschach",
      symbol: "oROR",
      address: "0xFB435ABc4C1481280e95A7e1B4b4A5DE7E7096FA",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "Wrapped Ether",
      symbol: "WETH",
      address: "0xFA8e7A0CD67e404b0D4D3728A3922e1Dff00cB99",
      pair: "WETH",
      supply: "134,000",
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("Address copied to clipboard!");
      },
      (err) => {
        alert("Failed to copy the address.");
      }
    );
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const glitchVariants = {
    visible: {
      textShadow: [
        "1px 1px 0px lime",
        "-1px -1px 0px purple",
        "1px -1px 0px lime",
        "-1px 1px 0px lime",
        "2px 2px 2px lime",
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div className="overflow-x-auto overflow-y-hidden mt-10 px-8 pt-8 md:px-20 max-w-screen-2xl mx-auto">
      <motion.h1 className="text-3xl text-grey">
        <motion.span
          variants={glitchVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Claim
        </motion.span>{" "}
        Testnet Tokens
      </motion.h1>
      <motion.table
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={tableVariants}
        className="min-w-full bg-black border rounded mt-10 text-grey"
      >
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">NAME</th>
            <th className="py-2 px-4 border-b text-left">SYMB</th>
            <th className="py-2 px-4 border-b text-left">ADDR</th>
            <th className="py-2 px-4 border-b text-left">PAIR</th>
            <th className="py-2 px-4 border-b text-left">SUPPLY</th>
            <th className="py-2 px-4 border-b text-left">CTA</th>
          </tr>
        </thead>
        <motion.tbody variants={tableVariants}>
          {tokens.map((token, index) => (
            <motion.tr key={index} variants={rowVariants}>
              <motion.td className="py-2 px-4 border-b text-left">
                {token.name}
              </motion.td>
              <motion.td className="py-2 px-4 border-b text-left">
                {token.symbol}
              </motion.td>
              <motion.td className="py-2 px-4 border-b text-left">
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://sepolia.basescan.org/address/${token.address}`}
                >
                  {token.address.slice(0, 14)}...
                </a>

                <button
                  className="ml-2 bg-black text-white px-2 py-1 rounded hover:text-lime-400"
                  onClick={() => copyToClipboard(token.address)}
                >
                  <FaCopy />
                </button>
              </motion.td>
              <motion.td
                className="py-2 px-4 border-b text-left"
                variants={glitchVariants}
              >
                {token.pair}
              </motion.td>
              <motion.td className="py-2 px-4 border-b text-left">
                {token.supply}
              </motion.td>
              <motion.td className="py-2 px-4 border-b text-left">
                {token.name === "WETH" ? (
                  <p>
                    visit
                    <a
                      className="text-light-purple mx-1 hover:text-lime-400"
                      href="https://www.alchemy.com/faucets/ethereum-sepolia"
                    >
                      Alchemy Faucet
                    </a>{" "}
                    to Claim WETH
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-8 py-2 rounded-full hover:text-lime-400">
                      Claim
                    </button>
                    <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-8 py-2 rounded-full hover:text-lime-400">
                      Return
                    </button>
                  </div>
                )}
              </motion.td>
            </motion.tr>
          ))}
        </motion.tbody>
      </motion.table>
      <p className="text-grey text-lg mt-5">
        We require: Metamask, Sepolia WETH, and Testnet ERC20 tokens to test the
        platform. Make sure to claim ETH from{" "}
        <a
          className="text-light-purple mx-1 hover:text-lime-400"
          href="https://www.alchemy.com/faucets/ethereum-sepolia"
        >
          Alchemy Faucet
        </a>{" "}
        , and convert it to WETH on Uniswap. Use WETH address provided above on
        <a
          className="text-light-purple mx-1 hover:text-lime-400"
          href="https://app.uniswap.org/swap"
        >
          Uniswap
        </a>
        . Then deposit WETH to Vault in order to buy trades. You require WETH as
        all our testnet tokens are paired with WETH. Please note these are mock
        tokens with no value outside our testnet. Claim above and proceed below.
      </p>
    </div>
  );
};

export default TokenTable;
