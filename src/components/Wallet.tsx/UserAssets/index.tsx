import Image from "next/image";
import ImagePlayful from "../../../assets/imgs/playful.webp";
import WalletTransact from "./WalletTransact";
import NetWorth from "./NetWorth";

export default function UserAssets() {
  return (
    <div className="netWorthHold border">
      <div className="section-title list-header py-[30px] pr-[20px]">
        <Image src={ImagePlayful} alt="Neon" />
        <h2>User Assets</h2>
      </div>
      <WalletTransact />
      <NetWorth />
    </div>
  );
}
