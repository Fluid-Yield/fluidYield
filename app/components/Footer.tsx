import Image from "next/image";
import FY_logo from "@/public/file.svg";

export default function Footer() {
  return (
    <footer className="border-t border-[#132225] bg-[#090B0C]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src={FY_logo}
            alt="Nir Finance"
            width={36}
            height={36}
            className="w-8 h-8"
          />
          <div className="text-sm text-[#8FB5B8]">
            <p>Nir Finance — clarity-first strategy tooling.</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Nir. All rights reserved.
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/dashboard" className="text-[#B8D7DA] hover:text-[#E7FDFF]">
            App
          </a>
          <a
            href="/dashboard/learn"
            className="text-[#B8D7DA] hover:text-[#E7FDFF]"
          >
            Learn
          </a>
          <a
            href="/dashboard/settings"
            className="text-[#B8D7DA] hover:text-[#E7FDFF]"
          >
            Settings
          </a>
        </nav>
      </div>
    </footer>
  );
}
