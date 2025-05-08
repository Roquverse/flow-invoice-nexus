import React from "react";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import MobileAppComingSoon from "@/components/MobileAppComingSoon";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="home-page w-full overflow-x-hidden">
      <Header />
      <Hero />
      <WhyChooseUs />
      <MobileAppComingSoon />
      <Footer />
    </div>
  );
};

export default Index;
