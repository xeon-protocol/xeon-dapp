import TokenInformation from "@/components/Analytics/TokenInformation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UnderConstruction from "@/components/UnderConstruction";
import React from "react";

function Page() {
  return (
    <div className="pt-20">
      <Header />
      <UnderConstruction />
      <TokenInformation />
      <Footer />
    </div>
  );
}

export default Page;
