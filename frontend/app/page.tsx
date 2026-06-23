import Navbar from "./components/navbar";
import HeroSection from "./components/hero-section";
import TrustSection from "./components/trust-section";
import FeaturesSection from "./components/features-section";
import ProductShowcaseSection from "./components/product-showcase-section";
import CTASection from "./components/cta-section";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <ProductShowcaseSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
