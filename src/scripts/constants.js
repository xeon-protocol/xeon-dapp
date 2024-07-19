const CONSTANTS = {
    network: '0xaa36a7', // goerli 0x5 // bsc: 0x56
	chainID: 11155111, // hex
    etherScan: "https://sepolia.etherscan.io", // https://goerli.etherscan.io // https://bscscan.com/
    decimals: 18,
    neonAddress: '0xDb90a9f7cEaA33a32Ec836Bbadeeaa8772Ad9797',
    hedgingAddress: '0xa50E605f76661d4C0e36a78C588E084D779B05fE',
    stakingAddress: '0x535caE6FcD7E8536E8Ee14BfB22801a5e998e3c2',
	burnAddress: '0x000000000000000000000000000000000000dEaD',
    wethAddress: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    usdtAddress: '0x297b8d4b35294e730087adf0597a31a9bc1746af',
    usdcAddress: '0x8267cF9254734C6Eb452a7bb9AAF97B392258b21',
    UniswapUSDCETH_LP: '',
    UNISWAP_FACTORY_ADDRESS: '0x7E0987E5b3a30e3f2828572Bb659A548460a3003',
	ethUsdcPrice: 2000,
    popuptimer: 20,
	tokenLimit: 100,
    neonContractABI: [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "_maxTxAmount", "type": "uint256" } ], "name": "MaxTxAmountUpdated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "_buyCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_ethRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_finalBuyTax", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_finalSellTax", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_initialBuyTax", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_initialSellTax", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_maxTaxSwap", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_maxTxAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_maxWalletSize", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_preventSwapBefore", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_reduceSellTaxAt", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_taxSwapThreshold", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_taxWallet", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "bots_", "type": "address[]" } ], "name": "addBots", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "cooldownTimerInterval", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "notbot", "type": "address[]" } ], "name": "delBots", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "a", "type": "address" } ], "name": "isBot", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "manualSwap", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "openTrading", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_newFee", "type": "uint256" } ], "name": "reduceFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "removeLimits", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "transferDelayEnabled", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" } ],
    hedgingContractABI: [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "hedgeId", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "bookmarked", "type": "bool" } ], "name": "bookmarkToggle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "optionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "createValue", "type": "uint256" }, { "indexed": false, "internalType": "enum oXEONVAULT.HedgeType", "name": "hedgeType", "type": "uint8" }, { "indexed": true, "internalType": "address", "name": "writer", "type": "address" } ], "name": "hedgeCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "optionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "startValue", "type": "uint256" }, { "indexed": false, "internalType": "enum oXEONVAULT.HedgeType", "name": "hedgeType", "type": "uint8" }, { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" } ], "name": "hedgePurchased", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "optionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "endValue", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "payOff", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "miner", "type": "address" } ], "name": "hedgeSettled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "optionId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "miner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "paired", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenFee", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "pairFee", "type": "uint256" } ], "name": "minedHedge", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" } ], "name": "onDeposit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "token", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" } ], "name": "onWithdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "received", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "party", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "hedgeId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "topupAmount", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "consent", "type": "bool" } ], "name": "topupRequested", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "hedgeId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "party", "type": "address" } ], "name": "zapRequested", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" } ], "name": "bookmarkHedge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" } ], "name": "buyHedge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" }, { "internalType": "uint256", "name": "_requestID", "type": "uint256" } ], "name": "cancelTopupRequest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tool", "type": "uint256" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "cost", "type": "uint256" }, { "internalType": "uint256", "name": "strikeprice", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "createHedge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "depositToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" }, { "internalType": "uint256", "name": "_requestID", "type": "uint256" } ], "name": "rejectTopupRequest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" } ], "name": "settleHedge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "action", "type": "bool" } ], "name": "topupHedge", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }, { "inputs": [ { "internalType": "uint256", "name": "numerator", "type": "uint256" }, { "internalType": "uint256", "name": "denominator", "type": "uint256" } ], "name": "updateFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "withdrawToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" } ], "name": "zapRequest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "bookmarkedOptions", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "bookmarks", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "calculateFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "depositedTokensLength", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "equityswapsCreatedLength", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "equityswapsTakenLength", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" } ], "name": "equivUserCosts", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" } ], "name": "equivUserHedged", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeDenominator", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeNumerator", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getAllOptions", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getAllOptionsTaken", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getAllSwaps", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getAllSwapsTaken", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "_optionId", "type": "uint256" } ], "name": "getBookmark", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getBoughtOptionsERC20", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getBoughtSwapsERC20", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "token", "type": "address" } ], "name": "getCountTokenOptions", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "token", "type": "address" } ], "name": "getCountTokenSwaps", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "address", "name": "pairedCurrency", "type": "address" } ], "name": "getEquivUserPL", "outputs": [ { "internalType": "uint256", "name": "profits", "type": "uint256" }, { "internalType": "uint256", "name": "losses", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_optionId", "type": "uint256" } ], "name": "getHedgeDetails", "outputs": [ { "components": [ { "internalType": "bool", "name": "topupConsent", "type": "bool" }, { "internalType": "bool", "name": "zapTaker", "type": "bool" }, { "internalType": "bool", "name": "zapWriter", "type": "bool" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "taker", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "paired", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "createValue", "type": "uint256" }, { "internalType": "uint256", "name": "startValue", "type": "uint256" }, { "internalType": "uint256", "name": "strikeValue", "type": "uint256" }, { "internalType": "uint256", "name": "endValue", "type": "uint256" }, { "internalType": "uint256", "name": "cost", "type": "uint256" }, { "internalType": "uint256", "name": "dt_created", "type": "uint256" }, { "internalType": "uint256", "name": "dt_started", "type": "uint256" }, { "internalType": "uint256", "name": "dt_expiry", "type": "uint256" }, { "internalType": "uint256", "name": "dt_settled", "type": "uint256" }, { "internalType": "enum oXEONVAULT.HedgeType", "name": "hedgeType", "type": "uint8" }, { "internalType": "uint256[]", "name": "topupRequests", "type": "uint256[]" } ], "internalType": "struct oXEONVAULT.hedgingOption", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "startId", "type": "uint256" }, { "internalType": "uint256", "name": "endId", "type": "uint256" } ], "name": "getHedgeRange", "outputs": [ { "components": [ { "internalType": "bool", "name": "topupConsent", "type": "bool" }, { "internalType": "bool", "name": "zapTaker", "type": "bool" }, { "internalType": "bool", "name": "zapWriter", "type": "bool" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "taker", "type": "address" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "paired", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "createValue", "type": "uint256" }, { "internalType": "uint256", "name": "startValue", "type": "uint256" }, { "internalType": "uint256", "name": "strikeValue", "type": "uint256" }, { "internalType": "uint256", "name": "endValue", "type": "uint256" }, { "internalType": "uint256", "name": "cost", "type": "uint256" }, { "internalType": "uint256", "name": "dt_created", "type": "uint256" }, { "internalType": "uint256", "name": "dt_started", "type": "uint256" }, { "internalType": "uint256", "name": "dt_expiry", "type": "uint256" }, { "internalType": "uint256", "name": "dt_settled", "type": "uint256" }, { "internalType": "enum oXEONVAULT.HedgeType", "name": "hedgeType", "type": "uint8" }, { "internalType": "uint256[]", "name": "topupRequests", "type": "uint256[]" } ], "internalType": "struct oXEONVAULT.hedgingOption[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ], "name": "getmyBookmarks", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getOptionsForToken", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" } ], "name": "getPairAddressZK", "outputs": [ { "internalType": "address", "name": "pairAddress", "type": "address" }, { "internalType": "address", "name": "pairedCurrency", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getSettledOptionsERC20", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getSettledSwapsERC20", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getSwapsForToken", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" } ], "name": "getUnderlyingValue", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getUserHistory", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getUserOptionsCreated", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getUserOptionsTaken", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getUserSwapsCreated", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "startIndex", "type": "uint256" }, { "internalType": "uint256", "name": "limit", "type": "uint256" } ], "name": "getUserSwapsTaken", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address", "name": "user", "type": "address" } ], "name": "getUserTokenBalances", "outputs": [ { "internalType": "uint256", "name": "deposited", "type": "uint256" }, { "internalType": "uint256", "name": "withdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "lockedinuse", "type": "uint256" }, { "internalType": "uint256", "name": "withdrawable", "type": "uint256" }, { "internalType": "uint256", "name": "withdrawableValue", "type": "uint256" }, { "internalType": "address", "name": "paired", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "hedgesCostVolume", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "hedgesCreatedVolume", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "hedgesTakenVolume", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "minerMap", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "miners", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "myoptionsCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "myoptionsTaken", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "myswapsCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "myswapsTaken", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "optionID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "optionsCreatedLength", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "optionsTakenLength", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "optionsVolume", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "pairedERC20s", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "protocolBalanceMap", "outputs": [ { "internalType": "uint256", "name": "deposited", "type": "uint256" }, { "internalType": "uint256", "name": "withdrawn", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "protocolCashierFees", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "protocolFeesTokens", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "protocolPairedFees", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "protocolPairProfits", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "protocolProfitsTokens", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "settledTradesCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "settledVolume", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "swapsVolume", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "topupMap", "outputs": [ { "internalType": "uint256", "name": "amountWriter", "type": "uint256" }, { "internalType": "uint256", "name": "amountTaker", "type": "uint256" }, { "internalType": "uint256", "name": "requestTime", "type": "uint256" }, { "internalType": "uint256", "name": "acceptTime", "type": "uint256" }, { "internalType": "uint256", "name": "rejectTime", "type": "uint256" }, { "internalType": "uint256", "name": "state", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "topupRequestID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "usdcAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "usdcEquivDeposits", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "usdcEquivWithdrawals", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "usdtAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "usdtEquivDeposits", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "usdtEquivWithdrawals", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" } ], "name": "userBalanceMap", "outputs": [ { "internalType": "uint256", "name": "deposited", "type": "uint256" }, { "internalType": "uint256", "name": "withdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "lockedinuse", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "userERC20s", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "wethAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "wethEquivDeposits", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "wethEquivWithdrawals", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "XeonAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" } ],
    stakingContractABI: [ { "inputs": [ { "internalType": "address", "name": "XeonToken", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "poolID", "type": "uint256" } ], "name": "RewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "poolID", "type": "uint256" } ], "name": "RewardsDistributed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "Staked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountForMining", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountForLiquidity", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountForCollateral", "type": "uint256" } ], "name": "TokensAssigned", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountFromMining", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountFromLiquidity", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountFromCollateral", "type": "uint256" } ], "name": "TokensUnassigned", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "Unstaked", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "_percentForMining", "type": "uint256" }, { "internalType": "uint256", "name": "_percentForLiquidity", "type": "uint256" }, { "internalType": "uint256", "name": "_percentForCollateral", "type": "uint256" } ], "name": "assignTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimCollateralRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimLiquidityRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimedRewards", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claimedRewardsCol", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "claimedRewardsCollateral", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claimedRewardsLiq", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "claimedRewardsLiquidity", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "claimedRewardsStaking", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "depositCollateralRewards", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "depositLiquidityRewards", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "depositRewards", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "ethCollateralRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ethLiquidityRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ethRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "stakerAddress", "type": "address" } ], "name": "getAssignedAndUnassignedAmounts", "outputs": [ { "internalType": "uint256", "name": "assignedForMining", "type": "uint256" }, { "internalType": "uint256", "name": "assignedForLiquidity", "type": "uint256" }, { "internalType": "uint256", "name": "assignedForCollateral", "type": "uint256" }, { "internalType": "uint256", "name": "unassigned", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCollateralRewardsDue", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getLiquidityRewardsDue", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRewardsDue", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "stakerAddress", "type": "address" } ], "name": "getStakedBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStakers", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalAssigned", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalStaked", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalUnassigned", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "lastCollateralRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "lastLiquidityRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "lastRewardBasis", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nextUnstakeDay", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "poolExpiry", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "restartPool", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "stakerAddresses", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "stakers", "outputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "stakingTime", "type": "uint256" }, { "internalType": "uint256", "name": "lastClaimedDay", "type": "uint256" }, { "internalType": "uint256", "name": "assignedForMining", "type": "uint256" }, { "internalType": "uint256", "name": "assignedForLiquidity", "type": "uint256" }, { "internalType": "uint256", "name": "assignedForCollateral", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "stakingToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "startContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "totalAssignedForCollateral", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalAssignedForLiquidity", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalAssignedForMining", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amountFromMining", "type": "uint256" }, { "internalType": "uint256", "name": "_amountFromLiquidity", "type": "uint256" }, { "internalType": "uint256", "name": "_amountFromCollateral", "type": "uint256" } ], "name": "unassignTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ],
};

// CoinGecko API price call function
function getCurrentEthUsdcPriceFromUniswapV2() { 
    return CONSTANTS.ethUsdcPrice;
}

// Function to Validate the Ethereum wallet address format
function isValidEthereumAddress(address) {
    return ethers.utils.isAddress(address);
}

// Function to Truncate the token address for display
function truncateAddress(address) {
    return address.slice(0, 6) + '...' + address.slice(-4);
}

// Function to Convert to USD value based on pair
// accepts Number
// outputs Number
function convertToUSD(value, pairedCurrency, ethUsdPrice) {
    console.log(`outputUSD ${value}, worthOf ${pairedCurrency}, @ ethusd: ${ethUsdPrice}`);
    switch (pairedCurrency) {
        case CONSTANTS.wethAddress:
            return value * ethUsdPrice;
        case CONSTANTS.usdtAddress:
        case CONSTANTS.usdcAddress:
            return value;
        default:
            return 0;
    }
}

// Function to get token USD value
// accepts Decimal Number
// outputs Decimal Number
async function getTokenUSDValue(underlyingTokenAddr, balance) {
	balance = balance.toString();
    const ethUsdPrice = getCurrentEthUsdcPriceFromUniswapV2();
    try {
        if (underlyingTokenAddr === CONSTANTS.wethAddress) {
            const usdValue = convertToUSD(balance, CONSTANTS.wethAddress, ethUsdPrice);
            return usdValue;
        } else {
			// Convert to BigInt
			const addressDecimal = await getTokenDecimals(underlyingTokenAddr);
			const balanceBigInt = fromDecimalToBigInt(balance, addressDecimal);
            const underlyingValue = await getTokenETHValue(underlyingTokenAddr, balanceBigInt);
            const balanceNumber = Number(underlyingValue[0]);
            const pairSymbol = underlyingValue[1];

            // reverse engineer pair address needed for USD conversion
            let pairedAddress;
            if (pairSymbol === 'USDT') {
                pairedAddress = CONSTANTS.usdtAddress;
            } else if (pairSymbol === 'USDC') {
                pairedAddress = CONSTANTS.usdcAddress;
            } else if (pairSymbol === 'WETH') {
                pairedAddress = CONSTANTS.wethAddress;
            }
            // accepts Number not wei & BigNumber
            const usdValue = convertToUSD(balanceNumber, pairedAddress, ethUsdPrice);
            console.log(`converted to: ${balanceNumber}, usd: ${usdValue}`);
            return usdValue;
        }
    } catch (error) {
        console.error("Error getting token USD value:", error);
        return 0;
    }
}

// Function to get token paired currency value
// accepts BigNumber 
// outputs Decimal Number
// Rename to getUnderlyingValue
async function getTokenETHValue(underlyingTokenAddr, bigIntBalanceInput) {
	
    try {
        // Convert balance to string
        const input_balance = bigIntBalanceInput.toString();
        console.log(`>input: ${input_balance}, token: ${underlyingTokenAddr} bal: ${bigIntBalanceInput}`);

        const result = await hedgingInstance.getUnderlyingValue(underlyingTokenAddr, input_balance);

        const underlyingValue = result[0];
        const pairedAddress = result[1];

        if (!result) {
            console.error("Invalid result:", result);
            return [ethers.BigNumber.from(0), ''];
        }
        // convert from BigNumber to Number
        const pairedAddressDecimal = await getTokenDecimals(pairedAddress);
        const trueValue = fromBigIntNumberToDecimal(underlyingValue, pairedAddressDecimal);

        let pairSymbol;
        if (pairedAddress === '0xdac17f958d2ee523a2206206994597c13d831ec7') {
            pairSymbol = 'USDT';
        } else if (pairedAddress === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
            pairSymbol = 'USDC';
        } else if (pairedAddress === CONSTANTS.wethAddress) {
            pairSymbol = 'WETH';
        }
        console.log(`<output: ${result[0]}, token: ${result[1]}, TV: ${trueValue}, ${pairSymbol}, decimals: ${pairedAddressDecimal}`);
        return [trueValue, pairSymbol];
    } catch (error) {
        console.error("Error getting token ETH value:", error);
        return [ethers.BigNumber.from(0), ''];
    }
}

// Function to get token decimals
// WETH on Sepolia has 6 decimals, hacked here to 18(mainnet) for dev purposes only
// Returns default value if call fails
async function getTokenDecimals(tokenAddress, defaultDecimals = 18) {
    const decimalsABI = [
        {inputs:[],name:'decimals',outputs:[{internalType:'uint8',name:'',type:'uint8'}],stateMutability:'view',type:'function'}
    ];

    if (tokenAddress !== CONSTANTS.wethAddress) {
        try {
            const pairedContract = new ethers.Contract(tokenAddress, decimalsABI, provider);
            const pairDecimals = await pairedContract.decimals();
            return Number(pairDecimals);
        } catch (error) {
            console.error("Error fetching decimals:", error);
            return defaultDecimals;
        }
    } else {
        return Number(18);
    }
}

async function getTokenDecimalSymbolName(tokenAddress) {
    // ERC20 ABI
    const erc20ABI = [
        { constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' },
        { constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' },
        { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }
    ];
    
    const erc20Contract = new ethers.Contract(tokenAddress, erc20ABI, provider); 

	const [nameResult, decimalsResult, symbolResult] = await Promise.all([
        erc20Contract.name(),
		erc20Contract.decimals(),
		erc20Contract.symbol()
	]);
    return [nameResult, Number(decimalsResult), symbolResult];
}

// Function to fetch user's token balances
// Returns Decimal
async function getUserBalancesForToken(tokenAddress, userAddress) {
    console.log(`getUserBalancesForToken: ${tokenAddress}, ${userAddress}`);
    try {
        const userBalances = await hedgingInstance.getUserTokenBalances(tokenAddress, userAddress);
        const deposited = userBalances[0];
        const withdrawn = userBalances[1];
        const lockedInUse = userBalances[2];
        const withdrawable = userBalances[3];
        const withdrawableValue = userBalances[4];
        const pairedAddress = userBalances[5];

        console.log(`deposited: ${deposited}, withdrawn: ${withdrawn}, lockedInUse: ${lockedInUse}, withdrawable: ${withdrawable}, withdrawableValue: ${withdrawableValue}, paired: ${pairedAddress}`);

        // Use pair to convert to correct decimals
        const tokenDecimal = await getTokenDecimals(tokenAddress);
        const depositedBalance = fromBigIntNumberToDecimal(deposited, tokenDecimal);
        const withdrawnBalance = fromBigIntNumberToDecimal(withdrawn, tokenDecimal);
        const lockedInUseBalance = fromBigIntNumberToDecimal(lockedInUse, tokenDecimal);
        const withdrawableBalanceEth = fromBigIntNumberToDecimal(withdrawable, tokenDecimal);

        return {
            deposited: depositedBalance,
            withdrawn: withdrawnBalance,
            lockedInUse: lockedInUseBalance,
            withdrawableBalance: withdrawableBalanceEth,
            withdrawableValue: withdrawableValue
        }
    } catch (error) {
        console.error("Error fetching user's token balances:", error);

        return {
            deposited: 0,
            withdrawn: 0,
            lockedInUse: 0,
            withdrawableBalance: 0,
            withdrawableValue: 0
        };
    }
}

async function getPairToken(tokenAddress) {
    const result = await hedgingInstance.getPairAddressZK(tokenAddress);
    return result;
}

async function getAccounts() {
	const accounts = await provider.listAccounts();
	return accounts;
}

async function getSymbol(tokenAddress) {
    const tokenAbi = [
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
    const symbol = await tokenContract.symbol();
    return symbol;
}

// Get pair address - ALT just call getPairAddressZK from hedging contract
async function getPairAddress(tokenAddress) {
    const UNISWAP_FACTORY_ADDRESS = CONSTANTS.UNISWAP_FACTORY_ADDRESS; 
    const wethAddress = CONSTANTS.wethAddress;
    const usdtAddress = CONSTANTS.usdtAddress; 
    const usdcAddress = CONSTANTS.usdcAddress;
  
    const factory = new ethers.Contract(
        UNISWAP_FACTORY_ADDRESS,
        [
            {
                constant: true,
                inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }],
                name: 'getPair',
                outputs: [{ name: '', type: 'address' }],
                type: 'function',
            },
        ],
        provider
    );
  
    try {
        const wethPairAddress = await factory.getPair(tokenAddress, wethAddress);
        const usdtPairAddress = await factory.getPair(tokenAddress, usdtAddress);
        const usdcPairAddress = await factory.getPair(tokenAddress, usdcAddress);
  
        if (wethPairAddress !== '0x0000000000000000000000000000000000000000') {
            return { pairAddress: wethPairAddress, pairedCurrency: wethAddress };
        } else if (usdtPairAddress !== '0x0000000000000000000000000000000000000000') {
            return { pairAddress: usdtPairAddress, pairedCurrency: usdtAddress };
        } else if (usdcPairAddress !== '0x0000000000000000000000000000000000000000') {
            return { pairAddress: usdcPairAddress, pairedCurrency: usdcAddress };
        } else {
            throw new Error("TokenValue: token is not paired with WETH, USDT, or USDC");
        }
    } catch (error) {
        throw error;
    }
}

async function tokenWalletBalance (tokenAddress, walletAddress) {
    const balanceOfABI = [
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function"
        }
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, balanceOfABI, provider);

    // Get balance of the token for the wallet address
    try {
        const balance = await tokenContract.balanceOf(walletAddress);
        console.log('Wallet token balance:', balance);
        return balance;
    } catch (error) {
        console.error('Error fetching token balance:', error);
        return 0;
    }

}

// HELPERS
// Tokens unrounded
function fromWeiToFixed2_unrounded(amount) {//doesnt round up figures
    var amount = amount / Math.pow(10, CONSTANTS.decimals);
    var fixed = 2;
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return amount.toString().match(re)[0];
}

// ETH unrounded
function toFixed8_unrounded(amount) {
    //accepts decimals
    var parsed_eth = parseFloat(amount);
    var fixed = 8;//8 is good for all esp RBW
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parsed_eth.toString().match(re)[0];
}
function fromWeiToFixed5_unrounded(amount) {//doesnt round up figures
    //accepts wei only not decimals, also no need to string wei
    var raw_eth = ethers.utils.formatUnits(amount, "ether");
    var parsed_eth = parseFloat(raw_eth);
    var fixed = 5;//6 is good for all esp RBW
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parsed_eth.toString().match(re)[0];
}
function fromWeiToFixed8_unrounded(amount) {//doesnt round up figures
    //accepts wei only not decimals, also no need to string wei
    var raw_eth = ethers.utils.formatUnits(amount, "ether");
    var parsed_eth = parseFloat(raw_eth);
    var fixed = 8;
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return parsed_eth.toString().match(re)[0];
}
function fromWeiToFixed8(amount){
    var raw_eth = ethers.utils.formatUnits(amount, "ether");
    var parsed_eth = parseFloat(raw_eth);
    var ethFriendly = parsed_eth.toFixed(8);
    return ethFriendly;
}
function fromWeiToFixed12(amount){
    var raw_eth = ethers.utils.formatUnits(amount, "ether");
    var parsed_eth = parseFloat(raw_eth);
    var ethFriendly = parsed_eth.toFixed(12);
    return ethFriendly;
}
function fromWeiToFixed5(amount){
    var raw_eth = ethers.utils.formatUnits(amount, "ether");
    var parsed_eth = parseFloat(raw_eth);
    var ethFriendly = parsed_eth.toFixed(5);
    return ethFriendly;
}
// Accepts BigNumber
// BN in hex accepted too
function fromBigIntNumberToDecimal(number, decimals) {
    try {
        // Convert to BigNumber, since migration to sepolia & etherjs intergration smart contracts are not returning BigNumber/XXXn
        const bigNumberValue = ethers.BigNumber.from(number);
        const formattedValue = ethers.utils.formatUnits(bigNumberValue, decimals);
        
        return Number(formattedValue);
    } catch (error) {
        console.error("Error converting from BigNumber to Decimal:", error);
        return Number(0); // Return a default value
    }
}

function fromDecimalToBigInt(number, decimals) {
    try {
        // Convert to string, only accepts string
        const numberString = number.toString();
        const decimalsString = decimals.toString();
        const formattedValue = ethers.utils.parseUnits(numberString, decimalsString);
        return formattedValue.toString();
    } catch (error) {
        console.error("Error converting from Decimal to BigNumber:", error);
        return "0"; // Return a default value as a string
    }
}

function commaNumbering(number){
	const options = {
		style: 'decimal',
		minimumFractionDigits: 2,
		maximumFractionDigits: 5,
	};
	return number.toLocaleString('en-US', options);
}; 
function cardCommaFormat(number) {
    // Number to string, only to handle scientific notation correctly on cost for instance
    // Some figures are too small currently returning 0.00 without this
    const numberString = number.toString();
    const parsedNumber = parseFloat(numberString);

    // Convert to a string and extract the decimal part 
    const decimalPart = numberString.split('.')[1];    
    const maxDecimalPlaces = decimalPart && decimalPart.length === 12 ? 12 : 8;

    const options = {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDecimalPlaces,
    };
    return parsedNumber.toLocaleString('en-US', options);
}

// Other backup formaters
const formatValue = (value) => {
	return `$${value.toFixed(2)}`;
};
const formatString = (number) => {
	return number.toLocaleString();
};

export { CONSTANTS, getAccounts, getCurrentEthUsdcPriceFromUniswapV2, isValidEthereumAddress, truncateAddress, convertToUSD, getTokenUSDValue, getTokenETHValue, getUserBalancesForToken, getPairToken, getSymbol, getTokenDecimals, getTokenDecimalSymbolName, tokenWalletBalance };
export { fromBigIntNumberToDecimal, fromDecimalToBigInt, commaNumbering, cardCommaFormat, fromWeiToFixed12, fromWeiToFixed5, fromWeiToFixed8, fromWeiToFixed8_unrounded, fromWeiToFixed5_unrounded, fromWeiToFixed2_unrounded, toFixed8_unrounded };