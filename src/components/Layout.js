"use client";
import {Image} from "@chakra-ui/react";
import React, {useState} from "react";
import RightBarCard from "./RightBarCard";
import LeftBarButton from "./LeftBarButton";
import LiveTxs from "./LiveTxs";

const Layout = ({
  children,
  setShowPositions,
  setShowDiscover,
  setShowBookmarks,
  setShowSocials,

  setShowLoans,
  setShowTellerWidget,
  setActiveSection,
  setActiveSideTab,
  activeSideTab,
  activeSection,
}) => {
  const [showStats, setShowStats] = useState(true);
  const [activeRightBar, setActiveRightBar] = useState("Stats");

  console.log(activeRightBar, showStats);
  const handleSectionChange = (section, button) => {
    if (section === "discover" && button === "Equity Swaps") {
      setShowPositions(false);
      setShowDiscover(true);
      setShowBookmarks(false);
      setActiveSection("discover");
      setActiveSideTab("Equity Swaps");
      setShowTellerWidget(false);
    } else if (section === "positions" && button === "Loans") {
      setShowPositions(false);
      setShowDiscover(false);
      setShowBookmarks(false);
      setShowLoans(true);
      setActiveSection("positions");
      setActiveSideTab("Loans");
      setShowTellerWidget(true);
    } else if (section === "positions" && button === "Options") {
      setShowPositions(false);
      setShowDiscover(false);
      setShowBookmarks(false);
      setActiveSection("positions");
      setActiveSideTab("Options");
      setShowTellerWidget(false);
    } else if (section === "discover" && button === "Social") {
      setShowPositions(false);
      setShowDiscover(false);
      setShowBookmarks(false);
      setShowSocials(true);
      setActiveSection("discover");
      setActiveSideTab("Social");
      setShowTellerWidget(false);
    } else if (section === "positions" && button === "Equity Swaps") {
      setShowPositions(false);
      setShowDiscover(true);
      setShowBookmarks(false);
      setActiveSection("positions");
      setActiveSideTab("Equity Swaps");
      setShowTellerWidget(false);
    } else if (section === "discover" && button === "Options") {
      setShowPositions(false);
      setShowDiscover(true);
      setShowBookmarks(false);
      setActiveSection("discover");
      setActiveSideTab("Options");
      setShowTellerWidget(false);
    }
  };

  return (
    <div>
      <Image
        className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-black z-[30]"
        src="/base.png"
        alt="container"
      />
      <div className="flex fixed bottom-5 bg-black z-[31] justify-between w-[80%] gap-2 md:hidden">
        <p onClick={() => handleSectionChange("positions", "Options")}>
          Options
        </p>
        <p onClick={() => handleSectionChange("discover", "Equity Swaps")}>
          Equity Swaps
        </p>
        <p onClick={() => handleSectionChange("positions", "Loans")}>Loans</p>
        <p onClick={() => handleSectionChange("discover", "Social")}>Social</p>
      </div>

      <div className="flex flex-col gap-4 mx-auto md:flex-row md:justify-start lg:flex-row lg:justify-between lg:gap-x-4">
        <div className="text-white relative md:p-0 p-4 lg:p-4 md:w-[35%] lg:w-1/4 md:flex md:flex-col">
          <Image
            className="hidden md:block"
            src="/base.webp"
            height={{
              base: "100px",
              md: "350px",
              lg: "380px",
            }}
            alt="container"
          />
          <div className="absolute top-0 lg:top-4 left-2 lg:left-6 w-full h-full hidden md:block">
            <p className="md:text-sm lg:text-lg">{`{ >OTC_SILKROAD }`}</p>
          </div>
          <div className="absolute top-4 lg:top-[70px] left-6 w-full h-full hidden md:block">
            <LeftBarButton
              active={activeSideTab === "Options" ? true : false}
              title="Options"
              handleClick={() => handleSectionChange("discover", "Options")}
            />
            <LeftBarButton
              active={activeSideTab === "Equity Swaps" ? true : false}
              title="Equity Swaps"
              handleClick={() =>
                handleSectionChange("discover", "Equity Swaps")
              }
            />
            <LeftBarButton
              active={activeSideTab === "Loans" ? true : false}
              title="Loans"
              handleClick={() => handleSectionChange("positions", "Loans")}
            />
            <LeftBarButton
              active={activeSideTab === "Social" ? true : false}
              title="Social"
              handleClick={() => handleSectionChange("discover", "Social")}
            />
            <div>
              <p className="text-grey text-lg">Reach Us</p>
              <div className="flex gap-4 mt-2">
                <a href="https://twitter.com/XeonProtocol">
                  <Image src="/x.webp" alt="container" className="w-8" />
                </a>
                <a href="https://medium.com/@xeonprotocol">
                  <Image src="/medium.webp" alt="container" className="w-8" />
                </a>
                <a href="https://t.me/XeonProtocolPortal">
                  <Image src="/telegram.webp" alt="container" className="w-8" />
                </a>
                <a href="mailto:info@xeon-protocol.io">
                  <Image src="/mail.webp" alt="container" className="w-8" />
                </a>
              </div>
            </div>
            <div className="text-white relative ml-[-10px] mt-16 hidden md:block lg:hidden md:flex md:flex-col">
              <Image
                src="/right.webp"
                height={"380px"}
                alt="container"
                className="relative hidden md:block ml-[-20px]"
              />
              <div className="absolute top-3 left-[-20px] w-full h-full hidden md:block">
                <div className="flex justify-between px-14 md:px-8 md:mt-[-10px] lg:px-12">
                  <p
                    onClick={() => {
                      setShowStats(true);
                      setActiveRightBar("Stats");
                    }}
                    className={`${
                      activeRightBar === "Stats" ? "text-grey" : "text-muted"
                    } hover:cursor-pointer`}
                  >{`{ Statistics }`}</p>
                  <p
                    onClick={() => {
                      setShowStats(false);
                      setActiveRightBar("Live Txs");
                    }}
                    className={`${
                      activeRightBar === "Live Txs"
                        ? "text-grey"
                        : "text-muted "
                    }
                    hover:cursor-pointer`}
                  >{`{ Live Txs }`}</p>
                </div>
                {showStats ? (
                  <div className="mt-5 p-2 lg:pr-8">
                    <RightBarCard
                      title="Hedged Volume"
                      amount="0.23"
                      number="01"
                    />
                    <RightBarCard
                      title="Premium Volume"
                      amount="0.11"
                      number="02"
                    />
                    <RightBarCard
                      title="Settle Hedge Volume"
                      amount="0.00"
                      number="03"
                    />
                    <RightBarCard
                      title="Profit Payoffs"
                      amount="0.00"
                      number="04"
                    />
                  </div>
                ) : (
                  <LiveTxs />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 md:p-4 md:w-[65%] order-1 lg:order-none">
          {children}
        </div>

        <div className="text-white hidden md:hidden lg:block relative p-4 md:w-1/4 lg:w-1/4 md:flex md:flex-col">
          <Image
            src="/right.webp"
            height={"380px"}
            alt="container"
            className="relative hidden md:block"
          />
          <div className="absolute top-3 left-0 w-full h-full hidden md:block">
            <div className="flex justify-between px-14 lg:px-14">
              <p
                onClick={() => {
                  setShowStats(true);
                  setActiveRightBar("Stats");
                }}
                className={`${
                  activeRightBar === "Stats" ? "text-grey" : "text-muted"
                } hover:cursor-pointer`}
              >{`{ Statistics }`}</p>
              <p
                onClick={() => {
                  setShowStats(false);
                  setActiveRightBar("Live Txs");
                }}
                className={`${
                  activeRightBar === "Live Txs" ? "text-grey" : "text-muted "
                }
                    hover:cursor-pointer`}
              >{`{ Live Txs }`}</p>
            </div>
            {showStats ? (
              <div className="mt-5 pr-8">
                <RightBarCard title="Hedged Volume" amount="0.23" number="01" />
                <RightBarCard
                  title="Premium Volume"
                  amount="0.11"
                  number="02"
                />
                <RightBarCard
                  title="Settle Hedge Volume"
                  amount="0.00"
                  number="03"
                />
                <RightBarCard
                  title="Profit Payoffs"
                  amount="0.00"
                  number="04"
                />
              </div>
            ) : (
              <LiveTxs />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
