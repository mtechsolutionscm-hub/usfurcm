import { Shield, Star, Heart, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import collage1Asset from "@/assets/field/JJAC8844.jpg.asset.json";
import collage2Asset from "@/assets/field/HEDD9472.jpg.asset.json";
import collage3Asset from "@/assets/field/OGPX7041.jpg.asset.json";
const collage1 = collage1Asset.url;
const collage2 = collage2Asset.url;
const collage3 = collage3Asset.url;

const values = [
  { icon: Shield, title: "Integrity", desc: "Upholding the highest ethical standards in all our dealings." },
  { icon: Star, title: "Excellence", desc: "Delivering quality training and consulting services." },
  { icon: Heart, title: "Service", desc: "Committed to serving communities with ethical finance." },
  { icon: Lightbulb, title: "Innovation", desc: "Developing modern Islamic finance solutions." },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 bg-card overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[480px] sm:h-[560px]"
          >
            {/* Main image */}
            <div className="absolute top-0 left-0 w-[72%] h-[68%] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
              <img
                src={collage1}
                alt="Architecture moderne d'institution financière islamique"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
            </div>

            {/* Bottom-right image */}
            <div className="absolute bottom-0 right-0 w-[62%] h-[52%] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-card">
              <img
                src={collage2}
                alt="Équipe d'experts en finance islamique en réunion"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-secondary/25 via-transparent to-transparent" />
            </div>

            {/* Top-right small card */}
            <div className="absolute top-[8%] right-0 w-[36%] h-[32%] rounded-xl overflow-hidden shadow-xl ring-4 ring-card hidden sm:block">
              <img
                src={collage3}
                alt="Signature d'un contrat de finance islamique"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative shapes */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary opacity-90 -z-10" />
            <div className="absolute -bottom-6 left-[30%] w-32 h-32 rounded-2xl bg-gradient-to-tr from-primary/15 to-secondary/15 backdrop-blur-sm border border-border -z-10" />

            {/* Stats badge */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-border">
              <p className="text-2xl font-heading font-bold text-primary">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Charia Compliant</p>
            </div>
          </motion.div>


          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-gold-light text-secondary text-xs font-medium mb-3">
              About Us
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">Your Partner in Islamic Finance Excellence</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Usfur Islamic Finance Training & Consulting is a leading institution dedicated to promoting and implementing Sharia-compliant financial solutions across Africa and beyond. Founded with a vision to bridge the gap between conventional finance and Islamic principles, we provide comprehensive training and consulting services.
            </p>
          </div>
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
