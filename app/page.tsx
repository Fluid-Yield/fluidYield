import Image from "next/image";
import FY_logo from "@/public/file.svg";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050607] text-[#E7FDFF]">
      {/* Background accents */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-40 left-[10%] h-80 w-80 rounded-full blur-[120px] opacity-25"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(31,233,247,0.28) 0%, rgba(31,233,247,0.04) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          className="absolute -bottom-24 right-[8%] h-64 w-[28rem] rounded-full blur-[120px] opacity-20"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(143,181,184,0.25) 0%, rgba(143,181,184,0.06) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      <section className="px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl py-12 sm:py-18 lg:py-22">
          {/* Brand row */}
          <div className="mx-auto mb-6 sm:mb-8 flex w-full max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-up">
              <Image
                src={FY_logo}
                alt="Nir Finance"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-sm translate-y-2 sm:text-base text-[#CDEFF1]">
                Nir Finance
              </span>
            </div>
          </div>
          {/* Hero split */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-center">
            <div className="flex flex-col items-start text-left gap-6">
              <div className="flex items-center gap-2 animate-fade-up">
                <span className="rounded-full border border-[#1FE9F71F] bg-[#0B0C0D] px-3 py-1.5 text-[11px] tracking-wide text-[#9EDDE2]">
                  Strategy-first DeFi
                </span>
                <span className="rounded-full border border-[#1FE9F71F] bg-[#0B0C0D] px-3 py-1.5 text-[11px] tracking-wide text-[#9EDDE2]">
                  Nir Finance — clarity-first strategy tooling.
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-[#E7FDFF] animate-fade-up">
                Build <span className="text-[#6FE8F5]">strategies</span> you’re
                proud to share.
              </h1>
              <p className="max-w-xl text-[#9CB9BC] text-sm sm:text-base animate-fade-up-delayed">
                A clean space to compose, backtest, and publish DeFi strategies.
                Designed for clarity, built for collaboration.
              </p>

              <div className="mt-1 flex items-center gap-3 animate-fade-up-delayed">
                <a
                  href="/dashboard"
                  className="rounded-full border border-[#1FE9F759] bg-[#050607] px-6 sm:px-7 py-3 text-sm sm:text-base font-medium text-[#1FE9F7] shadow-[inset_0_0_14px_rgba(31,233,247,0.14)] transition hover:text-[#68f5ff]"
                >
                  Launch Dapp
                </a>
                <a
                  href="/dashboard/learn"
                  className="rounded-full bg-[#101214] px-6 sm:px-7 py-3 text-sm sm:text-base text-[#B8D7DA] border border-[#233236] hover:bg-[#121417] transition"
                >
                  What’s inside
                </a>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 max-w-lg">
                <div
                  className="rounded-lg border border-[#132225] bg-[#0A0B0C] p-3 animate-fade-up"
                  style={{ animationDelay: "0ms" }}
                >
                  <p className="text-xs text-[#8FB5B8]">Curators</p>
                  <p className="text-sm font-semibold mt-1">Community-led</p>
                </div>
                <div
                  className="rounded-lg border border-[#132225] bg-[#0A0B0C] p-3 animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  <p className="text-xs text-[#8FB5B8]">Privacy</p>
                  <p className="text-sm font-semibold mt-1">Yours by default</p>
                </div>
                <div
                  className="rounded-lg border border-[#132225] bg-[#0A0B0C] p-3 animate-fade-up"
                  style={{ animationDelay: "240ms" }}
                >
                  <p className="text-xs text-[#8FB5B8]">Latency</p>
                  <p className="text-sm font-semibold mt-1">Snappy</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 max-w-lg">
                <div className="rounded-lg border border-[#132225] bg-[#0A0B0C] p-3">
                  <p className="text-xs text-[#8FB5B8]">Chains</p>
                  <p className="text-sm font-semibold mt-1">Base, OP, BSC</p>
                </div>
                <div className="rounded-lg border border-[#132225] bg-[#0A0B0C] p-3">
                  <p className="text-xs text-[#8FB5B8]">Focus</p>
                  <p className="text-sm font-semibold mt-1">Clarity-first</p>
                </div>
                <div className="rounded-lg border border-[#132225] bg-[#0A0B0C] p-3">
                  <p className="text-xs text-[#8FB5B8]">Mode</p>
                  <p className="text-sm font-semibold mt-1">Collaborative</p>
                </div>
              </div>
            </div>

            {/* Preview card */}
            <div className="rounded-2xl border border-[#172225] bg-[#0A0B0C] p-4 sm:p-5 lg:p-6 shadow-[0_24px_48px_rgba(6,24,26,0.35)] animate-fade-up">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#9CB9BC]">Preview</p>
                <p className="text-xs text-[#6C8D90]">Example strategy</p>
              </div>
              <div className="mt-3 aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#132225] bg-[#070B0B] flex items-center justify-center animate-fade-up-delayed">
                <img
                  src="/bar.svg"
                  alt="Strategy preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div
                  className="rounded-md border border-[#132225] bg-[#0A0B0C] p-3 animate-fade-up"
                  style={{ animationDelay: "0ms" }}
                >
                  <p className="text-[11px] text-[#8FB5B8]">Type</p>
                  <p className="text-sm font-semibold mt-1">Momentum</p>
                </div>
                <div
                  className="rounded-md border border-[#132225] bg-[#0A0B0C] p-3 animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  <p className="text-[11px] text-[#8FB5B8]">Risk</p>
                  <p className="text-sm font-semibold mt-1 text-[#FCD34D]">
                    Mod.
                  </p>
                </div>
                <div
                  className="rounded-md border border-[#132225] bg-[#0A0B0C] p-3 animate-fade-up"
                  style={{ animationDelay: "240ms" }}
                >
                  <p className="text-[11px] text-[#8FB5B8]">Perf.</p>
                  <p className="text-sm font-semibold mt-1 text-[#46FFD7]">
                    +12.4%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 sm:mt-20 h-px w-full bg-gradient-to-r from-transparent via-[#1c2a2d] to-transparent animate-fade-up" />

          {/* Feature grid */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div
              className="rounded-xl border border-[#172225] bg-[#0A0B0C] p-5 animate-fade-up"
              style={{ animationDelay: "0ms" }}
            >
              <h3 className="text-[#E7FDFF] font-medium">Visual composition</h3>
              <p className="mt-2 text-sm text-[#93B2B6]">
                Drag-free building blocks, clear defaults, and guardrails that
                stay out of your way.
              </p>
            </div>
            <div
              className="rounded-xl border border-[#172225] bg-[#0A0B0C] p-5 animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <h3 className="text-[#E7FDFF] font-medium">Fast backtesting</h3>
              <p className="mt-2 text-sm text-[#93B2B6]">
                Iterate quickly with lightweight sims and focused metrics that
                tell the story.
              </p>
            </div>
            <div
              className="rounded-xl border border-[#172225] bg-[#0A0B0C] p-5 animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              <h3 className="text-[#E7FDFF] font-medium">
                Respectful publishing
              </h3>
              <p className="mt-2 text-sm text-[#93B2B6]">
                Share drafts, invite comments, and keep ownership of what you
                ship.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-14 sm:mt-18 rounded-2xl border border-[#172225] bg-[#0A0B0C] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-up">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#E7FDFF]">
                Start crafting your first strategy
              </h3>
              <p className="mt-2 text-sm text-[#93B2B6]">
                It takes minutes to set up a draft. No loud banners. No
                distractions.
              </p>
            </div>
            <a
              href="/dashboard/create"
              className="rounded-full border border-[#1FE9F759] bg-[#050607] px-6 sm:px-8 py-3 text-sm sm:text-base font-medium text-[#1FE9F7] shadow-[inset_0_0_14px_rgba(31,233,247,0.14)] transition hover:text-[#68f5ff]"
            >
              Create Strategy
            </a>
          </div>
        </div>
      </section>
      <div className="mt-16" />
      {/* Footer */}
      <Footer />
    </main>
  );
}
