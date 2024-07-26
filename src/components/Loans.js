import { Widget } from '@teller-protocol/teller-widget';
import xeonTokenList from '@/abi/xeonTokenList.json';

function Loans() {
  /**
   * @dev map xeonTokenList to the required format for Widget
   */
  const whitelistedTokens = Object.fromEntries(
    Object.entries(xeonTokenList.tokens).map(([networkId, tokens]) => [
      networkId,
      tokens.map((token) => token.address),
    ])
  );

  return (
    <div>
      <Widget
        showOnlyWhiteListedTokens={false}
        showModalByDefault
        buttonClassName="md:block text-white bg-floral flex justify-center items-center flex p-2 w-full rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
        isBareButton
        whitelistedChains={Object.keys(whitelistedTokens).map(Number)}
        whitelistedTokens={whitelistedTokens}
      />
    </div>
  );
}

export default Loans;
