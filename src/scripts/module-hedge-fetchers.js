import { CONSTANTS, getTokenDecimals, cardCommaFormat, fromBigIntNumberToDecimal, fromDecimalToBigInt, getTokenDecimalSymbolName, getAccounts, truncateAddress } from './constants.js';
import { updateSectionValues_HedgeCard, updateSectionValues_Progress, updateSectionValues_Gains } from './module-hedge-section-updaters.js';
import { updateChartValues_Hedge, updateChartValues_Assets } from './module-hedge-chart-updaters.js';

// 1. Fetch Section Values - Hedge
//-----------------------------------------
async function fetchSection_HedgeCard(){
            
    // Check if the webpage URL has '?id='
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    let optionId;
    if (idParam) {
       optionId = parseInt(idParam)
    } else {
        await fetchSection_HedgeCardDefault();
        return;
    }

    try {
        const accounts = await getAccounts();
        const userAddress = accounts[0];

        
        const hedgeResult = await hedgingInstance.getHedgeDetails(optionId);
        const {
            topupConsent, // bool
            zapTaker, // bool
            zapWriter, // bool
            owner, // address
            taker, // address
            token, // address
            paired, // address
            status, // uint256
            amount, // uint256
            createValue, // uint256
            startValue, // uint256
            strikeValue, // unit256
            endValue, // uint256
            cost, // uint256
            dt_created, // uint256
            dt_started, // uint256
            dt_expiry, // uint256
            dt_settled, // uint256
            hedgeType, // uint8 (enum value)
            topupRequests, // uint256[]
        } = hedgeResult;

		//name and symbol
		let tokenName,tokenSymbol, tokenDecimal;
        
		[tokenName, tokenDecimal, tokenSymbol] = await getTokenDecimalSymbolName(hedgeResult.token);
		//token & pair address
		let tokenAddress = hedgeResult.token;
		let tokenPairAddress = hedgeResult.paired;
		//owner
		let hedgeOwner = hedgeResult.owner;
        let truncatedOwner = truncateAddress(hedgeOwner);
		//taker
		let hedgeTaker = hedgeResult.taker;
        let truncatedTaker = truncateAddress(hedgeTaker);
		//hedge status
		let hedgeStatus = parseFloat(hedgeResult.status);		
		//amounts
		let tokenAmount = fromBigIntNumberToDecimal(hedgeResult.amount, tokenDecimal);
		let amountFormated = cardCommaFormat(tokenAmount);

		//hedge type
		let hedgeTypeString;
		if (hedgeResult.hedgeType === 0) {
			hedgeTypeString = 'CALL';
		} else if (hedgeResult.hedgeType === 1) {
			hedgeTypeString = 'PUT';
		} else if (hedgeResult.hedgeType === 2) {
			hedgeTypeString = 'SWAP';
		} else {
			console.log('Hedge type is unknown');
		}

		//paired symbol
		let pairSymbol;
		if (tokenPairAddress === CONSTANTS.usdtAddress) {
			pairSymbol = 'USDT';
		} else if (tokenPairAddress === CONSTANTS.usdcAddress) {
			pairSymbol = 'USDC';
		} else if (tokenPairAddress === CONSTANTS.wethAddress) {
			pairSymbol = 'WETH';
		}

        //const strikevalueHex = hedgeResult.strikeValue; // Access _hex property if available
	    //const strikeValuee = strikevalueHex ? parseInt(strikevalueHex, 16).toString() : 0; // Convert hex to decimal if available
        //console.log(strikeValuee);

		//market value current
		const [marketvalueCurrent, pairedAddress] = await hedgingInstance.getUnderlyingValue(tokenAddress, hedgeResult.amount);
		const pairedAddressDecimal = await getTokenDecimals(tokenPairAddress);
        const createValueDeci = fromBigIntNumberToDecimal(hedgeResult.createValue, pairedAddressDecimal);
        const createPrice = createValueDeci / tokenAmount;
		const marketvalue = fromBigIntNumberToDecimal(marketvalueCurrent, pairedAddressDecimal);
        const marketPrice = marketvalue / tokenAmount;
        const strikeValueR1 = fromBigIntNumberToDecimal(hedgeResult.strikeValue, tokenDecimal);// saved as BigInt * BigInt in struct during create
        const strikeValueR1BN = ethers.BigNumber.from(strikeValueR1);
        const strikeValueDeci = fromBigIntNumberToDecimal(strikeValueR1BN, pairedAddressDecimal);// saved as BigInt * BigInt in struct during create
        const strikePrice = strikeValueDeci / tokenAmount;
        const startValueDeci = fromBigIntNumberToDecimal(hedgeResult.startValue, pairedAddressDecimal);
        const costDeci = fromBigIntNumberToDecimal(hedgeResult.cost, pairedAddressDecimal);
        
        // Gains & Losses
        // +ve or -ve integers passed to update function.. logic below is sound       
        let takerGains;
        let writerGains;

        // startValueDeci checked once
        const positiveStartValue = startValueDeci > 0;
        switch (hedgeTypeString) {
            case 'CALL': // CALL - cost max loss if price goes down
                if (positiveStartValue) {
                    if (marketvalue <= strikeValueDeci) {
                        takerGains = -costDeci;
                        writerGains = costDeci;
                    } else {
                        takerGains = marketvalue - strikeValueDeci - costDeci;
                        writerGains = costDeci + strikeValueDeci - marketvalue;
                    }
                } else {
                    takerGains = 0;
                    writerGains = 0;
                }
                break;
            case 'PUT': // PUT - cost max loss if price goes up
                if (positiveStartValue) {
                    if (marketvalue >= strikeValueDeci) {
                        takerGains = -costDeci;
                        writerGains = costDeci;
                    } else {
                        takerGains = strikeValueDeci - marketvalue - costDeci;
                        writerGains = costDeci + marketvalue - strikeValueDeci;
                    }
                } else {
                    takerGains = 0;
                    writerGains = 0;
                }
                break;
            case 'SWAP': // SWAP - no cost paid in equity swaps
                if (positiveStartValue) {
                    takerGains = marketvalue - startValueDeci;
                    writerGains = startValueDeci - marketvalue;
                } else {
                    takerGains = 0;
                    writerGains = 0;
                }
                break;
            default:
                takerGains = 0;
                writerGains = 0;
                break;
        }

        // Helper to farmatting below, format dates to "DD/MM/YYYY"
        function formatTimestamp(timestamp) {
            const date = new Date(timestamp * 1000);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are 0-indexed
            const year = date.getFullYear();
            return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        }

        // Format the dates
        const dt_createdFormatted = formatTimestamp(dt_created);
        const dt_startedFormatted = formatTimestamp(dt_started);
        const dt_expiryFormatted = formatTimestamp(dt_expiry);
        const dt_settledFormatted = formatTimestamp(dt_settled);

        // Get current timestamp in seconds
        const dt_today = Math.floor(Date.now() / 1000);
        const lifespan = Math.floor((dt_expiry - dt_created) / 3600);

        // Calculate time to expiry in hours
        let timetoExpiry = 0;
        if (dt_today < dt_expiry) {
            timetoExpiry = Math.floor((dt_expiry - dt_today) / 3600); // Convert seconds to hours
        }

        // USE 3 UPDATERS: HEDGE, PROGRESS, GAINS
        updateSectionValues_HedgeCard(
            tokenName,
            tokenSymbol,
            tokenAmount,
            hedgeTypeString,
            token,
            tokenPairAddress,
            pairSymbol,
            //values
            endValue,
            strikeValueDeci,
            marketvalue,
            startValueDeci,
            createValueDeci,
            costDeci,
            //parties
            hedgeOwner,
            hedgeTaker,
            userAddress,
            takerGains,
            writerGains,
            //date
            dt_createdFormatted,
            dt_startedFormatted,
            dt_expiryFormatted,
            dt_settledFormatted,
            timetoExpiry,
            //status
            hedgeStatus,
            //consent
            topupConsent, // bool
            zapTaker, // bool
            zapWriter, // bool
            //requests
            topupRequests, // uint256[]
        );
        updateSectionValues_Progress(
            //date
            dt_createdFormatted,
            dt_startedFormatted,
            dt_expiryFormatted,
            dt_settledFormatted,
            timetoExpiry,
            lifespan,
            //status
            hedgeStatus
        );
        // Gains, Buy & Requests. All variables needed to compile breakdown paragraph/ explainer for each party 
        //..(you wrote a swap of 1M TSUKA (TSU....) this means...
        // status to determine buttons to show
        updateSectionValues_Gains(
            tokenName,
            tokenSymbol,
            tokenAmount,
            hedgeTypeString,
            token,
            tokenPairAddress,
            pairSymbol,
            //values
            endValue,
            strikeValueDeci,
            marketvalue,
            startValueDeci,
            createValueDeci,
            costDeci,
            //parties
            hedgeOwner,
            hedgeTaker,
            userAddress,
            takerGains,
            writerGains,
            //date
            timetoExpiry,
            //status
            hedgeStatus,
            //consent
            zapTaker, // bool
            zapWriter // bool
        );

        // Update Charts and Graphics and Buttons
        // Step 4: Update asset bubbles & type of asset basket
        // use chart updater function, like in networth, wc accepts values to display all; bubbles, price chart, etc
        // this way its easy to create a default load & separate an actual data update
        
        // Hedge Price Levels - First item is startValue, last item is underlying/current value
        const initialPrices = [createPrice, marketPrice, strikePrice];
        updateChartValues_Hedge(initialPrices);

        // Hedge Underlying ERC20 Assets - Global arrays for token names and amounts
        // For Alpha and Beta V1, single assets, display underlying quantity & cost quantity in basket
        const tokenNamesArray = [tokenSymbol, pairSymbol];
        const tokenAmountArray = [tokenAmount, costDeci];
        updateChartValues_Assets(tokenNamesArray, tokenAmountArray);

    } catch (error) {
        console.error("Error fetching Hedge Panel section data:", error);
    }
}

// 2. Fetch Section Values - HedgeCard Default Load
async function fetchSection_HedgeCardDefault(){
    try {
        // Hedge Price Levels - First item is startValue, last item is underlying/current value
        const startValue = 0;
        const createValue = 50;
        const marketvalue = 100;
        const initialPrices = [startValue, createValue, marketvalue];
        const initialTargetPrice = 80;
        updateChartValues_Hedge(initialPrices, initialTargetPrice);

        // Hedge Underlying ERC20 Assets - Global arrays for token names and amounts
        // For Alpha and Beta V1, single assets, display underlying quantity & cost quantity in basket
        const tokenNamesArray = ["ZKS", "ZRO", "GMX", "ARB", "VELA"];
        const tokenAmountArray = [1000000, 2000000, 3000000, 4000000, 5000000];
        updateChartValues_Assets(tokenNamesArray, tokenAmountArray);

    } catch (error) {
        console.error("Error fetching Hedge Panel section data:", error);
    }
}

// Export the fetch functions
export { fetchSection_HedgeCard, fetchSection_HedgeCardDefault };