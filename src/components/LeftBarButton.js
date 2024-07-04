"use client";
import { Image } from "@chakra-ui/react";
import React from "react";

function LeftBarButton({ title, handleClick, active }) {
  return (
    <div className="my-8">
      <div className="relative  hover:cursor-pointer" onClick={handleClick}>
        <p
          className={`${
            active ? "text-light-purple" : "text-grey"
          } ml-2 mt-[-10px]
       xl:w-[300px] lg:w-[245px] md:w-[200px] md:text-[16px] lg:text-lg
          hover:cursor-pointer hover:text-light-purple`}
        >
          {title}
        </p>
        <Image
          src={active ? "/btn-active.webp" : "/btn-grey.webp"}
          alt="container"
          className="relative md:mt-[-28px] lg:mt-[-40px]  w-[84%]"
        />
      </div>
    </div>
  );
}

export default LeftBarButton;
