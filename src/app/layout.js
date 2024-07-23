import "./globals.css";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";

import { ThirdwebProvider } from "thirdweb/react";

export const metadata = {
  title: "Xeon Dapp",
  description:
    "Unlock liquidity and manage risk seamlessly with XEON Protocol, the future of DeFi. Use any ERC-20 token as collateral, receive DeFi cash advances, and trade options & swaps.",

  image: "/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=nippo@200,300,400,500,700&display=swap"
          rel="stylesheet"
        />

        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        <link rel="icon" href={metadata.image} />
      </head>
      <body>
        <ThirdwebProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
