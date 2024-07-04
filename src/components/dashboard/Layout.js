"use client";
import { Box, Button, Image } from "@chakra-ui/react";
import React from "react";
import RightBarCard from "./RightBarCard";
import { BsSpeedometer2 } from "react-icons/bs";
import { FaBookmark, FaEthereum } from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import LeftBottomWethValue from "./LeftBottomWethValue";
import LeftBottomDates from "./LeftBottomDates";
import CenterNav from "./CenterNav";

const Layout = ({ children }) => {
  const [showGraphic, setShowGraphic] = React.useState(false);
  const [showSwap, setShowSwap] = React.useState(false);
  console.log(showGraphic, showSwap);
  return (
    <div>
      <Image
        className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-black z-[30]"
        src="/base.png"
        alt="container"
      />
      <div className="flex fixed bottom-5 bg-black z-[31] justify-evenly w-[80%] gap-2 md:hidden">
        <p
          className={`${
            showGraphic ? "text-grey" : "text-muted"
          } hover:cursor-pointer`}
          onClick={() => {
            setShowGraphic(true);
            setShowSwap(false);
          }}
        >
          Graphic
        </p>
        <p
          onClick={() => {
            setShowGraphic(false);
            setShowSwap(true);
          }}
          className={`${
            showSwap ? "text-grey" : "text-muted"
          } hover:cursor-pointer`}
        >
          Swap
        </p>
      </div>
      <div className="flex flex-col gap-4 mx-auto lg:flex-row lg:flex-row lg:justify-between lg:gap-x-4 ">
        <Box
          display={{
            base: showSwap || showGraphic ? "none" : "block",
            md: "block",
          }}
          className="border-[1px] border-[#6c6c6c] border-[1px] rounded-xl   pt-2 text-white relative p-4  lg:block md:w-[100%] lg:w-4/12"
        >
          <div className="mt-[-15px] flex justify-center items-center">
            <div className="my-2 w-[100%]">
              <div className="rounded-xl p-2 boder-[#1F1F1F] mt-5 mr-6 w-[100%] border-[1px]">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex ml-2 items-center">
                    <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                      <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                        <FaEthereum className="text-light-purple" size={14} />
                      </div>
                    </div>
                    <p className="text-grey text-lg ml-2 font-medium">
                      500,000.00
                    </p>
                  </div>
                  <p className="text-light-purple text-sm">oVELA</p>
                </div>
              </div>
            </div>
          </div>
          <Image
            src="/left-nav.png"
            height={"100px"}
            className="w-[100%] "
            mt={5}
            alt="container"
          />
          <div className="absolute top-24 left-0 w-full h-full ">
            <div className="flex justify-between px-12 md:px-9  lg:px-14">
              <p className="hover:cursor-pointer text-sm">{`{ Hedge }`}</p>
              <p className="hover:cursor-pointer text-sm">{`{ Value }`}</p>
              <p className="hover:cursor-pointer text-sm">{`{ Assets }`}</p>
            </div>
            <div className="flex justify-between items-center px-6 py-6">
              <div className="bg-muted rounded-md text-xs lg:text-sm text-grey p-1 lg:p-2">
                CALL OPTION
              </div>
              <div>
                <div className="flex ml-2 items-center">
                  <p className="text-grey text-xs lg:text-sm mr-1 font-medium">
                    0.0000376
                  </p>
                  <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaEthereum className="text-light-purple" size={14} />{" "}
                    </div>
                  </div>
                  <span className="lg:text-sm text-xs ml-1 text-light-purple">
                    WETH
                  </span>
                </div>
              </div>
              <div>
                <p className="lg:text-sm text-xs">Mixed</p>
              </div>
            </div>
          </div>
          <div>
            <div className="relative border border-[#6c6c6c] rounded-lg w-full mt-5 h-[200px] pt-2">
              <div className="absolute bottom-3 left-3 flex flex-col items-center z-10">
                <p className="text-xs text-grey">0.00006</p>
                <p className="text-xs text-grey">WETH</p>
              </div>

              <Image
                src="/Ellipse.png"
                className="absolute bottom-0 left-0"
                alt="ellipse"
              />
              <Image
                src="/EllipseDotted_sm.png"
                className="absolute bottom-0 left-0"
                alt="ellipse dotted"
              />

              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                <p className="text-xs text-grey">0.00006</p>
                <p className="text-xs text-grey">WETH</p>
              </div>

              <Image
                src="/Ellipse_big.png"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                alt="big ellipse"
              />
              <Image
                src="/Ellipse_dot_big.png"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                alt="big ellipse dotted"
              />
            </div>
            <div className="flex flex-col md:flex-row lg:flex-col justify-between gap-4 xl:items-center mt-5">
              <div className="w-[100%]">
                <LeftBottomWethValue value={"0.00"} />
                <LeftBottomWethValue value={"0.00"} />
                <LeftBottomWethValue value={"0.00"} />
                <LeftBottomDates
                  line1={"Date"}
                  line2={"Created"}
                  value={"10/04/2024"}
                />
                <LeftBottomDates
                  line1={"Date"}
                  line2={"taken"}
                  value={"10/04/2024"}
                />
                <LeftBottomDates
                  line1={"Date"}
                  line2={"Expire"}
                  value={"10/04/2024"}
                />
              </div>

              <div className="flex justify-between items-center w-[100%]">
                <div>
                  <p className="mb-2">Deal Requests</p>
                  <div className="flex gap-4 mb-2">
                    <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-2 py-1 text-xs rounded-full">
                      Topup <BsSpeedometer2 className="mr-2" />
                    </button>
                    <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-2 py-1 text-xs rounded-full">
                      Zap-it <MdElectricBolt className="mr-2" />
                    </button>
                  </div>
                  <p className="text-sm">
                    Send a request to party B to Zap (settle hedge now as things
                    stand), or to increase hedge collateral (risk more).
                  </p>
                  <div className="border border-[#6c6c6c] rounded-lg w-full mt-5  p-2">
                    <p className="text-light-purple">
                      No trade requests. Make a request to populate this area...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
        <div className="md:flex hidden lg:hidden ">
          <div className="text-white  relative p-4 md:block lg:hidden hidden">
            <Image
              src="/Bg.png"
              height={"170px"}
              alt="container"
              mt={5}
              className="relative "
            />

            <div className="absolute top-8 left-0 w-full h-full">
              <div className="flex justify-between pr-14 pl-8 ">
                <p className="lg:text-sm xl:text-lg">{`{ >GAIN SECTION }`}</p>
                <Image src="/icon.png" alt="container" my={10} />
              </div>
              <div className="mt-[-30px] pr-8">
                <a
                  href="#"
                  className="text-light-purple text-right ml-10"
                >{`{ 0X461E...456c}`}</a>
                <RightBarCard title="Hedged Volume" amount="0.23" number="01" />
              </div>
            </div>
            <div className="border-dashed flex items-center px-5 gap-4 relative border-grey border-l-2 border-r-2 min-h-[100px] mx-5">
              <button
                _hover={{ scale: 1.1 }}
                className="text-white bg-button-gradient flex justify-center items-center flex p-2 w-full rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
                p={8}
                variant="solid"
              >
                <MdElectricBolt color="white" /> Buy Hedge
              </button>
              <div class="ml-1 rounded-full w-14 h-10 p-px bg-gradient-to-b from-grey to-transparent">
                <div class="bg-black  h-10  rounded-full flex m-auto justify-center items-center">
                  <FaBookmark size={20} />
                </div>
              </div>
            </div>
            <div className="border-[1px] border-[#6c6c6c] border-[1px] rounded-lg w-full pt-2">
              <a
                href="#"
                className="text-light-purple text-right ml-5"
              >{`{ 0X461E...456c}`}</a>

              <div className="mt-[-15px] w-full flex justify-center items-center">
                <div className="my-2 w-[100%]">
                  <div className="rounded-xl p-2 boder-[#1F1F1F] mt-5 w-[95%] mx-2 border-[1px]">
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-light-purple text-lg">$0.00</p>
                      <div className="flex ml-2 items-center">
                        <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                          <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                            <FaEthereum
                              className="text-light-purple"
                              size={14}
                            />
                          </div>
                        </div>
                        <p className="text-light-purple ext-lg ml-2 font-medium">
                          WETH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CenterNav />
        </div>
        <Box
          display={{
            base: showGraphic ? "block" : "none",
            md: "none",
            lg: "block",
          }}
          className="flex-1 md:p-4 order-1 lg:order-none"
        >
          {children}
        </Box>

        <Box
          display={{
            base: showSwap ? "block" : "none",
            lg: "block",
          }}
          className={`text-white lg:block relative p-4 md:hidden lg:block lg:w-3/12`}
        >
          <Image
            src="/Bg.png"
            height={"170px"}
            alt="container"
            w={"full"}
            className="relative "
          />

          <div className="absolute top-3 left-0 w-full h-full">
            <div className="flex justify-between pr-14 pl-8 ">
              <p className="lg:text-sm xl:text-lg">{`{ >GAIN SECTION }`}</p>
              <Image src="/icon.png" alt="container" my={10} />
            </div>
            <div className="mt-[-30px] ">
              <a
                href="#"
                className="text-light-purple text-right ml-10"
              >{`{ 0X461E...456c}`}</a>
              <div className="my-2 w-full">
                <div className="rounded-xl p-2 boder-[#1F1F1F] mt-5 lg:w-[80%] xl:w-[84%] ml-7 mx-2 border-[1px]">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-light-purple text-lg">$0.00</p>
                    <div className="flex ml-2 items-center">
                      <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                        <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                          <FaEthereum className="text-light-purple" size={14} />
                        </div>
                      </div>
                      <p className="text-light-purple ext-lg ml-2 font-medium">
                        WETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-dashed flex items-center px-5 gap-4 relative border-grey border-l-2 border-r-2 min-h-[100px] mx-6">
            <button className="text-white bg-button-gradient lg:text-xs xl:text-sm justify-center items-center flex p-2 w-full rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              <MdElectricBolt color="white" /> Buy Hedge
            </button>
            <div class="ml-1 rounded-full w-14 h-10 p-px bg-gradient-to-b from-grey to-transparent">
              <div class="bg-black  h-10  rounded-full flex m-auto justify-center items-center">
                <FaBookmark size={20} />
              </div>
            </div>
          </div>
          <div className="border-[1px] border-[#6c6c6c] border-[1px] rounded-lg lg:w-full pt-2">
            <a
              href="#"
              className="text-light-purple text-right ml-5"
            >{`{ 0X461E...456c}`}</a>

            <div className="mt-[-15px] w-full flex justify-center items-center">
              <div className="my-2 w-full">
                <div className="rounded-xl p-2 boder-[#1F1F1F] mt-5 w-[95%] mx-2 border-[1px]">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-light-purple text-lg">$0.00</p>
                    <div className="flex ml-2 items-center">
                      <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                        <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                          <FaEthereum className="text-light-purple" size={14} />
                        </div>
                      </div>
                      <p className="text-light-purple ext-lg ml-2 font-medium">
                        WETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Layout;
