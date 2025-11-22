import Image from "next/image";

import {
  getAllStrategiesWithAi,
  toStrategyCardProps,
} from "@/lib/strategies-service";
import TimeRangeToggle from "../components/dashboard/TimeRangeToggle";
import StrategyCard from "../components/dashboard/StrategyCard";

export default async function DashboardHomePage() {
  const all = await getAllStrategiesWithAi();
  const cards = await Promise.all(all.map(toStrategyCardProps));

  const featured = cards[0] ?? null;
  const others = cards.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        <section className="mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                Trending This Week
              </h2>
              <p className="text-[12px] sm:text-[14px] text-[#ADBEBF]">
                Discover, compare, and follow top-performing DeFi strategies
                curated by experts.
              </p>
            </div>

            <TimeRangeToggle />
          </div>

          <div className="mb-8 sm:mb-10 border border-[#EDFCFE0F] rounded-md p-4 sm:p-6">
            <h3 className="text-[11px] sm:text-[12px] font-semibold text-[#ADBEBF]">
              7:45 AM MAR 10 2025
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center mt-3 gap-4 sm:justify-between">
              {/* Mobile-only image (first on mobile) */}
              <Image
                src="/bar.svg"
                alt="Bar chart"
                width={1000}
                height={1000}
                className="block sm:hidden w-full h-[150px] object-cover"
              />

              <div className="w-full sm:w-auto order-2 md:order-1">
                <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                  {featured?.title ?? "No strategies yet"}
                </h1>
                <div className="flex items-center gap-2 w-fit text-[11px] sm:text-[12px] rounded-full bg-[#EDFCFE0F] px-3 sm:px-4 py-1 border border-[#EDFCFE0F] mt-2">
                  <h1>Creator:</h1>
                  <Image
                    src="/icons/user_icon.svg"
                    alt="Creator"
                    width={18}
                    height={18}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  {featured && (
                    <span className="text-[#5efbff]">{featured.creator}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto order-3 sm:order-2">
                <div className="flex items-center flex-col w-full sm:w-[120px] lg:w-[142px] rounded-md gap-2 bg-[#070B0B] border border-[#EDFCFE0F] px-3 sm:px-5 py-2 sm:py-2.5">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/diamond.svg"
                      alt="Diamond"
                      width={18}
                      height={18}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />

                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                      Type
                    </span>
                  </div>
                  <h2 className="text-[11px] sm:text-[12px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                    {featured?.type ?? ""}
                  </h2>
                </div>

                <div className="flex items-center flex-col w-full sm:w-[120px] lg:w-[142px] rounded-md gap-2 bg-[#070B0B] border border-[#EDFCFE0F] px-3 sm:px-5 py-2 sm:py-2.5">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/WarningDiamond.svg"
                      alt="Diamond"
                      width={18}
                      height={18}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />

                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                      Risk
                    </span>
                  </div>
                  <h2 className="text-[11px] sm:text-[12px] font-semibold tracking-[0.01em] text-[#FCD34D]">
                    {featured?.risk ?? ""}
                  </h2>
                </div>

                <div className="flex items-center flex-col w-full sm:w-[120px] lg:w-[142px] rounded-md gap-2 bg-[#070B0B] border border-[#EDFCFE0F] px-3 sm:px-5 py-2 sm:py-2.5">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/Drop.svg"
                      alt="Diamond"
                      width={18}
                      height={18}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />

                    <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                      Performance
                    </span>
                  </div>
                  {featured && (
                    <h2 className="text-[11px] sm:text-[12px] font-semibold tracking-[0.01em] text-[#46FFD7]">
                      {featured.performance}
                    </h2>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop/tablet image (below the row, preserved original layout) */}
            <Image
              src="/bar.svg"
              alt="Bar chart"
              width={1000}
              height={1000}
              className="hidden sm:block w-full h-[180px] md:h-auto mt-4 object-cover md:object-contain"
            />
          </div>
        </section>

        <section>
          <div className="mb-6 sm:mb-7 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-[0.01em] text-[#F2F4F5]">
                Explore Strategies
              </h2>
              <p className="text-[12px] sm:text-[14px] text-[#ADBEBF]">
                Discover, compare, and follow top-performing DeFi strategies
                curated by experts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {cards.length === 0 ? (
              <p className="text-[13px] sm:text-[14px] text-[#ADBEBF] col-span-full">
                No strategies have been created yet. Use the Create page to let
                Nir build one from your prompt.
              </p>
            ) : (
              (others.length > 0 ? others : cards).map((strategy) => (
                <StrategyCard
                  key={`${strategy.title}-${strategy.href}`}
                  {...strategy}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
