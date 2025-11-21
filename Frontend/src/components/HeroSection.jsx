import { Search, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="w-full bg-lawyer-gray px-4 sm:px-6 md:px-12 lg:px-[244px] pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12 lg:pb-[92px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:gap-[23px]">
          <h1 className="text-lawyer-blue font-inter text-3xl sm:text-4xl lg:text-[45px] font-bold leading-tight lg:leading-[52px]">
            Experienced lawyers are
            <br />
            ready to help.
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-[104px]">
            <div className="text-lawyer-gray-text font-inter text-base md:text-[19px] font-normal leading-[26px]">
              Find a lawyer
            </div>
            <div className="flex items-center justify-center gap-2.5 border-b-4 border-[#0071BC] pb-2.5">
              <div className="text-lawyer-gray-text font-lato text-base md:text-[19px] font-bold leading-[26px]">
                Get Started
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-6">
          <div className="relative flex-1 max-w-full sm:max-w-[354px]">
            <div className="absolute left-0 top-0 h-[38px] w-[38px] flex items-center justify-center pointer-events-none">
              <Search className="w-4 h-4 text-lawyer-gray-dark" />
            </div>
            <input
              type="text"
              placeholder="Practice area or lawyer name"
              className="w-full h-[38px] pl-[34px] pr-3 py-2.5 border border-[#CCC] bg-white text-base font-inter placeholder:text-lawyer-gray-text placeholder:opacity-40"
            />
          </div>

          <div className="relative flex-1 max-w-full sm:max-w-[232px]">
            <div className="absolute left-0 top-0 h-[38px] w-[38px] flex items-center justify-center pointer-events-none">
              <MapPin className="w-4 h-4 text-lawyer-gray-dark" />
            </div>
            <input
              type="text"
              placeholder="City, state, or ZIP code"
              className="w-full h-[38px] pl-[34px] pr-3 py-2.5 border border-[#CCC] bg-white text-base font-inter placeholder:text-lawyer-gray-text placeholder:opacity-40"
            />
          </div>

          <button className="h-[38px] px-6 bg-gradient-to-b from-[#0071BC] to-[#00D2FF] text-white font-inter text-sm font-normal leading-[22.5px] hover:opacity-90 transition-opacity whitespace-nowrap">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}