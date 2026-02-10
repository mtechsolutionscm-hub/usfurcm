import { motion } from "framer-motion";

const testimonials = [
  { name: "Amadou Diallo", role: "Senior Banking Officer", company: "Afriland First Bank", initials: "AD", text: "The training completely transformed my understanding of Sharia-compliant products. I now lead our Islamic banking division with confidence. The practical case studies were invaluable." },
  { name: "Fatima Ndiaye", role: "Compliance Director", company: "Microfinance Institution", initials: "FN", text: "Exceptional program! The depth of knowledge in Sukuk and Takaful modules helped our institution launch three new Sharia-compliant products within 6 months of completing the training." },
  { name: "Ibrahim Boubacar", role: "Finance Manager", company: "SME Owner", initials: "IB", text: "As a business owner, understanding Islamic finance has opened new funding opportunities. The instructors are experts who bring real-world experience to every session." },
  { name: "Mariama Camara", role: "Risk Analyst", company: "Regional Bank", initials: "MC", text: "The governance and risk management modules were exactly what I needed. Clear explanations of complex concepts and excellent support throughout the program." },
  { name: "Ousmane Bah", role: "Investment Advisor", company: "Financial Consultancy", initials: "OB", text: "Best investment in my career. The certification is now recognized by major financial institutions in the region. Highly recommend to anyone in finance." },
  { name: "Aisha Toure", role: "Branch Manager", company: "Islamic Bank", initials: "AT", text: "The bilingual approach (French/English) made complex concepts accessible. The networking opportunities with fellow professionals were an added bonus." },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-2">Success Stories</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">What Our Trainees Say</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Hear from professionals who transformed their careers with our Islamic Finance training
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="p-6 rounded-xl bg-background border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
