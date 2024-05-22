export default function TestnetGuide() {
  return (
    <div className="contain">
      <div className="stepHeader">
        Testnet Hitchhiker's Guide...&nbsp; <i className="fa fa-binoculars"></i>
      </div>
      <div className="listItem">
        <div className="itemHeder">
          01.
          <br />
          Intro
        </div>
        <div className="itemContents">
          <div className="illustration illu-intro"></div>
          <p>
            We built an entire protocol from scratch to enable users to deposit
            and create OTC trades using any ERC20 token. Most of the development
            work for Neon Hedge is complete, we will only test, fine tune and
            experiment with monetary concepts that we think can be ground
            breaking. This is where you come in as the community to help in
            manifesting the cause: universal ERC20 hedging and lending.
          </p>
          <p>To test this platform, you need testnet tokens.</p>
        </div>
      </div>
      <div className="listItem">
        <div className="itemHeder">
          02.
          <br />
          Goto Testnet
        </div>
        <div className="itemContents">
          <div className="illu-testnet"></div>
          <p>
            The testnet page will tell you all you need about the test
            enviroment and network.{" "}
            <a href="./testnet.html" target="_blank">
              goto testnet <i className="fa fa-external-link"></i>
            </a>
          </p>
        </div>
      </div>
      <div className="listItem">
        <div className="itemHeder">
          03.
          <br />
          Make a Deposit
        </div>
        <div className="itemContents">
          <div className="illu-deposit"></div>
          <p>
            Now that you have testnet tokens, go to the{" "}
            <a href="./testnet.html" target="_blank">
              wallet <i className="fa fa-external-link"></i>
            </a>{" "}
            page to make a deposit into our protocol.
          </p>
          <p>
            Go to the{" "}
            <a href="./testnet.html" target="_blank">
              silkroad <i className="fa fa-external-link"></i>
            </a>{" "}
            page to begin OTC trading with your deposited ERC20 tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
