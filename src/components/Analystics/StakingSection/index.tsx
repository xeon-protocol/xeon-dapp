import SectionH1 from "@/components/reusable/SectionH1";
import EarnMoreWidget from "./EarnMoreWidget";
import TrafficStats from "./TrafficStats";
import StakeAssignmentPools from "./StakeAssignmentPools";

export default function StakingSection() {
  return (
    <div className="main-traffic-section">
      <SectionH1>Staking Section</SectionH1>
      <EarnMoreWidget />
      <TrafficStats />
      <StakeAssignmentPools />
    </div>
  );
}
