
import React from 'react';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WhyChooseUs from "@/components/WhyChooseUs";
import PowerfulTemplate from "@/components/PowerfulTemplate";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <Features />
      <WhyChooseUs />
      <PowerfulTemplate />
      <Footer />
    </div>
  );
};

export default Index;
