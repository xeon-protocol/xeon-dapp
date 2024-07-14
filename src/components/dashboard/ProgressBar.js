import { useState, useEffect } from "react";

const ProgressBar = ({ progress }) => {
  const [pillPosition, setPillPosition] = useState(0);

  useEffect(() => {
    setPillPosition(progress);
  }, [progress]);

  return (
    <div className="relative w-full h-8 rounded-full bg-muted">
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
        style={{
          width: `${progress}%`,
          backgroundSize: "30px 30px",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgb(170 121 229) 10px, rgb(170 121 229)  22px)",
        }}
      ></div>
      <div
        className="absolute top-0 transform -translate-x-1/2 w-10 h-7 mt-[2px] ml-[-25px] p-px bg-gradient-to-b from-gray-400 to-transparent rounded-full flex justify-center items-center"
        style={{
          left: `${pillPosition}%`,
          transform:
            pillPosition > 90 ? "translate(-100%, 0)" : "translate(-50%, 0)",
        }}
      >
        <div className="bg-deep-purple text-white rounded-full flex justify-center items-center w-full h-full">
          <span className="text-sm">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
