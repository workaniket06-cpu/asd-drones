import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import StatsSection from "@/components/StatsSection";
import SegmentsSection from "@/components/SegmentsSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <StatsSection />
      <SegmentsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <BlogSection />
    </>
  );
}
