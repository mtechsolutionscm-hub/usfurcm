import usfurLogo from "@/assets/usfur-logo.jpg";

const Footer = () => {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-3">
          <img src={usfurLogo} alt="USFUR Logo" className="h-12 w-auto rounded" />
          <p className="text-xs text-muted-foreground italic">
            Finance Éthique. Compétences Pratiques. Impact Durable.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Usfur Islamic Finance Training & Consulting. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
