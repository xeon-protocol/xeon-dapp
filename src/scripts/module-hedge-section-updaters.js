import { acceptTopupInterface, acceptZapInterface } from './module-silkroad-writer.js';

// Update Section Values - Hedge Card
async function updateSectionValues_HedgeCard(
    tokenName,
    tokenSymbol,
    tokenAmount,
    hedgeType,
    token,
    pairedCurrency,
    pairedSymbol,
    //values
    endValue,
    strikeValue,
    marketValue,
    startValue,
    createValue,
    cost,
    //parties
    owner,
    taker,
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
    status,
    //consent
    topupConsent, // bool
    zapTaker, // bool
    zapWriter, // bool
    //requests
    topupRequests, // uint256[]
) {
    try {
        const formatValue = (value) => `$${value.toFixed(2)}`;
        const formatString = (number) => number.toLocaleString();
        const formatStringDecimal = (number) => {
            const options = {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 7,
            };
            return number.toLocaleString('en-US', options);
        };

        // Step 1: Update Type
        const hedgeTypeMapping = {
            'CALL': { text: 'Call Option', color: '#089353' },
            'PUT': { text: 'Put Option', color: '#d6188a' },
            'SWAP': { text: 'Equity Swap', color: '#440076' },
        };

        const hedgeTypeDiv = document.querySelector('#hedgeType');
        const hedgeTypeValue = hedgeTypeMapping[hedgeType] || { text: 'Unknown Hedge', color: '#FFF' };
        document.getElementById('hedgeTypeCard').style.backgroundColor = hedgeTypeValue.color;
        hedgeTypeDiv.textContent = hedgeTypeValue.text;

        // Step 2: Update token symbol & amount
        document.getElementById("tokenSymbol").textContent = tokenSymbol;
        document.getElementById("tokenAmount").textContent = formatStringDecimal(tokenAmount) + ' tokens';

        // Step 3: Update underlying / current value
        document.getElementById("marketValue").textContent = `${formatStringDecimal(marketValue)} ${pairedSymbol}`;

        // Step 4: Update hedge values
        document.getElementById("startValue").textContent = `${formatStringDecimal(startValue)} ${pairedSymbol}`;
        document.getElementById("strikeValue").textContent = `${formatStringDecimal(strikeValue)} ${pairedSymbol}`;
        document.getElementById("cost").textContent = `${formatStringDecimal(cost)} ${pairedSymbol}`;

        // Step 5: Update times
        document.getElementById("created").textContent = dt_createdFormatted;
        document.getElementById("taken").textContent = dt_startedFormatted;
        document.getElementById("expires").textContent = dt_expiryFormatted;

        // Update the tokenLogo background
        const tokenLogoDiv = document.getElementById('tokenLogo');
        tokenLogoDiv.style.backgroundImage = 'url(\'./imgs/tokens/ovela.webp\')';

        // Update the requests list
        await updateRequestsList(topupRequests, topupConsent, zapTaker, zapWriter);

    } catch (error) {
        console.error("Error Updating Net Worth section data:", error);
    }
}
async function updateRequestsList(topupRequests, zapConsent, zapTaker, zapWriter) {
    try {
        const requestsList = document.getElementById('requestList');

        // Clear previous request list
        requestsList.innerHTML = '';

        // Handle topup requests
        for (let i = 0; i < topupRequests.length; i++) {
            const request = topupRequests[i];
            const topupData = await hedgingInstance.topupMap(request);
            const requestSpan = document.createElement('span');
            requestSpan.classList.add('request');

            const topupButtonClass = `topupRequestButton`;
            const topupButton = document.createElement('button');
            topupButton.classList.add(topupButtonClass, 'actonRequest', 'requestButton');
            topupButton.setAttribute('data-topup-request-id', request);
            topupButton.textContent = 'Accept';

            // Update the request status and type for topup requests
            if (topupData.state == 0) {
                requestSpan.innerHTML = `<i class="fa fa-bell"></i> Topup Request Pending`;
                requestSpan.appendChild(topupButton);
            } else if (topupData.state == 1) {
                requestSpan.innerHTML = `<i class="fa fa-check-circle"></i> Topup Accepted ${formatDate(topupData.acceptedDate)}`;
            } else if (topupData.state == 2) {
                requestSpan.innerHTML = `<i class="fa fa-times-circle"></i> Topup Rejected ${formatDate(topupData.acceptedDate)}`;
            }

            requestsList.appendChild(requestSpan);
        }

        // Handle consent
        if (zapConsent && (zapTaker && zapWriter)) {
            const consentHTML = `<span><i class="fa fa-check-circle"></i> Zap Consent Given</span>`;
            const consentSpan = document.createElement('span');
            consentSpan.classList.add('consent');
            consentSpan.innerHTML = consentHTML;
            requestsList.appendChild(consentSpan);
        } else if (!zapConsent && (zapTaker || zapWriter)) {
            const zapButtonClass = 'zapRequestButton';
            const zapButton = document.createElement('button');
            zapButton.classList.add(zapButtonClass, 'actonRequest', 'requestButton');
            zapButton.setAttribute('data-zap-request-id', 'zapRequest');
            zapButton.textContent = 'Accept';

            const zapRequestSpan = document.createElement('span');
            zapRequestSpan.classList.add('request');
            zapRequestSpan.innerHTML = `<i class="fa fa-bell"></i> Zap Request Pending`;
            zapRequestSpan.appendChild(zapButton);

            requestsList.appendChild(zapRequestSpan);
        }

        // Add event listeners for the buttons
        document.querySelectorAll('.actonRequest').forEach(button => {
            button.addEventListener('click', function () {
                if (this.classList.contains('topupRequestButton')) {
                    const requestId = this.getAttribute('data-topup-request-id');
                    acceptTopupInterface(requestId);
                } else if (this.classList.contains('zapRequestButton')) {
                    const requestId = this.getAttribute('data-zap-request-id');
                    acceptZapInterface(requestId);
                }
            });
        });
    } catch (error) {
        console.error("Error updating requests list:", error);
    }
}


// Format date to "DD/MM/YYYY HH:MM"
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function updateSectionValues_Progress(
    //date
    dt_createdFormatted,
    dt_startedFormatted,
    dt_expiryFormatted,
    dt_settledFormatted,
    timetoExpiry,
    lifespan,
    //status
    status
)   {
    const formatValue = (value) => {
        return `${value.toFixed(0)}`;
    };

    try {
        // Step 1: Update progress : hours left
        document.getElementById("timetoExpiry").textContent = `${timetoExpiry} hrs`;
        
        // Step 2: compare lifespan to timetoExpiry and set the width of a div with ID progressBar, if timetoExpiry is 10% of lifespan then width is 10% of 100%        
        const progressBar = document.getElementById('meter_guage');
        
        if (timetoExpiry < lifespan) {
            // Difference between them as %
            const diffPercent = ((lifespan - timetoExpiry) / lifespan) * 100;
            progressBar.style.width = `${diffPercent}%`;
            //update % text
            document.getElementById("measure").textContent = `${formatValue(diffPercent)} %`;
        } else {
            progressBar.style.width = '0%';
            //update % text
            document.getElementById("measure").textContent = `${0} %`;
        }
    } catch (error) {
        console.error("Error Updating Net Worth section data:", error);
    }
}

function updateSectionValues_Gains(
    tokenName,
    tokenSymbol,
    tokenAmount,
    hedgeType,
    token,
    pairedCurrency,
    pairedSymbol,
    //values
    endValue,
    strikeValue,
    marketValue,
    startValue,
    createValue,
    cost,
    //parties
    owner,
    taker,
    userAddress,
    takerGains,
    writerGains,
    //date
    timetoExpiry,
    //status
    status,
    //consent
    zapTaker, // bool
    zapWriter // bool
) {

  try {
        const formatValue = (value) => {
            return `$${value.toFixed(2)}`;
        };

        const formatString = (number) => {
            return number.toLocaleString();
        };

        const formatStringDecimal = (number) => {
            const options = {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            };
            return number.toLocaleString('en-US', options);
        };
        

        // Check writer gains
        const writerGainsDiv = document.getElementById("writerGainsBase");
        const writerCard = document.getElementById("ownerProfitabil");
        if (writerGains < 0) {
            writerGainsDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
            writerCard.style.backgroundImage = 'url(\'./imgs/svg-loss-arrow.svg\')'; 
        } else if (writerGains > 0) {
            writerGainsDiv.style.backgroundColor = "rgb(8, 147, 83)";
            writerCard.style.backgroundImage = 'url(\'./imgs/svg-profit-arrow.svg\')'; 
        }

        // Check taker gains
        const takerGainsDiv = document.getElementById("takerGainsBase");
        const takerCard = document.getElementById("takerProfitabil");
        if (takerGains < 0) {
            takerGainsDiv.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
            takerCard.style.backgroundImage = 'url(\'./imgs/svg-loss-arrow.svg\')'; 
        } else if (takerGains > 0) {
            takerGainsDiv.style.backgroundColor = "rgb(8, 147, 83)";
            takerCard.style.backgroundImage = 'url(\'./imgs/svg-profit-arrow.svg\')'; 
        }
        //background styling & positioning
        writerCard.style.backgroundRepeat = 'no-repeat';
        takerCard.style.backgroundRepeat = 'no-repeat';
        writerCard.style.backgroundPosition = 'center';
        takerCard.style.backgroundPosition = 'center';

        // Display writer gains and taker gains with symbols
        //writer
        const writerGainsBaseDiv = document.getElementById("writerGainsBase");
        let formattedGainsWr;
        if (Math.abs(writerGains) == 0 || Math.abs(writerGains) >= 1) {
            formattedGainsWr = writerGains.toFixed(2);
        } else {
            formattedGainsWr = writerGains.toFixed(7);
        }
        writerGainsBaseDiv.innerText = `${writerGains >= 0 ? '+' : '-'}${formattedGainsWr} ${pairedSymbol}`;

        //taker
        const takerGainsBaseDiv = document.getElementById("takerGainsBase");
        let formattedGainsTk;
        if (Math.abs(takerGains) == 0 || Math.abs(takerGains) >= 1) {
            formattedGainsTk = takerGains.toFixed(2);
        } else {
            formattedGainsTk = takerGains.toFixed(7);
        }
        takerGainsBaseDiv.innerText = `${takerGains >= 0 ? '+' : '-'}${formattedGainsTk} ${pairedSymbol}`;

        // Truncate addresses
        const truncateAddress = (address) => {
            const first = address.substring(0, 5);
            const last = address.slice(address.length - 3);
            return `${first}..${last}`;
        };

        // Display privatised taker and owner addresses
        const hedgeTakerDiv = document.getElementById("takerTrunc");
        hedgeTakerDiv.innerText = truncateAddress(taker);

        const hedgeOwnerDiv = document.getElementById("ownerTrunc");
        hedgeOwnerDiv.innerText = truncateAddress(owner);

        // Show buttons based on status and userAddress
        const takeHedgeButton = document.getElementById("takeHedge");
        const deleteHedgeButton = document.getElementById("deleteHedge");
        const zapHedgeButton = document.getElementById("zapHedge");
        const settledAlreadyButton = document.getElementById("settledAlready");
        
        $(".dealButton").hide();
        // Only parties can have action buttons
        if(userAddress != taker && userAddress != owner) {
            $("#viewHedge").show();
            return;
        }
        status = parseFloat(status);
        if (status == 1) {
            if (userAddress !== owner) {
            takeHedgeButton.style.display = "inline-block";
            } else {
            deleteHedgeButton.style.display = "inline-block";
            }
        } else if (status == 2) {
            zapHedgeButton.style.display = "inline-block";
        } else if (status == 3) {
            settledAlreadyButton.style.display = "inline-block";
        }
  
    } catch (error) {
      console.error("Error Updating Net Worth section data:", error);
    }
}

// Export the fetch functions
export { updateSectionValues_HedgeCard, updateSectionValues_Progress, updateSectionValues_Gains };