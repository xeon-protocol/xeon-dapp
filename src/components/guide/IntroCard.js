import lottieJson2 from '@/assets/animations/PE1.json';
import { Image } from '@chakra-ui/react';
import Lottie from 'react-lottie-player';
function ScrollCard() {
  return (
    <div className="flex flex-col md:gap-12 relative md:flex-row lg:pt-32 justify-between items-center px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="md:w-[40%] lg:w-full w-full lg:pl-16">
        <h1 className="text-floral md:text-lg lg:text-xl">{`{ O1 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">Intro</h1>
      </div>
      <div className="w-full relative">
        <Lottie
          className="w-[40%] md:absolute top-[-40px] left-[-29%] hidden lg:block"
          loop
          animationData={lottieJson2}
          play
        />
        <div className="md:absolute top-16 md:left-[30px] w-full h-full">
          <p className="text-grey text-lg mt-5 md:text-justify md:w-[90%] lg:w-[85%]">
            We built an entire protocol from scratch to enable users to deposit
            and create OTC trades using any ERC20 token. Most of the development
            work for Neon Hedge is complete, we will only test, fine tune and
            experiment with monetary concepts that we think can be ground
            breaking. This is where you come in as the community to help in
            manifesting the cause: universal ERC20 hedging and lending. To test
            this platform, you need testnet tokens.
          </p>
        </div>
        <Image
          src="/card-109.svg"
          // w={"100%"}
          h={'350px'}
          alt="container"
          className="relative hidden md:block lg:ml-[-20px]"
        />
      </div>
    </div>
  );
}

export default ScrollCard;
