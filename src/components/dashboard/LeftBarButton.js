"use client";
import { Image } from "@chakra-ui/react";
import React from "react";

function LeftBarButton({ title, handleClick }) {
  return (
    <div className="my-8">
      {" "}
      <div className="relative ">
        <p
          onClick={handleClick}
          className="text-grey ml-2 mt-[-10px]
       xl:w-[300px] lg:w-[245px]
          hover:cursor-pointer"
        >
          {title}
        </p>
        <Image
          src="/btn-line.webp"
          alt="container"
          className="relative mt-[-12px]  xl:w-[280px] lg:w-[245px]"
        />
        <Image
          src="/icon.webp"
          alt="container"
          className="absolute top-[-10px] right-16"
        />
      </div>
    </div>
  );
}

export default LeftBarButton;
