import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">Get In Touch</h2>
          <p className="text-muted-foreground">Start Your Journey Today</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* WhatsApp CTA */}
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground mb-12">
            <h3 className="font-heading font-bold text-xl mb-3">Book via WhatsApp</h3>
            <p className="text-sm opacity-90 mb-6">Click below to contact us directly on WhatsApp and book your consultation.</p>
            <Button
              variant="secondary"
              size="lg"
              className="gap-2"
              asChild
            >
              <a
                href="https://wa.me/237690895554?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20for%20Islamic%20finance."
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="w-4 h-4" /> Start Conversation
              </a>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <MapPin className="w-5 h-5 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Address</h4>
              <p className="text-xs text-muted-foreground">Akwa, 360 rue Drouot 15574</p>
              <p className="text-xs text-muted-foreground">B.P: 4915</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <Phone className="w-5 h-5 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Phone</h4>
              <p className="text-xs text-muted-foreground">+237 620 73 55 32</p>
              <p className="text-xs text-muted-foreground">+237 690 89 55 54</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <Mail className="w-5 h-5 text-primary mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Email</h4>
              <p className="text-xs text-muted-foreground">info@usfur.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
