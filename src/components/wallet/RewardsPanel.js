"use client";
import {motion} from "framer-motion";
const DashboardSection = () => {
  const glitchVariants = {
    visible: {
      textShadow: [
        "1px 1px 0px lime",
        "-1px -1px 0px purple",
        "1px -1px 0px lime",
        "-1px 1px 0px lime",
        "2px 2px 2px lime",
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };
  return (
    <div className="px-8 pt-8 md:px-10 max-w-screen-2xl mx-auto text-grey">
      <div className="section-title flex items-center lg:mt-20 gap-32 mb-6">
        <motion.h1 className="text-3xl text-grey">
          <motion.span
            initial="hidden"
            whileInView={{opacity: 1, x: 0}}
            animate={"visible"}
          >
            Hedges
          </motion.span>{" "}
          Panel
        </motion.h1>
      </div>

      <div className="rewardsInformer mb-6 md:w-3/4 mb-5">
        Xeon Protocol generates Real-Yield through multiple revenue streams.
        Namely: Vault withdrawal fees, Hedge settlement fees, Native hedge
        liquidity farming, and XEON token trading fees. Xeon Protocol brings
        back the generated revenue to investors for Revenue Sharing through
        Staking Rewards. Learn more about our income streams{" "}
        <a href="#" className="neon-real-yield-link text-blue-500">
          here..
        </a>
      </div>

      <div className="earnMoreWidget-rewards grid grid-cols-1 lg:mb-20 md:grid-cols-3 gap-6  mb-6">
        <div className="staking-widget-rewards p-4 border rounded-md flex flex-col items-center text-center">
          <div className="icon mb-2 text-yellow-500">
            <i className="fas fa-coins text-2xl"></i>
          </div>
          <h4 className="text-lg font-semibold mb-2">Staking for Rewards</h4>
          <p className="text-sm">
            Simply stake XEON to be eligible for monthly revenue sharing.
            <a
              href="#jump-to-section"
              className="walletStateLink text-blue-500"
            >
              {" "}
              learn... <i className="fa fa-link" aria-hidden="true"></i>
            </a>
          </p>
        </div>
        <div className="staking-widget-rewards p-4 border rounded-md flex flex-col items-center text-center">
          <div className="icon mb-2 text-yellow-500">
            <i className="fas fa-hammer text-2xl"></i>
          </div>
          <h4 className="text-lg font-semibold mb-2">Stake to Become Miner</h4>
          <p className="text-sm">
            Stake and assign tokens to miner pool, to qualify as hedge
            miner/settler.
            <a
              href="#jump-to-section"
              className="walletStateLink text-blue-500"
            >
              {" "}
              learn... <i className="fa fa-link" aria-hidden="true"></i>
            </a>
          </p>
        </div>
        <div className="staking-widget-rewards p-4 border rounded-md flex flex-col items-center text-center">
          <div className="icon mb-2 text-yellow-500">
            <i className="fas fa-diamond text-2xl"></i>
          </div>
          <h4 className="text-lg font-semibold mb-2">Stake to Farm</h4>
          <p className="text-sm">
            Provide the Protocol with lending collateral or hedge liquidity.
            <a
              href="#jump-to-section"
              className="walletStateLink text-blue-500"
            >
              {" "}
              learn... <i className="fa fa-link" aria-hidden="true"></i>
            </a>
          </p>
        </div>
      </div>

      <div className="rewards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="sumRewards flex items-center justify-between gap-2">
            <div className="grid-sect-title text-lg font-semibold">
              Claimable Rewards
            </div>
            <div className="grid-sect-title text-green-600">
              <span id="totalRewardsDueAmnt" className="amount">
                0
              </span>{" "}
              (
              <span id="totalRewardsDueValue" className="green-value">
                0
              </span>
              )
            </div>
          </div>
          <div className="grid grid-cols-2 gap-32 stakeBlock items-center p-4 border border-muted rounded-md">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle text-sm">Revenue Sharing</div>
              <div className="grid-sect-subtitle-value text-sm">
                <span id="rewardsDueAmnt" className="amount">
                  0
                </span>{" "}
                (
                <span id="rewardsDueValue" className="green-value">
                  0
                </span>
                )
              </div>
            </div>
            <button className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              Claim
            </button>
          </div>
          <hr className="line border-gray-200" />
          <div className="grid grid-cols-2 gap-32 stakeBlock items-center p-4 border border-muted rounded-md">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle text-sm">
                Native Lending Collateral
              </div>
              <div className="grid-sect-subtitle-value text-sm">
                <span id="rewardsDueAmntLend" className="amount">
                  0
                </span>{" "}
                (
                <span id="rewardsDueValueLend" className="green-value">
                  0
                </span>
                )
              </div>
            </div>
            <button className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              Claim
            </button>
          </div>
          <hr className="line border-gray-200" />
          <div className="grid grid-cols-2 gap-32 stakeBlock items-center p-4 border border-muted  rounded-md">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle text-sm">
                Native Hedging Liquidity
              </div>
              <div className="grid-sect-subtitle-value text-sm">
                <span id="rewardsDueAmntLiq" className="amount">
                  0
                </span>{" "}
                (
                <span id="rewardsDueValueLiq" className="green-value">
                  0
                </span>
                )
              </div>
            </div>
            <button className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              Claim
            </button>
          </div>
          <hr className="line border-gray-200" />
          <div className="grid grid-cols-2 gap-32 stakeBlock items-center p-4 border border-muted rounded-md">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle text-sm">
                Hedge Mining Commission
              </div>
              <div className="grid-sect-subtitle-value text-sm">
                <span id="rewardsDueAmntMine" className="amount">
                  <span id="rewardsDueValueMine" className="green-value">
                    * auto claim
                  </span>
                </span>
              </div>
            </div>
            <button className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              Claim
            </button>
          </div>
        </div>
        <div className="rewClaimed flex flex-col gap-6">
          <div className="sumRewards flex items-center justify-between gap-2">
            <div className="grid-sect-title text-lg font-semibold">
              Rewards Claimed
            </div>
            <div className="grid-sect-title text-green-600">
              <span id="totalRewardsClaimedAmnt" className="amount">
                0
              </span>{" "}
              (
              <span id="totalRewardsClaimedValue" className="green-value">
                0
              </span>
              )
            </div>
          </div>
          <div className="flex flex-row justify-between gap-1 p-4 border border-muted rounded-md">
            <div className="grid-sect-subtitle text-xl py-[6px]">
              from Revenue Sharing
            </div>
            <div className="grid-sect-subtitle-value text-sm">
              <span id="rewardsClaimedAmnt" className="amount">
                0
              </span>{" "}
              (
              <span id="rewardsClaimedValue" className="green-value">
                0
              </span>
              )
            </div>
          </div>
          <hr className="line border-gray-200" />
          <div className="flex flex-row justify-between gap-1 p-4 border border-muted rounded-md">
            <div className="grid-sect-subtitle text-xl py-[6px]">
              from Native Lending Collateral
            </div>
            <div className="grid-sect-subtitle-value text-sm">
              <span id="rewardsClaimedAmntLiq" className="amount">
                0
              </span>{" "}
              (
              <span id="rewardsClaimedValueLend" className="green-value">
                0
              </span>
              )
            </div>
          </div>
          <hr className="line border-gray-200" />
          <div className="flex flex-row justify-between gap-1 p-4 border border-muted rounded-md">
            <div className="grid-sect-subtitle text-xl py-[6px]">
              from Native Hedge Liquidity
            </div>
            <div className="grid-sect-subtitle-value text-sm">
              <span id="rewardsClaimedAmntLend" className="amount">
                0
              </span>{" "}
              (
              <span id="rewardsClaimedValueLiq" className="green-value">
                0
              </span>
              )
            </div>
          </div>
          <hr className="line border-gray-200" />
          <div className="flex flex-row justify-between gap-1 p-4 border border-muted rounded-md">
            <div className="grid-sect-subtitle text-xl py-[3px]">
              from Mining Hedges
            </div>
            <div className="grid-sect-subtitle-value text-sm">
              <p id="rewardValue" className="amount">
                generate total commission earned..{" "}
              </p>
              <div className="hedge-i-cat">
                <button className="border-dashed border-2 border-light-purple mt-2 text-white py-1 px-2 rounded-md">
                  fetch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
