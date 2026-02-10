import { ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import module1 from "@/assets/module-1-sharia.jpg";
import module2 from "@/assets/module-2-products.jpg";
import module4 from "@/assets/module-4-governance.jpg";
import module5 from "@/assets/module-5-money.jpg";
import module6 from "@/assets/module-6-crisis.jpg";
import module7 from "@/assets/module-7-takaful.jpg";
import module8 from "@/assets/module-8-sukuk.jpg";

const modules = [
  { num: 1, title: "Fondements de la Charia", duration: "4 semaines", image: module1, objectives: ["Sources de la jurisprudence islamique", "Histoire de la jurisprudence", "Maqaasid Charia et règles jurisprudentielles majeures", "Jurisprudence des transactions", "Principales interdictions et sagesse de l'interdiction"] },
  { num: 2, title: "Produits Financiers Islamiques", duration: "4 semaines", image: module2, objectives: ["Financement participatif + étude de cas", "Financement basé sur la dette (commercial)", "Modes de financement non commerciaux", "Financement de services", "Opérations équivoques"] },
  { num: 3, title: "Comptabilité & Normes AAOIFI", duration: "4 semaines", image: module4, objectives: ["Introduction aux normes AAOIFI", "Traitement comptable des produits islamiques", "Normes de reporting financier islamique", "Audit charia et conformité comptable", "Études de cas pratiques AAOIFI"] },
  { num: 4, title: "Gouvernance & Gestion Bancaire", duration: "4 semaines", image: module4, objectives: ["Organisation bancaire", "Gestion des comptes + étude de cas", "Comités charia et contrôle", "Gestion de la zakat + étude de cas", "Gestion des risques"] },
  { num: 5, title: "La Monnaie en Finance Islamique", duration: "3 semaines", image: module5, objectives: ["Nature et fonctions de la monnaie", "Monnaie et politique monétaire en finance islamique", "Paradigme monétaire en Islam", "Monnaie et inflation"] },
  { num: 6, title: "Crise Financière & Finance Islamique", duration: "3 semaines", image: module6, objectives: ["Introduction à la stabilité financière", "Crises du système financier conventionnel", "Échec des réponses classiques à l'instabilité systémique", "Approches alternatives du risque en FI"] },
  { num: 7, title: "Takaful (Assurance Islamique)", duration: "3 semaines", image: module7, objectives: ["Principes de l'assurance classique", "Raisons de l'interdiction", "Fondements du Takaful (assurance solidaire)", "Modèles de gestion Takaful (wakala, mudaraba)"] },
  { num: 8, title: "Sukuk & Marchés de Capitaux", duration: "3 semaines", image: module8, objectives: ["4 normes AAOIFI pour les marchés", "Gestion de portefeuille et fonds d'investissement", "14 contrats de sukuk nommés", "Gestion d'indices et screening", "Instruments de liquidité et couverture"] },
];

const WHATSAPP = "https://wa.me/237690895554";

const ModulesSection = () => {
  return (
    <section id="modules" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-green-light text-primary text-xs font-medium mb-3">
            Conforme AAOIFI
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Modules de Formation en Finance Islamique
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Programme complet suivant les normes internationales AAOIFI
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm mb-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-light">
            <span className="font-medium text-foreground">Frais d'admission</span>
            <span className="font-bold text-secondary">50 000 FCFA</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-light">
            <span className="font-medium text-foreground">Frais de cours</span>
            <span className="font-bold text-secondary">250 000 FCFA</span>
          </div>
        </div>

        {/* Public cible & Livrables */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="p-6 rounded-xl bg-background border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">Public Cible</h4>
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
            <h4 className="font-heading font-semibold text-foreground mb-3">Livrables de Formation</h4>
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
                <p className="text-[10px] text-muted-foreground font-medium mb-2">Objectifs d'apprentissage :</p>
                <ul className="space-y-1 mb-3">
                  {m.objectives.map((o) => (
                    <li key={o} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span> {o}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Frais :</span>
                  <span className="font-bold text-foreground">250 000 FCFA</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1 text-[10px] px-2">
                    <ExternalLink className="w-3 h-3" /> Détails
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
            <a href="/auth">S'inscrire au Programme</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
