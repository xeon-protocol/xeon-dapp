import React, { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { color, motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ethers } from 'ethers';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import BookmarkAdded from '../BookmarkAdded';
import MockERC20FactoryABI from '../../../contracts/abi/MockERC20Factory.abi.json';
import { Constants } from '../../abi/Constants.js';

const TokenTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [referralAddress, setReferralAddress] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(
    Constants.testnet.MockERC20FactoryContractAddress,
    'Constants.testnet.MockERC20FactoryContractAddress'
  );
  const [tokens, setTokens] = useState([
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
  ]);

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
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(
      Constants.testnet.MockERC20FactoryContractAddress,
      MockERC20FactoryABI,
      provider
    );

    const fetchTokenSupply = async () => {
      try {
        const updatedTokens = await Promise.all(
          tokens.map(async (token) => {
            const totalSupply = await factoryContract.getTotalSupply(
              token.address
            );
            return {
              ...token,
              supply: ethers.utils.formatUnits(totalSupply, 18),
            };
          })
        );
        setTokens(updatedTokens);
      } catch (error) {
        console.error('Error fetching token supply:', error);
      }
    };

    fetchTokenSupply();
  }, []);
  const handleClaim = async (tokenAddress) => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }

    setLoading(true);
    setError(null);
    onOpen();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const claimContract = new ethers.Contract(
        Constants.testnet.OnboardingUtilsContractAddress,
        [
          'function claimInitial(address tokenAddress) public',
          'function claimInitialWithReferral(address tokenAddress, address referredByAddress) public',
        ],
        signer
      );

      let transaction;
      if (referralAddress) {
        transaction = await claimContract.claimInitialWithReferral(
          tokenAddress,
          referralAddress
        );
      } else {
        transaction = await claimContract.claimInitial(tokenAddress);
      }

      await transaction.wait();
      setShowPopup(true);
      setMessage('Token claimed successfully!');
      setStatus('success');
      // Refresh token supply after claim
      const factoryContract = new ethers.Contract(
        '0x5A0d5390c45b49505C43A56DA4A4f89b93023F11',
        MockERC20FactoryABI,
        provider
      );
      const updatedSupply = await factoryContract.getTotalSupply(tokenAddress);
      const formattedSupply = ethers.utils.formatUnits(updatedSupply, 18);
      console.log(formattedSupply, 'formatted supply');
      setTokens((prevTokens) =>
        prevTokens.map((token) =>
          token.address === tokenAddress
            ? { ...token, supply: formattedSupply }
            : token
        )
      );
    } catch (error) {
      setMessage('Failed to claim token.');
      console.error('Error claiming token:', error);
      setError('Failed to claim token. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden mt-10 px-8 pt-8 md:px-20 max-w-screen-2xl mx-auto">
      <motion.h1 className="text-3xl text-grey">
        <motion.span
          variants={glitchVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          Claim
        </motion.span>{' '}
        Testnet Tokens
      </motion.h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter referral address (optional)"
          value={referralAddress}
          onChange={(e) => setReferralAddress(e.target.value)}
          className="w-full bg-[#26222B] p-2 border text-grey border-gray-300 rounded mt-4"
        />
      </div>
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
                {token.name === 'WETH' ? (
                  <p>
                    visit
                    <a
                      className="text-light-purple mx-1 hover:text-lime-400"
                      href="https://www.alchemy.com/faucets/base-sepolia"
                    >
                      Alchemy Faucet
                    </a>{' '}
                    to claim testnet ETH
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-8 py-2 rounded-full hover:text-lime-400"
                      onClick={() => handleClaim(token.address)}
                    >
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={'#000'}>
          <ModalHeader bg={'#000'} color={'white'}>
            Claim Token
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg={'#000'}>
            {loading ? (
              <Spinner />
            ) : (
              <BookmarkAdded
                message={message}
                status={status}
                setShowPopup={setShowPopup}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <button
              className="
              bg-gradient-button text-white px-4 py-2 rounded mt-4
              "
              onClick={onClose}
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showPopup && (
        <Modal isOpen={showPopup} onClose={() => setShowPopup(false)}>
          <BookmarkAdded
            message={message}
            status={status}
            setShowPopup={setShowPopup}
          />
        </Modal>
      )}

      <p className="text-grey text-lg mt-5">
        We require: Metamask, testnet ETH on Base Sepolia, and Testnet ERC20
        tokens to test the platform. Make sure to claim ETH from{' '}
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="text-light-purple mx-1 hover:text-lime-400"
          href="https://www.alchemy.com/faucets/base-sepolia"
        >
          Alchemy Faucet
        </a>{' '}
        . Your initial token claim includes 1 WETH, which is required for
        opening trades as all tokens are paired with WETH. These tokens are for
        testing purposes only. They hold no value outside of the Xeon Protocol
        Testnet.
      </p>
    </div>
  );
};

export default TokenTable;
