import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import usfurLogoAsset from "@/assets/usfur-logo-new.png.asset.json";
const usfurLogo = usfurLogoAsset.url;

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/usfur_stories?igsh=MXFmMjcyY3VjMmFj",
    icon: faInstagram,
  },
  {
    name: "Facebook",
    href: "https://web.facebook.com/profile.php?id=61589653911070",
    icon: faFacebookF,
  },
  {
    name: "LinkedIn",
    href: "http://linkedin.com/company/usfur-finance-islamique-formation-conseil",
    icon: faLinkedinIn,
  },
];

const Footer = () => {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-3">
          <img src={usfurLogo} alt="USFUR Logo" className="h-12 w-auto rounded" />
          <p className="text-xs text-muted-foreground italic">
            Finance Éthique. Compétences Pratiques. Impact Durable.
          </p>
          <div className="flex items-center gap-4" aria-label="Réseaux sociaux">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-colors"
              >
                <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Usfur Islamic Finance Training & Consulting. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
