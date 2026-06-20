import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import galleryPrayer from "@/assets/gallery/gallery-prayer.jpg";
import galleryBusiness from "@/assets/gallery/gallery-business.jpg";
import galleryEducation from "@/assets/gallery/gallery-education.jpg";
import galleryFamily from "@/assets/gallery/gallery-family.jpg";
import galleryMarket from "@/assets/gallery/gallery-market.jpg";
import galleryYouth from "@/assets/gallery/gallery-youth.jpg";

const slides = [
  {
    src: galleryPrayer,
    alt: "Prière communautaire",
    caption: "Foi & Communauté",
    description: "Nos frères et sœurs unis dans la prière et la dévotion.",
  },
  {
    src: galleryBusiness,
    alt: "Transactions commerciales",
    caption: "Finance Islamique",
    description: "Des contrats éthiques conformes à la Charia pour votre entreprise.",
  },
  {
    src: galleryEducation,
    alt: "Formation et éducation",
    caption: "Éducation & Excellence",
    description: "Former la prochaine génération d'experts en finance islamique.",
  },
  {
    src: galleryFamily,
    alt: "Famille heureuse",
    caption: "Prospérité Familiale",
    description: "Construire un avenir serein et conforme à nos valeurs.",
  },
  {
    src: galleryMarket,
    alt: "Marché africain",
    caption: "Commerce Halal",
    description: "Soutenir les entrepreneurs et le commerce éthique en Afrique.",
  },
  {
    src: galleryYouth,
    alt: "Jeunes professionnels",
    caption: "Jeunesse & Innovation",
    description: "L'énergie créatrice de la jeunesse musulmane africaine.",
  },
];

export default function PhotoGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

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
            La <span className="text-gradient-gold"> richesse </span> de nos valeurs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Des moments de foi, de prospérité et de solidarité qui illustrent la
            vitalité de la communauté musulmane africaine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          {/* Carousel wrapper */}
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
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Caption */}
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

          {/* Navigation Arrows */}
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

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
