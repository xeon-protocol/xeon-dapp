import { Image } from "@chakra-ui/react";
import React from "react";

function NoEvents() {
  return (
    <div className="flex flex-col items-center relative">
      <div className="absolute bottom-0 top-32 left-0 right-0 flex flex-col items-center justify-between">
        <div className="text-center">
          <p className="text-3xl text-grey">Coming Soon...</p>
          <p className="text-grey w-[70%] m-auto">
            {" "}
            Neon Lend is currently under development. Coming Soon...
          </p>
        </div>
        <Image src="/animation.webp" alt="no events" />
      </div>
      <Image src="/dotted.webp" alt="no events" />
    </div>
  );
}

export default NoEvents;
