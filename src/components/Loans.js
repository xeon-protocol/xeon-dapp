import { Widget as TellerWidget } from "@teller-protocol/teller-widget";

function Loans() {
  return (
    <div>
      {" "}
      <TellerWidget
        showModalByDefault
        buttonClassName="lg:hidden md:block hidden 2xl:hidden text-white bg-floral flex justify-center items-center flex p-2 w-full rounded-full border-t-none border-b-[1px] border-r-[1px] border-l-[1px] border-button-gradient hover:bg-purple hover:border-blue"
        isBareButton
      />
      ;
    </div>
  );
}

export default Loans;
