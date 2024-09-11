import {Image} from "@chakra-ui/react";
const explorerUrls = {
  0: "https://sepolia.basescan.org/tx/",
  1: "https://etherscan.io/tx/",
  56: "https://bscscan.com/tx/",
  137: "https://polygonscan.com/tx/",
  84532: "https://sepolia.basescan.org/tx/",
};

function BookmarkAdded({message, status, chainId, txHash}) {
  const explorerUrl = explorerUrls[chainId]
    ? `${explorerUrls[chainId]}${txHash}`
    : null;

  return (
    <div className="bg-black text-grey flex flex-col justify-center items-center">
      <p className="text-lg mb-4 text-center">{status}</p>
      <Image
        src={status === "success" ? "/success.webp" : "/fail.webp"}
        alt="transaction status"
        className=""
      />

      <h3 className="text-2xl mt-4 text-center">{message}</h3>

      {status === "success" && explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-light-purple underline mt-2"
        >
          View Transaction on Explorer
        </a>
      )}
    </div>
  );
}

export default BookmarkAdded;
