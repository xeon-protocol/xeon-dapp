'use client';
import React, { useState } from 'react';
import { Button, IconButton, Image } from '@chakra-ui/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { client } from '@/components/ConnectWallet/client';
import { ConnectButton } from 'thirdweb/react';
import xeonTokenList from '@/abi/xeonTokenList.json';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * @dev map xeonTokenList to the required format for supportedTokens
   */
  const supportedTokens = Object.fromEntries(
    Object.entries(xeonTokenList.tokens).map(([network, tokens]) => [
      network,
      tokens.map(({ address, name, symbol, icon }) => ({
        address,
        name,
        symbol,
        icon,
      })),
    ])
  );

  return (
    <header
      className="flex items-center justify-between p-1 bg-black text-white 
    border border-gray-800 rounded-full fixed top-6 w-full z-50  w-[calc(100%-5rem)] 
    left-1/2 transform -translate-x-1/2
    max-w-screen-2xl
    "
    >
      <Link href={'/'} className="text-lg font-medium">
        <Image className="hidden md:block" ml={6} src="/logo.png" alt="xeon" />
        <Image className=" md:hidden" ml={6} src="/Logo2.png" alt="xeon" />
      </Link>

      <nav className="hidden md:flex space-x-6">
        <Link href={'/silkroad'}>Silkroad</Link>
        <Link href={'/wallet'}>Wallet</Link>
        <Link href={'/analytics'}>Analytics</Link>
        <Link href={'/guide'}>Guide</Link>
        <Link href={'/'}>Claim</Link>
        <Link
          href={
            "https://docs.xeon-protocol.io/documentation target='_blank' rel='noopener noreferrer' "
          }
        >
          Docs
        </Link>
      </nav>
      <div className="md:hidden">
        <p className="text-grey" onClick={toggleMenu}>
          MENU
        </p>
      </div>

      <div className=" md:flex gap-4">
        {/* <button className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
          Switch Network
        </button> */}
        <ConnectButton
          supportedTokens={supportedTokens}
          connectButton={{
            className:
              'text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue',
            style: {
              borderRadius: '50px',
              backgroundColor: '#3253FB',
              color: 'white',
            },
          }}
          signInButton={{
            className:
              'text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue',
          }}
          detailsButton={{
            className:
              'text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue',
            style: {
              borderRadius: '50px',
              backgroundColor: '#3253FB',
              color: 'white',
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
          <Link href="/wallet">
            <p className="hover:text-gray-400">Wallet</p>
          </Link>
          <Link href="/analytics">
            <p className="hover:text-gray-400">Analytics</p>
          </Link>
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
    </header>
  );
}

export default Header;
