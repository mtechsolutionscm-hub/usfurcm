import { useEffect, useRef, useState } from "react";
import { MessageSquare, ArrowRight, ChevronLeft, ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import f2 from "@/assets/field/IJGG5746.jpg.asset.json";
import f6 from "@/assets/field/JJAC8844.jpg.asset.json";
import f7 from "@/assets/field/SAXH8257.jpg.asset.json";
import { useLanguage } from "@/contexts/LanguageContext";

const slides = [f2.url, f6.url, f7.url];

const HeroSection = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const paused = useRef(false);

  const goTo = (i: number, dir: number = 1) => {
    setDirection(dir);
    setIndex((i + slides.length) % slides.length);
  };
  const next = () => goTo(index + 1, 1);
  const prev = () => goTo(index - 1, -1);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        setDirection(1);
        setIndex((i) => (i + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    paused.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    const dx = touchDeltaX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setTimeout(() => (paused.current = false), 300);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden touch-pan-y select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Background carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${slides[index]})` }}
            initial={(d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 1.05 })}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={(d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 })}
            transition={{ opacity: { duration: 1 }, x: { duration: 0.8, ease: "easeOut" }, scale: { duration: 6, ease: "linear" } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/50 to-background/80" />
      </div>

      <div className="absolute -left-32 top-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      {/* Prev / Next controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/60 hover:bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/60 hover:bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

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
              onClick={() => goTo(i, i > index ? 1 : -1)}
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
