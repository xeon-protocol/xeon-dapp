import SectionH1 from "@/components/reusable/SectionH1";
import TrafficSection from "./TrafficSection";
import HedgingStats from "./HedgingStats";

export default function HedgesSection() {
  return (
    <div className="main-traffic-section">
      <div className="section-title pt-[30px] px-[20px]">
        <SectionH1>Hedges Section</SectionH1>
        <TrafficSection />
        <HedgingStats />
      </div>
    </div>
  );
}
