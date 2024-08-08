'use client';
import { client } from '@/components/ConnectWallet/client';
import { Image, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { ConnectButton } from 'thirdweb/react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className="flex items-center justify-between p-1 bg-black text-white 
    border border-gray-800 rounded-full fixed top-6 w-full z-50  w-[calc(100%-5rem)] 
    left-1/2 transform -translate-x-1/2
    max-w-screen-2xl
    "
    >
      <Link href={'/'} className="text-lg font-medium">
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
        <Link href={'/silkroad'}>Silkroad</Link>
        <Tooltip label="Page under construction">
          <div className="cursor-not-allowed">Wallet</div>
        </Tooltip>
        <Tooltip label="Page under construction">
          <div className="cursor-not-allowed">Analytics</div>
        </Tooltip>
        <Link href={'/guide'}>Guide</Link>
        <Link href={'/'}>Claim</Link>
        <Link
          href={'https://docs.xeon-protocol.io/documentation'}
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

      <div className=" md:flex gap-4">
        <ConnectButton
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
          <Tooltip label="Page under construction">
            <div className="hover:text-gray-400 cursor-not-allowed">Wallet</div>
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
    </header>
  );
}

export default Header;
