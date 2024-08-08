import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaCopy } from 'react-icons/fa';

const TokenTable = () => {
  const tokens = [
    {
      name: 'Vela Exchange',
      symbol: 'oVELA',
      address: '0xb7E16D46f26B1615Dcc501931F28F07fD4b0D7F4',
      pair: 'WETH',
      supply: '100,000,000',
    },
    {
      name: 'Pepe',
      symbol: 'oPEPE',
      address: '0x7dC9ecE25dcCA41D8a627cb47ded4a9322f7722b',
      pair: 'WETH',
      supply: '100,000,000',
    },
    {
      name: 'Degen',
      symbol: 'oDEGEN',
      address: '0x9B9852A943a570685c3704d70C4F1ebD5EdE109B',
      pair: 'WETH',
      supply: '100,000,000',
    },
    {
      name: 'Higher',
      symbol: 'oHIGHER',
      address: '0x9855d38b7E6270B9f22F283A0C62330b16Ac909C',
      pair: 'WETH',
      supply: '100,000,000',
    },
    {
      name: 'Rorschach',
      symbol: 'oROR',
      address: '0xEb2DCAFFFf1b0d5BA76F14Fe6bB8348126339FcB',
      pair: 'WETH',
      supply: '100,000,000',
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      address: '0x395cB7753B02A15ed1C099DFc36bF00171F18218',
      pair: 'WETH',
      supply: '134,000',
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Address copied to clipboard!');
      },
      (err) => {
        alert('Failed to copy the address.');
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
        '1px 1px 0px lime',
        '-1px -1px 0px purple',
        '1px -1px 0px lime',
        '-1px 1px 0px lime',
        '2px 2px 2px lime',
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: 'mirror',
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
          animate={inView ? 'visible' : 'hidden'}
        >
          Vault
        </motion.span>{' '}
        Balances
      </motion.h1>
      <motion.table
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
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
