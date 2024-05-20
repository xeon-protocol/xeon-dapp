import Image from "next/image";
import ImageMoon from "../../../assets/imgs/moon5.webp";

export default function NetWorth() {
  return (
    <div className="nw-rectangle">
      <span className="nEdge"></span>
      <span className="nEdge"></span>
      <span className="nEdge"></span>
      <span className="nEdge"></span>
      <div className="userFundsCont">
        <div className="nw-right">
          <div className="nw-text nwtextFirst">
            <div className="nw-text-title nwPrimary-ttitle flex items-center">
              <Image src={ImageMoon} alt="net worth of all assets" />
              Net Worth
            </div>
          </div>
          <div className="nw-text nwtextFirst">
            <div
              id="netWorthUSD"
              className="nw-text-value is-loading nwPrimary-ttitle"
            >
              $ --.--
            </div>
          </div>
          <div className="nw-text">
            <span className="nw-text-title">
              <i
                className="fa fa-info-circle"
                aria-hidden="true"
                title="net value of user tokens currently deposited into protocol: in base"
              ></i>
              Deposits
            </span>
            <span id="netDepositsUSD" className="nw-text-value is-loading">
              $ --.--
            </span>
          </div>
          <div className="nw-text">
            <span className="nw-text-title">
              <i
                className="fa fa-info-circle"
                aria-hidden="true"
                title="net rewards due from staking XEON tokens on our protocol."
              ></i>
              Dividents
            </span>
            <span id="netRewardsUSD" className="nw-text-value is-loading">
              $ --.--
            </span>
          </div>
          <div className="nw-text">
            <span className="nw-text-title">
              <i
                className="fa fa-info-circle"
                aria-hidden="true"
                title="net earnings from providing native swap liquidity and settling hedges or loans."
              ></i>
              Commission
            </span>
            <span id="netCommissionUSD" className="nw-text-value is-loading">
              $ --.--
            </span>
          </div>
          <div className="nw-text">
            <span className="nw-text-title">
              <i
                className="fa fa-info-circle"
                aria-hidden="true"
                title="value of XEON tokens in wallet"
              ></i>
              XEON
            </span>
            <span id="walletBalanceUSD" className="nw-text-value is-loading">
              $ --.--
            </span>
          </div>
        </div>

        <div className="userWalletCont">
          <div className="user-card">
            <div className="icon">
              <i className="fa-solid fa-user-astronaut"></i>
            </div>
          </div>
          <div id="walletAddress" className="userWallet">
            0X000...0000
          </div>
          <div className="nw-left">
            <div className="walletStates">
              <div className="walletStatesDiv">
                <span className="dot dot_idle"></span>staked
                <a href="#jump-to-section" className="walletStateLink">
                  <i className="fa fa-link" aria-hidden="true"></i>
                </a>
                <div className="volume-widget">
                  <div className="volume-bars vertical">
                    <div className="volume-bar red"></div>
                    <div className="volume-bar blue"></div>
                    <div className="volume-bar green"></div>
                  </div>
                  <div
                    id="stakedBalance"
                    className="volume-count is-loading value-green"
                  >
                    ****
                  </div>
                </div>
              </div>

              <div className="walletStatesDiv">
                <span className="dot dot_idle"></span>wallet
                <a href="#jump-to-section" className="walletStateLink">
                  <i className="fa fa-link" aria-hidden="true"></i>
                </a>
                <div className="volume-widget">
                  <div className="volume-bars horizontal">
                    <div className="volume-bar red"></div>
                    <div className="volume-bar blue"></div>
                    <div className="volume-bar green"></div>
                  </div>
                  <div
                    id="walletBalance"
                    className="volume-count is-loading value-green"
                  >
                    ****
                  </div>
                </div>
              </div>

              <div className="walletStatesDiv">
                <span className="dot dot_idle"></span>airdrop
                <a href="#jump-to-section" className="walletStateLink">
                  <i className="fa fa-link" aria-hidden="true"></i>
                </a>
                <div className="volume-widget">
                  <div className="volume-bars rain">
                    <div className="volume-bar red"></div>
                    <div className="volume-bar blue"></div>
                    <div className="volume-bar green"></div>
                  </div>
                  <div className="volume-count is-loading value-green">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
