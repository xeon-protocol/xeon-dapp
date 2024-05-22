export default function TrafficSection() {
  return (
    <div className="traffic-section">
      <div className="traffic-card">
        <h4 className="card-title" title="based on start value">
          Hedge Volume
        </h4>
        <p className="card-value" id="hedgeVolumeValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title" title="based on cost value">
          Buy Volume
        </h4>
        <p className="card-value" id="buyVolumeValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title" title="fees collected on settlement">
          Fee Volume
        </h4>
        <p className="card-value" id="feeVolumeValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title" title="fees collected on settlement">
          Settled Volume
        </h4>
        <p className="card-value" id="settleVolumeValue">
          -
        </p>
      </div>

      <div className="traffic-card">
        <h4 className="card-title">ERC20 Types</h4>
        <p className="card-value" id="activeTokensCount">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title" title="number of hedges taken">
          Hedges Count
        </h4>
        <p className="card-value" id="tradedHedgesCount">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title" title="number of options taken">
          Options Count
        </h4>
        <p className="card-value" id="optionsCountValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title" title="number of swaps taken">
          Swaps Count
        </h4>
        <p className="card-value" id="swapsCountValue">
          -
        </p>
      </div>
    </div>
  );
}
