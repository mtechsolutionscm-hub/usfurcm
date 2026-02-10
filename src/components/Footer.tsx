const Footer = () => {
  return (
    <footer className="py-8 bg-card border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-xs">UIF</span>
          </div>
          <span className="font-heading font-bold text-foreground">Usfur Islamic Finance</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Usfur Islamic Finance Training & Consulting. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
