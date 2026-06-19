import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ctaBg from "@/assets/cta-services-bg.jpg";

const WHATSAPP =
  "https://wa.me/237690895554?text=" +
  encodeURIComponent(
    "Bonjour USFUR, je souhaite découvrir vos produits et services en finance islamique."
  );

const ServicesCTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ctaBg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl text-primary-foreground"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground border border-secondary/30 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" /> Catalogue complet
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Tous nos produits & services <br />
            <span className="text-secondary">de finance islamique</span>
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl">
            Murabaha, Sukuk, Takaful, Ijara, Mudaraba, audit charia, structuration, formation… Découvrez notre catalogue complet et démarrez votre projet via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link to="/services">
                Voir tous nos services <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 bg-transparent border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <a href={WHATSAPP} target="_blank" rel="noopener">
                <MessageCircle className="w-5 h-5" /> Échanger sur WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesCTA;
