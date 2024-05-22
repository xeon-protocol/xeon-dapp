export default function StakeAssignmentPools() {
  return (
    <>
      <div className="section-title staking-assignments-title">
        <span className="sectionLabel aplAssignments">
          Stake Assignment Pools
        </span>
      </div>
      <div className="assignments-grid">
        <div className="assignGrids staking-summary-grid grid grid-cols-2 gap-5">
          <hr className="line" />
          <div className="stakeDataRow flex items-center justify-between gap-2">
            <div className="grid-sect-title">Assigned Stakes</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="assignedStakesAmnt" className="green-amount">
                10,000,000
              </span>
              (
              <span id="assignedStakesValue" className="green-value">
                $300,000
              </span>
              )
            </div>
          </div>

          <hr className="line" />
          <div className="stakeDataRow flex items-center justify-between gap-2">
            <div className="grid-sect-title">Unassigned Stakes</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="unAssignedStakesAmnt" className="green-amount">
                290,000,000
              </span>
              (
              <span id="unAssignedStakesValue" className="green-value">
                $2,700,000
              </span>
              )
            </div>
          </div>

          <hr className="line" />
          <div className="stakeDataRow flex items-center justify-between gap-2">
            <div className="grid-sect-title">Assignment Pools Earnings</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="assignmentRewardsAmnt" className="green-value">
                24 ETH
              </span>
              (
              <span id="assignmentRewardsValue" className="green-value">
                $400,000
              </span>
              )
            </div>
          </div>
        </div>
        <div className="assignmentPools flex flex-col gap-5">
          <div className="grid grid-cols-2 place-flexstart">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">Protocol Hedge Liquidity</div>
              <div className="grid-sect-subtitle-value">
                <span id="assignedLiquidityAmnt" className="amount">
                  1,000,000
                </span>
                (
                <span id="assignedLiquidityValue" className="value">
                  $30,000
                </span>
                )
              </div>
            </div>
            <button className="claim-button" disabled>
              <span>Review Earnings</span>
            </button>
          </div>
          <hr className="line" />
          <div className="grid grid-cols-2 place-flexstart">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">Protocol Loan Collateral</div>
              <div className="grid-sect-subtitle-value">
                <span id="assignedCollateralAmnt" className="amount">
                  2,500,000
                </span>
                (
                <span id="assignedCollateralValue" className="value">
                  $40,000
                </span>
                )
              </div>
            </div>
            <button className="claim-button" disabled>
              <span>Review Earnings</span>
            </button>
          </div>
          <hr className="line" />
          <div className="grid grid-cols-2 place-flexstart">
            <div className="flex flex-col">
              <div className="grid-sect-subtitle">Mining Rights</div>
              <div className="grid-sect-subtitle-value">
                <span id="assignedMiningAmnt" className="amount">
                  8,000,000
                </span>
                (
                <span id="assignedMiningValue" className="value">
                  $70,000
                </span>
                )
              </div>
            </div>
            <button className="claim-button" disabled>
              <span>Review Earnings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
