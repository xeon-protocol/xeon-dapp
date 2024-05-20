import Image from "next/image";
import ImagePayful from "../../../assets/imgs/playful.webp";

export default function RwardsPanel() {
  return (
    <div className="hedgesPanelHold">
      <div className="dashboard-section">
        <div className="section-title">
          <Image src={ImagePayful} alt="Neon" />
          <h2>Rewards Panel</h2>
        </div>

        <div className="rewardsInformer">
          <a href="">
            <i className="fa fa-leaf" aria-hidden="true"></i>
          </a>{" "}
          Xeon Protocol generates Real-Yield through multiple revenue streams.
          Namely: Vault withdrawal fees, Hedge settlement fees, Native hedge
          liquidity farming, and XEON token trading fees. Xeon Protocol brings
          back the generated revenue to investors for Revenue Sharing through
          Staking Rewards. Learn more about our income streams{" "}
          <a href="" className="neon-real-yield-link">
            here..
          </a>
        </div>

        <div className="earnMoreWidget-rewards">
          <div className="staking-widget-rewards">
            <div className="icon">
              <i className="fas fa-coins"></i>
            </div>
            <h4>Staking for Rewards</h4>
            <p>
              Simply stake XEON to be eligible for monthly revenue sharing.
              <a
                href="#jump-to-section"
                className="walletStateLink text-[#188dd6]"
              >
                <text text-anchor="middle">
                  {" "}
                  learn... <i className="fa fa-link" aria-hidden="true"></i>
                </text>
              </a>{" "}
            </p>
          </div>
          <div className="staking-widget-rewards">
            <div className="icon">
              <i className="fas fa-hammer"></i>
            </div>
            <h4>Stake to Become Miner</h4>
            <p>
              Stake and assign tokens to miner pool, to qualify as hedge
              miner/settler.
              <a
                href="#jump-to-section"
                className="walletStateLink text-[#188dd6]"
              >
                <text text-anchor="middle">
                  {" "}
                  learn... <i className="fa fa-link" aria-hidden="true"></i>
                </text>
              </a>{" "}
            </p>
          </div>
          <div className="staking-widget-rewards">
            <div className="icon">
              <i className="fas fa-diamond"></i>
            </div>
            <h4>Stake to Farm</h4>
            <p>
              Provide the Protocol with lending collateral or hedge liquidity.
              <a
                href="#jump-to-section"
                className="walletStateLink text-[#188dd6]"
              >
                <text text-anchor="middle">
                  {" "}
                  learn... <i className="fa fa-link" aria-hidden="true"></i>
                </text>
              </a>{" "}
            </p>
          </div>
        </div>

        <div className="rewards-grid grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-4">
            <div className="sumRewards flex items-center justify-between gap-2">
              <div className="grid-sect-title">Claimable Rewards</div>
              <div className="grid-sect-title text-[#089353]">
                <span id="totalRewardsDueAmnt" className="amount">
                  10 ETH
                </span>{" "}
                (
                <span id="totalRewardsDueValue" className="green-value">
                  $20,000
                </span>
                )
              </div>
            </div>
            <div className="grid grid-cols-2 stakeBlock">
              <div className="flex flex-col">
                <div className="grid-sect-subtitle">Revenue Sharing</div>
                <div className="grid-sect-subtitle-value">
                  <span id="rewardsDueAmnt" className="amount">
                    17 ETH
                  </span>{" "}
                  (
                  <span id="rewardsDueValue" className="green-value">
                    $30,000
                  </span>
                  )
                </div>
              </div>
              <button className="claim-button">
                <span>Claim</span>
              </button>
            </div>
            <hr className="line" />
            <div className="grid grid-cols-2 stakeBlock">
              <div className="flex flex-col">
                <div className="grid-sect-subtitle">
                  Native Lending Collateral
                </div>
                <div className="grid-sect-subtitle-value">
                  <span id="rewardsDueAmntLend" className="amount">
                    2 ETH
                  </span>{" "}
                  (
                  <span id="rewardsDueValueLend" className="green-value">
                    $3,000
                  </span>
                  )
                </div>
              </div>
              <button className="claim-button">
                <span>Claim</span>
              </button>
            </div>
            <hr className="line" />
            <div className="grid grid-cols-2 stakeBlock">
              <div className="flex flex-col">
                <div className="grid-sect-subtitle">
                  Native Hedging Liquidity
                </div>
                <div className="grid-sect-subtitle-value">
                  <span id="rewardsDueAmntLiq" className="amount">
                    1 ETH
                  </span>{" "}
                  (
                  <span id="rewardsDueValueLiq" className="green-value">
                    $2,000
                  </span>
                  )
                </div>
              </div>
              <button className="claim-button">
                <span>Claim</span>
              </button>
            </div>
            <hr className="line" />
            <div className="grid grid-cols-2 stakeBlock">
              <div className="flex flex-col">
                <div className="grid-sect-subtitle">
                  Hedge Mining Commission
                </div>
                <div className="grid-sect-subtitle-value">
                  <span id="rewardsDueAmntMine" className="amount">
                    <span id="rewardsDueValueMine" className="green-value">
                      * auto claim
                    </span>
                  </span>
                </div>
              </div>
              <button className="claim-button" disabled>
                <span>Claim</span>
              </button>
            </div>
          </div>
          <div className="rewClaimed flex flex-col gap-5">
            <div className="sumRewards flex items-center justify-between gap-2">
              <div className="grid-sect-title">Rewards Claimed</div>
              <div className="grid-sect-title text-[#089353]">
                <span id="totalRewardsClaimedAmnt" className="amount">
                  1 ETH
                </span>{" "}
                (
                <span id="totalRewardsClaimedValue" className="green-value">
                  $1,000
                </span>
                )
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="grid-sect-subtitle">from Revenue Sharing</div>
              <div className="grid-sect-subtitle-value">
                <span id="rewardsClaimedAmnt" className="amount">
                  2 ETH
                </span>{" "}
                (
                <span id="rewardsClaimedValue" className="green-value">
                  $3,000
                </span>
                )
              </div>
            </div>
            <hr className="line" />
            <div className="flex flex-col gap-1">
              <div className="grid-sect-subtitle">
                from Native Lending Collateral
              </div>
              <div className="grid-sect-subtitle-value">
                <span id="rewardsClaimedAmntLiq" className="amount">
                  1 ETH
                </span>{" "}
                (
                <span id="rewardsClaimedValueLend" className="green-value">
                  $1,000
                </span>
                )
              </div>
            </div>
            <hr className="line" />
            <div className="flex flex-col gap-1">
              <div className="grid-sect-subtitle">
                from Native Hedge Liquidity
              </div>
              <div className="grid-sect-subtitle-value">
                <span id="rewardsClaimedAmntLend" className="amount">
                  3 ETH
                </span>{" "}
                (
                <span id="rewardsClaimedValueLiq" className="green-value">
                  $6,000
                </span>
                )
              </div>
            </div>
            <hr className="line" />
            <div className="flex flex-col gap-1">
              <div className="grid-sect-subtitle">from Mining Hedges</div>
              <div className="grid-sect-subtitle-value">
                <span id="rewardValue" className="amount">
                  generate total commission earned..{" "}
                  <div className="hedge-i-cat">
                    <button className="hedgeTxBtn">fetch</button>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
