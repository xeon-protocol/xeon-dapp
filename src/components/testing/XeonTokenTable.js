import XeonTokenDistributorABI from "@/abi/XeonTokenDistributor.abi.json";
import {Constants} from "@/abi/constants";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {ethers} from "ethers";
import {useEffect, useState} from "react";
import BookmarkAdded from "../BookmarkAdded";
import {FaCopy} from "react-icons/fa";

const XeonTokenTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [txHash, setTxHash] = useState("");
  const [txChainId, setTxChainId] = useState("");

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

  const xeonToken = {
    name: "Xeon Token",
    symbol: "XEON",
    address: Constants.testnet.XeonToken,
    supply: "100,000,000",
  };

  const handleClaimXeon = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    setLoading(true);
    setError(null);
    onOpen();

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const xeonDistributorContract = new ethers.Contract(
        Constants.testnet.XeonTokenDistributor,
        XeonTokenDistributorABI,
        signer
      );

      const userAddress = await signer.getAddress();
      const hasClaimed = await xeonDistributorContract.hasUserClaimed(
        userAddress
      );

      if (hasClaimed) {
        setMessage("You have already claimed your XEON tokens.");
        setStatus("error");
      } else {
        const transaction = await xeonDistributorContract.claimXeon();
        await transaction.wait();
        setTxHash(transaction.hash);
        setTxChainId(transaction.chainId);
        setShowPopup(true);
        setMessage("XEON tokens claimed successfully!");
        setStatus("success");
      }
    } catch (error) {
      console.error("Error claiming XEON tokens:", error);
      setMessage("Failed to claim XEON tokens.");
      setStatus("failed");
    }

    setLoading(false);
  };

  return (
    <div className="overflow-x-auto overflow-y-hidden mt-10 2xl:mt-32 px-8 pt-8 md:px-20 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl text-grey">Claim testnet XEON</h1>
      <table className="min-w-full bg-black border rounded mt-10 text-grey">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">NAME</th>
            <th className="py-2 px-4 border-b text-left">SYMB</th>
            <th className="py-2 px-4 border-b text-left">ADDR</th>
            <th className="py-2 px-4 border-b text-left">SUPPLY</th>
            <th className="py-2 px-4 border-b text-left">{""}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b text-left">{xeonToken.name}</td>
            <td className="py-2 px-4 border-b text-left">{xeonToken.symbol}</td>
            <td className="py-2 px-4 border-b text-left">
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={`https://sepolia.basescan.org/address/${xeonToken.address}`}
              >
                {xeonToken.address.slice(0, 6)}...{xeonToken.address.slice(-4)}
              </a>
              <button
                className="ml-2 bg-black text-white px-2 py-1 rounded hover:text-lime-400"
                onClick={() => copyToClipboard(xeonToken.address)}
              >
                <FaCopy />
              </button>
            </td>
            <td className="py-2 px-4 border-b text-left">{xeonToken.supply}</td>
            <td className="py-2 px-4 border-b text-left">
              <button
                className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-8 py-2 rounded-full hover:text-lime-400"
                onClick={handleClaimXeon}
              >
                Claim XEON
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#000"}>
          <ModalHeader bg={"#000"} color={"white"}>
            Claim XEON Tokens
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg={"#000"}>
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
            txHash={txHash}
            txChainId={txChainId}
            setShowPopup={setShowPopup}
          />
        </Modal>
      )}
    </div>
  );
};

export default XeonTokenTable;
