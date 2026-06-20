import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ServicesCTA from "@/components/ServicesCTA";
import TrainingSection from "@/components/TrainingSection";
import ModulesSection from "@/components/ModulesSection";
import CEMACSection from "@/components/CEMACSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import PhotoGallery from "@/components/PhotoGallery";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ServicesCTA />
      <TrainingSection />
      <ModulesSection />
      <CEMACSection />
      <TestimonialsSection />
      <FAQSection />
      <AboutSection />
      <PhotoGallery />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
