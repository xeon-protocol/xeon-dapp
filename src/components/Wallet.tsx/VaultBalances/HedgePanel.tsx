import ImagePayful from "../../../assets/imgs/playful.webp";
import ImageCallOption from "../../../assets/imgs/call-option.svg";
import ImageEquitySwap from "../../../assets/imgs/equityswap.svg";
import Image from "next/image";

export default function HedgePanel() {
  return (
    <div className="hedgesPanelHold">
      <div id="hedgingSection" className="dashboard-section">
        <div className="section-title">
          <Image src={ImagePayful} alt="Neon" />
          <h2>Hedges Panel</h2>
        </div>

        <div className="data-cards">
          <div className="data-card hedge-created">
            <h3 className="card-title">Hs.Created</h3>
            <p className="card-value" id="hedgesCreatedCount">
              --
            </p>
            <div className="card-extra" title="options to swaps ratio">
              <text
                id="usererc20Count"
                text-anchor="middle"
                className="text-[#089353]"
              >
                15
              </text>
              <a href="#jump-to-section" className="walletStateLink">
                <text text-anchor="middle" className="text-[#188dd6]">
                  {" "}
                  erc20s <i className="fa fa-link" aria-hidden="true"></i>
                </text>
              </a>
            </div>
          </div>
          <div className="data-card hedge-taken">
            <h3 className="card-title">Hs.Taken</h3>
            <p className="card-value" id="hedgesTakenCount">
              --
            </p>
            <div className="card-extra" title="options to swaps ratio">
              <text text-anchor="middle" className="text-[#089353]">
                --
              </text>
              <a href="#jump-to-section" className="walletStateLink">
                <text text-anchor="middle" className="text-[#188dd6]">
                  {" "}
                  erc20s <i className="fa fa-link" aria-hidden="true"></i>
                </text>
              </a>
            </div>
          </div>
          <div className="data-card hedge-volume">
            <h3 className="card-title">Write Volume</h3>
            <p className="card-value" id="writeVolume">
              -- ETH
            </p>
          </div>
          <div className="data-card buy-volume">
            <h3 className="card-title">Take Volume</h3>
            <p className="card-value" id="takeVolume">
              -- ETH
            </p>
          </div>

          <div className="data-card hedge-created">
            <h3 className="card-title">Options</h3>
            <p className="card-value" id="optionsCount">
              --
            </p>
            <div className="card-extra" title="hedge type">
              <Image src={ImageCallOption} alt="" />
            </div>
          </div>
          <div className="data-card hedge-taken">
            <h3 className="card-title">Equity Swaps</h3>
            <p className="card-value" id="swapsCount">
              --
            </p>
            <div className="card-extra" title="hedge type">
              <Image src={ImageEquitySwap} alt="" />
            </div>
          </div>
          <div className="data-card hedge-volume">
            <h3 className="card-title">Gains</h3>
            <p className="card-value text-[#089353]" id="profitsETH">
              -- ETH
            </p>
          </div>
          <div className="data-card buy-volume">
            <h3 className="card-title">Losses</h3>
            <p className="card-value text-[#d6188a]" id="lossesETH">
              -- ETH
            </p>
          </div>
        </div>
      </div>

      <div className="hedges-list-section">
        <div className="hedges-load-section">
          <div className="list-toggle">
            <button data-type="Options Created" className="active">
              Options Created
            </button>
            <button data-type="Options Taken">Options Taken</button>
            <button data-type="Swaps Created">Swaps Created</button>
            <button data-type="Swaps Taken">Swaps Taken</button>
            <button data-type="My Bookmarks">My Bookmarks</button>
          </div>
        </div>
        <li className="trade-item t-i-lead hedges-trade-list">
          <div className="hlH hedge-type hedge-i-cat">TYPE</div>
          <div className="hedge-info">
            <div className="hlH hedge-symbol hedge-i-cat hSm">SYMB</div>
            <div className="hlH hedge-valuetitle hedge-i-cat">VALUE</div>
            <div className="hlH hedge-i-cat">COST</div>
            <div className="hlH hedge-i-cat">STATE</div>
            <div className="hlH hedge-time hedge-i-cat">START</div>
            <div className="hlH hedge-time hedge-i-cat">EXPIRE</div>
            <div className="hlH token-address hedge-i-cat">PARTYB</div>
          </div>
          <div className="hlH hedge-tx-btn">LINK</div>
        </li>

        <ul id="hedges-trade-list" className="trade-list hedges-trade-list">
          <li className="hedge-item">
            <div className="hedge-type hedge-i-cat hedgeType">CALL</div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">TKA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">BBET</div>
              <div className="hedge-value hedge-i-cat">0.42 ETH</div>
              <div className="hedge-i-cat">0.04 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">VELA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.07 ETH</div>
              <div className="hedge-i-cat">CLOSED</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">FTM</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.07 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">SHIB</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">CLOSED</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">TKA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.12 ETH</div>
              <div className="hedge-i-cat">CLOSED</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">BBET</div>
              <div className="hedge-value hedge-i-cat">0.42 ETH</div>
              <div className="hedge-i-cat">0.04 ETH</div>
              <div className="hedge-i-cat">CLOSED</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">VELA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.03 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">FTM</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.03 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">SHIB</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">TKA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">BBET</div>
              <div className="hedge-value hedge-i-cat">0.42 ETH</div>
              <div className="hedge-i-cat">0.04 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">VELA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">FTM</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">SHIB</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">TKA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              SWAP
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">SHIB</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>

          <li className="hedge-item">
            <div className="hedge-i-cat hedgeType flux highlightOption">
              CALL
            </div>
            <div className="token-info">
              <div className="hedge-symbol hedge-i-cat">TKA</div>
              <div className="hedge-value hedge-i-cat">0.72 ETH</div>
              <div className="hedge-i-cat">0.02 ETH</div>
              <div className="hedge-i-cat">OPEN</div>
              <div className="hedge-time hedge-i-cat">11/05/2023</div>
              <div className="hedge-time hedge-i-cat">18/05/2023</div>
              <div className="token-address">0x123...90</div>
            </div>
            <div className="hedge-i-cat">
              <button className="hedgeTxBtn">Tx</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
