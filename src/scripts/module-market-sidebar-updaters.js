import { CONSTANTS, getUserBalancesForToken, truncateAddress, fromWeiToFixed12, fromWeiToFixed5, fromWeiToFixed8, fromWeiToFixed8_unrounded, fromWeiToFixed5_unrounded, fromWeiToFixed2_unrounded, toFixed8_unrounded } from './constants.js';

// 1. Update Sidebar Hedge Volumes 
//----------------------------------------------------
function updateSectionValues_volumes(hedgesTraded, hedgesCreated, swapsVolume, optionsVolume, settledVolume, hedgeCostsTotal, hedgeProfits, hedgeFees, cashierFees) {
    // Format values
    const formatValue = (value) => {
      return `$${value.toFixed(2)}`;
    };
  
    // Update hedges traded and created
    document.getElementById("hedgeVolume").textContent = formatValue(hedgesTraded);
    // Update hedge premiums
    document.getElementById("premiumVolume").textContent = formatValue(hedgeCostsTotal);
    // Update settled volume
    document.getElementById("settleVolume").textContent = formatValue(settledVolume);  
    // Update hedge profits and losses
    document.getElementById("payoffVolume").textContent = formatValue(hedgeProfits);

}

function updateSectionValues_volumesERC20(tokenAddress, tokenName, tokenPrice, pairedSymbol, boughtOptionsCount, boughtSwapsCount, settledOptionsCount, settledSwapsCount, optionsCount, swapsCount) {
  
  const trancutedAddress = truncateAddress(tokenAddress);
  // prepare token summary
  const tokenHeader = `
  <div class="tokenHead">
    <div class="projectLogo sidebarLogo" style="background-image:url('./imgs/erc20-shitcoin-tr.png')"></div>
    <div class="projectName sidebarName">
      <div>`+tokenName+`</div>
      <div class="token_links">
        <a class="etherscanLink" href="https://arbiscan.io/address/`+tokenAddress+`" target="_blank" alt="SC" title="view on Arbitrum Explorer">`+trancutedAddress+`</a>
        <a class="etherscanLink" href="https://www.dextools.io/app/en/arbitrum/pair-explorer/`+tokenAddress+`" target="_blank" alt="SC" title="Go to Arbitrum Explorer">`+trancutedAddress+`</a>
        <span>`+tokenPrice+` `+pairedSymbol+`</span>
      </div>
    </div>
  </div>
  <div class="neon-container">
    <span class="neon-text">Hedges Bought</span>
    <span class="neon-amount boughtVolume">`+boughtOptionsCount + boughtSwapsCount+`</span>
  </div>
  <div class="neon-container">
    <span class="neon-text">Options</span>
    <span class="neon-amount settledVolume">`+optionsCount+`</span>
  </div>
  <div class="neon-container">
    <span class="neon-text">Swaps</span>
    <span class="neon-amount settledVolume">`+swapsCount+`</span>
  </div>
  <div class="neon-container">
    <span class="neon-text">Hedges Settled</span>
    <span class="neon-amount settledVolume">`+settledOptionsCount + settledSwapsCount+`</span>
  </div>`;
  
  // Hide the volumeStats div and show the tokenStats div
  const volumeStatsDiv = document.getElementById('volumeStats');
  const tokenStatsDiv = document.getElementById('tokenStats');

  volumeStatsDiv.style.display = 'none';
  tokenStatsDiv.style.display = 'block';
  // Update hedges traded and created
  document.getElementById("tokenStats").empty().append = tokenHeader;
}
  export { updateSectionValues_volumes, updateSectionValues_volumesERC20 };