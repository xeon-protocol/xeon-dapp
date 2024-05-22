import Image from "next/image";
import ImagePlayful from "../../assets/imgs/playful.webp";

interface SectionH1Props {
  children: string;
}

export default function SectionH1(props: SectionH1Props) {
  return (
    <div className="section-title pt-[30px] px-[20px]">
      <Image src={ImagePlayful} alt="Neon" />
      <h2>{props.children}</h2>
    </div>
  );
}
