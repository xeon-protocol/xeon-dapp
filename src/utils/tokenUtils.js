import xeonTokenList from '@/abi/xeonTokenList.json';

/**
 * @dev map xeonTokenList to the required format for supportedTokens
 * @returns {Object} token list object
 */
export const getSupportedTokens = () => {
  return Object.fromEntries(
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
};
