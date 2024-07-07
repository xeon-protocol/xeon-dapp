import { Image } from "@chakra-ui/react";
import React from "react";

const SoftwareVersions = () => {
  const versions = [
    {
      version: "1.0",
      dateRange: "10.12.2023 to 19.12.2023",
      name: "Xeon Testnet - Dry Bone Thriller 🎃",
      description:
        "Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.",
      imgSrc:
        "https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png",
      link: "https://dapp.xeon-protocol.io/testnet/V1.0/",
    },
    {
      version: "1.1",
      dateRange: "19.12.2023 to 20.12.2023",
      name: "Xeon Testnet - Tendons Thriller 🎃",
      description:
        "Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.",
      imgSrc:
        "https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png",
      link: "https://dapp.xeon-protocol.io/testnet/V1.1/",
    },
    {
      version: "1.2",
      dateRange: "20.12.2023 to 21.12.2023",
      name: "Xeon Testnet - Tendons Thriller 🎃",
      description:
        "Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.",
      imgSrc:
        "https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png",
      link: "https://dapp.xeon-protocol.io/testnet/V1.1/",
    },
    {
      version: "1.3",
      dateRange: "21.12.2023 to 21.12.2023",
      name: "Xeon Testnet - Tendons Thriller 🎃",
      description:
        "Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.",
      imgSrc:
        "https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png",
      link: "https://dapp.xeon-protocol.io/testnet/V1.1/",
    },
    {
      version: "1.4",
      dateRange: "24.12.2023 to 25.12.2023",
      name: "Xeon Testnet - Tendons Thriller 🎃",
      description:
        "Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.",
      imgSrc:
        "https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png",
      link: "https://dapp.xeon-protocol.io/testnet/V1.1/",
    },
  ];

  return (
    <div className="software-versions p-4 text-grey px-8 pt-8 md:px-20 max-w-screen-2xl mx-auto">
      <div className="header flex justify-between border-b-2 border-gray-300 pb-2 mb-4">
        <div className="version font-bold">Version</div>
        <div className="name font-bold">Name</div>
        <div className="portal-widget font-bold">Portal Widget</div>
      </div>
      {versions.map((version, index) => (
        <div key={index} className="entry flex justify-between mb-4">
          <div className="version w-1/4">
            <h3 className="text-lg text-lime">{`{ ${version.version} } `}</h3>
            <div className="text-sm text-gray-600">{version.dateRange}</div>
          </div>
          <div className="name w-1/2 px-4">
            <h3 className="text-lg ">{version.name}</h3>
            <p className="text-sm text-gray-600 md:w-[80%]">
              {version.description}
            </p>
          </div>
          <div className="portal-widget w-1/4">
            <a href={version.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={version.imgSrc}
                alt={version.name}
                className="w-full"
              />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoftwareVersions;
