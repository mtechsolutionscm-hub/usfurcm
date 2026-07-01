import { useEffect, useState } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import f2 from "@/assets/field/IJGG5746.jpg.asset.json";
import f6 from "@/assets/field/JJAC8844.jpg.asset.json";
import { useLanguage } from "@/contexts/LanguageContext";

const slides = [f2.url, f6.url];

const HeroSection = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={index}
            src={slides[index]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 6, ease: "linear" } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/85" />
      </div>

      <div className="absolute -left-32 top-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      {/* Face-focus preview frame */}
      <motion.div
        className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 z-20"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative w-64 xl:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/20 bg-card">
          <AnimatePresence mode="sync">
            <motion.img
              key={`face-${index}`}
              src={slides[index]}
              alt="Aperçu professionnel"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 22%", transform: "scale(1.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">En direct</span>
            </div>
            <p className="text-sm font-heading font-semibold text-foreground">Experts en Finance Islamique</p>
            <p className="text-xs text-muted-foreground">Rencontres & missions institutionnelles</p>
          </div>
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary/90 backdrop-blur text-primary-foreground text-[10px] font-medium tracking-wide">
            USFUR • {String(index + 1).padStart(2, "0")}
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-light text-secondary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            {t("hero.badge")}
          </span>
        </motion.div>

        <motion.h1
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground drop-shadow-sm"
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
          {t("hero.title2").split("&")[0]}
          <span className="text-gradient-gold">&</span>
          {t("hero.title2").split("&")[1]}
        </motion.h2>

        <motion.p
          className="text-foreground/85 max-w-xl mx-auto text-base sm:text-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t("hero.desc")}
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
              {t("hero.cta.book")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="px-8 text-base" asChild>
            <a href="#training">{t("hero.cta.programs")}</a>
          </Button>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
