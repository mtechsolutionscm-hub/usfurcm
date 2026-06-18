import { Compass, ClipboardCheck, Building2, TrendingUp, Scale, GraduationCap, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  {
    icon: Compass,
    title: "Conseil & Structuration Financière",
    description: "Structuration de produits financiers islamiques et montage de financements conformes charia.",
    details: [
      "Structuration de produits : Murabaha, Mudaraba, Musharaka, Ijara, Istisna'a, Salam",
      "Montage de financements d'entreprises et de projets (project finance islamique)",
      "Structuration et émission de Sukuk (obligations islamiques)",
      "Transformation de financements classiques en financements conformes charia",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Audit & Conformité Charia",
    description: "Audit charia des produits, contrats et opérations financières avec mise en place de comités.",
    details: [
      "Audit charia des produits, contrats et opérations financières",
      "Mise en place de comités charia et coordination avec les scholars",
      "Rédaction de rapports de conformité charia",
      "Revue des procédures internes des banques ou institutions financières",
    ],
  },
  {
    icon: Building2,
    title: "Accompagnement des Institutions Financières",
    description: "Conseil aux banques islamiques, lancement de produits et mise en conformité des systèmes.",
    details: [
      "Conseil aux banques islamiques et fenêtres islamiques",
      "Lancement de nouveaux produits de finance islamique",
      "Mise en conformité des systèmes d'information et process internes",
      "Assistance réglementaire (banques centrales et autorités)",
    ],
  },
  {
    icon: TrendingUp,
    title: "Gestion d'Investissements & Fonds Islamiques",
    description: "Création de fonds d'investissement islamiques et sélection d'actifs halal.",
    details: [
      "Création et structuration de fonds d'investissement islamiques",
      "Sélection d'actifs halal (screening financier et sectoriel)",
      "Conseil en private equity islamique",
      "Gestion de portefeuilles conformes à la charia",
    ],
  },
  {
    icon: Scale,
    title: "Ingénierie Juridique & Fiscale",
    description: "Rédaction de contrats islamiques et optimisation fiscale des opérations.",
    details: [
      "Rédaction de contrats islamiques",
      "Adaptation des montages aux cadres juridiques locaux",
      "Optimisation fiscale des opérations islamiques",
      "Conseil sur le traitement comptable (AAOIFI, IFRS adaptés)",
    ],
  },
  {
    icon: GraduationCap,
    title: "Formation & Recherche",
    description: "Formations en finance islamique pour banques, entreprises et étudiants.",
    details: [
      "Formations en finance islamique (banques, entreprises, étudiants)",
      "Séminaires pour cadres dirigeants",
      "Rédaction d'études, manuels et guides pratiques",
      "Veille réglementaire et jurisprudence charia",
    ],
  },
  {
    icon: Globe,
    title: "Conseil Stratégique & Développement",
    description: "Études de marché, accompagnement des États et conseil ESG & finance islamique.",
    details: [
      "Études de marché en finance islamique",
      "Stratégies de pénétration de nouveaux marchés",
      "Accompagnement des États (cadres légaux, Sukuk souverains)",
      "Conseil ESG & finance islamique (zakat, waqf, impact investing)",
    ],
  },
];

const ServiceCard = ({ s, i }: { s: typeof services[0]; i: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="p-6 rounded-xl border border-border bg-background hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
    >
      <div className="w-12 h-12 rounded-lg bg-green-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
        <s.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{s.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.description}</p>

      {expanded && (
        <ul className="space-y-2 mb-3">
          {s.details.map((d) => (
            <li key={d} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        {expanded ? (
          <>Voir moins <ChevronUp className="w-3 h-3" /></>
        ) : (
          <>Voir plus <ChevronDown className="w-3 h-3" /></>
        )}
      </button>
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="relative py-24 bg-card overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><path d='M40 0 L80 40 L40 80 L0 40 Z M40 15 L65 40 L40 65 L15 40 Z' fill='none' stroke='%23006A4E' stroke-width='1.2'/></svg>")`,
        }}
      />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h3 className="text-primary font-medium text-sm tracking-wider uppercase mb-2">Nos Services</h3>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Solutions Complètes en Finance Islamique
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};


export default ServicesSection;
