import axios from 'axios';

// URL for the Uniswap token list hosted on IPFS
const UNISWAP_TOKEN_LIST_URL =
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org';

/**
 * Fetches the Uniswap token list from the provided URL.
 *
 * This function makes an HTTP GET request to the Uniswap token list URL
 * using axios and returns the raw token data.
 *
 * @returns {Promise<Array>} a promise that resolves to an array of raw token objects.
 */
export const fetchTokenList = async () => {
  try {
    const response = await axios.get(UNISWAP_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error('Error fetching Uniswap token list:', error);
    return [];
  }
};

/**
 * Maps the raw token data to the format required for the
 * Thirdweb WalletConnect supported tokens.
 *
 * @param {Array} tokens is the raw token data
 * @returns {Array} of tokens mapped to the required format
 */
export const mapToSupportedTokens = (tokens) => {
  return tokens.map(({ address, name, symbol, logoURI }) => ({
    address,
    name,
    symbol,
    icon: logoURI,
  }));
};
