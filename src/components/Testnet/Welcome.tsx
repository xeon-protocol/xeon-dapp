import Image from "next/image";
import ImageCityScape from "../../assets/imgs/cityscape.svg";
import { IconWETH } from "../reusable/images";
import ImageMoon4 from "../../assets/imgs/moon4.webp";
import ImageCosmicsettled from "../../assets/imgs/cosmicsettled.webp";
import ImageLoanprep from "../../assets/imgs/loanprep.webp";

export default function Welcome() {
  return (
    <>
      <div className="aboutTestnetHold">
        <div className="aboutTestnet">
          <div className="aboutHead">
            <h3>
              <i className="fa fa-bell-o" aria-hidden="true"></i> What to know
              about testing
            </h3>
            <span>
              <br />
              This involves usage of our Dapp to interact with our
              protocol/smart contracts.
              <br />
              All Testnet Versions are listed at the bottom of this page for the
              public to inspect.
              <br />
              Neon Hedge comes with 3 OTC tools: Call Options, Put Options,
              Equity Swaps.
              <br />
              Test Blockchain is Seporlia Testnet.
              <br />
              Install
              <a href="https://metamask.io/" target="_blank">
                MetaMask
              </a>
              on your Browser to use our Dapp.
              <br />
              When done, proceed to below section and claim our mock ERC20
              tokens.
            </span>
          </div>
          <div className="jumpToTestnet">
            <div
              id="buttons"
              className="buttonsHold flex"
              data-aos="zoom-out-down"
              data-aos-delay="100"
            >
              <a
                href="https://neon-hedge.gitbook.io/xeon-protocol-documentation/"
                target="_blank"
                className="btn btn-cta neon-blue"
              >
                Read Manual
                <i className="fa fa-share-square-o" aria-hidden="true"></i>
              </a>
              <a
                href="./guide.html"
                target="_blank"
                className="btn btn-border btn-dext neon-blue"
              >
                Jump to Dapp
                <i className="fa fa-share-square-o" aria-hidden="true"></i>
              </a>
              <a
                href="https://t.me/xeon_protocol"
                target="_blank"
                className="btn btn-border btn-dext neon-blue"
              >
                Telegram Support
                <i className="fa fa-share-square-o" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="aboutCityScape">
          <Image src={ImageCityScape} alt="City scape SVG" />
        </div>
      </div>
      <div className="code-container">
        <input className="sig" value=">_ Team Xeon 💜" onChange={() => {}} />
        <div className="glow-container">
          <div className="augs" data-augmented-ui></div>
        </div>
        <section className="augs backG" data-augmented-ui>
          <button
            className="dots"
            onClick={() => {}}
            title="(click to change) Current Mode: css"
          ></button>
          <input className="title" value="terminal" onChange={() => {}} />
          <div className="code highcontrast-dark">
            <div className="terminalStep">
              <h3 id="testnetGrab">Claim Testnet Tokens</h3>
              <div className="testTokensList">
                <div className="list-section">
                  <li className="trade-item t-i-lead">
                    <div className="token-icon"></div>
                    <div className="token-info">
                      <div className="token-name t-i-heading flex-grow">
                        NAME
                      </div>
                      <div className="token-symbol t-i-heading">SYMB</div>
                      <div className="token-address t-i-heading">ADDR</div>
                      <div className="token-copy"></div>
                      <div className="token-pair t-i-heading">Pair</div>
                    </div>
                    <div className="tokenSupply t-i-heading">Supply</div>
                    <div className="tokenSupply t-i-heading">cta</div>
                  </li>
                  <ul className="trade-list">
                    <li className="trade-item">
                      <div className={`token-icon bg-${ImageLoanprep}`}></div>
                      <div className="token-info">
                        <div className="token-name flex-grow">
                          <a
                            href="https://sepolia.etherscan.io/token/0x461eBee65e95F92db8bb9f0122B57E946D0245Bc"
                            target="_blank"
                          >
                            oVela Exchange
                          </a>
                        </div>
                        <div className="token-symbol">oVELA</div>
                        <div className="token-address text-to-copy">
                          0x461eBee65e95F92db8bb9f0122B57E946D0245Bc
                        </div>
                        <div className="token-copy">
                          <i className="far fa-copy"></i>
                        </div>
                        <div className="token-pair">WETH</div>
                      </div>
                      <div className="tokenSupply">100,000,000</div>
                      <button className="claimBtn" id="claimOne">
                        Claim
                      </button>
                      <button className="returnBtn" id="returnOne">
                        Return
                      </button>
                    </li>

                    <li className="trade-item">
                      <div
                        className={`token-icon bg-${ImageCosmicsettled}`}
                      ></div>
                      <div className="token-info">
                        <div className="token-name flex-grow">
                          <a
                            href="https://sepolia.etherscan.io/token/0x02F992f8F110654869c719bE53a3202F6ab51B08"
                            target="_blank"
                          >
                            oPepe
                          </a>
                        </div>
                        <div className="token-symbol">oPEPE</div>
                        <div className="token-address text-to-copy">
                          0x02F992f8F110654869c719bE53a3202F6ab51B08
                        </div>
                        <div className="token-copy">
                          <i className="far fa-copy"></i>
                        </div>
                        <div className="token-pair">WETH</div>
                      </div>
                      <div className="tokenSupply">100,000,000</div>
                      <button className="claimBtn">Claim</button>
                      <button className="returnBtn">Return</button>
                    </li>

                    <li className="trade-item">
                      <div className={`token-icon bg-${ImageMoon4}`}></div>
                      <div className="token-info">
                        <div className="token-name flex-grow">
                          <a
                            href="https://sepolia.etherscan.io/token/0x71F72c8A8F7e94F16EcD21cEc9f789bD5c50Af35"
                            target="_blank"
                          >
                            oBlockchain Bets
                          </a>
                        </div>
                        <div className="token-symbol">oBCB</div>
                        <div className="token-address text-to-copy">
                          0x71F72c8A8F7e94F16EcD21cEc9f789bD5c50Af35
                        </div>
                        <div className="token-copy">
                          <i className="far fa-copy"></i>
                        </div>
                        <div className="token-pair">WETH</div>
                      </div>
                      <div className="tokenSupply">100,000,000</div>
                      <button className="claimBtn">Claim</button>
                      <button className="returnBtn">Return</button>
                    </li>

                    <li className="trade-item">
                      <div
                        className={`token-icon bg-${ImageCosmicsettled}`}
                      ></div>
                      <div className="token-info">
                        <div className="token-name flex-grow">
                          <a
                            href="https://sepolia.etherscan.io/token/0xf588aE424BD3D78f1172Cf37a5a6D604c1FD141c"
                            target="_blank"
                          >
                            oHarryPotterObamaSonicInu
                          </a>
                        </div>
                        <div className="token-symbol">oBITCOIN</div>
                        <div className="token-address text-to-copy">
                          0xf588aE424BD3D78f1172Cf37a5a6D604c1FD141c
                        </div>
                        <div className="token-copy">
                          <i className="far fa-copy"></i>
                        </div>
                        <div className="token-pair">WETH</div>
                      </div>
                      <div className="tokenSupply">100,000,000</div>
                      <button className="claimBtn">Claim</button>
                      <button className="returnBtn">Return</button>
                    </li>

                    <li className="trade-item">
                      <div className={`token-icon bg-${ImageMoon4}`}></div>
                      <div className="token-info">
                        <div className="token-name flex-grow">
                          <a
                            href="https://sepolia.etherscan.io/token/0x8f2936bEAc38d21c63B21D07E4CBee7E416C565D"
                            target="_blank"
                          >
                            oBanana Gun Bot
                          </a>
                        </div>
                        <div className="token-symbol">oBANANA</div>
                        <div className="token-address text-to-copy">
                          0x8f2936bEAc38d21c63B21D07E4CBee7E416C565D
                        </div>
                        <div className="token-copy">
                          <i className="far fa-copy"></i>
                        </div>
                        <div className="token-pair">WETH</div>
                      </div>
                      <div className="tokenSupply">100,000,000</div>
                      <button className="claimBtn">Claim</button>
                      <button className="returnBtn">Return</button>
                    </li>

                    <li className="trade-item">
                      <div className={`token-icon bg-${IconWETH}`}></div>
                      <div className="token-info">
                        <div className="token-name flex-grow">
                          <a
                            href="https://sepolia.etherscan.io/token/0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
                            target="_blank"
                          >
                            WETH
                          </a>
                        </div>
                        <div className="token-symbol">WETH</div>
                        <div className="token-address text-to-copy">
                          0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
                        </div>
                        <div className="token-copy">
                          <i className="far fa-copy"></i>
                        </div>
                        <div className="token-pair">WETH</div>
                      </div>
                      <div className="tokenSupply">134,000</div>
                      <span>
                        visit{" "}
                        <a
                          href="https://www.alchemy.com/faucets/ethereum-sepolia"
                          target="_blank"
                        >
                          Alchemy Faucet
                        </a>{" "}
                        to Claim ETH
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="testnetTokensCont">
                  <span>
                    <br />
                    We require: Metamask, Sepolia WETH, and Testnet ERC20 tokens
                    to test the platform.
                    <br />
                    Make sure to claim ETH from{" "}
                    <a
                      href="https://www.alchemy.com/faucets/ethereum-sepolia"
                      target="_blank"
                    >
                      Alchemy Faucet
                    </a>
                    , and convert it to WETH on{" "}
                    <a href="https://app.uniswap.org/swap?" target="_blank">
                      Uniswap
                    </a>
                    . Use WETH address provided above on Uniswap.
                    <br />
                    Then deposit WETH to Vault in order to buy trades. You
                    require WETH as all our testnet tokens are paired with WETH.
                    <br />
                    Please note these are mock tokens with no value outside our
                    testnet. Claim above and proceed below.
                  </span>
                </div>
              </div>
            </div>
            <div className="terminalStep">
              <h3 id="testnetUse">Token Use Cases</h3>
              <div className="tokenUseList">
                <li className="useCase">
                  <div className="useCaseDescr case1">
                    <h5>Deposit Tokens</h5>
                    <span>
                      Go to the Cashier under the Wallet page to deposit tokens
                      into the testnet Vault.
                    </span>
                  </div>
                  <div className="useCaseLinks">
                    <img
                      src="./imgs/screenshots/cashier-deposit.webp"
                      alt="cashier deposit screen"
                    />
                    <div className="useCaseLink">
                      <a
                        href="wallet.html"
                        target="_blank"
                        title="Jump to section"
                      >
                        Jump to Cashier
                      </a>
                    </div>
                  </div>
                </li>
                <li className="useCase">
                  <div className="useCaseDescr case2">
                    <h5>Write Hedges</h5>
                    <span>
                      Go to the Silkroad to Hedge the tokens you just deposited.
                      Write a Call Option, Put Option or Equity Swaps using the
                      tokens as underlying asset. Once listed on the Silkroad
                      timeline, speculators can see the Hedge and Buy it OTC.
                      The hedge will only be settled on expiry.
                    </span>
                  </div>
                  <div className="useCaseLinks">
                    <img
                      src="./imgs/screenshots/write-hedge.webp"
                      alt="silkroad write hedges screen"
                    />
                    <div className="useCaseLink">
                      <a
                        href="index.html"
                        target="_blank"
                        title="Jump to section"
                      >
                        Jump to Silkroad
                      </a>
                    </div>
                  </div>
                </li>
                <li className="useCase">
                  <div className="useCaseDescr case3">
                    <h5>Withdraw Tokens</h5>
                    <span>
                      Go to the Cashier under the Wallet page to withdraw tokens
                      from the testnet Vault.
                    </span>
                  </div>
                  <div className="useCaseLinks">
                    <img
                      src="./imgs/screenshots/cashier-withdraw.webp"
                      alt="cashier withdraw screen"
                    />
                    <div className="useCaseLink">
                      <a
                        href="wallet.html"
                        target="_blank"
                        title="Jump to section"
                      >
                        Jump to Cashier
                      </a>
                    </div>
                  </div>
                </li>
              </div>
              <div className="testnetTokensCont">
                <span>
                  Go to our Neon Hedge test platform and use the tokens as
                  stated in our documentation.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
