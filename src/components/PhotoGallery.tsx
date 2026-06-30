import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import g1 from "@/assets/field/GTRR1012.jpg.asset.json";
import g2 from "@/assets/field/IJGG5746.jpg.asset.json";
import g3 from "@/assets/field/GTMA0436.jpg.asset.json";
import g4 from "@/assets/field/SMJT2967.jpg.asset.json";
import g5 from "@/assets/real/meet-cmr-1.jpg.asset.json";
import g6 from "@/assets/real/meet-cmr-2.jpg.asset.json";

const slides = [
  {
    src: g1.url,
    alt: "Visite SEN TAKAFUL",
    caption: "Takaful & Assurance Islamique",
    description: "Rencontre avec les dirigeants de SEN TAKAFUL au Sénégal.",
  },
  {
    src: g2.url,
    alt: "Banque Islamique du Sénégal",
    caption: "Banque Islamique",
    description: "Mission auprès de la Banque Islamique du Sénégal — un partenaire de référence.",
  },
  {
    src: g3.url,
    alt: "Délégation USFUR",
    caption: "Coopération Africaine",
    description: "Délégation USFUR en visite institutionnelle à Dakar.",
  },
  {
    src: g4.url,
    alt: "Échanges institutionnels",
    caption: "Partenariats Stratégiques",
    description: "Échanges entre experts en finance islamique africaine.",
  },
  {
    src: g5.url,
    alt: "Rencontre USFUR Cameroun",
    caption: "USFUR Cameroun",
    description: "Présence active sur le terrain en Afrique centrale.",
  },
  {
    src: g6.url,
    alt: "Équipe sur le terrain",
    caption: "Engagement Communautaire",
    description: "Notre équipe au plus près des institutions et de la communauté.",
  },
];

export default function PhotoGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-gradient-to-b from-background via-green-light/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-light text-secondary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Notre Communauté
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            La <span className="text-gradient-gold"> richesse </span> de nos rencontres
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Photos authentiques de nos missions, partenariats et engagements à
            travers l'Afrique.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_85%] lg:flex-[0_0_70%] px-2 md:px-4"
                >
                  <div className="relative rounded-2xl overflow-hidden group">
                    <div className="aspect-[16/10] md:aspect-[16/9]">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs md:text-sm font-semibold mb-2">
                        {slide.caption}
                      </span>
                      <p className="text-white/90 text-sm md:text-base font-medium max-w-xl">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all duration-300 border border-border"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all duration-300 border border-border"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </motion.div>

        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "w-8 bg-primary" : "w-2.5 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
