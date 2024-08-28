"use client";
import Card from "@/components/Card";
import CenterNav from "@/components/CenterNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import NoEvents from "@/components/NoEvents";
import SocialPopup from "@/components/SocialPopup";
import React from "react";

import Loans from "@/components/Loans";

export default function Home() {
  const [showPositions, setShowPositions] = React.useState(false);
  const [showDiscover, setShowDiscover] = React.useState(true);
  const [showBookmarks, setShowBookmarks] = React.useState(false);
  const [showSocials, setShowSocials] = React.useState(false);
  const [showComingSoon, setShowComingSoon] = React.useState(false);
  const [activeSideTab, setActiveSideTab] = React.useState("");
  const [activeSection, setActiveSection] = React.useState("discover");
  const [chainId, setChainId] = React.useState(1);
  const [selectedToken, setSelectedToken] = React.useState("");

  const [showLoans, setShowLoans] = React.useState(false);

  // NOTE: Mock token list with added chainId so that we can use it with teller
  const tokenList = [
    {
      name: "Vela Exchange",
      symbol: "oVELA",
      address: "0xb7E16D46f26B1615Dcc501931F28F07fD4b0D7F4",
      pair: "WETH",
      supply: "100,000,000",
      chainId: 555, //this is not a real chainId
    },
    {
      name: "Pepe",
      symbol: "oPEPE",
      address: "0x7dC9ecE25dcCA41D8a627cb47ded4a9322f7722b",
      pair: "WETH",
      supply: "100,000,000",
      chainId: 411,
    },
    {
      name: "Degen",
      symbol: "oDEGEN",
      address: "0x9B9852A943a570685c3704d70C4F1ebD5EdE109B",
      pair: "WETH",
      supply: "100,000,000",
      chainId: 666666666,
    },
    {
      name: "Higher",
      symbol: "oHIGHER",
      address: "0x9855d38b7E6270B9f22F283A0C62330b16Ac909C",
      pair: "WETH",
      supply: "100,000,000",
      chainId: 1, // this is not the real chainId as well
    },
    {
      name: "Rorschach",
      symbol: "oROR",
      address: "0xEb2DCAFFFf1b0d5BA76F14Fe6bB8348126339FcB",
      pair: "WETH",
      supply: "100,000,000",
      chainId: 8453, // used base chainId
    },
  ];
  const handleSelectedToken = (inputAddress) => {
    const token = tokenList.find(
      (t) => t.address.toLowerCase() === inputAddress.toLowerCase()
    );
    if (token) {
      setSelectedToken(token.address);
      setChainId(token.chainId);
    } else {
      setSelectedToken("");
      setChainId(1);
      setShowLoans(false);
    }
  };
  return (
    <>
      <div className="bg-[#000] min-h-[100vh] px-8 pt-8 max-w-screen-2xl mx-auto">
        <Header />
        <div className="md:mt-20 lg:mt-32">
          <Layout
            setShowBookmarks={setShowBookmarks}
            setShowDiscover={setShowDiscover}
            setShowPositions={setShowPositions}
            setShowSocials={setShowSocials}
            setShowLoans={setShowLoans}
            setShowComingSoon={setShowComingSoon}
            showPositions={showPositions}
            showDiscover={showDiscover}
            showBookmarks={showBookmarks}
            activeSection={activeSection}
            activeSideTab={activeSideTab}
            setActiveSection={setActiveSection}
            setActiveSideTab={setActiveSideTab}
          >
            <CenterNav
              setShowBookmarks={setShowBookmarks}
              setShowDiscover={setShowDiscover}
              setShowPositions={setShowPositions}
              setShowSocials={setShowSocials}
              setShowComingSoon={setShowComingSoon}
              activeSection={activeSection}
              activeSideTab={activeSideTab}
              setActiveSection={setActiveSection}
              setActiveSideTab={setActiveSideTab}
              setSelectedToken={setSelectedToken}
              tokenList={tokenList}
              handleSelectedToken={handleSelectedToken}
            />
            {showDiscover && <Card />}
            <div className="mt-5">{showDiscover && <Card />}</div>
            <div className="mt-5">{showPositions && <NoEvents />}</div>
            <div className="mt-5">{showBookmarks && <NoEvents />}</div>
            <div className="mt-5">
              {showSocials && (
                <SocialPopup
                  setShowSocial={setShowSocials}
                  setShowDiscover={setShowDiscover}
                />
              )}
            </div>

            <div className="mt-5">
              {showLoans && (
                <Loans chainId={chainId} selectedToken={selectedToken} />
              )}
            </div>
          </Layout>
        </div>
      </div>
      <Footer />
    </>
  );
}
