import { FeaturesSection } from "@/components/FeaturesSection";
import { HeroSection } from "@/components/HeroSection";
import Footer from "@/components/layout/Footer";
import { StatsSection } from "@/components/StatsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col h-full overflow-auto scrollbar-hide pt-8 ">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
