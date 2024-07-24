import './globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { ThirdwebProvider } from 'thirdweb/react';
// import { ThirdwebProvider } from '@thirdweb-dev/react';

export const metadata = {
  title: 'Xeon Protocol | Redefining DeFi',
  description:
    'Unlock liquidity and manage risk seamlessly with Xeon Protocol, the future of DeFi. Use any ERC-20 token as collateral, lend tokens for a DeFi cash advance, or trade options & swaps using our next-gen hedging tools.',
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
      </head>
      <body>
        <ThirdwebProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
