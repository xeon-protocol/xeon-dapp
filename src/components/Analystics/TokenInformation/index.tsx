import SectionH1 from "@/components/reusable/SectionH1";

export default function TokenInformation() {
  return (
    <div className="main-traffic-section">
      <SectionH1>Token Information</SectionH1>
      <div className="token-info-widget">
        <div className="widget-title">
          <span className="icon">
            <i className="fas fa-info-circle"></i>
          </span>
          XEON is an ERC20 Token on Arbitrum Blockchain
        </div>
        <div className="widget-content">
          <div className="token-info-section">
            <div className="left-section">
              <div className="info-item">
                <h4>
                  <span className="icon">
                    <i className="fas fa-file-contract"></i>
                  </span>
                  Contract Address
                </h4>
                <p id="tokenoCA">0x1234567890123456789012345678901234567890</p>
              </div>
              <div className="info-item">
                <h4>
                  <span className="icon">
                    <i className="fas fa-coins"></i>
                  </span>
                  Token Symbol
                </h4>
                <p id="tokenoSymbol">XEON</p>
              </div>
              <div className="info-item">
                <h4>
                  <span className="icon">
                    <i className="fas fa-sort-numeric-up-alt"></i>
                  </span>
                  Decimals
                </h4>
                <p id="tokenoDecimals">18</p>
              </div>
              <div className="info-item">
                <h4>
                  <span className="icon">
                    <i className="fas fa-exchange-alt"></i>
                  </span>
                  Swap Tax
                </h4>
                <p id="tokenoTaxes">5/5</p>
              </div>
            </div>
            <div className="right-section">
              <div className="token-price">
                <h4>Token Price (USD)</h4>
                <p id="tokenoPriceUSD">$1.50</p>
              </div>
            </div>
          </div>
          <div className="supply-section">
            <div className="info-item">
              <h4>
                <span className="icon">
                  <i className="fas fa-list-ol"></i>
                </span>
                Total Supply
              </h4>
              <p id="tokenoTotalSupply">300,000,000 XEON</p>
            </div>
            <div className="info-item">
              <h4>
                <span className="icon">
                  <i className="fas fa-burn"></i>
                </span>
                Burnt Supply
              </h4>
              <p id="tokenoBurnt">10,000, 000 XEON</p>
            </div>
            <div className="info-item">
              <h4>
                <span className="icon">
                  <i className="fas fa-sync-alt"></i>
                </span>
                Circulating Supply
              </h4>
              <p id="tokenoCirculating">290,000, 000 XEON</p>
            </div>
          </div>
        </div>
        <div className="flex section section-full-chart">
          <div>
            <canvas id="tokenomicsChart"></canvas>
          </div>
          <div className="tokenomicsBriefing">
            <h4>* This Token is Deflationary!</h4>
            <p>XEON is the native token of our Ecosystem. </p>
            <p>
              Fundamental for tokenizing income rights whilst stimulating
              protocol revenue.
            </p>
            <p>
              Token utility within the protocol includes: <br />
              Stake to gain hedge mining rights, <br />
              Stake to provide native lending collateral, <br />
              Stake to provide native hedge liquidity, <br />
              Stake to claim portion of revenue share.
            </p>
            <p>
              Read more on
              <a href="#jump-to-section" className="walletStateLink">
                <text text-anchor="middle" className="text-[#188dd6]">
                  token-utility...
                  <i className="fa fa-link" aria-hidden="true"></i>
                </text>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
