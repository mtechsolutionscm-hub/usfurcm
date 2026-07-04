import { useState } from "react";
import { Menu, X, User, UserPlus, LogIn } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import usfurLogoAsset from "@/assets/usfur-logo-new.png.asset.json";
const usfurLogo = usfurLogoAsset.url;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, isAdmin, isTeacher } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: t("nav.home"), href: "/#home" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.training"), href: "/#training" },
    { label: t("nav.modules"), href: "/cours" },
    { label: t("nav.partners"), href: "/partners" },
    { label: t("nav.gallery"), href: "/#gallery" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  const LangSwitch = () => (
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
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home" className="flex items-center gap-2 min-w-0">
          <img src={usfurLogo} alt="USFUR Logo" className="h-10 w-auto rounded" />
        </a>

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
          <LangSwitch />
          {user ? (
            <Button size="sm" className="gap-1.5" onClick={() => navigate(isAdmin || isTeacher ? "/admin" : "/student")}>
              <User className="w-4 h-4" /> {t("nav.myspace")}
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => navigate("/auth")}>
                <LogIn className="w-4 h-4" /> {t("nav.login")}
              </Button>
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => navigate("/auth?mode=signup")}>
                <UserPlus className="w-4 h-4" /> {t("nav.signup")}
              </Button>
            </>
          )}
          <Button size="sm" asChild>
            <a href="https://wa.me/237690895554?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20consultation%20en%20finance%20islamique." target="_blank" rel="noopener">
              {t("nav.book")}
            </a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-card border-b border-border px-4 pb-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="pt-2">
            <LangSwitch />
          </div>
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
          {user ? (
            <Button size="sm" className="w-full mt-2 gap-2" onClick={() => { setOpen(false); navigate(isAdmin || isTeacher ? "/admin" : "/student"); }}>
              <User className="w-4 h-4" /> {t("nav.myspace")}
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="w-full mt-2 gap-2" onClick={() => { setOpen(false); navigate("/auth"); }}>
                <LogIn className="w-4 h-4" /> {t("nav.login")}
              </Button>
              <Button size="sm" className="w-full mt-1 gap-2" onClick={() => { setOpen(false); navigate("/auth?mode=signup"); }}>
                <UserPlus className="w-4 h-4" /> {t("nav.signup")}
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" className="w-full mt-2" asChild>
            <a href="https://wa.me/237690895554?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20consultation%20en%20finance%20islamique." target="_blank" rel="noopener">
              {t("nav.bookShort")}
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
