import SectionH1 from "@/components/reusable/SectionH1";
import {
  IconERC20Gold,
  IconUSDC,
  IconUSDT,
  IconWETH,
} from "@/components/reusable/images";
import Image from "next/image";

export default function ProtocolEarnings() {
  return (
    <div className="main-traffic-section">
      <SectionH1>Protocol Earnings</SectionH1>
      <div className="trafficStats">
        <div className="statsbreakdown">
          <div className="widget">
            <div className="widget-content">
              <div className="total-amount">
                <h4 className="widget-title">Revenue Breakdown</h4>
                <p id="totalFeesValue" className="align-right">
                  $0.00
                </p>
              </div>
              <div className="breakdown">
                <ul>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">
                        <Image
                          src={IconWETH}
                          alt="coin"
                          className="w-[32px] h-[32px]"
                        />
                        WETH
                      </span>
                      <div className="align-right">
                        <span id="deposits_wethAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="deposits_wethValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">
                        <Image
                          src={IconUSDC}
                          alt="coin"
                          className="w-[32px] h-[32px]"
                        />
                        USDC
                      </span>
                      <div className="align-right">
                        <span id="deposits_usdcAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="deposits_usdcValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">
                        <Image
                          src={IconUSDT}
                          alt="coin"
                          className="w-[32px] h-[32px]"
                        />
                        USDT
                      </span>
                      <div className="align-right">
                        <span id="deposits_usdtAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="deposits_usdtValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">
                        <Image
                          src={IconERC20Gold}
                          alt="coin"
                          className="w-[32px] h-[32px]"
                        />
                        ERC20
                      </span>
                      <div className="align-right">
                        <span id="deposits_erc20Amnt" className="amount">
                          0
                        </span>
                        (
                        <span id="deposits_erc20Value" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="widget">
            <div className="widget-content">
              <div className="total-amount">
                <h4 className="widget-title">Total Revenue</h4>
                <p id="totalRevenueValue" className="align-right">
                  $0.00
                </p>
              </div>
              <div className="breakdown">
                <ul>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Cashier</span>
                      <div className="align-right">
                        <span id="cashierRevenueAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="cashierRevenueValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">OTC Trades</span>
                      <div className="align-right">
                        <span id="hedgeRevenueAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="hedgeRevenueValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Token-Tax</span>
                      <div className="align-right">
                        <span id="taxRevenueAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="taxRevenueValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span
                        className="currency-name"
                        title="Liquidity for Xeon run Hedges"
                      >
                        Farming
                      </span>
                      <div className="align-right">
                        <span id="farmingRevenueAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="farmingRevenueValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="widget">
            <div className="widget-content">
              <div className="total-amount">
                <h4 className="widget-title">Dividents | Rewards</h4>
              </div>
              <div className="breakdown">
                <ul>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Revenue Pending</span>
                      <div className="align-right">
                        <span id="totalRevenueUndistrAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="totalRevenueUndistrValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Revenue Distributed</span>
                      <div className="align-right">
                        <span id="totalRevenueDistrAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="totalRevenueDistrValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Claimed</span>
                      <div className="align-right">
                        <span id="totalClaimedAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="totalClaimedValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">unClaimed</span>
                      <div className="align-right">
                        <span id="totalUnclaimedAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="totalUnclaimedValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Total Stakers</span>
                      <div className="align-right">
                        <span id="totalStakers" className="amount">
                          0
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="widget">
            <div className="widget-content">
              <div className="total-amount">
                <h4 className="widget-title">Miner | Settlement Stats</h4>
              </div>
              <div className="breakdown">
                <ul>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Miner Fees</span>
                      <div className="align-right">
                        <span id="minerFeesAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="minerFeesValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Mined Volume</span>
                      <div className="align-right">
                        <span id="minedHedgesCount" className="amount">
                          0
                        </span>
                        (
                        <span id="minedHedgesValue" className="value">
                          $0
                        </span>
                        )
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="currency-details">
                      <span className="currency-name">Active Miners</span>
                      <div className="align-right">
                        <span id="minersCount" className="amount">
                          0
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="section section-big-chart">
          <h4 className="widget-title">Revenue Split</h4>
          <div>
            <canvas id="revenuesplitChart"></canvas>
          </div>
          <h4 className="widget-title">Revenue Distributed</h4>
          <div>
            <canvas id="dividentsChart"></canvas>
          </div>
          <h4 className="widget-title">Divident Claims</h4>
          <div>
            <canvas id="claimsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
