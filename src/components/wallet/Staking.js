import React from "react";

const StakingPanel = () => {
  return (
    <div className="px-8 pt-8 md:px-10 max-w-screen-2xl mx-auto text-grey pb-20">
      <div className="section-title flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Staking Panel</h2>
      </div>

      <div className="rewardsInformer mb-6 md:w-3/4">
        Stake XEON tokens to be eligible for rewards sharing. The staking window
        opens 3 days only each month-end, during which users can stake or
        unstake XEON. Revenue is deposited to staking contract for claiming.
      </div>

      <div className="myStakes staking-grid grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 stakeGrids md:my-10">
            <div className="stakeDataRow flex flex-col">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span className="splitView-title">my Staked Balance: </span>
                <span id="stakedBalanceAmnt">0</span>
                <span id="stakedBalanceValue">($0.00)</span>
              </div>
              <div className="grid-sect-subtitle splitView">
                <span className="splitView-title">my Total Holdings: </span>
                <span id="totalBalanceAmnt">0</span>
                <span id="totalBalanceValue">($0.00)</span>
              </div>
            </div>
            <div id="stakedChart" className="chart-svg">
              <p className="text-2xl md:text-7xl text-lime">0.00%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 stakeGrids md:my-10">
            <div className="stakeDataRow flex flex-col">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span className="splitView-title">Staked Supply: </span>
                <span id="stakedSupplyAmnt">0</span>
                <span id="stakedSupplyValue">($0.00)</span>
              </div>
              <div className="grid-sect-subtitle splitView">
                <span className="splitView-title">Circulating Supply: </span>
                <span id="circSupplyAmnt">100,000,000</span>
                <span id="circSupplyValue">($137.42)</span>
              </div>
            </div>
            <div id="circulatingChart" className="chart-svg">
              <p className="text-2xl md:text-7xl text-light-purple">0.00%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 stakeGrids md:my-10">
            <div className="stakeDataRow flex flex-col">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span className="splitView-title">Dividends Distributed: </span>
                <span id="divDistributedAmnt">0</span>
                <span id="divDistributedValue">($0.00)</span>
              </div>
              <div className="grid-sect-subtitle splitView">
                <span className="splitView-title">Dividends Claimed: </span>
                <span id="divClaimedAmnt">0</span>
                <span id="divClaimedValue">($0.00)</span>
              </div>
            </div>
            <div id="dividendsChart" className="chart-svg">
              <p className="text-2xl md:text-7xl text-deep-purple">0.00%</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-row justify-between items-center lg:mb-10 gap-1">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">XEON available</div>
              <div className="grid-sect-subtitle-value">
                <span className="text-2xl md:text-7xl" id="tokensStakedWallet">
                  0
                </span>
              </div>
            </div>
            <button className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue h-12">
              <span>Stake XEON</span>
            </button>
          </div>
          <div className="flex flex-row justify-between items-center gap-1">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">XEON staked</div>
              <div className="grid-sect-subtitle-value">
                <span className="text-2xl md:text-7xl" id="tokensStakedWallet">
                  0
                </span>
              </div>
            </div>
            <button className="text-white bg-floral rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue h-12">
              <span>Unstake XEON</span>
            </button>
          </div>
        </div>
      </div>

      <div className="section-title staking-assignments-title mb-6">
        <span className="sectionLabel aplAssignments text-2xl">
          Stake Assignment Pools
        </span>
      </div>
      <div className="rewardsInformer mb-6 lg:mb-20 md:w-3/4">
        After staking tokens, you can choose which farming pool or income method
        to assign your tokens to. (1) Simply stake XEON without assigning, to
        qualify for general revenue sharing. (2) Stake and assign to Native
        Hedging &amp; Lending Liquidity Pools. (3) The protocol will now use
        your tokens to provide native equity swaps or options liquidity. (4)
        Profits are brought back to pool assigners for sharing. Native Liquidity
        Pools are not only available for XEON tokens only, other projects can
        create their own pools too.
      </div>

      <div className="assignments-grid grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="stakeGrids flex flex-col gap-4">
          <div className="stakeDataRow flex items-center justify-between gap-2">
            <div className="grid-sect-title text-lg font-semibold">
              Staked Tokens
            </div>
            <div className="grid-sect-title text-green-600">
              <span id="mystakedTokensAmnt">0</span>
              <span id="myStakedTokensValue">($0.00)</span>
            </div>
          </div>
          <hr className="line border-gray-200" />
          <div className="stakeDataRow flex items-center justify-between gap-2">
            <div className="grid-sect-title text-lg font-semibold">
              Assigned Tokens
            </div>
            <div className="grid-sect-title text-green-600">
              <span id="myAssignedAmnt">0</span>
              <span id="myAssignedValue">($0.00)</span>
            </div>
          </div>
          <hr className="line border-gray-200" />
          <div className="stakeDataRow flex items-center justify-between gap-2">
            <div className="grid-sect-title text-lg font-semibold">
              Unassigned Tokens
            </div>
            <div className="grid-sect-title text-green-600">
              <span id="myUnassignedAmnt">0</span>
              <span id="myUnassignedValue">($0.00)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 place-flexstart">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">Protocol Hedge Liquidity</div>
              <div className="grid-sect-subtitle-value">
                <span id="assignedToLiquidityAmnt">0</span>
                <span id="assignedToLiquidityValue">($0.00)</span>
              </div>
            </div>
            <button
              className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue h-12"
              disabled
            >
              <span>Manage</span>
            </button>
          </div>
          <hr className="line border-gray-200" />
          <div className="grid grid-cols-2 place-flexstart">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">
                Protocol Lending Collateral
              </div>
              <div className="grid-sect-subtitle-value">
                <span id="assignedToCollateralAmnt">0</span>
                <span id="assignedToCollateralValue">($0.00)</span>
              </div>
            </div>
            <button
              className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue h-12"
              disabled
            >
              <span>Manage</span>
            </button>
          </div>
          <hr className="line border-gray-200" />
          <div className="grid grid-cols-2 place-flexstart">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">Mining Rights</div>
              <div className="grid-sect-subtitle-value">
                <span id="assignedToMiningAmnt">0</span>
                <span id="assignedToMiningValue">($0.00)</span>
              </div>
            </div>
            <button
              className="text-white bg-button-gradient rounded-full px-8 py-2 border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue h-12"
              disabled
            >
              <span>Manage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPanel;
