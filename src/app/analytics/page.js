import TokenInformation from "@/components/Analytics/TokenInformation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

function Page() {
  return (
    <div className="pt-20">
      <Header />
      <TokenInformation />
      <Footer />
    </div>
  );
}

export default Page;
