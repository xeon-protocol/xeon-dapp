import React, { useState, useEffect } from 'react';
import { Widget } from '@teller-protocol/teller-widget';
import { fetchTokenList, mapToWhitelistedTokens } from '@/utils/tokenUtils';

function Loans() {
  const [whitelistedTokens, setWhitelistedTokens] = useState({});

  useEffect(() => {
    const fetchAndMapTokens = async () => {
      const tokens = await fetchTokenList();
      const mappedTokens = mapToWhitelistedTokens(tokens);
      setWhitelistedTokens(mappedTokens);
    };
    fetchAndMapTokens();
  }, []);

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
