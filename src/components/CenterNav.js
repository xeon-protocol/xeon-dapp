"use client";
import {ethers} from "ethers";
import {
  Box,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import {useActiveAccount} from "thirdweb/react";
import {useEffect, useState} from "react";
import {FaPlusCircle, FaSearch} from "react-icons/fa";
import {IoIosInformationCircleOutline} from "react-icons/io";
import {tokenList} from "@/app/utils/tokenList";

function CenterNav({
  setShowPositions,
  setShowDiscover,
  setShowBookmarks,
  activeSection,
  activeSideTab,
  setActiveSection,
  setActiveSideTab,
}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [premium, setPremium] = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [hedgeType, setHedgeType] = useState("");
  const [hedgeCreated, setHedgeCreated] = useState(false);
  const [hedgeError, setHedgeError] = useState(false);
  const [balances, setBalances] = useState({
    deposited: 0,
    locked: 0,
    withdrawn: 0,
    available: 0,
  });
  const account = useActiveAccount();

  const allowedTokens = [
    "Vela Exchange",
    "Pepe",
    "Degen",
    "Higher",
    "Rorschach",
  ];
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const allowedTokenList = tokenList.reduce((acc, token) => {
      if (allowedTokens.includes(token.name)) {
        acc.push(token);
      }
      return acc;
    }, []);

    setTokens(allowedTokenList);
  }, []);
  const contractAddress = "0xf527b037e30d8764e8e24b7ed7a6158488c6a758";
  const abi = [
    "function createHedge(string tool, string token, uint256 amount, uint256 cost, uint256 strikePrice, uint256 deadline) external",
    "function getUserTokenBalances(address token, address user) view returns (deposited uint256, withdrawn uint256, lockedInUse uint256, withdrawable uint256, withdrawableValue uint256, paired address)",
  ];

  const createHedge = async ({
    tool,
    token,
    amount,
    cost,
    strikePrice,
    deadline,
  }) => {
    if (!window.ethereum) {
      console.error("No crypto wallet found. Please install it.");
      return;
    }

    try {
      await window.ethereum.request({method: "eth_requestAccounts"});

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.createHedge(
        tool,
        token,
        amount,
        cost,
        strikePrice,
        deadline
      );
      await tx.wait();
      console.log("Hedge created successfully:", tx);
      setHedgeCreated(true);
    } catch (err) {
      setHedgeError(true);
      console.error("Error creating hedge:", err);
    }
  };

  const handleCreateHedge = () => {
    const toolMap = {
      "Call Option": 0,
      "Put Option": 1,
      "Equity Swap": 2,
    };

    const tool = toolMap[hedgeType] || 0;
    const amount = parseFloat(tokenAmount);
    const cost = parseFloat(premium);
    const strikePriceFloat = parseFloat(strikePrice);
    const deadline = Math.floor(Date.now() / 1000) + 86400 * 30; //Note: Assuming a default of 30 days from now

    createHedge({
      tool,
      token: tokenAddress,
      amount,
      cost,
      strikePrice: strikePriceFloat,
      deadline,
    });
  };
  const getUserTokenBalances = async (tokenAddress, userAddress) => {
    if (!window.ethereum) {
      console.error("No crypto wallet found. Please install it.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balances = await contract.getUserTokenBalances(
        tokenAddress,
        userAddress
      );
      setBalances({
        deposited: ethers.utils.formatUnits(balances[0], 18),
        locked: ethers.utils.formatUnits(balances[1], 18),
        withdrawn: ethers.utils.formatUnits(balances[2], 18),
        available: ethers.utils.formatUnits(balances[3], 18),
      });
    } catch (error) {
      console.error("Error fetching user token balances:", error);
    }
  };
  useEffect(() => {
    if (tokenAddress) {
      // get address of the connected wallet
      const userAddress = account?.address;
      getUserTokenBalances(tokenAddress, userAddress);
    }
  }, [tokenAddress]);
  return (
    <Box position="relative">
      <div className="flex justify-between lg:px-14 px-1 absolute top-0 md:top-[-7px] lg:top-[-7px]  left-0 right-0 pr-3 md:pr-4  lg:px-8 text-[10px] md:text-xs lg:text-lg">
        <p
          onClick={() => {
            setShowPositions(false);
            setShowDiscover(true);
            setShowBookmarks(false);
            setActiveSection("discover");
            setActiveSideTab("");
          }}
          className={`${
            activeSection === "discover" ? "text-grey" : "text-muted"
          } hover:cursor-pointer ml-5`}
        >{`{ Discover }`}</p>
        <p
          onClick={() => {
            setShowPositions(true);
            setShowDiscover(false);
            setShowBookmarks(false);
            setActiveSection("positions");
            setActiveSideTab("");
          }}
          className={`${
            activeSection === "positions" ? "text-grey" : "text-muted"
          } hover:cursor-pointer ml-2 lg:ml-3`}
        >{`{ Positions }`}</p>
        <p
          onClick={() => {
            setShowPositions(false);
            setShowDiscover(false);
            setShowBookmarks(true);
            setActiveSection("bookmarks");
            setActiveSideTab("");
          }}
          className={`${
            activeSection === "bookmarks" ? "text-grey" : "text-muted"
          } hover:cursor-pointer ml-2 lg:ml-5`}
        >{`{ Bookmarks }`}</p>
        <div
          onClick={onOpen}
          class="rounded-full hover:cursor-pointer  w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent"
        >
          <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
            <FaPlusCircle className="text-light-purple" size={14} />
          </div>
        </div>
      </div>
      <Image
        mb={10}
        src="/nav.webp"
        className="h-20 md:h-auto md:block"
        alt="logo"
      />

      <InputGroup
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        width="95%"
        zIndex="1"
        className="bg-[#71637f4d] rounded-lg top-[35px]  md:top-[24px] lg:top-[35px]"
      >
        <InputLeftElement pointerEvents="none">
          <FaSearch color="#6c6c6c" className="ml-2" />
        </InputLeftElement>
        <Input
          size={{
            md: "sm",
            lg: "md",
          }}
          placeholder="filter token address..."
          type="search"
          bg="transparent"
          w={"100%"}
          pl="2rem"
          _focus={{
            border: "none",
            outline: "none",
          }}
          className="bg-[#71637f4d] text-grey p-1 md:p-1 lg:p-2 border-[#6c6c6c] border-[1px] rounded-lg"
        />
      </InputGroup>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent border={"1px solid #6c6c6c"}>
          <div className="bg-black text-lg py-2 text-center text-grey ">
            Create OTC Trade
          </div>
          <ModalCloseButton
            color={"white"}
            _focus={{
              outline: "none",
              border: "none",
              boxShadow: "none",
            }}
            outline={"none"}
          />
          <ModalBody className="bg-black">
            <div className="flex items-center gap-4 mb-2">
              {" "}
              <p className="text-grey">{`{ hedge type }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Select
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              placeholder="Call Option"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full"
              onChange={(e) => setHedgeType(e.target.value)}
            >
              <option className="dark:text-gray text-black">Call Option</option>
              <option className="dark:text-gray text-black">Put Option</option>
              <option className="dark:text-gray text-black">Equity Swap</option>
              <option className="dark:text-gray text-black">
                Loan (coming)
              </option>
            </Select>
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ token address }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Select
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              placeholder="Token Address"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full"
              onChange={(e) => setTokenAddress(e.target.value)}
            >
              {tokens.map((token, index) => (
                <option
                  key={index}
                  value={token.address}
                  className="dark:text-gray text-black"
                >
                  {token.name} {token?.address}
                </option>
              ))}
            </Select>
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ token amount }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
              onChange={(e) => setTokenAmount(e.target.value)}
            />
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ premium }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
              onChange={(e) => setPremium(e.target.value)}
            />
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ strike price }`}</p>
              <IoIosInformationCircleOutline
                className="text-muted"
                tooltip="The price at which the option holder can buy or sell the underlying asset."
              />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
              onChange={(e) => setStrikePrice(e.target.value)}
            />
            <div className="bg-black text-grey p-1 md:p-1 mt-5 lg:p-2 border-[#6c6c6c] border-[1px] rounded-lg">
              <div className="flex justify-between">
                <p className="text-grey w-[60%]">
                  Paste Token Address Above & View Your Balances
                </p>
                <p className="text-underline text-light-purple">
                  {tokenAddress.slice(0, 5)}...{tokenAddress.slice(-4)}
                </p>
              </div>
              <div className="flex gap-2 justify-between">
                <div>
                  <p className="text-muted text-sm text-center">{`{ deposited }`}</p>
                  <p className="text-grey text-center">{balances.deposited}</p>
                </div>
                <div>
                  <p className="text-muted text-sm text-center">{`{ locked }`}</p>
                  <p className="text-grey text-center">{balances.locked}</p>
                </div>
                <div>
                  <p className="text-muted text-sm text-center">{`{ withdrawn }`}</p>
                  <p className="text-grey text-center">{balances.withdrawn}</p>
                </div>
                <div>
                  <p className="text-muted text-sm text-center">{`{ available }`}</p>
                  <p className="text-grey text-center">{balances.available}</p>
                </div>
              </div>
            </div>
          </ModalBody>

          <div className={"bg-black py-3 flex justify-center"}>
            <button
              className="text-white bg-black px-8 py-2 mr-4 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateHedge}
              className="text-white px-8 py-2 mr-4  bg-button-gradient rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
            >
              Write
            </button>
          </div>
          {hedgeCreated && (
            <div className="bg-black text-light-purple text-center p-2">
              Hedge created successfully
            </div>
          )}
          {hedgeError && (
            <div className="bg-black text-red-500 text-center p-2">
              Error creating hedge
            </div>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CenterNav;
