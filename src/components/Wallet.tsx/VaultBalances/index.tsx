import Image from "next/image";
import ImagePlayful from "../../../assets/imgs/playful.webp";
import TradeList from "./TradeList";
import EarnMoreWidget from "./EarnMoreWidget";
import HedgePanel from "./HedgePanel";
import RwardsPanel from "./RwardsPanel";
import StakingPanel from "./StakingPanel";

export default function VaultBalances() {
  return (
    <div className="list-section">
      <div className="section-title list-header">
        <Image src={ImagePlayful} alt="Neon" />
        <h2>Vault Balances</h2>
        <div className="tokenHistory">
          <span>tokens:</span>
          <span id="tokensCount"></span>
        </div>
      </div>
      <TradeList />
      <EarnMoreWidget />
      <HedgePanel />
      <RwardsPanel />
      <StakingPanel />
    </div>
  );
}
