import { Shield, Star, Heart, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: Shield, title: "Integrity", desc: "Upholding the highest ethical standards in all our dealings." },
  { icon: Star, title: "Excellence", desc: "Delivering quality training and consulting services." },
  { icon: Heart, title: "Service", desc: "Committed to serving communities with ethical finance." },
  { icon: Lightbulb, title: "Innovation", desc: "Developing modern Islamic finance solutions." },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">About Us</h2>
          <p className="text-primary font-medium mb-6">Your Partner in Islamic Finance Excellence</p>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Usfur Islamic Finance Training & Consulting is a leading institution dedicated to promoting and implementing Sharia-compliant financial solutions across Africa and beyond. Founded with a vision to bridge the gap between conventional finance and Islamic principles, we provide comprehensive training and consulting services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <motion.div
            className="p-6 rounded-xl bg-primary text-primary-foreground"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading font-bold text-lg mb-2">Our Mission</h3>
            <p className="text-sm leading-relaxed opacity-90">
              To empower financial institutions and professionals with the knowledge and tools needed to implement ethical, Sharia-compliant financial solutions.
            </p>
          </motion.div>
          <motion.div
            className="p-6 rounded-xl bg-secondary text-secondary-foreground"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading font-bold text-lg mb-2">Our Vision</h3>
            <p className="text-sm leading-relaxed opacity-90">
              To be the leading center of excellence for Islamic finance education and consulting in Africa.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mx-auto mb-3">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-heading font-semibold text-foreground mb-1">{v.title}</h4>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
