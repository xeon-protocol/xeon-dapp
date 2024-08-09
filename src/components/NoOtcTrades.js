import { Image } from '@chakra-ui/react';

function FailedPopup() {
  return (
    <div
      className={'bg-black text-grey flex flex-col justify-center items-center'}
    >
      <Image src="/fail.webp" alt="failed popup" className="" />
      <p className="text-xl mt-5">No OTC Trades Found</p>
      <p className="mt-5">Nothing to find here...</p>

      <button className="text-white w-[70%] mt-5 px-8 py-2 mr-4  bg-button-gradient rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
        Okay
      </button>
    </div>
  );
}

export default FailedPopup;
