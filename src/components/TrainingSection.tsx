import { Check, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TrainingSection = () => {
  return (
    <section id="training" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-primary font-medium text-sm tracking-wider uppercase mb-2">Training Programs</h3>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Elevate Your Expertise</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Fast Track */}
          <motion.div
            className="rounded-2xl border border-border bg-card p-8 relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gold-light text-secondary">
                <Zap className="w-3 h-3" /> Fast Track
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">3 Weeks</p>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Accelerated Program</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Intensive fast-track training covering essential Islamic finance principles, products, and practices.
            </p>
            <ul className="space-y-3 mb-8">
              {["Core fundamentals", "Product structures", "Risk management", "Certification"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="w-full" asChild><a href="/auth">Enroll Now</a></Button>
          </motion.div>

          {/* Professional Diploma */}
          <motion.div
            className="rounded-2xl border-2 border-primary bg-card p-8 relative shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                <Award className="w-3 h-3" /> Most Popular
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">6 Months</p>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Professional Diploma</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Comprehensive program with in-depth modules, practical applications, and professional certification.
            </p>
            <ul className="space-y-3 mb-8">
              {["Advanced curriculum", "Case studies", "Industry projects", "Professional certification"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Button className="flex-1" asChild><a href="/auth">Enroll Now</a></Button>
              <Button variant="outline" className="flex-1" asChild><a href="#modules">View Modules</a></Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
