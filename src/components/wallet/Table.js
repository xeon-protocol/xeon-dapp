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
      amount: "0.01",
      supply: "100,000,000",
    },
    {
      name: "oPepe",
      symbol: "oPEPE",
      address: "0x02F992f8F110654869c719bE53a3202F6ab51B08",
      amount: "0.01",
      supply: "100,000,000",
    },
    {
      name: "oBlockchain Bets",
      symbol: "oBCB",
      address: "0x71F72c8A8F7e94F16EcD21cEc9f789bD5c50Af35",
      amount: "0.01",
      supply: "100,000,000",
    },
    {
      name: "oHarryPotterObamaSonicInu",
      symbol: "oBITCOIN",
      address: "0xf588aE424BD3D78f1172Cf37a5a6D604c1FD141c",
      amount: "0.01",
      supply: "100,000,000",
    },
    {
      name: "oBanana Gun Bot",
      symbol: "oBANANA",
      address: "0x8f2936bEAc38d21c63B21D07E4CBee7E416C565D",
      amount: "0.01",
      supply: "100,000,000",
    },
    {
      name: "WETH",
      symbol: "WETH",
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
      amount: "0.01",
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
    <div className="">
      <motion.h1 className="text-3xl text-grey">
        <motion.span
          variants={glitchVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Vault
        </motion.span>{" "}
        Balances
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
            <th className="py-2 px-4 border-b text-left">AMT</th>
            <th className="py-2 px-4 border-b text-left">VALUE</th>
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
                {token.amount}
              </motion.td>
              <motion.td className="py-2 px-4 border-b text-left">
                {token.supply}
              </motion.td>
            </motion.tr>
          ))}
        </motion.tbody>
      </motion.table>
    </div>
  );
};

export default TokenTable;
