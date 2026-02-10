import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, BookOpen, Radio, User, LogOut, GraduationCap
} from "lucide-react";
import usfurLogo from "@/assets/usfur-logo.jpg";

type Tab = "overview" | "courses" | "live" | "profile";

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [courses, setCourses] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchProfile();
  }, [user]);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").in("status", ["published", "live"]).order("module_number");
    if (data) setCourses(data);
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    const { data } = await supabase.from("enrollments").select("*, courses:course_id(*)").eq("student_id", user.id);
    if (data) setMyEnrollments(data);
  };

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    if (data) setProfile(data);
  };

  const enroll = async (courseId: string) => {
    if (!user) return;
    const { error } = await supabase.from("enrollments").insert({ student_id: user.id, course_id: courseId });
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Inscrit avec succès !" });
      fetchEnrollments();
    }
  };

  const enrolledCourseIds = myEnrollments.map((e) => e.course_id);
  const liveCourses = courses.filter((c) => c.is_live);

  const sidebarItems: { icon: any; label: string; tab: Tab }[] = [
    { icon: LayoutDashboard, label: "Tableau de Bord", tab: "overview" },
    { icon: BookOpen, label: "Mes Cours", tab: "courses" },
    { icon: Radio, label: "Cours en Direct", tab: "live" },
    { icon: User, label: "Mon Profil", tab: "profile" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <img src={usfurLogo} alt="USFUR" className="h-10 rounded" />
          <p className="text-xs text-muted-foreground mt-1">Espace Étudiant</p>
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

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Bienvenue, {profile?.full_name || user?.email} 👋</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Mes Cours</p>
                <p className="text-3xl font-bold text-primary">{myEnrollments.length}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Cours Disponibles</p>
                <p className="text-3xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">En Direct Maintenant</p>
                <p className="text-3xl font-bold text-accent">{liveCourses.length}</p>
              </div>
            </div>

            {liveCourses.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Cours en direct
                </h3>
                {liveCourses.map(c => (
                  <div key={c.id} className="flex items-center justify-between mt-2">
                    <span className="text-sm">{c.title}</span>
                    <Button size="sm" variant="destructive" onClick={() => setTab("live")}>Rejoindre</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "courses" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Cours Disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <div key={course.id} className="bg-card p-5 rounded-xl border border-border space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Module {course.module_number}: {course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{course.description?.slice(0, 120)}</p>
                      </div>
                      {course.is_live && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-1" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>⏱ {course.duration_minutes} min</span>
                      <span>👥 Max {course.max_participants}</span>
                    </div>
                    {isEnrolled ? (
                      <Button variant="outline" size="sm" disabled className="gap-2">
                        <GraduationCap className="w-4 h-4" /> Inscrit ✓
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => enroll(course.id)}>S'inscrire</Button>
                    )}
                  </div>
                );
              })}
              {courses.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-12">Aucun cours disponible pour le moment.</p>
              )}
            </div>
          </div>
        )}

        {tab === "live" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Cours en Direct</h1>
            {liveCourses.length > 0 ? (
              liveCourses.map(course => (
                <div key={course.id} className="bg-card p-6 rounded-xl border-2 border-red-300 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <h2 className="text-lg font-bold">🔴 {course.title}</h2>
                  </div>
                  <div className="bg-black/90 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center text-white space-y-3">
                      <Radio className="w-12 h-12 mx-auto text-red-400" />
                      <p className="text-lg font-medium">Cours en Direct</p>
                      <p className="text-sm text-gray-400">Flux vidéo/audio du professeur</p>
                    </div>
                  </div>
                  <StudentLiveChat courseId={course.id} />
                </div>
              ))
            ) : (
              <div className="bg-card p-12 rounded-xl border border-border text-center">
                <Radio className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun cours en direct pour le moment.</p>
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Mon Profil</h1>
            <div className="bg-card p-6 rounded-xl border border-border space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <Input value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                <Input value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <Button onClick={async () => {
                if (!user) return;
                await supabase.from("profiles").update({ full_name: profile?.full_name, phone: profile?.phone }).eq("user_id", user.id);
                toast({ title: "Profil mis à jour" });
              }}>Sauvegarder</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Student live chat
function StudentLiveChat({ courseId }: { courseId: string }) {
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
      .channel(`live-student-${courseId}`)
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
            <span>{m.content}</span>
          </div>
        ))}
        {messages.length === 0 && <p className="text-xs text-muted-foreground text-center">Aucun message</p>}
      </div>
      <div className="flex gap-2 p-3 border-t border-border">
        <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Poser une question..." onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1" />
        <Button size="sm" onClick={sendMessage}>Envoyer</Button>
      </div>
    </div>
  );
}

export default StudentDashboard;
