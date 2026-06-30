import { useCallback, useEffect, useState } from "react";
import { ExternalLink, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "@/contexts/LanguageContext";

import m1 from "@/assets/field/JJAC8844.jpg.asset.json";
import m2 from "@/assets/field/OGPX7041.jpg.asset.json";
import m3 from "@/assets/field/SAXH8257.jpg.asset.json";
import m4 from "@/assets/field/IJGG5746.jpg.asset.json";
import m5 from "@/assets/field/MCNP4527.jpg.asset.json";
import m6 from "@/assets/field/HEDD9472.jpg.asset.json";
import m7 from "@/assets/field/TCMU0097.jpg.asset.json";
import m8 from "@/assets/field/SMJT2967.jpg.asset.json";
const module1 = m1.url;
const module2 = m2.url;
const module4 = m4.url;
const module5 = m5.url;
const module6 = m6.url;
const module7 = m7.url;
const module8 = m8.url;
const module3img = m3.url;

const modules = [
  { num: 1, title: "Fondements de la Charia", duration: "4 semaines", image: module1, objectives: ["Sources de la jurisprudence islamique", "Histoire de la jurisprudence", "Maqaasid Charia et règles jurisprudentielles majeures", "Jurisprudence des transactions", "Principales interdictions et sagesse de l'interdiction"] },
  { num: 2, title: "Produits Financiers Islamiques", duration: "4 semaines", image: module2, objectives: ["Financement participatif + étude de cas", "Financement basé sur la dette (commercial)", "Modes de financement non commerciaux", "Financement de services", "Opérations équivoques"] },
  { num: 3, title: "Comptabilité & Normes AAOIFI", duration: "4 semaines", image: module3img, objectives: ["Introduction aux normes AAOIFI", "Traitement comptable des produits islamiques", "Normes de reporting financier islamique", "Audit charia et conformité comptable", "Études de cas pratiques AAOIFI"] },
  { num: 4, title: "Gouvernance & Gestion Bancaire", duration: "4 semaines", image: module4, objectives: ["Organisation bancaire", "Gestion des comptes + étude de cas", "Comités charia et contrôle", "Gestion de la zakat + étude de cas", "Gestion des risques"] },
  { num: 5, title: "La Monnaie en Finance Islamique", duration: "3 semaines", image: module5, objectives: ["Nature et fonctions de la monnaie", "Monnaie et politique monétaire en finance islamique", "Paradigme monétaire en Islam", "Monnaie et inflation"] },
  { num: 6, title: "Crise Financière & Finance Islamique", duration: "3 semaines", image: module6, objectives: ["Introduction à la stabilité financière", "Crises du système financier conventionnel", "Échec des réponses classiques à l'instabilité systémique", "Approches alternatives du risque en FI"] },
  { num: 7, title: "Takaful (Assurance Islamique)", duration: "3 semaines", image: module7, objectives: ["Principes de l'assurance classique", "Raisons de l'interdiction", "Fondements du Takaful (assurance solidaire)", "Modèles de gestion Takaful (wakala, mudaraba)"] },
  { num: 8, title: "Sukuk & Marchés de Capitaux", duration: "3 semaines", image: module8, objectives: ["4 normes AAOIFI pour les marchés", "Gestion de portefeuille et fonds d'investissement", "14 contrats de sukuk nommés", "Gestion d'indices et screening", "Instruments de liquidité et couverture"] },
];

const WHATSAPP = "https://wa.me/237690895554";

const ModulesCarousel = () => {
  const { t } = useLanguage();
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
    const id = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="mb-14">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-light text-secondary text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          {t("modules.carousel.eyebrow")}
        </span>
        <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-3">
          {t("modules.carousel.title")}
        </h3>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-2xl shadow-xl border border-border" ref={emblaRef}>
          <div className="flex">
            {modules.map((m, i) => (
              <div key={i} className="flex-[0_0_100%] sm:flex-[0_0_80%] md:flex-[0_0_60%] min-w-0 px-2">
                <div className="relative rounded-2xl overflow-hidden group bg-muted">
                  <div className="aspect-[16/9]">
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold mb-2 uppercase tracking-wider">
                      Module {m.num}
                    </span>
                    <p className="text-white text-sm sm:text-base md:text-lg font-semibold leading-snug break-words">
                      {m.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          aria-label="Previous"
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur shadow-lg flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all border border-border"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next"
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur shadow-lg flex items-center justify-center text-foreground hover:bg-white hover:scale-110 transition-all border border-border"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-5">
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
  );
};

const ModulesSection = () => {
  const { t } = useLanguage();
  return (
    <section id="modules" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-green-light text-primary text-xs font-medium mb-3">
            {t("modules.badge")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {t("modules.title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("modules.subtitle")}
          </p>
        </div>

        <ModulesCarousel />

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm mb-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-light">
            <span className="font-medium text-foreground">{t("modules.admission")}</span>
            <span className="font-bold text-secondary">50 000 FCFA</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-light">
            <span className="font-medium text-foreground">{t("modules.course")}</span>
            <span className="font-bold text-secondary">250 000 FCFA</span>
          </div>
        </div>

        {/* Public cible & Livrables */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="p-6 rounded-xl bg-background border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">{t("modules.target")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Professionnels et cadres bancaires", "Responsables conformité charia", "Conseillers en finance islamique", "Entrepreneurs cherchant un financement halal", "Étudiants et diplômés en finance"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-background border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">{t("modules.deliverables")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Certificat conforme AAOIFI", "Supports de formation PDF complets", "Exercices pratiques & études de cas", "Accès aux ressources en ligne", "Support post-formation"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((m, i) => (
            <motion.div
              key={m.num}
              className="rounded-xl border border-border bg-background overflow-hidden group hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">Module {m.num}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-card/90 text-foreground rounded-md">{m.duration}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-sm text-foreground mb-2">{m.title}</h3>
                <p className="text-[10px] text-muted-foreground font-medium mb-2">{t("modules.objectives")}</p>
                <ul className="space-y-1 mb-3">
                  {m.objectives.map((o) => (
                    <li key={o} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span> {o}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{t("modules.fees")}</span>
                  <span className="font-bold text-foreground">250 000 FCFA</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1 text-[10px] px-2">
                    <ExternalLink className="w-3 h-3" /> {t("modules.details")}
                  </Button>
                  <Button size="sm" className="flex-1 gap-1 text-[10px] px-2" asChild>
                    <a href={`${WHATSAPP}?text=${encodeURIComponent(`Bonjour, je suis intéressé par le "${m.title}" du programme UIFTIC.`)}`} target="_blank" rel="noopener">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <a href="/auth">{t("modules.enroll")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
