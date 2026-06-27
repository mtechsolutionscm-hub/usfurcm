import { ArrowLeft, Globe2, MapPin, Handshake, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import PartnershipDialog from "@/components/PartnershipDialog";
import AppointmentDialog from "@/components/AppointmentDialog";
import { useLanguage } from "@/contexts/LanguageContext";

import bis from "@/assets/partners/bis.png.asset.json";
import iebc from "@/assets/partners/iebc.jpg.asset.json";
import afrilife from "@/assets/partners/afrilife.png.asset.json";
import mupeci from "@/assets/partners/mupeci.png.asset.json";
import savana from "@/assets/partners/savana.jpg.asset.json";
import commercialbank from "@/assets/partners/commercialbank.png.asset.json";
import cbcbank from "@/assets/partners/cbcbank.jpg.asset.json";
import bfi from "@/assets/partners/bfi.png.asset.json";
import ccabank from "@/assets/partners/ccabank.jpg.asset.json";
import sentakaful from "@/assets/partners/sentakaful.png.asset.json";
import askiatakaful from "@/assets/partners/askiatakaful.png.asset.json";

import fieldBIS1 from "@/assets/field/JJAC8844.jpg.asset.json";
import fieldBIS2 from "@/assets/field/OGPX7041.jpg.asset.json";
import fieldBIS3 from "@/assets/field/SAXH8257.jpg.asset.json";
import fieldBIS4 from "@/assets/field/IJGG5746.jpg.asset.json";
import fieldISDB from "@/assets/field/MCNP4527.jpg.asset.json";
import fieldSenTak from "@/assets/field/GTRR1012.jpg.asset.json";
import fieldDelegation from "@/assets/field/GTMA0436.jpg.asset.json";
import fieldLounge from "@/assets/field/SMJT2967.jpg.asset.json";
import fieldTeam1 from "@/assets/field/HEDD9472.jpg.asset.json";
import fieldTeam2 from "@/assets/field/TCMU0097.jpg.asset.json";

const fieldPhotos = [
  { src: fieldBIS1.url, key: "visits.cap.bis1" },
  { src: fieldSenTak.url, key: "visits.cap.sentak" },
  { src: fieldBIS2.url, key: "visits.cap.bis2" },
  { src: fieldISDB.url, key: "visits.cap.isdb" },
  { src: fieldBIS3.url, key: "visits.cap.bis3" },
  { src: fieldBIS4.url, key: "visits.cap.bis4" },
  { src: fieldDelegation.url, key: "visits.cap.delegation" },
  { src: fieldLounge.url, key: "visits.cap.lounge" },
  { src: fieldTeam1.url, key: "visits.cap.team1" },
  { src: fieldTeam2.url, key: "visits.cap.team2" },
];

type Partner = {
  name: string;
  logo: string;
  country: string;
  category: string;
  website?: string;
};

const nationalPartners: Partner[] = [
  { name: "CCA Bank", logo: ccabank.url, country: "Cameroun", category: "Banque Commerciale" },
  { name: "CBC Bank", logo: cbcbank.url, country: "Cameroun", category: "Banque Commerciale" },
  { name: "Commercial Bank", logo: commercialbank.url, country: "Cameroun", category: "Banque Commerciale" },
  { name: "Afrilife Insurance", logo: afrilife.url, country: "Cameroun", category: "Assurance (CCA Holding)" },
  { name: "MUPECI", logo: mupeci.url, country: "Cameroun", category: "Microfinance Coopérative" },
  { name: "BFI - Bourse de la Financière", logo: bfi.url, country: "Cameroun", category: "Marchés Financiers" },
];

const internationalPartners: Partner[] = [
  { name: "Banque Islamique du Sénégal (BIS)", logo: bis.url, country: "Sénégal", category: "Banque Islamique" },
  { name: "SEN TAKAFUL", logo: sentakaful.url, country: "Sénégal", category: "Assurance Takaful" },
  { name: "ASKIA TAKAFUL", logo: askiatakaful.url, country: "Sénégal", category: "Assurance Takaful" },
  { name: "Savana Islamic Finance", logo: savana.url, country: "International", category: "Finance Islamique" },
  { name: "IEBC - International Economics & Business Corp.", logo: iebc.url, country: "International", category: "Conseil Économique" },
];

const PartnerCard = ({ p }: { p: Partner }) => (
  <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center">
    <div className="w-full h-32 flex items-center justify-center bg-white rounded-xl p-4 mb-4 overflow-hidden">
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
        loading="lazy"
      />
    </div>
    <h3 className="font-semibold text-foreground">{p.name}</h3>
    <p className="text-xs text-muted-foreground mt-1">{p.category}</p>
    <span className="text-xs mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
      <MapPin className="w-3 h-3" /> {p.country}
    </span>
  </div>
);

const Partners = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <header className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Handshake className="w-3.5 h-3.5" /> Nos Partenaires
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Un Réseau de Confiance, <span className="text-primary">National & International</span>
            </h1>
            <p className="text-muted-foreground">
              USFUR collabore avec les institutions financières, organismes et entreprises
              de référence pour promouvoir l'écosystème de la finance islamique en Afrique
              et à l'international.
            </p>
          </header>

          {/* National */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Partenaires Nationaux</h2>
                <p className="text-sm text-muted-foreground">Cameroun & zone CEMAC</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {nationalPartners.map((p) => <PartnerCard key={p.name} p={p} />)}
            </div>
          </section>

          {/* International */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Partenaires Internationaux</h2>
                <p className="text-sm text-muted-foreground">Afrique & au-delà</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {internationalPartners.map((p) => <PartnerCard key={p.name} p={p} />)}
            </div>
          </section>

          {/* Field photos — visits & meetings */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Visites & Rencontres Institutionnelles</h2>
                  <p className="text-sm text-muted-foreground">
                    Moments de collaboration avec nos partenaires sur le terrain
                  </p>
                </div>
              </div>
              <AppointmentDialog
                trigger={
                  <Button size="lg" className="gap-2 shrink-0">
                    <CalendarCheck className="w-4 h-4" /> Prendre rendez-vous
                  </Button>
                }
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fieldPhotos.map((photo, i) => (
                <figure
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs md:text-sm font-medium">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>


          {/* CTA */}
          <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-border rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Devenez partenaire d'USFUR</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Rejoignez notre réseau d'institutions engagées pour le développement de la
              finance islamique éthique et conforme à la Charia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <PartnershipDialog
                trigger={
                  <Button size="lg" className="gap-2">
                    <Handshake className="w-4 h-4" /> Formulaire de partenariat
                  </Button>
                }
              />
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://wa.me/237690895554?text=Bonjour%20USFUR%2C%20nous%20souhaitons%20devenir%20partenaire."
                  target="_blank"
                  rel="noopener"
                >
                  Discuter sur WhatsApp
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
