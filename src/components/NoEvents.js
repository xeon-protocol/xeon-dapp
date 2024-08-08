import lottieJson from '@/assets/animations/PE5.json';
import { Image } from '@chakra-ui/react';
import { useRef } from 'react';
import Lottie from 'react-lottie-player';

function NoEvents() {
  const animationContainer = useRef(null);

  return (
    <div className="flex flex-col items-center relative">
      <div className="absolute bottom-0 md:top-32 left-0 right-0 flex flex-col items-center">
        <div className="text-center">
          <p className="text-3xl text-grey">No Events Found</p>
          <p className="text-grey w-[70%] m-auto">
            Write or Buy OTC hedges to populate this area...
          </p>
        </div>
        <Lottie
          className="w-[50%] absolute bottom-[-38px]"
          loop
          animationData={lottieJson}
          play
        />
      </div>
      <Image src="/dotted.webp" alt="no events" />
    </div>
  );
}

export default NoEvents;
