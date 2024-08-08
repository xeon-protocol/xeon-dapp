import { Image } from '@chakra-ui/react';

function SocialPopup({ setShowSocial, setShowDiscover }) {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#000000eb] z-[30] fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
      <div className="relative flex justify-center items-center h-full w-full">
        <Image
          src="/Social.webp"
          alt="popup"
          className="absolute z-[1] hidden md:block"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <Image
          src="/pop-up.webp"
          alt="popup"
          className="absolute z-[1]  md:hidden"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div className="absolute z-[2] flex flex-col items-center">
          <p className="text-3xl text-center text-grey">Coming...</p>
          <p className="text-grey w-[50%] lg:w-[50%] md:w-[35%] text-xs md:text-sm lg:text-lg text-center mb-5">
            Social will be introduced later together with AI sentiment trackers
            from other providers.
          </p>
          <p className="text-grey w-[50%]  lg:w-[50%] md:w-[35%] text-xs md:text-lg m-auto text-center">
            It will provide a live feed of opinions on tokens.AI intergration is
            primarily intended to help in advising trades before or during their
            lifespan.
          </p>
          <button
            onClick={() => {
              setShowSocial(false);
              setShowDiscover(true);
            }}
            _hover={{ scale: 1.1 }}
            className="text-white bg-button-gradient px-8 py-2 mt-5 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
            variant="solid"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocialPopup;
