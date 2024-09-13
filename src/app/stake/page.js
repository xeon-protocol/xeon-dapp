"use client";

import {useEffect, useState, useMemo} from "react";
import XeonStakingPoolABI from "@/abi/XeonStakingPool.abi.json";
import {Constants} from "@/abi/constants";
import Header from "@/components/Header";
import UserAssets from "@/components/staking/UserAssets";
import {ethers} from "ethers";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import BookmarkAdded from "@/components/BookmarkAdded";
import {useActiveAccount} from "thirdweb/react";

function Page() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [epoch, setEpoch] = useState("0.00"); // todo: app doesn't set epoch, only reads it (value is whole number integer)
  const [ethInPool, setEthInPool] = useState("0.00");
  const [buyBackPercentage, setBuyBackPercentage] = useState("0.00");
  const [teamPercentage, setTeamPercentage] = useState("0.00");
  const [walletXeonBalance, setWalletXeonBalance] = useState("0.00"); // todo: display user's contract balance
  const [stakedXeonBalance, setStakedXeonBalance] = useState("0.00"); // todo: display user's staked balance
  const wallet = useActiveAccount();
  const connectedAddress = wallet?.address;
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const {isOpen, onOpen, onClose} = useDisclosure();

  // init provider and signer
  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
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

  const XeonToken = useMemo(() => {
    if (!provider || !signer) return null;
    return new ethers.Contract(
      Constants.testnet.XeonToken,
      XeonStakingPoolABI,
      signer
    );
  }, [provider, signer]);
  const WETH = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(
      Constants.testnet.WETH,
      XeonStakingPoolABI,
      provider
    );
  }, [provider]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!XeonStakingPool || !WETH || !XeonToken || !connectedAddress)
          return;

        const epoch = await XeonStakingPool.epoch();
        setEpoch(ethers.utils.formatUnits(epoch, 0));

        const ethBalance = await WETH.balanceOf(
          Constants.testnet.XeonStakingPool
        );
        setEthInPool(ethers.utils.formatEther(ethBalance));

        const buyBackPercentage = await XeonStakingPool.buyBackPercentage();
        setBuyBackPercentage(ethers.utils.formatUnits(buyBackPercentage, 0));

        const teamPercentage = await XeonStakingPool.teamPercentage();
        setTeamPercentage(ethers.utils.formatUnits(teamPercentage, 0));

        const xeonBalance = await XeonToken.balanceOf(connectedAddress);
        setWalletXeonBalance(ethers.utils.formatEther(xeonBalance));

        const stakedXeonBalance = await XeonStakingPool.balanceOf(
          connectedAddress
        );
        setStakedXeonBalance(ethers.utils.formatEther(stakedXeonBalance));
      } catch (error) {
        console.error("Error fetching asset values:", error);
      }
    };

    if (connectedAddress) {
      fetchData();
    }
  }, [connectedAddress, XeonStakingPool, XeonToken, WETH]);

  useEffect(() => {
    // fetch current buyback percentage from contract
    const fetchBuybackPercentage = async () => {
      if (XeonStakingPool) {
        try {
          // todo: for mainnet, ensure value is formatted correctly (N/10000)
          const percentage = await XeonStakingPool.buyBackPercentage(); // assume integer value from contract
          setCurrentPercentage(percentage.toNumber()); // update state with value
        } catch (error) {
          console.error("Error fetching buyback percentage:", error);
        }
      }
    };

    fetchBuybackPercentage();
  }, [XeonStakingPool]);

  return (
    <div className="bg-[#000] lg:min-h-[100vh] 2xl:min-h-[50vh] px-8 pt-8 max-w-screen-2xl mx-auto relative">
      <Header />
      <div className="flex flex-col md:gap-12 md:flex-row justify-between 2xl:mt-[10%] mt-[8%]">
        <div className="md:w-[40%] lg:w-auto md:px-0 lg:px-10 flex items-center md:block">
          <p className="text-lime text-2xl mt-4">
            Stake your XEON tokens in just two simple steps.
          </p>
          <div className="mt-3 ">
            <p className="text-grey md:text-justify text-lg md:w-[65%]">
              Stake XEON tokens to be eligible for revenue sharing. The staking
              window opens for 3 days at the end of each epoch, at which time
              XEON can be staked or unstaked. Protocol revenue is deposited is
              deposited into the staking pool.
            </p>
          </div>
        </div>
        <div className="relative md:w-[35%]">
          <div className="w-full lg:px-10">
            <div className="w-full flex justify-between gap-5">
              <div className="w-full flex justify-between">
                <p className="text-grey text-3xl"></p>
                <p className="text-light-purple">
                  {wallet?.address.slice(0, 6) +
                    "..." +
                    wallet?.address.slice(-4)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 ">
              <p className="text-right text-grey">Epoch # {epoch}</p>
              <p className="text-right text-grey">{ethInPool} ETH in pool</p>
              <p className="text-right text-grey">
                $XEON Buyback: {buyBackPercentage}%
              </p>
              <p className="text-right text-grey">
                Team Percentage: {teamPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <UserAssets />
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#000"}>
          <ModalHeader bg={"#000"} color={"white"}>
            Vote Feedback
          </ModalHeader>
          <ModalBody bg={"#000"}>
            {loading ? (
              <Spinner />
            ) : (
              <BookmarkAdded
                message={message}
                status={loading ? "loading" : "success"}
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
