import { Image } from '@chakra-ui/react';

function ScrollCard() {
  return (
    <div className="flex flex-col gap-6 md:gap-12 lg:py-32 relative mt-10 lg:mt-20 lg:flex-row-reverse md:flex-row justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full md:w-[40%] lg:w-full ">
        <h1 className="text-grey md:text-lg lg:text-xl">{`{ O2 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Go to
          <span className="text-light-purple md:hidden"> Claim</span>
        </h1>
        <h1 className="text-light-purple text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {' '}
          Claim
        </h1>
      </div>
      <div className="w-full lg:px-10 relative">
        <div className="border-2 border-[#6c6c6c] rounded-3xl text-grey p-4">
          <Image
            borderRadius={'md'}
            src="/testnet-table.png"
            // w={"100%"}
            h={'350px'}
            alt="container"
            className="relative "
          />
        </div>
        <div className="  w-full h-full">
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            The claim page will tell you all you need about the test enviroment
            and network.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScrollCard;
