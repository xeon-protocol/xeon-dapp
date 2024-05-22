export default function TrafficStats() {
  return (
    <div className="trafficStats">
      <div className="staking-summary-grid grid grid-cols-2 gap-5">
        <div className="stakeGrids flex flex-col gap-4">
          <div className="stakeDataRow flex justify-between gap-2">
            <div className="grid-sect-title">Staked Supply</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="stakedAmount" className="green-amount">
                80,000,000
              </span>
              (
              <span id="stakedValue" className="green-value">
                $700,000
              </span>
              )
            </div>
          </div>

          <hr className="line" />
          <div className="stakeDataRow flex justify-between gap-2">
            <div className="grid-sect-title">Circulating Supply</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="circAmount" className="green-amount">
                300,000,000
              </span>
              (
              <span id="circValue" className="green-value">
                $3,000,000
              </span>
              )
            </div>
          </div>

          <hr className="line" />
          <div className="stakeDataRow flex justify-between gap-2">
            <div className="grid-sect-title">Staking Cycles</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="stakeCycle" className="green-amount">
                30 Days
              </span>
            </div>
          </div>

          <hr className="line" />
          <div className="stakeDataRow flex justify-between gap-2">
            <div className="grid-sect-title">Total Stakers</div>
            <div className="grid-sect-title text-[#33856b]">
              <span id="stakersCount" className="green-amount">
                800
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 section section-big-chart">
        <h4 className="widget-title">Staked Vs Circulating</h4>
        <div>
          <canvas id="stakedsupplyChart"></canvas>
        </div>
      </div>
    </div>
  );
}
