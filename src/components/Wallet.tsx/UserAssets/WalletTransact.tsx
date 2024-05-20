export default function WalletTransact() {
  return (
    <div className="walletTransact">
      <form id="cashierForm">
        <div className="form-group">
          <label
            className="switch"
            title="default mode: Deposit, click to switch to Withdraw"
          >
            <input type="checkbox" />
            <span className="slider round"></span>
            <span className="mode">Vault Cashier: Deposit Mode</span>
          </label>
          <div className="input-group">
            <span id="addressData">
              **** &nbsp;
              <i className="fa fa-binoculars" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              className="erc20-address-input"
              id="erc20-address"
              name="erc20-address"
              placeholder="Paste address..."
            />
            <span className="or">OR</span>
            <select id="erc20-select" name="erc20-select">
              <option value="">Select token...</option>
              <option value="erc20-1">ERC20-1</option>
              <option value="erc20-2">ERC20-2</option>
              <option value="erc20-3">ERC20-3</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <span id="walletData">
            <span id="inWalletBalance">0,00</span> &nbsp;
            <i className="fa fa-wallet" aria-hidden="true"></i>
          </span>
          <input
            type="number"
            className="transact-amount"
            id="erc20-amount"
            name="erc20-amount"
            placeholder="Amount..."
            step="any"
          />
          <div id="balancesSection" className="hidden">
            <div id="expandClose" className="expand-button">
              <i className="fa fa-expand" aria-hidden="true"></i>
            </div>
            <div className="balgrid">
              <strong>Deposited:</strong>{" "}
              <span
                className="cashier-text-value is-loading-bal"
                id="depositedBalance"
              >
                0
              </span>
            </div>
            <div className="balgrid">
              <strong>Withdrawn:</strong>{" "}
              <span
                className="cashier-text-value is-loading-bal"
                id="withdrawnBalance"
              >
                0
              </span>
            </div>
            <div className="balgrid">
              <strong>Locked:</strong>{" "}
              <span
                className="cashier-text-value is-loading-bal"
                id="lockedInUseBalance"
              >
                0
              </span>
            </div>
            <div className="balgrid">
              <strong>Withdrawable:</strong>{" "}
              <span
                className="cashier-text-value is-loading-bal"
                id="withdrawableBalance"
              >
                0
              </span>
            </div>
          </div>
        </div>
        <button type="submit" id="transactSubmit">
          Submit
        </button>
      </form>
    </div>
  );
}
