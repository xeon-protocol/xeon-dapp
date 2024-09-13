"use client";
import {
  FormControl,
  FormLabel,
  Switch,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {useState, useEffect, useMemo} from "react";

import {ethers} from "ethers";
import XeonStakingPoolABI from "@/abi/XeonStakingPool.abi.json";
import {Constants} from "@/abi/constants";
import BookmarkAdded from "../BookmarkAdded";
import {useActiveAccount} from "thirdweb/react";

function UserAssets() {
  const [isSwitched, setIsSwitched] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [buttonText, setButtonText] = useState("APPROVE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const wallet = useActiveAccount();
  const [voteValue, setVoteValue] = useState(5); // state for user buyback vote value
  // todo: for mainnet, ensure currentPercentage is proper default
  const [currentPercentage, setCurrentPercentage] = useState(5); // state for current buyback percentage

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(signer);
    }
  }, []);

  const XeonToken = useMemo(() => {
    if (!provider || !signer) return null;
    return new ethers.Contract(
      Constants.testnet.XeonToken,
      XeonStakingPoolABI,
      signer
    );
  }, [provider, signer]);

  const XeonStakingPool = useMemo(() => {
    if (!provider || !signer) return null;
    return new ethers.Contract(
      Constants.testnet.XeonStakingPool,
      XeonStakingPoolABI,
      signer
    );
  }, [provider, signer]);

  useEffect(() => {
    if (wallet && XeonToken && XeonStakingPool) {
      XeonToken.balanceOf(wallet.address).then((balance) => {
        setWalletBalance(ethers.utils.formatEther(balance));
      });

      XeonStakingPool.stakedAmounts(wallet.address).then((balance) => {
        setStakedBalance(ethers.utils.formatEther(balance));
      });

      XeonToken.allowance(wallet.address, XeonStakingPool.address).then(
        (allowance) => {
          if (ethers.utils.formatEther(allowance) > 0) {
            setIsApproved(true);
            setButtonText("STAKE");
          }
        }
      );
    }
  }, [wallet, XeonToken, XeonStakingPool]);

  const switchHandler = () => {
    setIsSwitched(!isSwitched);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (parseFloat(stakeAmount) > parseFloat(walletBalance)) {
        throw new Error("Amount exceeds wallet balance");
      }

      if (!isApproved && XeonToken) {
        const tx = await XeonToken.approve(
          XeonStakingPool.address,
          ethers.utils.parseEther(stakeAmount)
        );
        await tx.wait();
        setIsApproved(true);
        setButtonText("STAKE");
        setStatus("success");
        setMessage("Approval successful!");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Approval failed.");
      console.error("Approval failed", error);
    } finally {
      setLoading(false);
      onOpen();
    }
  };

  const handleStake = async () => {
    setLoading(true);
    try {
      if (parseFloat(stakeAmount) > parseFloat(walletBalance)) {
        throw new Error("Amount exceeds wallet balance");
      }

      if (isApproved && XeonStakingPool) {
        const tx = await XeonStakingPool.stake(
          ethers.utils.parseEther(stakeAmount)
        );
        await tx.wait();
        setStatus("success");
        setMessage("Stake successful!");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Staking failed.");
      console.error("Staking failed", error);
    } finally {
      setLoading(false);
      onOpen();
    }
  };

  const handleUnstake = async () => {
    setLoading(true);
    try {
      if (parseFloat(stakeAmount) > parseFloat(stakedBalance)) {
        throw new Error("Unstake amount exceeds staked balance");
      }

      const tx = await XeonStakingPool.unstake(
        ethers.utils.parseEther(stakeAmount)
      );
      await tx.wait();
      setMessage("Unstake successful");
    } catch (error) {
      console.error("Unstaking failed", error);
      setMessage(error.message || "Unstaking failed");
    } finally {
      setLoading(false);
      onOpen();
    }
  };

  const handleButtonClick = () => {
    if (isSwitched) {
      handleUnstake();
    } else if (isApproved) {
      handleStake();
    } else {
      handleApprove();
    }
  };

  const handleStakeAmountChange = (e) => {
    const value = e.target.value;
    setStakeAmount(value);
  };
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
      setMessage("Please enter a value between 1 and 100");
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
      console.error("Vote failed", error);
      setLoading(false);
      setMessage("Vote failed, please try again.");
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
    <div className="flex flex-col gap-6 md:gap-6 lg:gap-6 lg:pb-20 relative md:flex-row justify-between  px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="md:w-[60%]">
        <div className="text-grey text-2xl md:text-3xl mb-4 ">
          {isSwitched ? "Unstake Tokens" : "Stake Tokens"}
        </div>
        <div className="border-2 bg-black rounded-xl border-grey w-full p-4 hover:border-animate">
          {isSwitched ? (
            <motion.div
              className="w-full  py-5"
              initial={{opacity: 0, x: -50}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: 50}}
            >
              <div className="w-full flex justify-between mt-2">
                <div>
                  <div className="my-2">
                    <p className="text-lg text-grey">
                      Staked: $XEON {stakedBalance}
                    </p>
                  </div>

                  <div className="flex justify-between my-2">
                    <p className="text-lg text-grey">
                      Wallet: $XEON {walletBalance}
                    </p>
                  </div>
                </div>
                <div className="text-grey">
                  <input
                    type="text"
                    placeholder="Amount..."
                    value={stakeAmount}
                    onChange={handleStakeAmountChange}
                    className="border-[1px] bg-[#71637f4d] mt-5 rounded-xl border-grey p-2 focus:outline-lime w-full"
                  />

                  <div className="flex flex-col items-center justify-center w-full">
                    <button
                      className="text-white bg-button-gradient mx-auto mt-5 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime"
                      onClick={handleButtonClick}
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Unstake"}
                    </button>
                    <FormControl display="flex" alignItems="center">
                      <Switch
                        mt={4}
                        mx={"auto"}
                        isChecked={isSwitched}
                        onChange={switchHandler}
                        id="mode-switch"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full"
              initial={{opacity: 0, x: 50}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: -50}}
            >
              <div className="w-full flex justify-between mt-4">
                <div>
                  <div className="my-2">
                    <p className="text-lg text-grey">
                      Staked: $XEON {stakedBalance}
                    </p>
                  </div>

                  <div className="flex justify-between my-2">
                    <p className="text-lg text-grey">
                      Wallet: $XEON {walletBalance}
                    </p>
                  </div>
                </div>
                <div className="text-grey">
                  <input
                    type="text"
                    placeholder="Amount..."
                    value={stakeAmount}
                    onChange={handleStakeAmountChange}
                    className="border-[1px] bg-[#71637f4d] mt-5 rounded-xl border-grey p-2 focus:outline-lime w-full"
                  />

                  <div className="flex flex-col items-center justify-center w-full">
                    <button
                      className="text-white bg-floral mx-auto mt-5 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime"
                      onClick={handleButtonClick}
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : buttonText}
                    </button>
                    <FormControl display="flex" alignItems="center">
                      <Switch
                        mt={4}
                        mx={"auto"}
                        isChecked={isSwitched}
                        onChange={switchHandler}
                        id="mode-switch"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <div className="w-full rounded-xl  flex gap-2 hover:border-animate">
        <div className="md:flex justify-between gap-8 px-8 pb-20">
          <div className="w-full md:w-1/3  ">
            <h3 className="text-grey text-2xl md:text-3xl mb-4">Settle</h3>
            <div className="text-grey text-lg  border-2 py-4 px-2 rounded-md">
              <p className="text-center mt-2">
                Close expired positions and collect fess into the staking pool
              </p>
              <div className="flex">
                <button className="m-auto text-white bg-floral mx-auto mt-4 mb-4 px-8 p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-lime">
                  Settle
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3  ">
            <h3 className="text-grey text-2xl md:text-3xl mb-4">
              $XEON Buyback
            </h3>
            <div className="text-grey text-lg py-4 border-2 p-2 rounded-md">
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
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#000"}>
          <ModalHeader bg={"#000"} color={"white"}>
            {status === "success" ? "Success" : "Error"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg={"#000"}>
            {loading ? (
              <Spinner />
            ) : (
              <BookmarkAdded
                message={message}
                status={status}
                setShowPopup={onClose}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <button
              className="bg-gradient-button text-white px-4 py-2 rounded mt-4"
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

export default UserAssets;
