import { Image } from "@chakra-ui/react";
import React from "react";

function BookmarkAdded({ message, status }) {
  return (
    <div
      className={"bg-black text-grey flex flex-col justify-center items-center"}
    >
      <Image
        src={status === "success" ? "/success.webp" : "/fail.webp"}
        alt="failed popup"
        className=""
      />
      <p className="text-lg mt-4">{status}</p>
      <h3 className="text-2xl mt-4">{message}</h3>
    </div>
  );
}

export default BookmarkAdded;
