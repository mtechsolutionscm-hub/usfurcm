import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "@/components/icons";

const faqs = [
  { q: "What is Islamic Finance?", a: "Islamic Finance is a financial system that operates according to Islamic law (Sharia). It prohibits interest (riba), excessive uncertainty (gharar), and investments in prohibited industries. Instead, it promotes risk-sharing, asset-backed transactions, and ethical investing." },
  { q: "What is AAOIFI and why is it important?", a: "AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) is an international body that sets standards for Islamic finance. Our training programs are aligned with AAOIFI standards, ensuring globally recognized quality and compliance." },
  { q: "What is CEMAC and COBAC?", a: "CEMAC (Economic and Monetary Community of Central Africa) is a regional economic organization. COBAC (Central African Banking Commission) is its banking supervisory body. Our CEMAC Banking Training is specifically designed for professionals operating within this regulatory framework." },
  { q: "Who can enroll in the training programs?", a: "Our programs are open to banking professionals, finance students, entrepreneurs, compliance officers, and anyone interested in Islamic finance or CEMAC banking regulations. No prior experience in Islamic finance is required for introductory modules." },
  { q: "What are the fees for Islamic Finance training?", a: "The admission fee is 50,000 FCFA and each module costs 250,000 FCFA. The complete Professional Diploma program offers comprehensive coverage across all modules." },
  { q: "What are the fees for CEMAC Banking Training?", a: "CEMAC Banking Training pricing varies based on format: Online (315,000-455,000 FCFA), In-Person (525,000-840,000 FCFA), and Certified Training (840,000-1,050,000 FCFA) per participant." },
  { q: "Do you provide certificates?", a: "Yes, all our programs provide certificates upon completion. Islamic Finance training provides AAOIFI-aligned certificates, while CEMAC Banking Training provides certificates of completion recognized in the CEMAC region." },
  { q: "Are classes held online or in-person?", a: "We offer both online and in-person training options. Online classes provide flexibility, while in-person sessions offer hands-on learning and networking opportunities." },
  { q: "Do you offer consulting services for businesses?", a: "Yes, we provide comprehensive consulting services for banks, microfinance institutions, and SMEs looking to implement Sharia-compliant financial products and services." },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium text-sm tracking-wider uppercase mb-2">Frequently Asked Questions</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">Got Questions?</h2>
          <p className="text-muted-foreground">Find answers to common questions about our training programs</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground mb-4">Still have questions?</p>
            <Button asChild>
              <a
                href="https://wa.me/237690895554?text=Hello%2C%20I%20have%20questions%20about%20your%20training%20programs."
                target="_blank"
                rel="noopener"
                className="gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
