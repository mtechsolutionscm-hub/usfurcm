import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Trash2, Bell, Users } from "lucide-react";

const AnnouncementsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentAnnouncements, setSentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchSent();
  }, []);

  const fetchSent = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("type", "announcement")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      // Deduplicate by title+message (sent to multiple users)
      const seen = new Set<string>();
      const deduped: any[] = [];
      for (const n of data) {
        const key = `${n.title}__${n.message}__${n.created_at.slice(0, 16)}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push({ ...n, recipientCount: data.filter(d => d.title === n.title && d.message === n.message && d.created_at.slice(0, 16) === n.created_at.slice(0, 16)).length });
        }
      }
      setSentAnnouncements(deduped);
    }
  };

  const sendAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ variant: "destructive", title: "Remplissez le titre et le message" });
      return;
    }
    setSending(true);

    // Get all students
    const { data: students } = await supabase.from("user_roles").select("user_id").eq("role", "student");
    if (!students || students.length === 0) {
      toast({ variant: "destructive", title: "Aucun étudiant trouvé" });
      setSending(false);
      return;
    }

    const notifications = students.map(s => ({
      user_id: s.user_id,
      title: `📢 ${title.trim()}`,
      message: message.trim(),
      type: "announcement",
    }));

    const { error } = await supabase.from("notifications").insert(notifications);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: `Annonce envoyée à ${students.length} étudiant(s) ✅` });
      setTitle("");
      setMessage("");
      fetchSent();
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <Bell className="w-6 h-6 text-primary" /> Annonces
      </h1>

      <div className="bg-card p-6 rounded-xl border border-border space-y-4 max-w-xl">
        <h3 className="font-semibold text-sm">Nouvelle Annonce</h3>
        <div className="space-y-2">
          <Label>Titre</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Nouvelle session de formation" />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Contenu de l'annonce..." rows={4} />
        </div>
        <Button onClick={sendAnnouncement} disabled={sending} className="gap-2">
          <Send className="w-4 h-4" /> {sending ? "Envoi..." : "Envoyer à tous les étudiants"}
        </Button>
      </div>

      {sentAnnouncements.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Annonces récentes</h3>
          <div className="space-y-2">
            {sentAnnouncements.map(a => (
              <div key={a.id} className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {a.recipientCount} destinataire(s) · {new Date(a.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;
