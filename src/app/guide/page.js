'use client';
import lottieJson from '@/assets/animations/PE2.json';
import lottieJson2 from '@/assets/animations/planet_orbit1.json';
import Footer from '@/components/Footer';
import Deposit from '@/components/guide/Deposit';
import HowItWorks from '@/components/guide/HowItWorks';
import ScrollCard from '@/components/guide/IntroCard';
import TestNetCard from '@/components/guide/Testnet';
import UseCases from '@/components/guide/UseCases';
import WhyOTC from '@/components/guide/WhyOTC';
import Header from '@/components/Header';
import { Image } from '@chakra-ui/react';
import Lottie from 'react-lottie-player';
function Page() {
  return (
    <>
      <div className="bg-[#000] lg:min-h-[100vh] 2xl:min-h-[50vh] px-8 pt-8 max-w-screen-2xl mx-auto relative">
        <Header />
        <div className="flex flex-col md:gap-12 md:flex-row justify-between 2xl:mt-[20%] mt-[18%]">
          <div className="md:w-[40%] lg:w-auto md:px-0 lg:px-18 flex items-center md:block">
            <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">Dapp</h1>
            <h1 className="text-floral text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10">
              Guide
            </h1>

            <Image
              src="/dotted.webp"
              alt="container"
              className="md:absolute top-[10%] w-[40%] left-[-10%] hidden lg:block"
            />
            <Lottie
              className="w-[40%] md:absolute top-[-55px] 2xl:right-[47%] right-[46%] hidden lg:block"
              loop
              animationData={lottieJson}
              play
            />
            <Lottie
              className="w-[40%] md:absolute bottom-[-55px] 2xl:bottom-[35%] right-[56%] hidden opacity-10 lg:block"
              loop
              animationData={lottieJson2}
              play
            />
          </div>
          <div className="relative">
            <p className="text-grey text-lg w-[85%] my-4">
              Learn how to nagivate – Equity Swaps, Call Options, Put Options,
              Crypto Lending.
            </p>
            <div className="md:absolute md:top-32 lg:top-28 md:left-[30px] lg:left-5 w-full h-full">
              <p className="text-grey md:text-justify text-lg mt-5 md:w-[80%]">
                This is the user guide page for the current testnet. Note: this
                protocol is developed recursively. Features will be altered with
                each testnet release. Scroll down to learn how to navigate our
                protocol and dApp.
              </p>
            </div>
            <Image
              src="/card-109.svg"
              // w={"100%"}
              h={{
                base: '150px',
                md: '200px',
                lg: '155px',
              }}
              alt="container"
              className="relative hidden md:block ml-[-20px]"
            />
            <div className="flex md:mt-40 mt-5 gap-4 ml-[-20px] md:ml-[-30px] px-5 md:flex-row md:justify-start lg:flex-row lg:justify-start lg:gap-x-4 md:mt-5 2xl:justify-evenly  2xl:ml-[-100px]">
              <a
                href="https://xeon-protocol.io/ecosystem"
                className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey"
              >
                Neon Hedge
              </a>
              <a
                href="https://xeon-protocol.io/ecosystem"
                className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey"
              >
                Neon Lend
              </a>
              <a
                href="https://xeon-protocol.io/ecosystem"
                className="border-2 p-1 md:p-2 border-dashed border-light-purple rounded-md text-grey"
              >
                Neon Farm
              </a>
            </div>
            <div>
              <p className="text-grey md:text-lg mt-5">{`{  This testnet introduces Neon Hedge Platform to the
            Ecosystem  }`}</p>
            </div>
          </div>
        </div>
      </div>
      <ScrollCard />
      <TestNetCard />
      <Deposit />
      <UseCases />
      <HowItWorks />
      <WhyOTC />
      <Footer />
    </>
  );
}

export default Page;
