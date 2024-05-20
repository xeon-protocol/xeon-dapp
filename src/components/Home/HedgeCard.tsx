import Image from "next/image";
import ImageCallOption from "../../assets/imgs/call-option.svg";
import ImageBookmark from "../../assets/imgs/bookmark_.png";
import ImageUniswap from "../../assets/imgs/erc20-uniswap-tr.png";

export default function HedgeCard() {
  return (
    <div>
      <div className="tl_hedgeCard statemark_ill_wish">
        <div className="tl_hedgeGrid">
          <div className="projectLogo">
            <Image src={ImageUniswap} alt="Uniswap" layout="fill" />
          </div>
          <div className="projectName">
            <div className="transparentTextLoading">
              Vela Exchange
              <a
                className="blockexplorer transparentTextLoading"
                href="https://etherscan.io/address/'`+pairAddress+`"
                target="_blank"
                title="Go to Etherscan"
              >
                0x00..000
              </a>
            </div>
            <div className="tl_bagsize transparentTextLoading">
              --,--,-- VELA
            </div>
          </div>
        </div>
        <div className="valueHold">
          <div className="assetsValue">
            <div className="valueTitle"></div>
            <div className="assetsMarketValue highlightOption transparentTextLoading">
              -- ETH
            </div>
          </div>
          <div className="assetsType">
            <div className="typeTitle">HEDGE</div>
            <div className="assetsTypeValue highlightOption transparentTextLoading">
              Call Option
            </div>
          </div>
        </div>

        <div className="strategyContainer">
          <div className="optionMarksHold">
            <div className="optionMark">
              <span>Strike:</span>
              <span className="oMfigure transparentTextLoading">--,-- eth</span>
            </div>
            <div className="optionMark">
              <span>Premium:</span>
              <span className="oMfigure transparentTextLoading">--,-- eth</span>
            </div>
            <div className="optionMark">
              <span>Expires:</span>
              <span className="oMfigure transparentTextLoading">-- days</span>
            </div>
          </div>
          <div className="strategyHold">
            <Image className="strategyImage" src={ImageCallOption} alt="" />
            <div className="strategyDataHold">
              <div className="topValue-call topValue-call-preload">
                profit zone
              </div>
              <div className="bottomValue-call">max loss</div>
            </div>
          </div>
        </div>
        <div className="optionSummary">
          <div className="option_S_tab _bullbear">
            <span className="status-dot inprogress transparentTextLoading">
              <svg
                stroke="currentColor"
                fill="#188dd6"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="8"></circle>
              </svg>
              <span className="whitespace-nowrap">Vacant</span>
            </span>
          </div>
          <div
            id='"+optionId+"buyButton'
            className="option_S_tab actionButton buyButton transparentTextLoading"
          >
            Buy Option
          </div>
          <div className="option_S_tab _bookmarkjump">
            <a
              className="view_project"
              href=""
              target="_blank"
              title="full details"
            >
              view
            </a>
            <div className="raise_S_tab _bookmarkjump">
              <Image src={ImageBookmark} width={18} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
