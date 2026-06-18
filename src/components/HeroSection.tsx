import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background/80" />
      </div>
      {/* Decorative circles */}
      <div className="absolute -left-32 top-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-light text-secondary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Essential for Success
          </span>
        </motion.div>

        <motion.h1
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-primary">Usfur</span> Islamic Finance
        </motion.h1>

        <motion.h2
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Training <span className="text-gradient-gold">&</span> Consulting
        </motion.h2>

        <motion.p
          className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Expert consulting and professional training in Sharia-compliant finance for banks, microfinances, and SMEs.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button size="lg" className="gap-2 px-8 text-base" asChild>
            <a
              href="https://wa.me/237690895554?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20consultation%20en%20finance%20islamique."
              target="_blank"
              rel="noopener"
            >
              <MessageSquare className="w-4 h-4" />
              Book Consultation
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="px-8 text-base" asChild>
            <a href="#training">View Programs</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
