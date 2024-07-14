import React from "react";

function RightBottomWethValue({ value }) {
  return (
    <div className="flex justify-between items-center w-[100%] mb-3">
      <span className="flex items-center">
        <div className="text-5xl font-light text-muted leading-none mr-2">
          {"{"}
        </div>
        <div className="inline-block text-muted text-sm">
          <p>Start</p>
          <p>Value</p>
        </div>
      </span>

      <div>
        <span className="flex items-center">
          <div className="inline-block text-muted">
            <p>{value}</p>
            <p className="text-light-purple">WETH</p>
          </div>
          <div className="text-5xl font-light text-muted leading-none mr-2">
            {"}"}
          </div>
        </span>
      </div>
    </div>
  );
}

export default RightBottomWethValue;
