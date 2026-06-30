import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModulesSection from "@/components/ModulesSection";

const Cours = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <ModulesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Cours;
