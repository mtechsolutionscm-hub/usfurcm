import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "FR" | "EN";

type Dict = Record<string, { FR: string; EN: string }>;

const dict: Dict = {
  // Navbar
  "nav.home": { FR: "Accueil", EN: "Home" },
  "nav.services": { FR: "Services", EN: "Services" },
  "nav.training": { FR: "Formation", EN: "Training" },
  "nav.modules": { FR: "Modules", EN: "Modules" },
  "nav.partners": { FR: "Partenaires", EN: "Partners" },
  "nav.gallery": { FR: "Galerie", EN: "Gallery" },
  "nav.about": { FR: "À Propos", EN: "About" },
  "nav.contact": { FR: "Contact", EN: "Contact" },
  "nav.myspace": { FR: "Mon Espace", EN: "My Space" },
  "nav.login": { FR: "Connexion", EN: "Login" },
  "nav.signup": { FR: "S'inscrire", EN: "Sign Up" },
  "nav.book": { FR: "Réserver une Consultation", EN: "Book a Consultation" },
  "nav.bookShort": { FR: "Réserver", EN: "Book" },

  // Hero
  "hero.badge": { FR: "L'excellence au service de votre réussite", EN: "Essential for Success" },
  "hero.title2": { FR: "Formation & Conseil", EN: "Training & Consulting" },
  "hero.desc": {
    FR: "Conseil expert et formation professionnelle en finance conforme à la Charia pour banques, microfinances et PME.",
    EN: "Expert consulting and professional training in Sharia-compliant finance for banks, microfinances, and SMEs.",
  },
  "hero.cta.book": { FR: "Réserver une Consultation", EN: "Book Consultation" },
  "hero.cta.programs": { FR: "Voir les Programmes", EN: "View Programs" },

  // Professional carousel
  "pro.eyebrow": { FR: "Professionnels en Action", EN: "Professionals in Action" },
  "pro.title": { FR: "L'excellence de la finance islamique africaine", EN: "Excellence in African Islamic finance" },
  "pro.subtitle": {
    FR: "Découvrez nos experts, conseillers et partenaires œuvrant chaque jour pour une finance éthique et conforme à la Charia.",
    EN: "Meet the experts, advisors and partners shaping ethical, Sharia-compliant finance every day.",
  },

  // Services section
  "services.eyebrow": { FR: "Nos Services", EN: "Our Services" },
  "services.title": { FR: "Solutions Complètes en Finance Islamique", EN: "Complete Solutions in Islamic Finance" },
  "services.more": { FR: "Voir plus", EN: "Show more" },
  "services.less": { FR: "Voir moins", EN: "Show less" },

  // Modules section
  "modules.badge": { FR: "Conforme AAOIFI", EN: "AAOIFI Compliant" },
  "modules.title": { FR: "Modules de Formation en Finance Islamique", EN: "Islamic Finance Training Modules" },
  "modules.subtitle": {
    FR: "Programme complet suivant les normes internationales AAOIFI",
    EN: "Comprehensive program aligned with AAOIFI international standards",
  },
  "modules.carousel.eyebrow": { FR: "Aperçu du Programme", EN: "Program Preview" },
  "modules.carousel.title": { FR: "Plongez au cœur de nos modules", EN: "Dive into our modules" },
  "modules.admission": { FR: "Frais d'admission", EN: "Admission fee" },
  "modules.course": { FR: "Frais de cours", EN: "Course fee" },
  "modules.target": { FR: "Public Cible", EN: "Target Audience" },
  "modules.deliverables": { FR: "Livrables de Formation", EN: "Training Deliverables" },
  "modules.objectives": { FR: "Objectifs d'apprentissage :", EN: "Learning objectives:" },
  "modules.fees": { FR: "Frais :", EN: "Fee:" },
  "modules.details": { FR: "Détails", EN: "Details" },
  "modules.enroll": { FR: "S'inscrire au Programme", EN: "Enroll in the Program" },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "FR";
    return (localStorage.getItem("usfur_lang") as Lang) || "FR";
  });

  useEffect(() => {
    localStorage.setItem("usfur_lang", lang);
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => dict[key]?.[lang] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
