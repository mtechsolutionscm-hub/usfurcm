import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Users, Filter } from "lucide-react";

const WHATSAPP_BASE = "https://wa.me/";

const BulkCommunication = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [messageTemplate, setMessageTemplate] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [enrollRes, profilesRes, coursesRes] = await Promise.all([
      supabase.from("enrollments").select("student_id, course_id"),
      supabase.from("profiles").select("user_id, full_name, phone"),
      supabase.from("courses").select("id, title, module_number"),
    ]);

    setCourses(coursesRes.data || []);

    const profilesMap = Object.fromEntries((profilesRes.data || []).map(p => [p.user_id, p]));
    const enrollments = enrollRes.data || [];
    const coursesMap = Object.fromEntries((coursesRes.data || []).map(c => [c.id, c]));

    const studentMap: Record<string, { id: string; name: string; phone: string; courseIds: string[] }> = {};
    for (const e of enrollments) {
      if (!studentMap[e.student_id]) {
        const p = profilesMap[e.student_id];
        studentMap[e.student_id] = { id: e.student_id, name: p?.full_name || "—", phone: p?.phone || "", courseIds: [] };
      }
      studentMap[e.student_id].courseIds.push(e.course_id);
    }

    setStudents(Object.values(studentMap));
  };

  const filteredStudents = filterCourse
    ? students.filter(s => s.courseIds.includes(filterCourse))
    : students;

  const toggleStudent = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const sendWhatsAppBulk = () => {
    const selected = filteredStudents.filter(s => selectedIds.has(s.id) && s.phone);
    if (selected.length === 0) {
      toast({ variant: "destructive", title: "Sélectionnez des étudiants avec un numéro de téléphone" });
      return;
    }
    if (!messageTemplate.trim()) {
      toast({ variant: "destructive", title: "Rédigez un message" });
      return;
    }

    // Open WhatsApp for first student (bulk WhatsApp requires individual sends)
    for (const s of selected) {
      const phone = s.phone.replace(/\s/g, "").replace(/^\+/, "");
      const msg = messageTemplate.replace("{nom}", s.name);
      window.open(`${WHATSAPP_BASE}${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    }
    toast({ title: `${selected.length} conversation(s) WhatsApp ouvertes ✅` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-primary" /> Communication
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-semibold text-sm">Message WhatsApp</h3>
            <div className="space-y-2">
              <Label>Modèle de message</Label>
              <Textarea
                value={messageTemplate}
                onChange={e => setMessageTemplate(e.target.value)}
                placeholder="Bonjour {nom}, nous vous informons que..."
                rows={5}
              />
              <p className="text-[10px] text-muted-foreground">Utilisez {"{nom}"} pour insérer le nom de l'étudiant.</p>
            </div>
            <Button onClick={sendWhatsAppBulk} disabled={selectedIds.size === 0} className="gap-2 w-full">
              <Send className="w-4 h-4" /> Envoyer via WhatsApp ({selectedIds.size})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              className="border border-border rounded-lg px-3 py-2 text-sm bg-card flex-1"
              value={filterCourse}
              onChange={e => setFilterCourse(e.target.value)}
            >
              <option value="">Tous les étudiants</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>Module {c.module_number}: {c.title}</option>
              ))}
            </select>
          </div>

          <div className="bg-card rounded-xl border border-border">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <button onClick={selectAll} className="text-xs text-primary hover:underline">
                {selectedIds.size === filteredStudents.length ? "Désélectionner tout" : "Tout sélectionner"}
              </button>
              <span className="text-xs text-muted-foreground">{filteredStudents.length} étudiant(s)</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
              {filteredStudents.map(s => (
                <label key={s.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(s.id)}
                    onChange={() => toggleStudent(s.id)}
                    className="accent-[hsl(var(--primary))]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.phone || "Pas de téléphone"}</p>
                  </div>
                </label>
              ))}
              {filteredStudents.length === 0 && (
                <p className="p-6 text-sm text-muted-foreground text-center">Aucun étudiant</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkCommunication;
