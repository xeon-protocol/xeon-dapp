import React from "react";
import { FaCopy } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TokenTable = () => {
  const tokens = [
    {
      name: "oVela Exchange",
      symbol: "oVELA",
      address: "0x461eBee65e95F92db8bb9f0122B57E946D0245Bc",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "oPepe",
      symbol: "oPEPE",
      address: "0x02F992f8F110654869c719bE53a3202F6ab51B08",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "oBlockchain Bets",
      symbol: "oBCB",
      address: "0x71F72c8A8F7e94F16EcD21cEc9f789bD5c50Af35",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "oHarryPotterObamaSonicInu",
      symbol: "oBITCOIN",
      address: "0xf588aE424BD3D78f1172Cf37a5a6D604c1FD141c",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "oBanana Gun Bot",
      symbol: "oBANANA",
      address: "0x8f2936bEAc38d21c63B21D07E4CBee7E416C565D",
      pair: "WETH",
      supply: "100,000,000",
    },
    {
      name: "WETH",
      symbol: "WETH",
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
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
                {token.address.slice(0, 14)}...
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
