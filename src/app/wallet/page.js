import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HedgesPanel from "@/components/wallet/HedgesPanel";
import DashboardSection from "@/components/wallet/RewardsPanel";
import StakingPanel from "@/components/wallet/Staking";
import UserAssets from "@/components/wallet/UserAssets";
import VaultBalances from "@/components/wallet/VaultBalances";
import React from "react";

function Page() {
  return (
    <div className="pt-20">
      <Header />
      <UserAssets />
      <VaultBalances />
      <HedgesPanel />
      <DashboardSection />
      <StakingPanel />
      <Footer />
    </div>
  );
}

export default Page;
