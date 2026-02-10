import { Building2, Users, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Building2,
    title: "Banks & Financial Institutions",
    description: "Strategic consulting for implementing Sharia-compliant products and services in traditional banking systems.",
  },
  {
    icon: Users,
    title: "Microfinance Organizations",
    description: "Tailored Islamic microfinance solutions to serve underbanked communities with ethical financial products.",
  },
  {
    icon: Briefcase,
    title: "SMEs & Businesses",
    description: "Business advisory for entrepreneurs seeking halal financing options and Sharia-compliant business structures.",
  },
  {
    icon: GraduationCap,
    title: "Banking Personnel",
    description: "Professional development and certification programs for banking staff in Islamic finance principles.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-primary font-medium text-sm tracking-wider uppercase mb-2">Our Services</h3>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Comprehensive Islamic Finance Solutions
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className="p-6 rounded-xl border border-border bg-background hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-green-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <s.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
