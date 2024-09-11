"use client";
import Card from "@/components/Card";
import CenterNav from "@/components/CenterNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import NoEvents from "@/components/NoEvents";
import SocialPopup from "@/components/SocialPopup";
import React, {useEffect, useState} from "react";

import Loans from "@/components/Loans";

export default function Home() {
  const [showPositions, setShowPositions] = useState(false);
  const [showDiscover, setShowDiscover] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showLoans, setShowLoans] = useState(false);

  const [activeSideTab, setActiveSideTab] = useState("");
  const [activeSection, setActiveSection] = useState("discover");
  const [chainId, setChainId] = useState(1);
  const [selectedToken, setSelectedToken] = useState("");
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        const response = await fetch(
          "https://tokens-uniswap-org.ipns.dweb.link/"
        );
        if (response.ok) {
          const data = await response.json();

          setTokenList(data.tokens);
        } else {
          console.error(
            "Failed to fetch token list, response not ok",
            response.status
          );
        }
      } catch (error) {
        console.error("Failed to fetch token list", error);
      }
    };

    fetchTokenList();
  }, []);

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
