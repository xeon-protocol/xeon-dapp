"use client";
import React from "react";
import Card from "@/components/Card";
import CenterNav from "@/components/CenterNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import NoEvents from "@/components/NoEvents";
import SocialPopup from "@/components/SocialPopup";
import ComingSoon from "@/components/ComingSoon";
import Head from "next/head";

import Loans from "@/components/Loans";

export default function Home() {
  const [showPositions, setShowPositions] = React.useState(false);
  const [showDiscover, setShowDiscover] = React.useState(true);
  const [showBookmarks, setShowBookmarks] = React.useState(false);
  const [showSocials, setShowSocials] = React.useState(false);
  const [showComingSoon, setShowComingSoon] = React.useState(false);
  const [activeSideTab, setActiveSideTab] = React.useState("");
  const [activeSection, setActiveSection] = React.useState("discover");

  const [showLoans, setShowLoans] = React.useState(false);

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

            <div className="mt-5">{showLoans && <Loans />}</div>
          </Layout>
        </div>
      </div>
      <Footer />
    </>
  );
}
