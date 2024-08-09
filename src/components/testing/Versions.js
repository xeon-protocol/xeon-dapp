import { Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
const SoftwareVersions = () => {
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const entryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const versions = [
    {
      version: '1.0',
      dateRange: '10.12.2023 to 19.12.2023',
      name: 'Xeon Testnet - Dry Bone Thriller 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png',
      link: 'testnet/V1.0/',
    },
    {
      version: '1.1',
      dateRange: '19.12.2023 to 20.12.2023',
      name: 'Xeon Testnet - Tendons Thriller 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween4.png',
      link: 'testnet/V1.1/',
    },
    {
      version: '1.2',
      dateRange: '20.12.2023 to 21.12.2023',
      name: 'Xeon Testnet - The Undead 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween3.png',
      link: 'testnet/V1.2/',
    },
    {
      version: '1.3',
      dateRange: '21.12.2023 to 21.12.2023',
      name: 'Xeon Testnet - The Undead Part 2 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween3.png',
      link: 'testnet/V1.3/',
    },
    {
      version: '1.4',
      dateRange: '24.12.2023 to 25.12.2023',
      name: 'Xeon Testnet - The Undead Part 3 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween3.png',
      link: 'testnet/V1.4/',
    },
    {
      version: '1.5',
      dateRange: '25.12.2023 to 26.12.2023',
      name: 'Xeon Testnet - The Undead Part 4 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween3.png',
      link: 'testnet/V1.5/',
    },
    {
      version: '1.6',
      dateRange: '28.12.2023 to 03.01.2024',
      name: 'Xeon Testnet - Risen 🎃',
      description:
        'Protocol booting, bringing the protocol to life for the first time. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules read smart contract data correctly, individually then collectively towards the end of this testnet version. Chain of choice is Goerli Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-halloween2.png',
      link: 'testnet/V1.6/',
    },
    {
      version: '2.0',
      dateRange: '03.01.2024 to 14.01.2024',
      name: 'Xeon Testnet - Surbuban 🏠',
      description:
        'Protocol is booted and alive. Focusing on froentend cahsier modules. The goal is to get cashier, silkroad, hedge, wallet and analytics page modules working together. Chain of choice is Sepolia Testnet, supports Uniswap V2 Router.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-surbuban2.png',
      link: 'testnet/V2.0/',
    },
    {
      version: '2.1',
      dateRange: '14.01.2024 to 15.01.2024',
      name: 'Xeon Testnet - Surbuban: Part 2 🏠',
      description:
        'Wallet module working fully. Analytics modules have been updated to run. New smart contract updates added to work with scripts. Target stop for this testnet is Hedge Creation.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-surbuban2.png',
      link: 'testnet/V2.1/',
    },
    {
      version: '2.2',
      dateRange: '15.01.2024 to 18.01.2024',
      name: 'Xeon Testnet - Surbuban: Part 3 🏠',
      description:
        'Wallet module working fully. Analytics modules have been updated to run. New smart contract updates added to work with scripts. Target stop for this testnet is Hedge Creation.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-surbuban4.png',
      link: 'testnet/V2.2/',
    },
    {
      version: '2.3',
      dateRange: '25.01.2024 to 07.02.2024',
      name: 'Xeon Testnet - Surbuban: Part 4 🏠',
      description:
        'Silkroad modules running partially, core modules fixed. Read, write, event listening. New smart contract updates added to work with modified scripts. Target stop for this testnet is Hedge Purchase and Settlement.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-surbuban4.png',
      link: 'testnet/V2.3/',
    },
    {
      version: '2.4',
      dateRange: '06.03.2024 to 07.04.2024',
      name: 'Xeon Testnet - Surbuban: Part 5 🏠',
      description:
        'Protocol fully functional. All modules fully functional. Users can claim test ERC20 tokens, deposit tokens to vault, withdraw, create options or swaps, buy options or swaps, monitor trade progress & gains as price flactuates. On every claim the price of the test ERC20 changes. Return test tokens to drop price.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-surbuban5.png',
      link: 'testnet/V2.4/',
    },
    {
      version: '2.5',
      dateRange: '08.04.2024 to **.**.2023',
      name: 'Xeon Testnet - Surbuban: Part 5 🏠',
      description:
        'Iterating the profitability and settlement calculations for each type of trade.',
      imgSrc:
        'https://dapp.xeon-protocol.io/imgs/screenshots/testnet-surbuban5.png',
      link: 'testnet/V2.5/',
    },
  ];

  return (
    <div className="software-versions p-4 text-grey px-8 pt-8 md:px-20 max-w-screen-2xl mx-auto">
      <motion.div
        className="header flex justify-between border-b-2 border-gray-300 pb-2 mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={headerVariants}
        transition={{ duration: 0.6 }}
      >
        <div className="version font-bold">Version</div>
        <div className="name font-bold">Name</div>
        <div className="portal-widget font-bold">Portal Widget</div>
      </motion.div>
      {versions.map((version, index) => (
        <motion.div
          key={index}
          className="entry flex justify-between mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={entryVariants}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <div className="version w-1/4">
            <h3 className="text-lg text-lime">{`{ ${version.version} } `}</h3>
            <div className="text-sm text-gray-600">{version.dateRange}</div>
          </div>
          <div className="name w-1/2 px-4">
            <h3 className="text-lg">{version.name}</h3>
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
        </motion.div>
      ))}
    </div>
  );
};

export default SoftwareVersions;
