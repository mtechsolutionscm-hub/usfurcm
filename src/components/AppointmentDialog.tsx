import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CalendarCheck, MessageCircle, Mail } from "@/components/icons";

const WHATSAPP_NUMBER = "237690895554";
const CONTACT_EMAIL = "contact@usfurcm.com";

const schema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(100),
  organisation: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  date: z.string().trim().min(1, "Date souhaitée requise"),
  time: z.string().trim().min(1, "Heure souhaitée requise"),
  subject: z.string().trim().min(2, "Objet requis").max(150),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface Props {
  trigger: React.ReactNode;
}

const buildText = (d: FormData) =>
  `Bonjour USFUR,\n\nJe souhaite prendre rendez-vous.\n\n` +
  `• Nom : ${d.name}\n` +
  (d.organisation ? `• Organisation : ${d.organisation}\n` : "") +
  `• Email : ${d.email}\n` +
  `• Téléphone : ${d.phone}\n` +
  `• Date souhaitée : ${d.date}\n` +
  `• Heure souhaitée : ${d.time}\n` +
  `• Objet : ${d.subject}\n` +
  (d.message ? `\nMessage :\n${d.message}\n` : "") +
  `\nMerci de confirmer la disponibilité.\nCordialement.`;

const AppointmentDialog = ({ trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    subject: "Rencontre institutionnelle",
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
        errs[i.path[0] as keyof FormData] = i.message;
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
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildText(data))}`,
      "_blank",
      "noopener",
    );
    toast({ title: "WhatsApp ouvert", description: "Envoyez votre demande pour confirmer le rendez-vous." });
    setOpen(false);
  };

  const sendEmail = () => {
    const data = validate();
    if (!data) return;
    const subject = `Demande de rendez-vous — ${data.name}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildText(data))}`;
    toast({ title: "Email préparé", description: "Votre client mail va s'ouvrir." });
    setOpen(false);
  };

  const Err = ({ k }: { k: keyof FormData }) =>
    errors[k] ? <p className="text-xs text-destructive mt-1">{errors[k]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" /> Prendre rendez-vous
          </DialogTitle>
          <DialogDescription>
            Remplissez le formulaire — votre demande part sur WhatsApp (+237 690 895 554) ou par Email, déjà pré-remplie.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ap-name">Nom complet *</Label>
              <Input id="ap-name" value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={100} />
              <Err k="name" />
            </div>
            <div>
              <Label htmlFor="ap-org">Organisation</Label>
              <Input id="ap-org" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} maxLength={150} />
            </div>
            <div>
              <Label htmlFor="ap-email">Email *</Label>
              <Input id="ap-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={255} />
              <Err k="email" />
            </div>
            <div>
              <Label htmlFor="ap-phone">Téléphone *</Label>
              <Input id="ap-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} />
              <Err k="phone" />
            </div>
            <div>
              <Label htmlFor="ap-date">Date souhaitée *</Label>
              <Input id="ap-date" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
              <Err k="date" />
            </div>
            <div>
              <Label htmlFor="ap-time">Heure souhaitée *</Label>
              <Input id="ap-time" type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
              <Err k="time" />
            </div>
          </div>
          <div>
            <Label htmlFor="ap-subject">Objet du rendez-vous *</Label>
            <Input id="ap-subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} maxLength={150} />
            <Err k="subject" />
          </div>
          <div>
            <Label htmlFor="ap-msg">Message (optionnel)</Label>
            <Textarea id="ap-msg" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={1500} />
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

export default AppointmentDialog;
