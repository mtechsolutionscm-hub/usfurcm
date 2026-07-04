import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Home, Compass, ClipboardCheck, Building2,
  TrendingUp, Scale, GraduationCap, Globe, Coins, Shield, FileText,
  Briefcase, PiggyBank, Landmark, HandCoins, BookOpen,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBgAsset from "@/assets/real/usfur-banner.jpg.asset.json";
const heroBg = heroBgAsset.url;

const WHATSAPP_NUMBER = "237690895554";
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

type Item = {
  icon: any;
  title: string;
  description: string;
  features: string[];
};

const services: { category: string; items: Item[] }[] = [
  {
    category: "Conseil & Structuration",
    items: [
      {
        icon: Compass,
        title: "Conseil & Structuration Financière",
        description: "Montage de financements conformes charia pour entreprises et projets.",
        features: [
          "Structuration Murabaha, Mudaraba, Musharaka, Ijara, Istisna'a, Salam",
          "Project finance islamique",
          "Émission et structuration de Sukuk",
          "Conversion de financements classiques en financements halal",
        ],
      },
      {
        icon: ClipboardCheck,
        title: "Audit & Conformité Charia",
        description: "Audit charia complet de vos produits, contrats et opérations financières.",
        features: [
          "Audit charia des produits et contrats",
          "Mise en place de comités charia",
          "Rapports de conformité",
          "Revue des procédures internes",
        ],
      },
    ],
  },
  {
    category: "Produits Financiers Islamiques",
    items: [
      {
        icon: HandCoins,
        title: "Murabaha (Vente à Marge)",
        description: "Financement d'achat avec marge bénéficiaire transparente et fixée à l'avance.",
        features: ["Achat de marchandises", "Équipements professionnels", "Véhicules", "Immobilier"],
      },
      {
        icon: Building2,
        title: "Ijara (Crédit-Bail Islamique)",
        description: "Location-vente conforme à la charia pour biens d'équipement et immobiliers.",
        features: ["Ijara opérationnelle", "Ijara Muntahia Bittamleek", "Biens industriels", "Flotte automobile"],
      },
      {
        icon: TrendingUp,
        title: "Mudaraba & Musharaka",
        description: "Financements participatifs basés sur le partage des profits et des pertes.",
        features: [
          "Capital-investissement",
          "Joint-ventures",
          "Financement de startups",
          "Partenariats commerciaux",
        ],
      },
      {
        icon: FileText,
        title: "Istisna'a & Salam",
        description: "Financements pour projets de construction et productions agricoles.",
        features: [
          "Construction immobilière",
          "Infrastructure",
          "Production agricole",
          "Fabrication industrielle",
        ],
      },
      {
        icon: Coins,
        title: "Sukuk (Obligations Islamiques)",
        description: "Émission et structuration d'obligations conformes à la charia.",
        features: ["Sukuk Ijara", "Sukuk Murabaha", "Sukuk Mudaraba", "Sukuk souverains & corporate"],
      },
      {
        icon: Shield,
        title: "Takaful (Assurance Islamique)",
        description: "Solutions d'assurance solidaire conformes aux principes islamiques.",
        features: ["Takaful familial", "Takaful général", "Modèle Wakala", "Modèle Mudaraba"],
      },
    ],
  },
  {
    category: "Investissement & Gestion d'Actifs",
    items: [
      {
        icon: PiggyBank,
        title: "Fonds d'Investissement Islamiques",
        description: "Création et gestion de fonds conformes à la charia.",
        features: ["Screening sectoriel halal", "Private equity islamique", "Fonds immobiliers", "Reporting AAOIFI"],
      },
      {
        icon: Briefcase,
        title: "Gestion de Portefeuille Charia",
        description: "Gestion discrétionnaire et conseil en portefeuilles 100% halal.",
        features: ["Sélection d'actifs", "Allocation stratégique", "Purification des revenus", "Suivi de performance"],
      },
      {
        icon: Landmark,
        title: "Accompagnement Institutions Financières",
        description: "Conseil aux banques classiques, banques islamiques et fenêtres islamiques.",
        features: [
          "Lancement de fenêtre islamique",
          "Mise en conformité SI & process",
          "Assistance réglementaire",
          "Formation des équipes",
        ],
      },
    ],
  },
  {
    category: "Juridique, Formation & Stratégie",
    items: [
      {
        icon: Scale,
        title: "Ingénierie Juridique & Fiscale",
        description: "Rédaction de contrats islamiques et optimisation fiscale.",
        features: [
          "Contrats charia-compliant",
          "Adaptation au droit local",
          "Traitement comptable AAOIFI/IFRS",
          "Optimisation fiscale",
        ],
      },
      {
        icon: GraduationCap,
        title: "Formation Certifiante",
        description: "Programmes pédagogiques 8 modules conformes AAOIFI.",
        features: [
          "Frais admission : 50 000 FCFA",
          "Frais cours : 250 000 FCFA",
          "Certificat reconnu",
          "Formations sur mesure entreprises",
        ],
      },
      {
        icon: BookOpen,
        title: "Recherche & Publications",
        description: "Études, guides et veille en finance islamique.",
        features: ["Études de marché", "Manuels pratiques", "Veille jurisprudentielle", "Notes sectorielles"],
      },
      {
        icon: Globe,
        title: "Conseil Stratégique & ESG",
        description: "Accompagnement des États et stratégies de pénétration de marchés.",
        features: ["Sukuk souverains", "Cadres légaux", "Zakat, Waqf, Impact investing", "ESG islamique"],
      },
    ],
  },
];

const ServicesPage = () => {
  const flatItems = useMemo(() => services.flatMap((c) => c.items), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="container mx-auto px-4 relative">
          <Button variant="ghost" size="sm" asChild className="mb-6 gap-2">
            <Link to="/"><ArrowLeft className="w-4 h-4" /> Retour à l'accueil</Link>
          </Button>
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-gold-light text-secondary text-xs font-medium mb-4">
              Tous nos services
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Produits & Services en Finance Islamique
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Catalogue complet de solutions charia-compliant pour particuliers, entreprises et institutions financières. Échangez directement avec un conseiller via WhatsApp.
            </p>
            <Button size="lg" asChild className="gap-2">
              <a href={waLink("Bonjour USFUR, je souhaite être conseillé sur vos produits et services en finance islamique.")} target="_blank" rel="noopener">
                <MessageCircle className="w-5 h-5" /> Parler à un conseiller
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="border-y border-border bg-card/50 sticky top-16 z-30 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-2 text-sm">
          {services.map((c) => (
            <a key={c.category} href={`#${c.category.replace(/\s/g, "-")}`}
               className="px-3 py-1.5 rounded-full bg-background hover:bg-primary hover:text-primary-foreground border border-border transition-colors">
              {c.category}
            </a>
          ))}
        </div>
      </section>

      {/* Services grid */}
      {services.map((cat, ci) => (
        <section key={cat.category} id={cat.category.replace(/\s/g, "-")} className="py-16 even:bg-card">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">{cat.category}</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl border border-border bg-background hover:shadow-xl hover:border-primary/30 transition-all flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {item.features.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="sm" className="w-full gap-2">
                    <a
                      href={waLink(
                        `Bonjour USFUR, je suis intéressé par le service "${item.title}". Pouvez-vous m'envoyer plus de détails et un devis ?`
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <MessageCircle className="w-4 h-4" /> Demander via WhatsApp
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Besoin d'une solution sur mesure ?
          </h2>
          <p className="opacity-90 mb-8">
            Nos experts en finance islamique ({flatItems.length} services disponibles) sont à votre écoute pour concevoir une offre adaptée à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <a
                href={waLink("Bonjour USFUR, j'aimerais discuter d'un projet sur mesure en finance islamique.")}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp +237 690 895 554
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-transparent border-primary-foreground/40 hover:bg-primary-foreground/10">
              <Link to="/"><Home className="w-5 h-5" /> Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
