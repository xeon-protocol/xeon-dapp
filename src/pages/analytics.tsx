import HedgesSection from "@/components/Analystics/HedgesSection";
import ProtocolEarnings from "@/components/Analystics/ProtocolEarnings";
import ProtocolTraffic from "@/components/Analystics/ProtocolTraffic";
import StakingSection from "@/components/Analystics/StakingSection";
import TokenInformation from "@/components/Analystics/TokenInformation";

export default function Analytics() {
  return (
    <div>
      <section id="analytics-section-traffic" className="analytics-section">
        <ProtocolTraffic />
      </section>
      <section id="analytics-section-traffic" className="analytics-section">
        <HedgesSection />
      </section>
      <section id="analytics-section-traffic" className="analytics-section">
        <ProtocolEarnings />
      </section>
      <section id="analytics-section-traffic" className="analytics-section">
        <StakingSection />
      </section>
      <section id="analytics-section-traffic" className="analytics-section">
        <TokenInformation />
      </section>
    </div>
  );
}
