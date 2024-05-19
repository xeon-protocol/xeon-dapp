import FeedsFilter from "./FeedsFilter";
import HedgeCard from "./HedgeCard";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export default function Home() {
  return (
    <div className="flex justify-between items-start">
      <div>
        <LeftSidebar />
      </div>
      <div>
        <FeedsFilter />
        <div className="flex flex-col gap-[40px] mt-[50px]">
          <HedgeCard />
          <HedgeCard />
          <HedgeCard />
        </div>
      </div>
      <div>
        <RightSidebar />
      </div>
    </div>
  );
}
