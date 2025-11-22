// components/ChartImage.tsx
import Image from "next/image";
import chartBg from "@/public/bar-placeholder.jpeg";

export const ChartImage = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden rounded-t-[28px]">
    <Image
      src={chartBg}
      alt="image"
      fill
      className="object-cover object-center"
      quality={100}
      priority
    />
  </div>
);
