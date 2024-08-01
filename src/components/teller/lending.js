import React from "react";

const LendingForm = () => {
  return (
    <div className="px-3 sm:p-10">
      <div className="flex flex-col items-center mb-3 text-white gap-3 sm:mb-5">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-row w-full justify-between  items-center space-x-1">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">Total Amount</label>
                <div
                  className="tooltip-container"
                  data-tip="The maximum amount that can be lent from your wallet. Funds will remain in your wallet until a borrower accepts the lending offer. The same capital can be used for multiple offers."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="h-4 w-5 my-auto"
                    width="1em"
                    height="1em"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="currentColor"
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M464 336a48 48 0 1 0 96 0a48 48 0 1 0-96 0m72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="text-right text-gray-500 !text-white">
                Max: 0 USDC
              </div>
            </div>
          </div>
          <div className="border border-gray-600 z-10 flex rounded bg-black border-grey">
            <div className="flex items-center flex-1 leading-4">
              <input
                type="text"
                className="focus:outline-none w-full px-4 py-3 bg-transparent"
                placeholder="0"
                required
                pattern="^[0-9]*[.,]?[0-9]*$"
                inputMode="decimal"
                autoComplete="off"
                spellCheck="false"
              />
              <button className="px-2 mr-2 h-5 text-sm bg-button-gradient hover:bg-blue-700 text-white rounded">
                MAX
              </button>
            </div>
            <div className="flex items-center px-3 gap-2 border-l border-gray-600">
              <div className="w-4 h-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className="w-4 h-4"
                  viewBox="0 0 32 32"
                >
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#3E73C4"></circle>
                    <g fill="#FFF">
                      <path d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156c-1.828-.243-2.193-.728-2.193-1.578c0-.85.61-1.396 1.828-1.396c1.097 0 1.707.364 2.011 1.275a.458.458 0 0 0 .427.303h.975a.416.416 0 0 0 .427-.425v-.06a3.04 3.04 0 0 0-2.743-2.489V9.142c0-.243-.183-.425-.487-.486h-.915c-.243 0-.426.182-.487.486v1.396c-1.829.242-2.986 1.456-2.986 2.974c0 2.002 1.218 2.791 3.778 3.095c1.707.303 2.255.668 2.255 1.639c0 .97-.853 1.638-2.011 1.638c-1.585 0-2.133-.667-2.316-1.578c-.06-.242-.244-.364-.427-.364h-1.036a.416.416 0 0 0-.426.425v.06c.243 1.518 1.219 2.61 3.23 2.914v1.457c0 .242.183.425.487.485h.915c.243 0 .426-.182.487-.485V21.34c1.829-.303 3.047-1.578 3.047-3.217z"></path>
                      <path d="M12.892 24.497c-4.754-1.7-7.192-6.98-5.424-11.653c.914-2.55 2.925-4.491 5.424-5.402c.244-.121.365-.303.365-.607v-.85c0-.242-.121-.424-.365-.485c-.061 0-.183 0-.244.06a10.895 10.895 0 0 0-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102c.244.121.488 0 .548-.243c.061-.06.061-.122.061-.243v-.85c0-.182-.182-.424-.365-.546m6.46-18.936c-.244-.122-.488 0-.548.242c-.061.061-.061.122-.061.243v.85c0 .243.182.485.365.607c4.754 1.7 7.192 6.98 5.424 11.653c-.914 2.55-2.925 4.491-5.424 5.402c-.244.121-.365.303-.365.607v.85c0 .242.121.424.365.485c.061 0 .183 0 .244-.06a10.895 10.895 0 0 0 7.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162"></path>
                    </g>
                  </g>
                </svg>
              </div>
              USDC
            </div>
          </div>
        </div>

        {/* USDC per XEON Section */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center space-x-1">
              <div>
                <label className="text-gray-400">USDC per XEON</label>
              </div>
              <div
                className="tooltip-container"
                data-tip="The amount of lending token per 1 collateral token. This is also known as the Loan-to-Value (LTV) ratio."
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className="h-4 w-5 my-auto"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="currentColor"
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M464 336a48 48 0 1 0 96 0a48 48 0 1 0-96 0m72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="border border-gray-600 z-10 flex rounded bg-black border-grey">
            <div className="flex items-center flex-1 leading-4">
              <input
                type="text"
                className="focus:outline-none w-full px-4 py-3 bg-transparent"
                placeholder="0"
                required
                pattern="^[0-9]*[.,]?[0-9]*$"
                inputMode="decimal"
                autoComplete="off"
                spellCheck="false"
              />
              <button className="px-2 mr-2 h-5 text-sm bg-button-gradient hover:bg-blue-700 text-white rounded">
                MAX
              </button>
            </div>
            <div className="flex items-center px-3 gap-2 border-l border-gray-600">
              <div className="w-4 h-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className="w-4 h-4"
                  viewBox="0 0 32 32"
                >
                  <g fill="none">
                    <circle cx="16" cy="16" r="16" fill="#3E73C4"></circle>
                    <g fill="#FFF">
                      <path d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156c-1.828-.243-2.193-.728-2.193-1.578c0-.85.61-1.396 1.828-1.396c1.097 0 1.707.364 2.011 1.275a.458.458 0 0 0 .427.303h.975a.416.416 0 0 0 .427-.425v-.06a3.04 3.04 0 0 0-2.743-2.489V9.142c0-.243-.183-.425-.487-.486h-.915c-.243 0-.426.182-.487.486v1.396c-1.829.242-2.986 1.456-2.986 2.974c0 2.002 1.218 2.791 3.778 3.095c1.707.303 2.255.668 2.255 1.639c0 .97-.853 1.638-2.011 1.638c-1.585 0-2.133-.667-2.316-1.578c-.06-.242-.244-.364-.427-.364h-1.036a.416.416 0 0 0-.426.425v.06c.243 1.518 1.219 2.61 3.23 2.914v1.457c0 .242.183.425.487.485h.915c.243 0 .426-.182.487-.485V21.34c1.829-.303 3.047-1.578 3.047-3.217z"></path>
                      <path d="M12.892 24.497c-4.754-1.7-7.192-6.98-5.424-11.653c.914-2.55 2.925-4.491 5.424-5.402c.244-.121.365-.303.365-.607v-.85c0-.242-.121-.424-.365-.485c-.061 0-.183 0-.244.06a10.895 10.895 0 0 0-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102c.244.121.488 0 .548-.243c.061-.06.061-.122.061-.243v-.85c0-.182-.182-.424-.365-.546m6.46-18.936c-.244-.122-.488 0-.548.242c-.061.061-.061.122-.061.243v.85c0 .243.182.485.365.607c4.754 1.7 7.192 6.98 5.424 11.653c-.914 2.55-2.925 4.491-5.424 5.402c-.244.121-.365.303-.365.607v.85c0 .242.121.424.365.485c.061 0 .183 0 .244-.06a10.895 10.895 0 0 0 7.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162"></path>
                    </g>
                  </g>
                </svg>
              </div>
              USDC
            </div>
          </div>
        </div>

        {/* Loan Duration Section */}
        <div className="flex-1 w-full">
          <div className="flex gap-2 align-center">
            <div className="duration w-full">
              <div className="flex flex-row items-center space-x-1">
                <div>
                  <label className="text-gray-400">Loan Duration</label>
                </div>
                <div
                  className="tooltip-container"
                  data-tip="The loan duration is the time the borrower has to repay the loan plus interest."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="h-4 w-5 my-auto"
                    width="1em"
                    height="1em"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="currentColor"
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M464 336a48 48 0 1 0 96 0a48 48 0 1 0-96 0m72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8"
                    ></path>
                  </svg>
                </div>
              </div>
              <select className="bg-black border-grey text-white border border-gray-600 rounded px-4 py-3">
                <option value="12 hours">12 hours</option>
                <option value="1 day">1 day</option>
                <option value="3 days">3 days</option>
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
                <option value="120 days">120 days</option>
              </select>
            </div>
            <div className="expiration w-full">
              <div className="flex flex-row items-center space-x-1">
                <div>
                  <label className="text-gray-400">Expiration</label>
                </div>
                <div
                  className="tooltip-container"
                  data-tip="After the expiration time, the lending offer will no longer be available for borrowers."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="h-4 w-5 my-auto"
                    width="1em"
                    height="1em"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="currentColor"
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M464 336a48 48 0 1 0 96 0a48 48 0 1 0-96 0m72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8"
                    ></path>
                  </svg>
                </div>
              </div>
              <select className="bg-black border-grey text-white border border-gray-600 rounded px-4 py-3">
                <option value="12 hours">12 hours</option>
                <option value="1 day">1 day</option>
                <option value="3 days">3 days</option>
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
                <option value="120 days">120 days</option>
              </select>
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex flex-row items-center space-x-1">
                  <div>
                    <label className="text-gray-400">APY</label>
                  </div>
                </div>
              </div>
              <div className="border border-gray-600 z-10 flex rounded bg-black border-grey">
                <div className="flex items-center flex-1 leading-4">
                  <input
                    type="text"
                    className="focus:outline-none w-full px-4 py-3 bg-transparent"
                    placeholder="0"
                    required
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                <div className="flex items-center px-3 gap-2 border-l border-gray-600">
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center mt-6">
        <button className="px-5 py-2 bg-button-gradient w-full hover:bg-blue-700 text-white rounded">
          Create Offer
        </button>
      </div>
    </div>
  );
};

export default LendingForm;
