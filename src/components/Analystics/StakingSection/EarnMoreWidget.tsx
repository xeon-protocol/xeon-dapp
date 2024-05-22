export default function EarnMoreWidget() {
  return (
    <div className="earnMoreWidget-rewards">
      <div className="staking-widget-rewards">
        <div className="icon">
          <i className="fas fa-coins"></i>
        </div>
        <h4>Stake to Claim</h4>
        <p>
          Only stakers can claim a share of the protocol revenue / dividents.
          <a href="#jump-to-section" className="walletStateLink">
            <text text-anchor="middle" className="text-[#188dd6]">
              learn... <i className="fa fa-link" aria-hidden="true"></i>
            </text>
          </a>
        </p>
      </div>
      <div className="staking-widget-rewards">
        <div className="icon">
          <i className="fas fa-hammer"></i>
        </div>
        <h4>Stake to Mine</h4>
        <p>
          Only stakers are eligible to mine hedges & claim settlement revenue.
          <a href="#jump-to-section" className="walletStateLink">
            <text text-anchor="middle" className="text-[#188dd6]">
              learn... <i className="fa fa-link" aria-hidden="true"></i>
            </text>
          </a>
        </p>
      </div>
      <div className="staking-widget-rewards">
        <div className="icon">
          <i className="fas fa-diamond"></i>
        </div>
        <h4>Stake to Farm</h4>
        <p>
          Native tokens are used by to provide Native Hedge Liquidity.
          <a href="#jump-to-section" className="walletStateLink">
            <text text-anchor="middle" className="text-[#188dd6]">
              learn... <i className="fa fa-link" aria-hidden="true"></i>
            </text>
          </a>
        </p>
      </div>
    </div>
  );
}
