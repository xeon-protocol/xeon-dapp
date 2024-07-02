import { Box, Image } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <Box fontWeight={"400"} position="relative" width="100%">
      <Image src="/line_footer.webp" alt="line footer" width="100%" />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        zIndex="0"
        height="300px"
        backgroundImage="url('/ellipse.webp')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Box
        py={20}
        className=" z-2 w-full flex flex-wrap"
        position="relative"
        zIndex="2"
      >
        <Box className="w-full md:w-1/2 p-4" color="white" textAlign="left">
          <p>Xeon Protocol.</p>
          <p>ERC20 Hedging & Lending Ecosystem.</p>
          <Box className="flex items-center gap-4 mt-5">
            <a
              href="https://twitter.com/XeonProtocol"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/x.webp" alt="twitter" />
            </a>
            <a
              href="https://medium.com/@xeonprotocol"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/medium.webp" alt="medium" />
            </a>
            <a
              href="https://t.me/XeonProtocolPortal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/telegram.webp" alt="telegram" />
            </a>
            <a href="mailto:info@xeon-protocol.io">
              <Image src="/mail.webp" alt="mail" />
            </a>
          </Box>
        </Box>
        <Box className="w-full md:w-1/6 p-4" textAlign="left">
          <p className="mb-2 text-grey">{`{ READ }`}</p>
          <li className="mb-2 text-grey">
            {" "}
            <Link href="https://xeonprotocol.gitbook.io/xeon-protocol">Documentation</Link>
          </li>

          <li className="mb-2 text-grey">
            <Link href="/whitepaper">Whitepaper</Link>
          </li>
          <li className="mb-2 text-grey">
            <Link href="https://medium.com/@xeonprotocol">Medium</Link>
          </li>
        </Box>
        <Box className="w-full md:w-1/6 p-4" textAlign="left">
          <p className="mb-2 text-grey">{`{ ENGINEERING }`}</p>
          <li className="mb-2 text-grey">
            {" "}
            <Link href="https://github.com/neonhedge">Github Repo</Link>
          </li>

          <li className="mb-2 text-grey">
            <Link href="https://docs.xeon-protocol.io/documentation/mechanics/development/deployments">Smart Contracts</Link>
          </li>
          <li className="mb-2 text-grey">
            <Link href="https://docs.xeon-protocol.io/documentation/mechanics/development/security-audits">Secutity Audits</Link>
          </li>
        </Box>
        <Box className="w-full md:w-1/6 p-4" textAlign="left">
          <p className="mb-2 text-grey">{`{ REVENUE SHARING }`}</p>
          <li className="mb-2 text-grey">
            {" "}
            <Link href="https://docs.xeon-protocol.io/documentation/real-yield/protocol-income">Protocol Fees</Link>
          </li>

          <li className="mb-2 text-grey">
            <Link href="https://docs.xeon-protocol.io/documentation/earn-with-us/how-to-earn">Ways to Earn</Link>
          </li>
          <li className="mb-2 text-grey">
            <Link href="https://docs.xeon-protocol.io/documentation/earn-with-us/hedge-mining">Miner Program</Link>
          </li>
        </Box>
      </Box>
      <Box className="w-full text-center text-white p-4 border-t-[1px] border-[#6c6c6c]">
        <p> Xeon Protocol © All rights reserved. 2024.</p>
      </Box>
    </Box>
  );
}

export default Footer;

import { Box, Image } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <Box position="relative" width="100%">
      <Image src="/line_footer.webp" alt="line footer" width="100%" />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        zIndex="0"
        height="300px"
        backgroundImage="url('/ellipse.webp')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Box
        py={20}
        className=" z-2 w-full flex flex-wrap"
        position="relative"
        zIndex="2"
      >
        <Box
          className="w-full md:w-1/2 p-4"
          bg="blue.500"
          color="white"
          textAlign="left"
        >
          <p>Xeon Protocol.</p>
          <p>ERC20 Hedging & Lending Ecosystem.</p>
          <Box className="flex items-center gap-4 mt-5">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/x.webp" alt="twitter" />
            </a>
            <a
              href="https://medium.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/medium.webp" alt="medium" />
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/telegram.webp" alt="telegram" />
            </a>
            <a href="mailto:example@example.com">
              <Image src="/mail.webp" alt="mail" />
            </a>
          </Box>
        </Box>
        <Box
          className="w-full md:w-1/6 p-4"
          bg="green.500"
          color="white"
          textAlign="left"
        >
          <p className="mb-2"> {`{ READ }`}</p>
          <li className="mb-2">
            {" "}
            <Link href="/documentation">Documentation</Link>
          </li>

          <li className="mb-2">
            <Link href="/whitepaper">Whitepaper</Link>
          </li>
          <li className="mb-2">
            <Link href="/medium">Medium</Link>
          </li>
        </Box>
        <Box
          className="w-full md:w-1/6 p-4"
          bg="red.500"
          color="white"
          textAlign="left"
        >
          <p className="mb-2"> {`{ ENGINEERING }`}</p>
          <li className="mb-2">
            {" "}
            <Link href="/github">Github Repo</Link>
          </li>

          <li className="mb-2">
            <Link href="/smart-contracts">Smart Contracts</Link>
          </li>
          <li className="mb-2">
            <Link href="/security-audits">Secutity Audits</Link>
          </li>
        </Box>
        <Box
          className="w-full md:w-1/6 p-4"
          bg="purple.500"
          color="white"
          textAlign="left"
        >
          <p className="mb-2"> {`{ REVENUE SHARING }`}</p>
          <li className="mb-2">
            {" "}
            <Link href="/protocol-fees">Protocol Fees</Link>
          </li>

          <li className="mb-2">
            <Link href="/ways-to-earn">Ways to Earn</Link>
          </li>
          <li className="mb-2">
            <Link href="/miner-program">Miner Program</Link>
          </li>
        </Box>
      </Box>
      <Box className="w-full text-center text-white p-4 border-t-[1px] border-[#6c6c6c]">
        <p> Xeon Protocol © All rights reserved. 2024.</p>
      </Box>
    </Box>
  );
}

export default Footer;