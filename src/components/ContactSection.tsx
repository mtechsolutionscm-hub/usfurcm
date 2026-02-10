import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">Contactez-nous</h2>
          <p className="text-muted-foreground">Commencez votre parcours dès aujourd'hui</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* WhatsApp CTA */}
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground mb-12">
            <h3 className="font-heading font-bold text-xl mb-3">Réserver via WhatsApp</h3>
            <p className="text-sm opacity-90 mb-6">Cliquez ci-dessous pour nous contacter directement sur WhatsApp et réserver votre consultation.</p>
            <Button
              variant="secondary"
              size="lg"
              className="gap-2"
              asChild
            >
              <a
                href="https://wa.me/237690895554?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20consultation%20en%20finance%20islamique."
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="w-4 h-4" /> Démarrer la conversation
              </a>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <MapPin className="w-5 h-5 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Adresse</h4>
              <p className="text-xs text-muted-foreground">Akwa, Rue des écoles, en face Phoenix</p>
              <p className="text-xs text-muted-foreground">B.P: 4915</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <Phone className="w-5 h-5 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Téléphone</h4>
              <p className="text-xs text-muted-foreground">+237 676 253 577</p>
              <p className="text-xs text-muted-foreground">+237 690 895 554</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <Mail className="w-5 h-5 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Email</h4>
              <p className="text-xs text-muted-foreground">usfurislamicfinancetraining@gmail.com</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>RCCM: RC/DLA 2022/B/6388</p>
                <p>NIU: M112217804579T</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
