export default function HedgingStats() {
  return (
    <div className="hedgingStats">
      <div className="staking-grid grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-4">
          <div className="cardDataRow grid grid-cols-2">
            <div className="flex flex-col cardData">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>created: </span>
                <span id="hedgesCreated">$0</span>
              </div>
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>bought: </span>
                <span id="hedgesTraded">$0</span>
              </div>
            </div>
            <div className="hedgeChart">
              <canvas id="hedgeBarChartA"></canvas>
            </div>
          </div>
          <hr className="line" />
          <div className="cardDataRow grid grid-cols-2">
            <div className="flex flex-col cardData">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>swaps volume: </span>
                <span id="swapsVolume">$0</span>
              </div>
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>options volume: </span>
                <span id="optionsVolume">$0</span>
              </div>
            </div>
            <div className="hedgeChart">
              <canvas id="hedgeBarChartB"></canvas>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="cardDataRow grid grid-cols-2">
            <div className="flex flex-col cardData">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>hedge costs: </span>
                <span id="hedgeCostsTotal">$0</span>
              </div>
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>hedge value: </span>
                <span id="hedgeValueTotal">$0</span>
              </div>
            </div>
            <div className="hedgeChart">
              <canvas id="hedgeBarChartC"></canvas>
            </div>
          </div>
          <hr className="line" />
          <div className="cardDataRow grid grid-cols-2">
            <div className="flex flex-col cardData">
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>hedge profits: </span>
                <span id="hedgeProfits">$0</span>
              </div>
              <div className="grid-sect-subtitle splitView stakedTitle">
                <span>hedge fees: </span>
                <span id="hedgeFees">$0</span>
              </div>
            </div>
            <div className="hedgeChart">
              <canvas id="hedgeBarChartD"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
