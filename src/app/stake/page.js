'use client';

import { useEffect, useState, useMemo } from 'react';
import { Image } from '@chakra-ui/react';
import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/animations/PE2.json';
import XeonStakingPoolABI from '@/abi/XeonStakingPool.abi.json';
import { Constants } from '@/abi/constants';
import Header from '@/components/Header';
import UserAssets from '@/components/staking/UserAssets';
import { ethers } from 'ethers';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import BookmarkAdded from '@/components/BookmarkAdded';

function Page() {
  const [voteValue, setVoteValue] = useState(5); // state for user buyback vote value
  // todo: for mainnet, ensure currentPercentage is proper default
  const [currentPercentage, setCurrentPercentage] = useState(5); // state for current buyback percentage
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // init provider and signer
  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(signer);
      }
    };

    initializeProvider();
  }, []);

  // memoize the XeonStakingPool contract instance to avoid re-creating it on every render
  const XeonStakingPool = useMemo(() => {
    if (!provider || !signer) return null;
    return new ethers.Contract(
      Constants.testnet.XeonStakingPool,
      XeonStakingPoolABI,
      signer
    );
  }, [provider, signer]);

  // fetch current buyback percentage value from staking contract
  useEffect(() => {
    const fetchBuybackPercentage = async () => {
      if (XeonStakingPool) {
        try {
          // todo: for mainnet, ensure value is formatted correctly (N/10000)
          const percentage = await XeonStakingPool.buyBackPercentage(); // assume integer value from contract
          setCurrentPercentage(percentage.toNumber()); // update state with value
        } catch (error) {
          console.error('Error fetching buyback percentage:', error);
        }
      }
    };

    fetchBuybackPercentage();
  }, [XeonStakingPool]);

  // handle increment and decrement of vote value
  // todo: for mainnet, ensure vote value is clamped to contract min/max
  const handleIncrement = () => {
    setVoteValue((prevValue) => Math.min(prevValue + 1, 100));
  };

  const handleDecrement = () => {
    setVoteValue((prevValue) => Math.max(prevValue - 1, 1));
  };

  const handleVote = async () => {
    if (!XeonStakingPool || voteValue < 1 || voteValue > 100) {
      setMessage('Please enter a value between 1 and 100');
      return;
    }

    setLoading(true);
    onOpen();

    try {
      const tx = await XeonStakingPool.voteForBuybackPercentage(voteValue);
      await tx.wait();
      setLoading(false);
      setMessage(`Vote successful for ${voteValue}% buyback`);
    } catch (error) {
      console.error('Vote failed', error);
      setLoading(false);
      setMessage('Vote failed, please try again.');
    }
  };

  // handle vote value change
  const handleVoteChange = (e) => {
    const value = parseInt(e.target.value);
    if (Number.isNaN(value)) {
      setVoteValue(1);
    } else {
      setVoteValue(Math.min(Math.max(value, 1), 100));
    }
  };

  return (
    <div className="bg-[#000] lg:min-h-[100vh] 2xl:min-h-[50vh] px-8 pt-8 max-w-screen-2xl mx-auto relative">
      <Header />
      <div className="flex flex-col md:gap-12 md:flex-row justify-between 2xl:mt-[20%] mt-[18%]">
        <div className="md:w-[40%] lg:w-auto md:px-0 lg:px-18 flex items-center md:block">
          <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">Stake</h1>
          <h1 className="text-floral text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10">
            Xeon
          </h1>

          <Image
            src="/dotted.webp"
            alt="container"
            className="md:absolute top-[10%] w-[40%] left-[-10%] hidden lg:block"
          />
          <Lottie
            className="w-[40%] md:absolute top-[-55px] 2xl:right-[47%] right-[46%] hidden lg:block"
            loop
            animationData={lottieJson}
            play
          />
        </div>
        <div className="relative">
          <p className="text-grey text-lg w-[85%] mt-4">Stake XEON and earn.</p>
          <div className="md:absolute md:top-24 lg:top-20 md:left-[30px] lg:left-8 w-full h-full">
            <p className="text-grey md:text-justify text-lg md:w-[80%]">
              Staking XEON allows you to passively earn a share of the revenue
              generated through the protocol. Staking Epochs last for 30 days,
              followed by a 3 day window during which time XEON can be staked or
              unstaked. All revenue collected through the protocol is deposited
              into the staking pool and split among stakers proportional to the
              amount of XEON staked. The staking pool also automatically buys
              back XEON from the LP at the end of every epoch, translating to
              passive buy pressure on the token. Stakers can vote on the
              percentage of revenue used to buyback XEON.
            </p>
          </div>
          <Image
            src="/card-109.svg"
            h={{
              base: '150px',
              md: '200px',
              lg: '185px',
            }}
            alt="container"
            className="relative hidden md:block ml-[-20px]"
          />
        </div>
      </div>
      <div className="mt-20">
        <UserAssets />
      </div>
      <div className="md:flex justify-between gap-8 px-8 pb-20">
        <div className="w-full md:w-1/2 p-5">
          <div className="text-grey text-lg mt-4 border-2 p-2 rounded-md">
            <h3 className="text-grey text-3xl md:text-5xl lg:text-7xl">
              Settle
            </h3>
            <p className="text-left mt-2">
              Close expired positions and collect fess into the staking pool
            </p>
            <div className="flex">
              <button className="m-auto text-white bg-floral mx-auto mt-10 mb-12 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime">
                Settle
              </button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-5">
          <div className="text-grey text-lg mt-4 border-2 p-2 rounded-md">
            <h3 className="text-grey text-3xl md:text-5xl lg:text-7xl">
              $XEON Buyback
            </h3>
            <p className="text-left mt-2">
              What percentage of protocol revenue should be used to buyback
              $XEON token?
            </p>
            <div className="flex items-center mt-5">
              <button
                className="text-white bg-floral px-4 p-2 rounded-full border-[1px] border-button-gradient hover:bg-purple hover:border-lime"
                onClick={handleDecrement}
              >
                -
              </button>

              <input
                type="number"
                value={voteValue}
                onChange={handleVoteChange}
                min={1}
                max={100}
                className="border-[1px] text-center bg-[#71637f4d] mx-3 rounded-xl border-grey p-2 focus:outline-lime w-[40%]"
              />

              <button
                className="text-white bg-floral px-4 p-2 rounded-full border-[1px] border-button-gradient hover:bg-purple hover:border-lime"
                onClick={handleIncrement}
              >
                +
              </button>
              <button
                className="m-auto text-white bg-floral mx-auto px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime"
                onClick={handleVote}
              >
                Vote
              </button>
            </div>
            <p className="mt-3">
              Current Buyback Percentage: {currentPercentage}%
            </p>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={'#000'}>
          <ModalHeader bg={'#000'} color={'white'}>
            Vote Feedback
          </ModalHeader>
          <ModalBody bg={'#000'}>
            {loading ? (
              <Spinner />
            ) : (
              <BookmarkAdded
                message={message}
                status={loading ? 'loading' : 'success'}
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
    </div>
  );
}

export default Page;
