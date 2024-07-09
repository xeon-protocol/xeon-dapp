import Header from "@/components/Header";
import HedgesPanel from "@/components/wallet/HedgesPanel";
import UserAssets from "@/components/wallet/UserAssets";
import VaultBalances from "@/components/wallet/VaultBalances";
import React from "react";

function Page() {
  return (
    <div className="py-20">
      <Header />
      <UserAssets />
      <VaultBalances />
      <HedgesPanel />
    </div>
  );
}

export default Page;
