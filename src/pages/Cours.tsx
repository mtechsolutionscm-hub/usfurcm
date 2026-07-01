import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModulesSection from "@/components/ModulesSection";
import TrainingSection from "@/components/TrainingSection";

const Cours = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <ModulesSection />
        <TrainingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Cours;
