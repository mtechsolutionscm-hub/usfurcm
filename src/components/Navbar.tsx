import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import usfurLogo from "@/assets/usfur-logo.jpg";

const navLinks = [
  { label: "Accueil", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Formation", href: "#training" },
  { label: "Modules", href: "#modules" },
  { label: "À Propos", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "FR">("FR");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home" className="flex items-center gap-2">
          <img src={usfurLogo} alt="USFUR Logo" className="h-10 w-auto rounded" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex rounded-full border border-border overflow-hidden text-xs">
            <button
              onClick={() => setLang("EN")}
              className={`px-3 py-1.5 font-medium transition-colors ${lang === "EN" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("FR")}
              className={`px-3 py-1.5 font-medium transition-colors ${lang === "FR" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              FR
            </button>
          </div>
          <a href="/auth">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <User className="w-4 h-4" /> Connexion
            </Button>
          </a>
          <Button size="sm">Réserver une Consultation</Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-card border-b border-border px-4 pb-4 space-y-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {l.label}
            </a>
          ))}
          <Button size="sm" className="w-full mt-2">Réserver une Consultation</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
