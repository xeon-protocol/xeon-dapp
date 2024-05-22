import SectionH1 from "@/components/reusable/SectionH1";
import TrafficSection from "./TrafficSection";
import TrafficStats from "./TrafficStats";

export default function ProtocolTraffic() {
  return (
    <div className="main-traffic-section">
      <SectionH1>Protocol Traffic</SectionH1>
      <TrafficSection />
      <TrafficStats />
    </div>
  );
}
