import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Shield, Award } from "lucide-react";
import usfurLogoAsset from "@/assets/usfur-logo-new.png.asset.json";
const usfurLogo = usfurLogoAsset.url;
import authBgAsset from "@/assets/real/usfur-classic.jpg.asset.json";
const authBg = authBgAsset.url;

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("usfur_remember") === "true");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load saved email if remember me was checked
    if (rememberMe) {
      const savedEmail = localStorage.getItem("usfur_saved_email");
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Save credentials preference
        if (rememberMe) {
          localStorage.setItem("usfur_remember", "true");
          localStorage.setItem("usfur_saved_email", email);
        } else {
          localStorage.removeItem("usfur_remember");
          localStorage.removeItem("usfur_saved_email");
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);

          const userRoles = roles?.map((r: any) => r.role) || [];
          if (userRoles.includes("admin")) {
            navigate("/admin");
          } else if (userRoles.includes("teacher")) {
            navigate("/admin");
          } else {
            navigate("/student");
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Compte créé avec succès", description: "Vous pouvez maintenant vous connecter." });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - Image & branding (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-end justify-center p-12"
        style={{
          backgroundImage: `url(${authBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-white space-y-6 max-w-md mb-16">
          <h2 className="text-3xl font-bold leading-tight">
            Formation d'excellence en Finance Islamique
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Rejoignez des centaines de professionnels formés par USFUR dans la zone CEMAC.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-sm">8 modules de formation certifiés</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-sm">Conforme à la Charia</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
              <span className="text-sm">Certificat de réussite délivré</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-4">
            <a href="/">
              <img src={usfurLogo} alt="USFUR" className="h-16 w-auto rounded-lg" />
            </a>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Connexion" : "Inscription"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Plateforme de formation USFUR
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Votre nom" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            {isLogin && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
                  Se souvenir de moi (2 semaines)
                </Label>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-primary font-medium hover:underline">
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
