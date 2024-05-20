export default function EarnMoreWidget() {
  return (
    <div className="earnMoreWidget">
      <div className="staking-widget">
        <div className="icon">
          <i className="fas fa-coins"></i>
        </div>
        <h4>Stake $XEON</h4>
        <p>
          XEON, our native token, is crucial to supporting our ecosystem. As
          such, we reward you through revenue sharing for buying and staking it.
          Protocol revenue from fees and taxes is distributed to all stakers.
        </p>
        <button>Stake Now</button>
      </div>
      <div className="farming-widget">
        <div className="icon">
          <i className="fas fa-seedling"></i>
        </div>
        <h4>Mine | Farm ERC20s</h4>
        <p>
          Settle hedges and earn a share of the settlement fees, in
          underlying-or-paired currency. Provide hedge liquidity, or protocol
          collateral and earn a share of the farming revenue.
        </p>
        <button>Coming Soon..</button>
      </div>
    </div>
  );
}
