export default function Intro() {
  return (
    <div className="contain">
      <main>
        <h1 className="dappWelcome neon-blue">Dapp Guide</h1>
        <span data-aos="zoom-out-down" data-aos-delay="100">
          Learn how to nagivate – Equity Swaps, Call Options, Put Options,
          Crypto Lending.
        </span>

        <div className="dappInformer">
          <i className="fa fa-fire" aria-hidden="true"></i> start...
          <br />
          This is the user guide page for the current testnet. Note: this
          protocol is developed recursively. Features will be altered with each
          testnet release. Scroll down to learn how to navigate our protocol and
          dApp.
        </div>
        <div id="developmentStatus">
          <div className="devstatus">
            <p>
              This testnet introduces
              <a
                href="https://docs.neonprotocol.io"
                target="_blank"
                title="ERC20 Swaps, Call, Put Options"
              >
                Neon Hedge
              </a>
              Platform to the Ecosystem.
            </p>
          </div>

          <div className="dappInformer">
            <small>Learn more about our Ecosystem here..</small>
            <br />
            <div className="dappInformer">
              <a href="https://xeon-protocol.io/ecosystem" target="_blank">
                Neon Hedge
              </a>
            </div>
            <div className="dappInformer">
              <a href="https://xeon-protocol.io/ecosystem" target="_blank">
                Neon Lend
              </a>
            </div>
            <div className="dappInformer">
              <a href="https://xeon-protocol.io/ecosystem" target="_blank">
                Neon Farm
              </a>
            </div>
          </div>
        </div>
        <div id="ecosystemContainer">
          <img id="border" src="https://image.ibb.co/gFxj6F/border.png" />
          <div id="ecosystemWelcome">
            <p id="firstSentence">
              Xeon Protocol's Ecosystem
              <br /> Comprises <span id="universe">3 OTC Platforms</span>
            </p>
            <p id="lastSentence">
              Click on the <span id="sun">sun</span> to get started
            </p>
          </div>
          <div id="ecoContent">
            <h2 id="ecoContentTitle"></h2>
            <p id="subtitle"></p>
            <p id="description"></p>
          </div>
        </div>
      </main>
    </div>
  );
}
