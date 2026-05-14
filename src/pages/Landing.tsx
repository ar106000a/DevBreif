import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import PreviewBox from "../components/sections/PreviewBox";
import HowItWorks from "../components/sections/HowItWorks";
import CTA from "../components/sections/CTA";

export default function Landing() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff" }}>
      <Navbar />
      <Hero />
      <PreviewBox />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
