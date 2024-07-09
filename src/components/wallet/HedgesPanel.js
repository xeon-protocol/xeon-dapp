"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { RiDownload2Line, RiDownloadLine, RiUploadLine } from "react-icons/ri";
import { FaCodepen } from "react-icons/fa6";
import { Image } from "@chakra-ui/react";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
const HedgesPanel = () => {
  const [selectedOption, setSelectedOption] = useState("Options Created");
  const [hedgesData, setHedgesData] = useState([]);

  const options = [
    "Options Created",
    "Options Taken",
    "Swaps Created",
    "Swaps Taken",
    "My Bookmarks",
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const glitchVariants = {
    visible: {
      textShadow: [
        "1px 1px 0px lime",
        "-1px -1px 0px purple",
        "1px -1px 0px lime",
        "-1px 1px 0px lime",
        "2px 2px 2px lime",
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };
  return (
    <div className="px-8 pt-8 md:px-10 max-w-screen-2xl mx-auto text-grey">
      <div id="hedgingSection" className="mt-2">
        <div className="section-title flex items-center gap-2 mb-5">
          <motion.h1 className="text-3xl text-grey">
            <motion.span
              variants={glitchVariants}
              initial="hidden"
              whileInView={{ opacity: 1, x: 0 }}
              animate={"visible"}
            >
              Hedges
            </motion.span>{" "}
            Panel
          </motion.h1>
        </div>

        <div className="data-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="data-card hedge-created p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">Hs.Created</h3>
                <p className="card-value text-2xl" id="hedgesCreatedCount">
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <RiUploadLine className="text-light-purple text-3xl" />
              </div>
            </div>
          </div>
          <div className="data-card hedge-taken p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">Hs.Taken</h3>
                <p className="card-value text-2xl" id="hedgesCreatedCount">
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <RiDownloadLine className="text-light-purple text-3xl" />
              </div>
            </div>
          </div>
          <div className="data-card hedge-volume p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">
                  Write Volume
                </h3>
                <p className="card-value text-2xl" id="hedgesCreatedCount">
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <FaCodepen className="text-light-purple text-3xl" />
              </div>
            </div>
          </div>
          <div className="data-card buy-volume p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">
                  Take Volume
                </h3>
                <p className="card-value text-2xl" id="hedgesCreatedCount">
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <FaCodepen className="text-light-purple text-3xl" />
              </div>
            </div>
          </div>

          <div className="data-card hedge-created p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">Options</h3>
                <p className="card-value text-2xl" id="hedgesCreatedCount">
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <Image src={"/call-option.svg"} />
              </div>
            </div>
          </div>
          <div className="data-card hedge-taken p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">
                  Equity Swaps
                </h3>
                <p className="card-value text-2xl" id="hedgesCreatedCount">
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <Image src={"/equityswap.svg"} height={16} />
              </div>
            </div>
          </div>
          <div className="data-card hedge-volume p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">Gains</h3>
                <p
                  className="card-value text-2xl"
                  id="profitsETH"
                  style={{ color: "#089353" }}
                >
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <IoIosTrendingUp className="text-light-purple text-3xl" />
              </div>
            </div>
          </div>
          <div className="data-card buy-volume p-4 border rounded-lg">
            <div className="flex w-full justify-between items-center">
              <div>
                <h3 className="card-title text-lg font-semibold">Losses</h3>
                <p
                  className="card-value text-2xl"
                  id="lossesETH"
                  style={{ color: "#d6188a" }}
                >
                  0
                </p>
              </div>
              <div className="card-extra" title="hedge type">
                <IoIosTrendingDown className="text-light-purple text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hedges-list-section mt-12">
        <div className="hedges-load-section mb-4">
          <div className="w-full justify-evenly flex space-x-2">
            {options.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 border rounded ${
                  selectedOption === option ? "border-lime" : "border-grey"
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <ul className="trade-list hedges-trade-list border rounded-lg p-4">
          <li className="trade-item t-i-lead hedges-trade-list flex justify-between">
            <div className="hlH hedge-type hedge-i-cat">TYPE</div>
            <div className="hedge-info flex flex-1 justify-between">
              <div className="hlH hedge-symbol hedge-i-cat hSm">SYMB</div>
              <div className="hlH hedge-valuetitle hedge-i-cat">VALUE</div>
              <div className="hlH hedge-i-cat">COST</div>
              <div className="hlH hedge-i-cat">STATE</div>
              <div className="hlH hedge-time hedge-i-cat">START</div>
              <div className="hlH hedge-time hedge-i-cat">EXPIRE</div>
              <div className="hlH token-address hedge-i-cat">PARTYB</div>
            </div>
            <div className="hlH hedge-tx-btn">LINK</div>
          </li>
          {hedgesData.length > 0 ? (
            hedgesData.map((data, index) => (
              <li key={index} className="trade-item flex justify-between">
                {/* Render data here */}
              </li>
            ))
          ) : (
            <div className="no-hedges-message text-center py-4">
              No {selectedOption} found to populate this area.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HedgesPanel;
