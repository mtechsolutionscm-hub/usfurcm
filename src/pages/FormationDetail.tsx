import { useParams, Link, Navigate } from "react-router-dom";
import { Check, Zap, Award, Clock, Users, GraduationCap, MessageSquare, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/field/SAXH8257.jpg.asset.json";

type Formation = {
  slug: string;
  badge: string;
  badgeIcon: "zap" | "award";
  duration: string;
  title: string;
  tagline: string;
  summary: string;
  audience: string;
  outcomes: string[];
  modules: { title: string; description: string }[];
  price?: string;
};

const formations: Formation[] = [
  {
    slug: "fast-track",
    badge: "Fast Track",
    badgeIcon: "zap",
    duration: "3 semaines",
    title: "Programme Accéléré en Finance Islamique",
    tagline: "Formation intensive pour professionnels pressés",
    summary:
      "Un parcours intensif de 3 semaines couvrant les fondamentaux essentiels de la finance islamique : principes de la Charia, produits bancaires conformes, techniques de structuration et gestion des risques. Idéal pour les cadres qui veulent monter en compétence rapidement.",
    audience:
      "Cadres bancaires, chargés de clientèle, entrepreneurs, consultants souhaitant une mise à niveau rapide et opérationnelle.",
    outcomes: [
      "Maîtriser les fondamentaux du fiqh al-mu'amalat",
      "Comprendre les structures Murabaha, Ijara, Mudaraba, Musharaka",
      "Identifier et éviter le riba, gharar et maysir",
      "Analyser un contrat conforme à la Charia",
      "Obtenir une attestation professionnelle USFUR",
    ],
    modules: [
      { title: "Semaine 1 — Fondamentaux", description: "Principes de la Charia, sources du fiqh, prohibitions majeures." },
      { title: "Semaine 2 — Produits & Contrats", description: "Murabaha, Ijara, Salam, Istisna, Sukuk, Takaful." },
      { title: "Semaine 3 — Pratique & Certification", description: "Études de cas, gestion des risques, examen final." },
    ],
    price: "Sur demande",
  },
  {
    slug: "professional-diploma",
    badge: "Le plus populaire",
    badgeIcon: "award",
    duration: "6 mois",
    title: "Diplôme Professionnel en Finance Islamique",
    tagline: "Le parcours complet vers l'expertise",
    summary:
      "Un cursus complet de 6 mois structuré autour des 8 modules de référence USFUR alignés sur les standards AAOIFI. Combine cours théoriques, études de cas, projets professionnels et stage optionnel pour former des experts reconnus.",
    audience:
      "Professionnels de la finance, régulateurs, dirigeants d'institutions financières, consultants et chercheurs en finance islamique.",
    outcomes: [
      "Expertise approfondie sur l'ensemble des produits et instruments",
      "Capacité à structurer des transactions conformes",
      "Maîtrise des normes AAOIFI et IFSB",
      "Compétences en gouvernance Charia et audit",
      "Diplôme professionnel USFUR reconnu",
    ],
    modules: [
      { title: "Module 1 — Charia & Fiqh al-Mu'amalat", description: "Fondements juridiques et principes fondamentaux." },
      { title: "Module 2 — Produits Bancaires Islamiques", description: "Financements, dépôts, comptes participatifs." },
      { title: "Module 3 — Marchés de Capitaux Islamiques", description: "Sukuk, fonds Charia-compatibles, indices." },
      { title: "Module 4 — Gouvernance Charia", description: "Sharia Supervisory Board, audit, conformité." },
      { title: "Module 5 — Takaful & Assurance Islamique", description: "Modèles Wakala, Mudaraba, retakaful." },
      { title: "Module 6 — Microfinance Islamique", description: "Inclusion financière, waqf, zakat productif." },
      { title: "Module 7 — Fintech & Innovation", description: "Blockchain, crowdfunding, digital banking Charia." },
      { title: "Module 8 — Projet Professionnel", description: "Mémoire, soutenance, certification." },
    ],
    price: "Sur demande",
  },
];

const waMessage = (title: string) =>
  `https://wa.me/237690895554?text=${encodeURIComponent(
    `Bonjour, je souhaite m'inscrire à la formation « ${title} » et recevoir plus d'informations.`,
  )}`;

const FormationDetail = () => {
  const { slug } = useParams();
  const formation = formations.find((f) => f.slug === slug);

  if (!formation) return <Navigate to="/cours" replace />;

  const Icon = formation.badgeIcon === "zap" ? Zap : Award;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroBg.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gold-light text-secondary mb-4">
                <Icon className="w-3.5 h-3.5" /> {formation.badge}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 break-words">
                {formation.title}
              </h1>
              <p className="text-lg text-primary font-medium mb-6">{formation.tagline}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {formation.duration}</span>
                <span className="inline-flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> Certifiant</span>
                <span className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Présentiel / En ligne</span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Résumé</h2>
                <p className="text-muted-foreground leading-relaxed break-words">{formation.summary}</p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Public cible</h2>
                <p className="text-muted-foreground leading-relaxed break-words">{formation.audience}</p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Ce que vous allez maîtriser</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {formation.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="break-words">{o}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="modules">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Modules du programme</h2>
                <div className="space-y-4">
                  {formation.modules.map((m, i) => (
                    <motion.div
                      key={m.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary font-heading font-bold inline-flex items-center justify-center">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-heading font-semibold text-foreground break-words">{m.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 break-words">{m.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar CTA */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Inscription</p>
                <h3 className="font-heading text-xl font-bold text-foreground mb-1 break-words">{formation.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{formation.duration} · {formation.price}</p>

                <div className="space-y-3">
                  <Button className="w-full gap-2" asChild>
                    <Link to="/auth">
                      S'inscrire maintenant <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={waMessage(formation.title)} target="_blank" rel="noopener">
                      <MessageSquare className="w-4 h-4" /> Contacter via WhatsApp
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/cours">← Voir toutes les formations</Link>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground space-y-1.5">
                  <p>· Financement possible pour institutions</p>
                  <p>· Sessions inter et intra-entreprise</p>
                  <p>· Attestation / diplôme USFUR</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FormationDetail;
