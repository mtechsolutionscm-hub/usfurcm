import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import a1 from "@/assets/field/JJAC8844.jpg.asset.json";
import a2 from "@/assets/field/OGPX7041.jpg.asset.json";
import a3 from "@/assets/field/SAXH8257.jpg.asset.json";
import a4 from "@/assets/field/MCNP4527.jpg.asset.json";
import a5 from "@/assets/field/HEDD9472.jpg.asset.json";
import a6 from "@/assets/field/TCMU0097.jpg.asset.json";

type Slide = {
  src: string;
  title: { FR: string; EN: string };
  caption: { FR: string; EN: string };
};

const slides: Slide[] = [
  {
    src: a1.url,
    title: { FR: "Direction Stratégique", EN: "Strategic Leadership" },
    caption: {
      FR: "Rencontre stratégique avec la Banque Islamique du Sénégal — 40 ans d'expertise.",
      EN: "Strategic meeting with Banque Islamique du Sénégal — 40 years of expertise.",
    },
  },
  {
    src: a2.url,
    title: { FR: "Partenariats Institutionnels", EN: "Institutional Partnerships" },
    caption: {
      FR: "Signature d'accords entre institutions de finance islamique africaines.",
      EN: "Signing agreements between African Islamic finance institutions.",
    },
  },
  {
    src: a3.url,
    title: { FR: "Excellence Bancaire", EN: "Banking Excellence" },
    caption: {
      FR: "Échanges techniques au siège d'une banque islamique de référence.",
      EN: "Technical exchanges at the headquarters of a leading Islamic bank.",
    },
  },
  {
    src: a4.url,
    title: { FR: "Coopération Internationale", EN: "International Cooperation" },
    caption: {
      FR: "Mission auprès de la Banque Islamique de Développement (ISDB).",
      EN: "Mission with the Islamic Development Bank (ISDB).",
    },
  },
  {
    src: a5.url,
    title: { FR: "Équipe Expert USFUR", EN: "USFUR Expert Team" },
    caption: {
      FR: "Notre équipe au service de la finance éthique en Afrique centrale.",
      EN: "Our team serving ethical finance across Central Africa.",
    },
  },
  {
    src: a6.url,
    title: { FR: "Conseil Personnalisé", EN: "Personalised Advisory" },
    caption: {
      FR: "Accompagnement sur-mesure des dirigeants et institutions.",
      EN: "Bespoke guidance for leaders and institutions.",
    },
  },
];

export default function ProfessionalCarousel() {
  const { lang, t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSnaps(emblaApi.scrollSnapList());
    };
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    const id = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="professionals" className="py-16 sm:py-20 md:py-24 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-light text-primary text-xs sm:text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {t("pro.eyebrow")}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 break-words">
            {t("pro.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            {t("pro.subtitle")}
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl border border-border" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_85%] lg:flex-[0_0_78%] px-1.5 sm:px-3"
                >
                  <div className="relative rounded-2xl overflow-hidden group bg-muted">
                    <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]">
                      <img
                        src={slide.src}
                        alt={slide.title[lang]}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-secondary/95 text-secondary-foreground text-[10px] sm:text-xs font-semibold mb-2 uppercase tracking-wider">
                        {slide.title[lang]}
                      </span>
                      <p className="text-white text-xs sm:text-sm md:text-base font-medium max-w-xl leading-snug break-words">
                        {slide.caption[lang]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Précédent"
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur shadow-lg flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all border border-border"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Suivant"
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur shadow-lg flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all border border-border"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
