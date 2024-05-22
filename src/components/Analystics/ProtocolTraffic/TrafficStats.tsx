import {
  IconERC20Gold,
  IconUSDC,
  IconUSDT,
  IconWETH,
} from "@/components/reusable/images";
import Image from "next/image";

export default function TrafficStats() {
  return (
    <div>
      <div className="trafficStats">
        <div className="statsbreakdown">
          <div className="widget">
            <div className="widget-content">
              <div className="total-amount">
                <h4 className="widget-title">Total Deposits</h4>
                <p id="totalDepositsValue" className="align-right">
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
                        </span>{" "}
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
                <h4 className="widget-title">Total Withdrawals</h4>
                <p id="totalWithdrawalsValue" className="align-right">
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
                        <span id="withdrawals_wethAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="withdrawals_wethValue" className="value">
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
                        <span id="withdrawals_usdcAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="withdrawals_usdcValue" className="value">
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
                        <span id="withdrawals_usdtAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="withdrawals_usdtValue" className="value">
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
                        <span id="withdrawals_erc20Amnt" className="amount">
                          0
                        </span>
                        (
                        <span id="withdrawals_erc20Value" className="value">
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
                <h4 className="widget-title">OTC Volume</h4>
                <p
                  id="totalOTCVolume"
                  className="align-right"
                  title="The total trading volume on the OTC market, based on startValue. Read Docs.."
                >
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
                        WETH Equiv
                      </span>
                      <div className="align-right">
                        <span id="otcVol_wethAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="otcVol_wethValue" className="value">
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
                        USDT Equiv
                      </span>
                      <div className="align-right">
                        <span id="otcVol_usdcAmnt" className="amount">
                          0
                        </span>
                        (
                        <span id="otcVol_usdcValue" className="value">
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
                        USDC Equiv
                      </span>
                      <div className="align-right">
                        <span id="otcVol_usdtAmnt" className="amount">
                          0
                        </span>{" "}
                        (
                        <span id="otcVol_usdtValue" className="value">
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
                        Other
                      </span>
                      <div className="align-right">
                        <span id="withdrawals_erc20Amnt" className="amount">
                          0
                        </span>
                        (
                        <span id="otcVol_otherValue" className="value">
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
        </div>

        <div className="section section-big-chart">
          <h4 className="widget-title">Cashier</h4>
          <canvas id="depositWithdrawalChart"></canvas>
          <h4 className="widget-title">Currencies</h4>
          <canvas id="cashingPieChart"></canvas>
        </div>
      </div>
    </div>
  );
}
