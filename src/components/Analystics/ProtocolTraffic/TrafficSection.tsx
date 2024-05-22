export default function TrafficSection() {
  return (
    <div className="traffic-section">
      <div className="traffic-card">
        <h4 className="card-title">Active Wallets</h4>
        <p className="card-value" id="activeWalletsValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title">Active ERC20 Tokens</h4>
        <p className="card-value" id="activeTokensValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4
          className="card-title"
          title="The number of trades taken on the OTC market."
        >
          OTC Trades
        </h4>
        <p className="card-value" id="tradesCountValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title">Cashier Volume</h4>
        <p className="card-value" id="cashierVolumeValue">
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4 className="card-title">OTC Volume</h4>
        <p
          className="card-value"
          id="otcVolumeValue"
          title="The total volume of trades on the OTC market."
        >
          -
        </p>
      </div>
      <div className="traffic-card">
        <h4
          className="card-title"
          title="Dex volume generates revenue for the protocol."
        >
          DEX Volume
        </h4>
        <p className="card-value" id="dexVolumeValue">
          -
        </p>
      </div>
    </div>
  );
}
