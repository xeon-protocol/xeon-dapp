export default function RightSidebar() {
  return (
    <div id="sidebar" className="min-w-[300px]">
      <div className="liveEvents">
        <ul className="scifiUI">
          <li className="scifiUI_li">
            <input
              type="radio"
              name="tab"
              id="tab1"
              checked
              onChange={() => {}}
            />
            <label htmlFor="tab1" id="statsLabel">
              Statistics
            </label>
            <div className="section">
              <div id="volumeStats">
                <div className="neon-container">
                  <span className="neon-text">Hedged Volume</span>
                  <span id="hedgeVolume" className="neon-amount hedgedVolume">
                    ****
                  </span>
                </div>
                <div className="neon-container">
                  <span className="neon-text">Premium Volume</span>
                  <span id="premiumVolume" className="neon-amount boughtVolume">
                    ****
                  </span>
                </div>
                <div className="neon-container">
                  <span className="neon-text">Settle Hedge Volume</span>
                  <span id="settleVolume" className="neon-amount settledVolume">
                    ****
                  </span>
                </div>
                <div className="neon-container">
                  <span className="neon-text">Profit Payoffs</span>
                  <span id="payoffVolume" className="neon-amount settledVolume">
                    ****
                  </span>
                </div>
              </div>
              <div id="tokenStats"></div>
            </div>
          </li>
          <li className="scifiUI_li">
            <input type="radio" name="tab" id="tab2" />
            <label htmlFor="tab2" id="eventsLabel">
              Live Txs
            </label>
            <div className="section">
              <ul id="scifiUI">
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.07 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>1.11 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.0014 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.021 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>0.52 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>0.74 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.0026 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>1.72 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.07 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>1.11 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.0014 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.021 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>0.52 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>0.74 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.0026 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>1.72 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.07 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>1.11 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.0014 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.021 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>0.52 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>settled</span>
                  <span>0.74 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>0.14 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>mined</span>
                  <span>0.0026 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
                <li>
                  <span>bought</span>
                  <span>1.72 eth</span>
                  <span>0x000...00</span>
                  <span>Txn</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
