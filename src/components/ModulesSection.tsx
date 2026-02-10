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
  { num: 1, title: "Module 1: Sharia Foundations", duration: "4 weeks", image: module1, objectives: ["Sources of jurisprudence", "History of jurisprudence", "Maqaasid Sharia and major jurisprudential rules", "Jurisprudence of transactions", "Main prohibitions and wisdom of prohibition"] },
  { num: 2, title: "Module 2: Financial Products", duration: "4 weeks", image: module2, objectives: ["Participatory financing + case study", "Debt-based (commercial) financing", "Non-commercial financing modes", "Service financing", "Equivocal operations"] },
  { num: 3, title: "Module 4: Governance & Bank Management", duration: "4 weeks", image: module4, objectives: ["Bank organization", "Account management + case study", "Sharia boards and control", "Zakat management + case study", "Risk management"] },
  { num: 4, title: "Module 5: Money in Islamic Finance", duration: "3 weeks", image: module5, objectives: ["Money, nature and functions", "Money and monetary policy in Islamic finance", "Monetary paradigm in Islam", "Money and inflation"] },
  { num: 5, title: "Module 6: Financial Crisis & Islamic Finance", duration: "3 weeks", image: module6, objectives: ["Financial stability introduction", "Conventional financial system crises", "Failure of classical responses to systemic instability", "Alternative risk approaches in IF"] },
  { num: 6, title: "Module 7: Takaful", duration: "3 weeks", image: module7, objectives: ["Principles of classical insurance", "Reasons for prohibition", "Foundations of Takaful solidarity insurance", "Takaful management models (wakala, mudaraba)"] },
  { num: 7, title: "Module 8: Sukuk & Capital Markets", duration: "3 weeks", image: module8, objectives: ["4 AAOIFI standards for markets", "Portfolio management and investment funds", "14 named sukuk contracts", "Index management and screening", "Liquidity instruments and hedging"] },
];

const WHATSAPP = "https://wa.me/237690895554";

const ModulesSection = () => {
  return (
    <section id="modules" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-green-light text-primary text-xs font-medium mb-3">
            AAOIFI Compliant
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Islamic Finance Training Modules
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Comprehensive curriculum following AAOIFI international standards
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-light">
            <span className="font-medium text-foreground">Admission Fee</span>
            <span className="font-bold text-secondary">50,000 FCFA</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-light">
            <span className="font-medium text-foreground">Course Fee</span>
            <span className="font-bold text-secondary">250,000 FCFA</span>
          </div>
        </div>

        {/* Target Audience & Deliverables */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="p-6 rounded-xl bg-background border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">Target Audience</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Banking professionals & executives", "Sharia compliance officers", "Islamic finance advisors", "Entrepreneurs seeking halal financing", "Finance students & graduates"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-background border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">Training Deliverables</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["AAOIFI-aligned certificate", "Complete PDF training materials", "Practical exercises & case studies", "Access to online resources", "Post-training support"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, i) => (
            <motion.div
              key={m.num}
              className="rounded-xl border border-border bg-background overflow-hidden group hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">Module {m.num}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-card/90 text-foreground rounded-md">{m.duration}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-semibold text-foreground mb-3">{m.title}</h3>
                <p className="text-xs text-muted-foreground font-medium mb-2">Learning Objectives:</p>
                <ul className="space-y-1.5 mb-4">
                  {m.objectives.map((o) => (
                    <li key={o} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span> {o}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Course Fee:</span>
                  <span className="font-bold text-foreground">250,000 FCFA</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs">
                    <ExternalLink className="w-3 h-3" /> View Details
                  </Button>
                  <Button size="sm" className="flex-1 gap-1 text-xs" asChild>
                    <a href={`${WHATSAPP}?text=${encodeURIComponent(`Hello, I am interested in "${m.title}" from the Islamic Finance training program UIFTIC.`)}`} target="_blank" rel="noopener">
                      <MessageCircle className="w-3 h-3" /> Book via WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">Enroll in Program</Button>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
