"use client";
import {
  Box,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import React from "react";
import { FaPlus, FaPlusCircle, FaSearch } from "react-icons/fa";

function CenterNav({
  setShowPositions,
  setShowDiscover,
  setShowBookmarks,
  activeSection,
  activeSideTab,
  setActiveSection,
  setActiveSideTab,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box position="relative">
      <div className="flex justify-between lg:px-14 px-1 absolute top-0 md:top-[-7px] lg:top-[-7px]  left-0 right-0 pr-3 md:pr-4  lg:px-8 text-[10px] md:text-xs lg:text-lg">
        <p
          onClick={() => {
            setShowPositions(false);
            setShowDiscover(true);
            setShowBookmarks(false);
            setActiveSection("discover");
            setActiveSideTab("");
          }}
          className={`${
            activeSection === "discover" ? "text-grey" : "text-muted"
          } hover:cursor-pointer ml-5`}
        >{`{ Discover }`}</p>
        <p
          onClick={() => {
            setShowPositions(true);
            setShowDiscover(false);
            setShowBookmarks(false);
            setActiveSection("positions");
            setActiveSideTab("");
          }}
          className={`${
            activeSection === "positions" ? "text-grey" : "text-muted"
          } hover:cursor-pointer ml-2 lg:ml-3`}
        >{`{ Positions }`}</p>
        <p
          onClick={() => {
            setShowPositions(false);
            setShowDiscover(false);
            setShowBookmarks(true);
            setActiveSection("bookmarks");
            setActiveSideTab("");
          }}
          className={`${
            activeSection === "bookmarks" ? "text-grey" : "text-muted"
          } hover:cursor-pointer ml-2 lg:ml-5`}
        >{`{ Bookmarks }`}</p>
        <div
          onClick={onOpen}
          class="rounded-full hover:cursor-pointer  w-6 h-6 p-px bg-gradient-to-b from-grey to-transparent"
        >
          <div class="bg-black  h-6 rounded-full flex m-auto justify-center items-center">
            <FaPlusCircle className="text-light-purple" size={14} />
          </div>
        </div>
      </div>
      <Image
        mb={10}
        src="/nav.webp"
        className="h-20 md:h-auto md:block"
        alt="logo"
      />

      <InputGroup
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        width="95%"
        zIndex="1"
        className="bg-[#71637f4d] rounded-lg top-[35px]  md:top-[24px] lg:top-[35px]"
      >
        <InputLeftElement pointerEvents="none">

          <FaSearch color="#6c6c6c" className="ml-2" />

        </InputLeftElement>
        <Input
          size={{
            md: "sm",
            lg: "md",
          }}
          placeholder="filter token address..."
          type="search"
          bg="transparent"
          w={"100%"}
          pl="2rem"
          _focus={{
            border: "none",
            outline: "none",
          }}
          className="bg-[#71637f4d] text-grey p-1 md:p-1 lg:p-2 border-[#6c6c6c] border-[1px] rounded-lg"
        />
      </InputGroup>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent border={"1px solid #6c6c6c"}>
          <div className="bg-black text-lg py-2 text-center text-grey ">
            Create OTC Trade
          </div>
          <ModalCloseButton
            color={"white"}
            _focus={{
              outline: "none",
              border: "none",
              boxShadow: "none",
            }}
            outline={"none"}
          />
          <ModalBody className="bg-black">
            <div className="flex items-center gap-4 mb-2">
              {" "}
              <p className="text-grey">{`{ hedge type }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Select
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              placeholder="Call Option"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
            >
              <option>Call Option</option>
              <option>Put Option</option>
              <option>Equity Swap</option>
              <option>Loan (coming)</option>
            </Select>
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ token address }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
            />
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ token amount }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
            />
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ premium }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
            />
            <div className="flex items-center gap-4 mt-4 mb-2">
              {" "}
              <p className="text-grey">{`{ strike price }`}</p>
              <IoIosInformationCircleOutline className="text-muted" />
            </div>
            <Input
              _hover={{
                backgroundColor: "transparent",
              }}
              bg={"black"}
              border={"1px"}
              borderColor={"#6c6c6c"}
              _focus={{
                borderColor: "#470c85",
              }}
              variant="filled"
              className="bg-black text-grey border-[1px] border-[#6c6c6c] rounded-lg w-full "
            />
            <div className="bg-black text-grey p-1 md:p-1 mt-5 lg:p-2 border-[#6c6c6c] border-[1px] rounded-lg">
              <div className="flex justify-between">
                <p className="text-grey w-[60%]">
                  Paste Token Address Above & View Your Balances
                </p>
                <p className="text-underline text-light-purple">
                  0xA929...0cE7
                </p>
              </div>
              <div className="flex gap-2 justify-between">
                <div>
                  <p className="text-muted text-sm text-center">{`{ deposited }`}</p>
                  <p className="text-grey text-center">0.00</p>
                </div>
                <div>
                  <p className="text-muted text-sm text-center">{`{ locked }`}</p>
                  <p className="text-grey text-center">0.00</p>
                </div>
                <div>
                  <p className="text-muted text-sm text-center">{`{ withdrawn }`}</p>
                  <p className="text-grey text-center">0.00</p>
                </div>
                <div>
                  <p className="text-muted text-sm text-center">{`{ available }`}</p>
                  <p className="text-grey text-center">0.00</p>
                </div>
              </div>
            </div>
          </ModalBody>

          <div className={"bg-black py-3 flex justify-center"}>
            <button
              className="text-white bg-black px-8 py-2 mr-4 rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="text-white px-8 py-2 mr-4  bg-button-gradient rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue">
              Write
            </button>
          </div>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CenterNav;
