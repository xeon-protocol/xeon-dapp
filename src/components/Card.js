import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {FaBookmark, FaEthereum, FaInfoCircle} from "react-icons/fa";
import {MdRadioButtonChecked} from "react-icons/md";
import {TfiNewWindow} from "react-icons/tfi";
function Card() {
  const router = useRouter();
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <div className="rounded-2xl border-[1px] border-[#6C6C6C] bg-black p-4 ">
      <div className="flex justify-between items-center ">
        <div className="flex items-center">
          <div class="rounded-full w-12 h-13 p-px bg-gradient-to-b from-white to-transparent">
            <div class="bg-black  h-12 rounded-full flex m-auto justify-center items-center">
              <FaEthereum className="text-light-purple" size={28} />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-white">oVela Exchange</h2>
            <p className="text-gray-400 text-sm">500, 000.00 oVELA</p>
          </div>
        </div>
        <div>
          <a
            href="https://sepolia.basescan.org/address/0x6Fc917A5588123609B301F528Be107BcbB2f35A4"
            className="text-light-purple"
            rel="noopener noreferrer"
            target="_blank"
          >
            0x6Fc9...2f35A4
          </a>
        </div>
      </div>
      <div className="border-[2px] rounded-lg border-gray-800 p-4 flex justify-between items-center mt-5">
        <div className="flex items-center">
          <p className="text-gray-400 lg:text-lg text-sm font-medium">
            0.0000006
          </p>
          <div className="flex ml-2 items-center">
            <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-lime to-transparent">
              <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                <FaEthereum className="text-lime" size={14} />
              </div>
            </div>
            <p className="text-lime lg:text-lg text-sm ml-2 font-medium">
              WETH
            </p>
          </div>
        </div>
        <div>
          <p className="text-lime text-sm">{`{ HEDGE }`} </p>
          <p className="text-lime text-sm">{`{ Coll }`} </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <div>
          <div className="flex justify-between items-center mt-5">
            <div className="w-full">
              <div className="flex items-center w-full lg:w-[300px] justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Strike:{" "}
                </p>
                <div className="flex ml-2 items-center">
                  <span className="text-grey lg:text-lg text-sm text-right">
                    0.0000006
                  </span>
                  <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaEthereum className="text-light-purple" size={14} />
                    </div>
                  </div>
                  <p className="text-lime ext-lg ml-2 font-medium">WETH</p>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
              <div className="flex items-center w-full lg:w-[300px] justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Premium:
                </p>
                <div className="flex ml-2 items-center">
                  <span className="text-grey lg:text-lg text-sm">
                    0.0000006
                  </span>
                  <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaEthereum className="text-light-purple" size={14} />
                    </div>
                  </div>
                  <p className="text-lime ext-lg ml-2 font-medium">WETH</p>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
              <div className="flex items-center w-full lg:w-[300px] justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Expires:
                </p>
                <div className="flex ml-2 items-center">
                  <p className="text-grey ext-lg ml-2 font-medium">
                    171D 2H 43 M
                  </p>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5 hidden lg:block ">
            <div className="flex items-center justify-center">
              <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-8 py-2 rounded-full">
                <MdRadioButtonChecked className="mr-2" /> Vacant
              </button>
              <button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="bg-black flex items-center gap-2 border-none text-white px-8 py-2 rounded-lg ml-4"
              >
                View{" "}
                <div class="ml-1 rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                  <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                    <FaBookmark size={14} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end lg:items-end w-full md:w-auto">
          <p className="text-lime text-right">{`{ Profit zone }`}</p>
          <div className=" mt-5 border-dashed relative border-lime border-b-2 w-full md:min-w-[220px]">
            <img
              src="/arrow.png"
              className="absolute bottom-[-3px] md:left-[60px] left-[157px] z-[2]"
              alt=""
            />
          </div>
          <p className="text-grey text-right">{`{ Strike price }`}</p>
          <p className="text-floral mt-5 text-sm text-right">{`{ max loss 0.00006 WETH}`}</p>
          <div className=" border-dashed border-muted border-b-[1px] min-w-[220px] relative">
            <img
              src="/line.png"
              className="absolute bottom-0 left-[101px] md:left-1"
              alt=""
            />
          </div>
          <div className="w-[100px] hidden lg:block ">
            <button
              onClick={onOpen}
              className="text-white bg-button-gradient mt-5 w-full p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
            >
              Buy Option
            </button>
          </div>
          <div className="lg:hidden flex justify-between items-center mt-5">
            <div className="flex justify-between items-center mt-5 ">
              <div className="flex items-center justify-center">
                <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-2 py-2 rounded-full">
                  <MdRadioButtonChecked className="mr-1" /> Vacant
                </button>
                <button
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  className="bg-black flex items-center gap-2 border-none text-white px-4 py-2 rounded-lg ml-4"
                >
                  View{" "}
                  <div class="ml-1 rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaBookmark size={14} />
                    </div>
                  </div>
                </button>
                <button
                  onClick={onOpen}
                  _hover={{scale: 1.1}}
                  className="text-white bg-button-gradient w-full p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
                  p={8}
                  variant="solid"
                >
                  Buy Option
                </button>
              </div>
            </div>
          </div>
          <div className="lg:hidden flex justify-between items-center mt-5">
            <div className="flex justify-between items-center mt-5 ">
              <div className="flex items-center justify-center">
                <button className="bg-black flex items-center gap-2 border-dashed border-light-purple border-2 text-white px-2 py-2 rounded-full">
                  <MdRadioButtonChecked className="mr-1" /> Vacant
                </button>
                <button
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  className="bg-black flex items-center gap-2 border-none text-white px-4 py-2 rounded-lg ml-4"
                >
                  View{" "}
                  <div class="ml-1 rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaBookmark size={14} />
                    </div>
                  </div>
                </button>
                <button
                  onClick={onOpen}
                  _hover={{scale: 1.1}}
                  className="text-white bg-button-gradient w-full p-2 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
                  p={8}
                  variant="solid"
                >
                  Buy Option
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} className={"bg-black"}>
        <ModalOverlay />
        <ModalContent className={"bg-black"}>
          <ModalCloseButton color={"#fff"} />
          <ModalBody
            className={
              "bg-black text-grey flex flex-col justify-center items-center"
            }
          >
            <Image src="/info.webp" alt="xeon" />
            <div className="border-[2px] w-full rounded-lg border-gray-800 p-4 flex justify-between items-center mt-5">
              <div className="flex items-center">
                <div className="flex mr-2 items-center">
                  <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-lime to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaEthereum className="text-light-purple" size={14} />
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 lg:text-lg text-sm ">500,000.00</p>
              </div>
              <div className="flex items-center">
                <p className="text-lime text-sm mt-1">oVELA </p>
                <a href="#" target="_blank" className="text-grey ml-2 text-sm">
                  <TfiNewWindow />
                </a>
              </div>
            </div>
            <div className="w-full mt-5">
              <div className="flex items-center w-full justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Market Value:{" "}
                </p>
                <div className="flex ml-2 items-center">
                  <span className="text-grey lg:text-lg text-sm text-right">
                    0.0000006
                  </span>
                  <div class="rounded-full w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent">
                    <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
                      <FaEthereum className="text-light-purple" size={14} />
                    </div>
                  </div>
                  <p className="text-lime ext-lg ml-2 font-light">WETH</p>
                  <a
                    href="#"
                    target="_blank"
                    className="text-grey ml-2 text-sm"
                  >
                    <TfiNewWindow />
                  </a>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
              <div className="flex items-center w-full  justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Buy Cost:
                </p>
                <div className="flex ml-2 items-center">
                  <span className="text-grey lg:text-lg text-sm">
                    0.0000006
                  </span>

                  <p className="text-lime ext-lg ml-2 font-light">WETH</p>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
              <div className="flex items-center w-full justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Market Value:
                </p>
                <div className="flex ml-2 items-center">
                  <p className="text-grey ext-lg ml-2 font-light">
                    171D 2H 43 M
                  </p>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
              <div className="flex items-center w-full justify-between">
                <p className="flex items-center text-muted">
                  <span className="text-4xl">{`{`}</span>
                  Hedge Type:
                </p>
                <div className="flex ml-2 items-center">
                  <p className="text-grey ext-lg ml-2 font-light">
                    CALL OPTION
                  </p>
                  <span className="text-4xl text-muted">{`}`}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5 text-lg font-light">
              <FaInfoCircle />
              <p className="text-grey ">
                Proceed below, you will be prompted to Sign the transaction in
                your wallet.
              </p>
            </div>
          </ModalBody>

          <div className={"bg-black py-3 flex justify-center"}>
            <button
              className="text-white text-base bg-black px-8 py-2 mr-4 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="text-white px-8 py-2 mr-4  bg-button-gradient rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              Buy
            </button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Card;
