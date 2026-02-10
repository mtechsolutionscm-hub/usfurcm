import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, BookOpen, Users, Radio, LogOut, Plus, Trash2, Play, Square, Settings
} from "lucide-react";
import usfurLogo from "@/assets/usfur-logo.jpg";

type Tab = "overview" | "courses" | "students" | "live" | "settings";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", module_number: 1, duration_minutes: 90, max_participants: 50 });

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("module_number");
    if (data) setCourses(data);
  };

  const fetchEnrollments = async () => {
    const { data } = await supabase.from("enrollments").select("*, profiles:student_id(full_name), courses:course_id(title)");
    if (data) setEnrollments(data);
  };

  const addCourse = async () => {
    const { error } = await supabase.from("courses").insert({
      ...newCourse,
      teacher_id: user?.id,
      status: "published",
    });
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Cours ajouté" });
      setShowAddCourse(false);
      setNewCourse({ title: "", description: "", module_number: 1, duration_minutes: 90, max_participants: 50 });
      fetchCourses();
    }
  };

  const toggleLive = async (courseId: string, isLive: boolean) => {
    await supabase.from("courses").update({
      is_live: !isLive,
      status: !isLive ? "live" : "published",
      live_room_id: !isLive ? crypto.randomUUID() : null,
    }).eq("id", courseId);
    fetchCourses();
    toast({ title: !isLive ? "Cours en direct démarré" : "Cours en direct arrêté" });
  };

  const deleteCourse = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
    toast({ title: "Cours supprimé" });
  };

  const sidebarItems: { icon: any; label: string; tab: Tab }[] = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", tab: "overview" },
    { icon: BookOpen, label: "Cours", tab: "courses" },
    { icon: Users, label: "Étudiants", tab: "students" },
    { icon: Radio, label: "Cours en Direct", tab: "live" },
    { icon: Settings, label: "Paramètres", tab: "settings" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <img src={usfurLogo} alt="USFUR" className="h-10 rounded" />
          <p className="text-xs text-muted-foreground mt-1">Panneau Administrateur</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map(({ icon: Icon, label, tab: t }) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground truncate mb-2">{user?.email}</p>
          <Button variant="outline" size="sm" className="w-full gap-2" onClick={signOut}>
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Cours Total</p>
                <p className="text-3xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Étudiants Inscrits</p>
                <p className="text-3xl font-bold text-primary">{enrollments.length}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Cours en Direct</p>
                <p className="text-3xl font-bold text-accent">{courses.filter(c => c.is_live).length}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "courses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestion des Cours</h1>
              <Button onClick={() => setShowAddCourse(!showAddCourse)} className="gap-2">
                <Plus className="w-4 h-4" /> Ajouter un cours
              </Button>
            </div>
            {showAddCourse && (
              <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Module N°</Label>
                    <Input type="number" value={newCourse.module_number} onChange={(e) => setNewCourse({ ...newCourse, module_number: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Durée (min)</Label>
                    <Input type="number" value={newCourse.duration_minutes} onChange={(e) => setNewCourse({ ...newCourse, duration_minutes: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max participants</Label>
                    <Input type="number" value={newCourse.max_participants} onChange={(e) => setNewCourse({ ...newCourse, max_participants: parseInt(e.target.value) })} />
                  </div>
                </div>
                <Button onClick={addCourse}>Créer le cours</Button>
              </div>
            )}
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Module {course.module_number}: {course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.description?.slice(0, 80)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${course.is_live ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {course.is_live ? "🔴 En Direct" : course.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleLive(course.id, course.is_live)}>
                      {course.is_live ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-muted-foreground text-center py-12">Aucun cours. Cliquez "Ajouter un cours" pour commencer.</p>
              )}
            </div>
          </div>
        )}

        {tab === "students" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Étudiants</h1>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Étudiant</th>
                    <th className="text-left p-3">Cours</th>
                    <th className="text-left p-3">Statut</th>
                    <th className="text-left p-3">Progression</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="p-3">{(e as any).profiles?.full_name || "—"}</td>
                      <td className="p-3">{(e as any).courses?.title || "—"}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{e.status}</span></td>
                      <td className="p-3">{e.progress}%</td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Aucun étudiant inscrit</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "live" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Cours en Direct</h1>
            <p className="text-muted-foreground">Gérez vos sessions de cours en direct avec diffusion audio/vidéo.</p>
            {courses.filter(c => c.is_live).length > 0 ? (
              courses.filter(c => c.is_live).map(course => (
                <div key={course.id} className="bg-card p-6 rounded-xl border-2 border-red-300 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <h2 className="text-lg font-bold">🔴 {course.title} — EN DIRECT</h2>
                  </div>
                  <div className="bg-black/90 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center text-white space-y-3">
                      <Radio className="w-12 h-12 mx-auto text-red-400" />
                      <p className="text-lg font-medium">Diffusion en cours</p>
                      <p className="text-sm text-gray-400">Room ID: {course.live_room_id}</p>
                      <p className="text-xs text-gray-500">WebRTC sera intégré avec un service comme LiveKit ou Daily.co</p>
                    </div>
                  </div>
                  <LiveChat courseId={course.id} />
                  <Button variant="destructive" onClick={() => toggleLive(course.id, true)}>
                    <Square className="w-4 h-4 mr-2" /> Arrêter la diffusion
                  </Button>
                </div>
              ))
            ) : (
              <div className="bg-card p-12 rounded-xl border border-border text-center">
                <Radio className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun cours en direct. Allez dans "Cours" pour démarrer un cours en direct.</p>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <div className="bg-card p-6 rounded-xl border border-border space-y-4">
              <h3 className="font-semibold">Informations du Compte</h3>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
              <p className="text-sm text-muted-foreground">ID: {user?.id}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Live chat component
function LiveChat({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("live_messages")
        .select("*, profiles:user_id(full_name)")
        .eq("course_id", courseId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`live-${courseId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_messages", filter: `course_id=eq.${courseId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [courseId]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !user) return;
    await supabase.from("live_messages").insert({ course_id: courseId, user_id: user.id, content: newMsg });
    setNewMsg("");
  };

  return (
    <div className="border border-border rounded-lg">
      <div className="p-3 border-b border-border bg-muted">
        <h4 className="text-sm font-semibold">💬 Chat en Direct</h4>
      </div>
      <div className="h-48 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-medium text-primary">{(m as any).profiles?.full_name || "Anonyme"}: </span>
            <span className="text-foreground">{m.content}</span>
          </div>
        ))}
        {messages.length === 0 && <p className="text-xs text-muted-foreground text-center">Aucun message</p>}
      </div>
      <div className="flex gap-2 p-3 border-t border-border">
        <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Écrire un message..." onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1" />
        <Button size="sm" onClick={sendMessage}>Envoyer</Button>
      </div>
    </div>
  );
}

export default AdminDashboard;
