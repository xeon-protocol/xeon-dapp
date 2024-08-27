import {Widget} from "@teller-protocol/teller-widget";

function Loans({chainId, selectedToken}) {
  const whitelistedTokens = {};

  if (chainId && selectedToken) {
    whitelistedTokens[chainId] = [selectedToken];
  } else {
    whitelistedTokens[1] = [
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "0xb23d80f5fefcddaa212212f028021b41ded428cf",
    ];
    whitelistedTokens[8453] = ["0x5A0d5390c45b49505C43A56DA4A4f89b93023F11"];
    whitelistedTokens[42161] = ["0x221a0f68770658c15b525d0f89f5da2baab5f321"];
  }

  return (
    <div>
      <Widget
        showOnlyWhiteListedTokens={false}
        showModalByDefault
        buttonClassName="md:block text-white bg-floral flex justify-center items-center p-2 w-full rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
        isBareButton
        whitelistedChains={[chainId || 1, 137, 42161, 8453]}
        whitelistedTokens={whitelistedTokens}
      />
    </div>
  );
}

export default Loans;
