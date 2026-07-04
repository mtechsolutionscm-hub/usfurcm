import { useState } from "react";
import { ExternalLink, MessageCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const pricingTabs = ["Per Participant", "Per Cohort", "Individual Trainer", "Organization"] as const;

const pricingData: Record<string, { rows: { label: string; price: string }[] }> = {
  "Per Participant": {
    rows: [
      { label: "Online", price: "315 000 – 455 000 FCFA" },
      { label: "In-Person", price: "525 000 – 840 000 FCFA" },
      { label: "Certified Training", price: "840 000 – 1 050 000 FCFA" },
      { label: "Banking Cadres CEMAC", price: "630 000 FCFA" },
    ],
  },
  "Per Cohort": {
    rows: [
      { label: "Online (10-20 participants)", price: "2 500 000 – 4 000 000 FCFA" },
      { label: "In-Person (10-20 participants)", price: "4 500 000 – 7 000 000 FCFA" },
      { label: "Certified (10-20 participants)", price: "7 500 000 – 10 000 000 FCFA" },
    ],
  },
  "Individual Trainer": {
    rows: [
      { label: "Half-day Session", price: "250 000 FCFA" },
      { label: "Full-day Session", price: "450 000 FCFA" },
      { label: "Weekly Package", price: "1 800 000 FCFA" },
    ],
  },
  "Organization": {
    rows: [
      { label: "Basic Package", price: "3 000 000 FCFA" },
      { label: "Premium Package", price: "6 000 000 FCFA" },
      { label: "Enterprise Package", price: "Custom Pricing" },
    ],
  },
};

const cemacModules = [
  { num: 1, title: "Banking Governance & CEMAC Regulatory Framework", objectives: ["Institutional framework of COBAC and BEAC", "Banking regulations in the CEMAC zone", "Prudential standards and Basel requirements", "Corporate governance of credit institutions", "Rights and obligations of banking executives"] },
  { num: 2, title: "Banking Risk Management", objectives: ["Risk typology in banking environment", "Credit risk assessment and mitigation", "Market risk and ALM management", "Operational risk and internal controls", "Liquidity risk and cash management"] },
  { num: 3, title: "Credit Analysis & Management", objectives: ["Fundamentals of credit analysis", "Financial statement analysis and interpretation", "Cash flow analysis and repayment capacity", "Collateral valuation and guarantee structures", "Credit scoring and rating systems"] },
  { num: 4, title: "Compliance, Audit & AML/CFT", objectives: ["Regulatory compliance framework CEMAC", "Internal audit methodology and standards", "Anti-money laundering fundamentals", "Customer due diligence and KYC", "Suspicious transaction detection and reporting"] },
  { num: 5, title: "Financial Innovation, Digital Banking & Security", objectives: ["Digital transformation in CEMAC banking", "Mobile money and payment systems", "Core banking system modernization", "Cybersecurity fundamentals and threats", "Data protection and GDPR principles"] },
];

const WHATSAPP = "https://wa.me/237690895554";

const CEMACSection = () => {
  const [activeTab, setActiveTab] = useState<string>("Per Participant");

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='%23C9A227' stroke-width='1'><circle cx='30' cy='30' r='28'/><path d='M30 2 L30 58 M2 30 L58 30 M10 10 L50 50 M50 10 L10 50'/></g></svg>")`,
        }}
      />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-4 relative">

        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-gold-light text-secondary text-xs font-medium mb-3">
            -30% Revised Pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
            CEMAC Professional Banking Training
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Comprehensive banking, financial and regulatory training adapted to the CEMAC zone
          </p>
        </div>

        {/* Pricing */}
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4 text-center">Pricing Structure</h3>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {pricingTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            {pricingData[activeTab]?.rows.map((row, i) => (
              <div key={row.label} className={`flex justify-between items-center px-6 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className="text-sm text-foreground">{row.label}</span>
                <span className="text-sm font-semibold text-primary">{row.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target & Deliverables */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">Target Audience</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Banking professionals & executives", "Financial institution managers", "Risk & compliance officers", "Credit analysts & advisors", "Internal & external auditors", "Central bank regulators (COBAC, BEAC)", "Fintech professionals"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <h4 className="font-heading font-semibold text-foreground mb-3">Training Deliverables</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Certificate of completion", "Complete PDF training materials", "Practical exercises & case studies", "Access to online resources", "Post-training support"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CEMAC Modules */}
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6 text-center">Training Modules</h3>
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          {cemacModules.map((m, i) => (
            <motion.div
              key={m.num}
              className="rounded-xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-sm">
                  M{m.num}
                </span>
                <div className="flex-1">
                  <h4 className="font-heading font-semibold text-foreground mb-1">Module {m.num}: {m.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">5 jours (35 heures)</p>
                  <ul className="space-y-1">
                    {m.objectives.map((o, j) => (
                      <li key={o} className="text-xs text-muted-foreground">
                        {String.fromCharCode(105 + j - 1)}. {o}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <ExternalLink className="w-3 h-3" /> View Details
                    </Button>
                    <Button size="sm" className="text-xs gap-1" asChild>
                      <a href={`${WHATSAPP}?text=${encodeURIComponent(`Hello, I am interested in "Module ${m.num}: ${m.title}" from the CEMAC Banking Training UIFTIC.`)}`} target="_blank" rel="noopener">
                        <MessageCircle className="w-3 h-3" /> Book via WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <a href={`${WHATSAPP}?text=${encodeURIComponent("Hello, I would like to enroll in the CEMAC professional banking training. Please contact me with the details.")}`} target="_blank" rel="noopener">
              Contact Us to Enroll
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CEMACSection;
