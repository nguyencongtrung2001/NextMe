import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import HeroBanner from "@/components/trangchu/HeroBanner";
import FeatureCards from "@/components/trangchu/FeatureCards";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon",
  },
};

export default function Home() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 flex-1">
      <section className="w-full flex flex-col gap-6 md:gap-10 animate-fade-up items-center max-w-5xl mx-auto">
        <HeroBanner />
        <FeatureCards />
      </section>
    </div>
  );
}
