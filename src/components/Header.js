"use client";
import {client} from "@/components/ConnectWallet/client";
import {Image, Spinner, Tooltip} from "@chakra-ui/react";
import Link from "next/link";
import {useState} from "react";
import {LuWallet} from "react-icons/lu";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useWalletBalance,
  useActiveWalletChain,
  useWalletDetailsModal,
} from "thirdweb/react";
import {inAppWallet} from "thirdweb/wallets";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeAccount = useActiveAccount();
  const {disconnect} = useDisconnect();
  const wallet = useActiveWallet();
  const chain = useActiveWalletChain();
  const detailsModal = useWalletDetailsModal();
  const address = activeAccount?.address;
  const {data, isLoading, isError} = useWalletBalance({
    chain,
    address,
    client,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  async function handleShowModal() {
    detailsModal.open({client, theme: "dark"});
  }
  const wallets = [
    inAppWallet({
      auth: {
        options: [
          "farcaster",
          "google",
          "apple",
          "facebook",
          "phone",
          "email",
          "passkey",
        ],
      },
    }),
  ];

  return (
    <header className="bg-black bg-opacity-85 text-white border-y border-gray-800 fixed top-6 w-full z-50 left-0">
      <div className="flex items-center justify-between p-1 w-[calc(100%-5rem)] max-w-screen-2xl mx-auto">
        <Link href={"/"} className="text-lg font-medium">
          <Image
            className="hidden md:block w-auto h-[50px] p-1"
            ml={6}
            src="/logo.png"
            alt="xeon"
          />
          <Image
            className=" md:hidden w-auto h-[50px] p-1"
            ml={6}
            src="/logo-2.png"
            alt="xeon"
          />
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href={"/silkroad"}>Silkroad</Link>
          <Tooltip label="Page under construction">
            <div className="cursor-not-allowed">Wallet</div>
          </Tooltip>
          <Tooltip label="Page under construction">
            <div className="cursor-not-allowed">Analytics</div>
          </Tooltip>
          <Link href={"/guide"}>Guide</Link>
          <Link href={"/"}>Claim</Link>
          <Link
            href={"https://docs.xeon-protocol.io/documentation"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </Link>
        </nav>
        <div className="md:hidden">
          <p className="text-grey" onClick={toggleMenu}>
            MENU
          </p>
        </div>

        <div className=" md:flex gap-4 p-1">
          <ConnectButton
            wallets={wallets}
            connectButton={{
              className:
                "text-white bg-button-gradient px-8 py-1 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue",
              style: {
                backgroundColor: "#3253FB",
                color: "white",
              },
            }}
            signInButton={{
              className:
                "text-white bg-button-gradient px-8 py-1 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue",
            }}
            detailsButton={{
              className:
                "text-white bg-button-gradient px-8 py-1 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue",
              style: {
                backgroundColor: "#3253FB",
                color: "white",
              },
              render: () => {
                return (
                  <div className="flex gap-2 items-center">
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : isError ? (
                      <p>Error</p>
                    ) : (
                      <p className="text-grey">
                        {parseFloat(data?.displayValue).toFixed(3)}{" "}
                        {data.symbol}
                      </p>
                    )}
                    <LuWallet className="inline-block" />
                    <button
                      onClick={handleShowModal}
                      className="text-white bg-button-gradient px-4 py-1 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue rounded-md"
                    >
                      {activeAccount?.address?.slice(0, 6) +
                        "..." +
                        activeAccount?.address.slice(-4)}
                    </button>
                  </div>
                );
              },
            }}
            client={client}
          />
        </div>

        {isMenuOpen && (
          <nav className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col items-center space-y-4 p-4 md:hidden">
            <Link href="/silkroad">
              <p className="hover:text-gray-400">Silkroad</p>
            </Link>
            <Tooltip label="Page under construction">
              <div className="hover:text-gray-400 cursor-not-allowed">
                Wallet
              </div>
            </Tooltip>
            <Tooltip label="Page under construction">
              <div className="hover:text-gray-400 cursor-not-allowed">
                Analytics
              </div>
            </Tooltip>
            <Link href="/guide">
              <p className="hover:text-gray-400">Guide</p>
            </Link>
            <Link href="/">
              <p className="hover:text-gray-400">Claim</p>
            </Link>
            <Link
              href="https://docs.xeon-protocol.io/documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hover:text-gray-400">Docs</p>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
