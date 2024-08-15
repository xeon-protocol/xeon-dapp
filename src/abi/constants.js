// global contract addresses
export const Constants = {
  testnet: {
    network: 'Base Sepolia',
    chainId: 84532,
    baseSepoliaScan: 'https://sepolia.basescan.org',
    baseSepoliaScanAPI: 'https://api-sepolia.basescan.org/api',
    onboardingUtilsContractAddress:
      '0x88232810891E015161D3e57C1E5A5DA2376407d5',
    MockERC20FactoryContractAddress:
      '0x5A0d5390c45b49505C43A56DA4A4f89b93023F11',
    PriceOracleAddress: '0xcdea17068968a1a989a0d21e28c5c61ff220fe7e',
    WETH: '0x395cB7753B02A15ed1C099DFc36bF00171F18218',
  },
  ethereum: {
    network: 'Ethereum',
    chainId: 1,
    baseMainnetScan: 'https://etherscan.io',
    baseMainnetScanAPI: 'https://api.etherscan.io/api',
    WETH: '0xMainnetWETHAddressHere',
    XeonToken: '0x8d65a2eaBDE4B31cbD7E43F27E47559d1CCec86c',
    XeonHedging: '0xXeonHedgingEthereumAddress',
    XeonStaking: '0xXeonStakingEthereumAddress',
    PriceOracle: '0xPriceOracleEthereumAddress',
  },
  base: {
    network: 'Base',
    chainId: 8453,
    baseMainnetScan: 'https://basescan.org',
    baseMainnetScanAPI: 'https://api.basescan.org/api',
    WETH: '0xMainnetWETHAddressHere',
    XeonToken: '0xXeonTokenBaseAddress',
    XeonHedging: '0xXeonHedgingBaseAddress',
    XeonStaking: '0xXeonStakingBaseAddress',
    PriceOracle: '0xPriceOracleBaseAddress',
  },
};
