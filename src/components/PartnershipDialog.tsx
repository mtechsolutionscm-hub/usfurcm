import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Mail, Handshake } from "@/components/icons";

const WHATSAPP_NUMBER = "237690895554";
const CONTACT_EMAIL = "contact@usfurcm.com";

const schema = z.object({
  organisation: z.string().trim().min(2, "Nom requis").max(150),
  contactName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  country: z.string().trim().min(2, "Pays requis").max(80),
  scope: z.enum(["national", "international"]),
  type: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10, "Décrivez votre proposition (10+ caractères)").max(2000),
});

type FormData = z.infer<typeof schema>;

interface Props {
  trigger: React.ReactNode;
  defaultScope?: "national" | "international";
}

const buildText = (d: FormData) =>
  `Bonjour USFUR,\n\nNotre organisation souhaite établir un partenariat ${d.scope === "national" ? "national" : "international"} avec USFUR Islamic Finance.\n\n` +
  `• Organisation : ${d.organisation}\n` +
  `• Contact : ${d.contactName}\n` +
  `• Email : ${d.email}\n` +
  `• Téléphone : ${d.phone}\n` +
  `• Pays : ${d.country}\n` +
  `• Type de partenariat : ${d.type}\n\n` +
  `Message :\n${d.message}\n\nCordialement.`;

const PartnershipDialog = ({ trigger, defaultScope = "national" }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    organisation: "",
    contactName: "",
    email: "",
    phone: "",
    country: "Cameroun",
    scope: defaultScope,
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      r.error.issues.forEach((i) => {
        const k = i.path[0] as keyof FormData;
        errs[k] = i.message;
      });
      setErrors(errs);
      return null;
    }
    setErrors({});
    return r.data;
  };

  const sendWhatsApp = () => {
    const data = validate();
    if (!data) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildText(data))}`;
    window.open(url, "_blank", "noopener");
    toast({ title: "WhatsApp ouvert", description: "Envoyez votre message pour finaliser la demande." });
    setOpen(false);
  };

  const sendEmail = () => {
    const data = validate();
    if (!data) return;
    const subject = `Demande de partenariat ${data.scope} — ${data.organisation}`;
    const body = buildText(data);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast({ title: "Email préparé", description: "Votre client mail va s'ouvrir." });
    setOpen(false);
  };

  const Err = ({ k }: { k: keyof FormData }) =>
    errors[k] ? <p className="text-xs text-destructive mt-1">{errors[k]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-primary" /> Demande de partenariat
          </DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire — envoyez ensuite votre demande par WhatsApp ou Email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Type de partenariat</Label>
            <RadioGroup
              value={form.scope}
              onValueChange={(v) => update("scope", v as "national" | "international")}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="p-nat" value="national" />
                <Label htmlFor="p-nat" className="font-normal cursor-pointer">National</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="p-int" value="international" />
                <Label htmlFor="p-int" className="font-normal cursor-pointer">International</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="org">Organisation *</Label>
              <Input id="org" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} maxLength={150} />
              <Err k="organisation" />
            </div>
            <div>
              <Label htmlFor="contact">Nom du contact *</Label>
              <Input id="contact" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} maxLength={100} />
              <Err k="contactName" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={255} />
              <Err k="email" />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} />
              <Err k="phone" />
            </div>
            <div>
              <Label htmlFor="country">Pays *</Label>
              <Input id="country" value={form.country} onChange={(e) => update("country", e.target.value)} maxLength={80} />
              <Err k="country" />
            </div>
            <div>
              <Label htmlFor="type">Domaine / type *</Label>
              <Input id="type" placeholder="Banque, microfinance, assurance…" value={form.type} onChange={(e) => update("type", e.target.value)} maxLength={120} />
              <Err k="type" />
            </div>
          </div>

          <div>
            <Label htmlFor="msg">Votre proposition *</Label>
            <Textarea id="msg" rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={2000} />
            <Err k="message" />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={sendEmail} className="gap-2">
            <Mail className="w-4 h-4" /> Envoyer par Email
          </Button>
          <Button onClick={sendWhatsApp} className="gap-2">
            <MessageCircle className="w-4 h-4" /> Envoyer via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipDialog;
