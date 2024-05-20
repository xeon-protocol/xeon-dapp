import UserAssets from "@/components/Wallet.tsx/UserAssets";
import VaultBalances from "@/components/Wallet.tsx/VaultBalances";

export default function Wallet() {
  return (
    <div>
      <UserAssets />
      <VaultBalances />
    </div>
  );
}
