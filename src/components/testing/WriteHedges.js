import { Image } from '@chakra-ui/react';
function ScrollCard() {
  return (
    <div className="flex flex-col gap-6 md:gap-12 lg:gap-0 lg:pb-20 md:pl-32 relative md:flex-row-reverse justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full md:w-[40%] lg:w-full lg:pl-16">
        <h3 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Write Hedges
        </h3>
        <h3 className="text-lime mt-5 md:w-[80%]">
          Go to the Silkroad to Hedge the tokens you just deposited. Write a
          Call Option, Put Option or Equity Swaps using the tokens as underlying
          asset. Once listed on the Silkroad timeline, speculators can see the
          Hedge and Buy it OTC. The hedge will only be settled on expiry.
        </h3>
      </div>
      <div className="w-[100%] relative">
        <div className=" top-16 md:left-[30px] w-full h-full">
          <Image
            borderRadius={'md'}
            src="write-hedges.png"
            alt="container"
            className="relative lg:ml-[-20px] md:w-[87%] lg:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default ScrollCard;
