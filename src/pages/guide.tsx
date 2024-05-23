import Benefits from "@/components/Guide/Benefits";
import Intro from "@/components/Guide/Intro";
import OTC from "@/components/Guide/OTC";
import TestnetGuide from "@/components/Guide/TestnetGuide";

export default function Guide() {
  return (
    <>
      <Intro />
      <TestnetGuide />
      <Benefits />
      <OTC />
    </>
  );
}
