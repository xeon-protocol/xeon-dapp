import React from "react";

function RightBarCard({ title, amount, number }) {
  return (
    <div className="my-2">
      <div className="rounded-xl p-2 boder-[#1F1F1F]  lg:ml-8 border-[1px]">
        <div className="flex justify-between items-center text-sm">
          <p>{`{ ${title} }`}</p>
          <p>{`{ ${number} }`}</p>
        </div>
        <p className="text-light-purple text-lg">${amount}</p>
      </div>
    </div>
  );
}

export default RightBarCard;
