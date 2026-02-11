import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
  LayoutDashboard, BookOpen, Users, Radio, LogOut, Plus, Trash2, Play, Square, Settings, FileQuestion, Pencil, Calendar, Clock, Eye, FileText, DollarSign, TrendingUp, Download, Sheet
} from "lucide-react";
import usfurLogo from "@/assets/usfur-logo.jpg";
import NotificationBell from "@/components/NotificationBell";
import QuizManager from "@/components/QuizManager";
import LiveRoom from "@/components/LiveRoom";
import MobileSidebar from "@/components/MobileSidebar";
import ProformaManager from "@/components/ProformaManager";
import AIAssistant from "@/components/AIAssistant";

type Tab = "overview" | "courses" | "students" | "live" | "quizzes" | "proformas" | "settings";

interface CourseForm {
  title: string;
  description: string;
  module_number: number;
  duration_minutes: number;
  max_participants: number;
  scheduled_at: string;
  status: string;
}

const emptyCourse: CourseForm = {
  title: "",
  description: "",
  module_number: 1,
  duration_minutes: 90,
  max_participants: 50,
  scheduled_at: "",
  status: "draft",
};

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [proformas, setProformas] = useState<any[]>([]);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourse);
  const [activeLiveRoom, setActiveLiveRoom] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewCourse, setViewCourse] = useState<any>(null);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchProformas();

    const coursesChannel = supabase
      .channel("admin-courses-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => fetchCourses())
      .subscribe();
    const enrollmentsChannel = supabase
      .channel("admin-enrollments-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => fetchEnrollments())
      .subscribe();
    const proformasChannel = supabase
      .channel("admin-proformas-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "proformas" }, () => fetchProformas())
      .subscribe();

    return () => {
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(proformasChannel);
    };
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("module_number");
    if (data) setCourses(data);
  };

  const fetchEnrollments = async () => {
    const { data: enrollData } = await supabase.from("enrollments").select("*");
    if (!enrollData) return;
    
    // Fetch all profiles and courses to join manually (no FK from enrollments.student_id to profiles)
    const studentIds = [...new Set(enrollData.map(e => e.student_id))];
    const courseIds = [...new Set(enrollData.map(e => e.course_id))];
    
    const [profilesRes, coursesRes] = await Promise.all([
      studentIds.length > 0 ? supabase.from("profiles").select("user_id, full_name, phone, organization_name").in("user_id", studentIds) : { data: [] },
      courseIds.length > 0 ? supabase.from("courses").select("id, title, module_number").in("id", courseIds) : { data: [] },
    ]);
    
    const profilesMap = Object.fromEntries((profilesRes.data || []).map(p => [p.user_id, p]));
    const coursesMap = Object.fromEntries((coursesRes.data || []).map(c => [c.id, c]));
    
    const enriched = enrollData.map(e => ({
      ...e,
      profiles: profilesMap[e.student_id] || null,
      courses: coursesMap[e.course_id] || null,
    }));
    
    setEnrollments(enriched);
  };

  const fetchProformas = async () => {
    const { data } = await supabase.from("proformas").select("*").order("created_at", { ascending: false });
    if (data) setProformas(data);
  };

  const totalRevenue = proformas.filter(p => p.status === "paid").reduce((s, p) => s + (p.total || 0), 0);
  const pendingRevenue = proformas.filter(p => p.status === "sent").reduce((s, p) => s + (p.total || 0), 0);
  const paidCount = proformas.filter(p => p.status === "paid").length;
  const pendingCount = proformas.filter(p => p.status === "sent").length;

  const exportToCSV = (data: any[], filename: string, headers: string[], getRow: (item: any) => string[]) => {
    const csvContent = [headers.join(";"), ...data.map(item => getRow(item).join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportProformas = () => {
    exportToCSV(proformas, "proformas", ["N°", "Client", "Email", "Téléphone", "Total", "Statut", "Date"],
      p => [p.proforma_number, p.client_name, p.client_email || "", p.client_phone || "", p.total, p.status, new Date(p.created_at).toLocaleDateString("fr-FR")]
    );
    toast({ title: "Export CSV téléchargé ✅" });
  };

  const exportStudents = () => {
    exportToCSV(enrollments, "etudiants", ["Étudiant", "Téléphone", "Organisation", "Cours", "Statut", "Progression", "Date inscription"],
      e => [e.profiles?.full_name || "—", e.profiles?.phone || "—", e.profiles?.organization_name || "—", e.courses?.title || "—", e.status, `${e.progress}%`, new Date(e.enrolled_at).toLocaleDateString("fr-FR")]
    );
    toast({ title: "Export CSV téléchargé ✅" });
  };

  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm(emptyCourse);
    setCourseDialogOpen(true);
  };

  const openEditCourse = (course: any) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || "",
      module_number: course.module_number || 1,
      duration_minutes: course.duration_minutes || 90,
      max_participants: course.max_participants || 50,
      scheduled_at: course.scheduled_at ? course.scheduled_at.slice(0, 16) : "",
      status: course.status || "draft",
    });
    setCourseDialogOpen(true);
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim()) {
      toast({ variant: "destructive", title: "Erreur", description: "Le titre est requis" });
      return;
    }

    const payload = {
      title: courseForm.title.trim(),
      description: courseForm.description.trim() || null,
      module_number: courseForm.module_number,
      duration_minutes: courseForm.duration_minutes,
      max_participants: courseForm.max_participants,
      scheduled_at: courseForm.scheduled_at ? new Date(courseForm.scheduled_at).toISOString() : null,
      status: courseForm.status,
      teacher_id: user?.id,
    };

    if (editingCourse) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editingCourse.id);
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Cours modifié avec succès" });
      }
    } else {
      const { error } = await supabase.from("courses").insert(payload);
      if (error) {
        toast({ variant: "destructive", title: "Erreur", description: error.message });
      } else {
        toast({ title: "Cours créé avec succès" });
      }
    }
    setCourseDialogOpen(false);
    fetchCourses();
  };

  const toggleLive = async (courseId: string, isLive: boolean) => {
    const roomId = !isLive ? crypto.randomUUID() : null;
    await supabase.from("courses").update({
      is_live: !isLive,
      status: !isLive ? "live" : "published",
      live_room_id: roomId,
    }).eq("id", courseId);
    fetchCourses();
    toast({ title: !isLive ? "🔴 Cours en direct démarré" : "Cours en direct arrêté" });
  };

  const deleteCourse = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    setDeleteConfirm(null);
    fetchCourses();
    toast({ title: "Cours supprimé" });
  };

  const getStatusBadge = (course: any) => {
    if (course.is_live) return { label: "🔴 En Direct", className: "bg-destructive/10 text-destructive" };
    switch (course.status) {
      case "draft": return { label: "Brouillon", className: "bg-muted text-muted-foreground" };
      case "published": return { label: "Publié", className: "bg-primary/10 text-primary" };
      case "archived": return { label: "Archivé", className: "bg-muted text-muted-foreground" };
      default: return { label: course.status, className: "bg-muted text-muted-foreground" };
    }
  };

  const sidebarItems: { icon: any; label: string; tab: Tab }[] = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", tab: "overview" },
    { icon: BookOpen, label: "Cours", tab: "courses" },
    { icon: Users, label: "Étudiants", tab: "students" },
    { icon: Radio, label: "Cours en Direct", tab: "live" },
    { icon: FileQuestion, label: "Quiz", tab: "quizzes" },
    { icon: FileText, label: "Proformas", tab: "proformas" },
    { icon: Settings, label: "Paramètres", tab: "settings" },
  ];

  if (activeLiveRoom) {
    return (
      <LiveRoom
        courseId={activeLiveRoom.id}
        courseTitle={activeLiveRoom.title}
        roomId={activeLiveRoom.live_room_id}
        isTeacher
        onLeave={() => setActiveLiveRoom(null)}
      />
    );
  }

  const sidebarContent = (
    <>
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
    </>
  );

  return (
    <div className="min-h-screen flex bg-background font-admin">
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col">
        {sidebarContent}
      </aside>
      <div className="lg:hidden">
        <MobileSidebar>{sidebarContent}</MobileSidebar>
      </div>

      <main className="flex-1 p-4 sm:p-6 overflow-auto pt-14 lg:pt-6">
        <div className="flex items-center justify-end mb-4">
          <NotificationBell />
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Vue d'ensemble</h1>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Cours Total</p>
                <p className="text-3xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Publiés</p>
                <p className="text-3xl font-bold text-primary">{courses.filter(c => c.status === "published" || c.status === "live").length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Étudiants Inscrits</p>
                <p className="text-3xl font-bold text-primary">{enrollments.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">En Direct</p>
                <p className="text-3xl font-bold text-accent">{courses.filter(c => c.is_live).length}</p>
              </div>
            </div>

            {/* Financial Stats */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> Statistiques Financières</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary/5 p-4 sm:p-6 rounded-xl border border-primary/10">
                  <p className="text-sm text-muted-foreground">Revenus Encaissés</p>
                  <p className="text-2xl font-bold text-primary">{totalRevenue.toLocaleString()} <span className="text-sm font-normal">FCFA</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{paidCount} proforma(s) payé(s)</p>
                </div>
                <div className="bg-secondary/5 p-4 sm:p-6 rounded-xl border border-secondary/10">
                  <p className="text-sm text-muted-foreground">En Attente</p>
                  <p className="text-2xl font-bold text-secondary">{pendingRevenue.toLocaleString()} <span className="text-sm font-normal">FCFA</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{pendingCount} proforma(s) en attente</p>
                </div>
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground">Total Proformas</p>
                  <p className="text-2xl font-bold text-foreground">{proformas.length}</p>
                </div>
                <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Taux Conversion</p>
                  <p className="text-2xl font-bold text-foreground">{proformas.length > 0 ? Math.round((paidCount / proformas.length) * 100) : 0}%</p>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={openAddCourse}>
                <Plus className="w-5 h-5" />
                <span className="text-xs">Ajouter un cours</span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={() => setTab("live")}>
                <Radio className="w-5 h-5" />
                <span className="text-xs">Gérer le direct</span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={exportProformas}>
                <Download className="w-5 h-5" />
                <span className="text-xs">Export Proformas</span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={exportStudents}>
                <Sheet className="w-5 h-5" />
                <span className="text-xs">Export Étudiants</span>
              </Button>
            </div>

            {/* Recent proformas */}
            {proformas.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Derniers Proformas</h2>
                <div className="space-y-2">
                  {proformas.slice(0, 5).map(p => (
                    <div key={p.id} className="bg-card p-3 rounded-lg border border-border flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{p.proforma_number} — {p.client_name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{p.total?.toLocaleString()} FCFA</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-primary/10 text-primary" : p.status === "sent" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                          {p.status === "paid" ? "Payé" : p.status === "sent" ? "Envoyé" : "Brouillon"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COURSES */}
        {tab === "courses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold">Gestion des Cours</h1>
              <Button onClick={openAddCourse} className="gap-2">
                <Plus className="w-4 h-4" /> Ajouter un cours
              </Button>
            </div>

            <div className="space-y-3">
              {courses.map((course) => {
                const badge = getStatusBadge(course);
                const courseEnrollments = enrollments.filter(e => e.course_id === course.id);
                return (
                  <div key={course.id} className="bg-card p-4 rounded-xl border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">Module {course.module_number}: {course.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_minutes} min</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{courseEnrollments.length}/{course.max_participants}</span>
                          {course.scheduled_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(course.scheduled_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="ghost" size="sm" onClick={() => setViewCourse(course)} title="Voir">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditCourse(course)} title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {course.is_live && (
                          <Button variant="secondary" size="sm" onClick={() => setActiveLiveRoom(course)} className="gap-1 text-xs">
                            <Radio className="w-3 h-3" /> Rejoindre
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => toggleLive(course.id, course.is_live)} title={course.is_live ? "Arrêter" : "Démarrer en direct"}>
                          {course.is_live ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(course.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {courses.length === 0 && (
                <div className="text-center py-16 space-y-4">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun cours. Cliquez "Ajouter un cours" pour commencer.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab === "students" && (() => {
          // Group enrollments by student
          const studentMap: Record<string, { profile: any; enrollments: any[] }> = {};
          for (const e of enrollments) {
            if (!studentMap[e.student_id]) {
              studentMap[e.student_id] = { profile: e.profiles, enrollments: [] };
            }
            studentMap[e.student_id].enrollments.push(e);
          }
          const groupedStudents = Object.entries(studentMap);

          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold">Étudiants ({groupedStudents.length})</h1>
              <Button variant="outline" size="sm" onClick={exportStudents} className="gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Étudiant</th>
                    <th className="text-left p-3">Téléphone</th>
                    <th className="text-left p-3">Organisation</th>
                    <th className="text-left p-3">Modules inscrits</th>
                    <th className="text-left p-3">Progression moy.</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedStudents.map(([studentId, { profile, enrollments: studentEnrolls }]) => {
                    const avgProgress = studentEnrolls.length > 0
                      ? Math.round(studentEnrolls.reduce((s, e) => s + (e.progress || 0), 0) / studentEnrolls.length)
                      : 0;
                    return (
                      <tr key={studentId} className="border-t border-border hover:bg-muted/50 align-top">
                        <td className="p-3 font-medium">{profile?.full_name || "—"}</td>
                        <td className="p-3 text-xs">{profile?.phone || "—"}</td>
                        <td className="p-3 text-xs">{profile?.organization_name || "—"}</td>
                        <td className="p-3">
                          <div className="space-y-1">
                            {studentEnrolls.map(e => (
                              <div key={e.id} className="flex items-center gap-2 text-xs">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${e.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-700'}`}>
                                  {e.status === 'completed' ? '✓' : '•'}
                                </span>
                                <span>{e.courses?.title || "—"}</span>
                                <span className="text-muted-foreground ml-auto">{e.progress}%</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${avgProgress}%` }} />
                            </div>
                            <span className="text-xs">{avgProgress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {groupedStudents.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Aucun étudiant inscrit</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}

        {/* LIVE */}
        {tab === "live" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Cours en Direct</h1>
            <p className="text-muted-foreground text-sm">Diffusion audio/vidéo WebRTC avec chat interactif.</p>

            {/* Scheduled upcoming */}
            {courses.filter(c => c.scheduled_at && !c.is_live && new Date(c.scheduled_at) > new Date()).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Sessions planifiées</h3>
                {courses.filter(c => c.scheduled_at && !c.is_live && new Date(c.scheduled_at) > new Date()).map(course => (
                  <div key={course.id} className="bg-card p-4 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(course.scheduled_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => toggleLive(course.id, false)} className="gap-1">
                      <Play className="w-3 h-3" /> Démarrer maintenant
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Currently live */}
            {courses.filter(c => c.is_live).length > 0 ? (
              courses.filter(c => c.is_live).map(course => (
                <div key={course.id} className="bg-card p-4 sm:p-6 rounded-xl border-2 border-destructive/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    <h2 className="text-lg font-bold">🔴 {course.title}</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setActiveLiveRoom(course)} className="gap-2">
                      <Radio className="w-4 h-4" /> Rejoindre la salle de diffusion
                    </Button>
                    <Button variant="destructive" onClick={() => toggleLive(course.id, true)} className="gap-2">
                      <Square className="w-4 h-4" /> Arrêter
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card p-12 rounded-xl border border-border text-center">
                <Radio className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun cours en direct. Allez dans "Cours" pour démarrer ou planifier.</p>
              </div>
            )}
          </div>
        )}

        {tab === "quizzes" && <QuizManager courses={courses} />}

        {tab === "proformas" && <ProformaManager courses={courses} />}

        {tab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Paramètres</h1>
            <div className="bg-card p-6 rounded-xl border border-border space-y-4 max-w-md">
              <h3 className="font-semibold">Informations du Compte</h3>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Course Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Modifier le cours" : "Nouveau cours"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Modifiez les informations du cours." : "Remplissez les informations pour créer un nouveau cours."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Ex: Principes de la Finance Islamique" />
              </div>
              <div className="space-y-2">
                <Label>Module N°</Label>
                <Input type="number" min={1} value={courseForm.module_number} onChange={(e) => setCourseForm({ ...courseForm, module_number: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows={3} placeholder="Description du contenu du cours..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durée (min)</Label>
                <Input type="number" min={15} value={courseForm.duration_minutes} onChange={(e) => setCourseForm({ ...courseForm, duration_minutes: parseInt(e.target.value) || 90 })} />
              </div>
              <div className="space-y-2">
                <Label>Max participants</Label>
                <Input type="number" min={1} value={courseForm.max_participants} onChange={(e) => setCourseForm({ ...courseForm, max_participants: parseInt(e.target.value) || 50 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Session planifiée</Label>
              <Input type="datetime-local" value={courseForm.scheduled_at} onChange={(e) => setCourseForm({ ...courseForm, scheduled_at: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <div className="flex items-center gap-4">
                {["draft", "published"].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={courseForm.status === s}
                      onChange={() => setCourseForm({ ...courseForm, status: s })}
                      className="accent-[hsl(var(--primary))]"
                    />
                    {s === "draft" ? "Brouillon" : "Publié"}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>Annuler</Button>
            <Button onClick={saveCourse}>{editingCourse ? "Enregistrer" : "Créer le cours"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Dialog */}
      <Dialog open={!!viewCourse} onOpenChange={() => setViewCourse(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Module {viewCourse?.module_number}: {viewCourse?.title}</DialogTitle>
            <DialogDescription>Détails du cours</DialogDescription>
          </DialogHeader>
          {viewCourse && (
            <div className="space-y-4">
              <p className="text-sm">{viewCourse.description || "Aucune description"}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Durée</p>
                  <p className="font-medium">{viewCourse.duration_minutes} min</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Max participants</p>
                  <p className="font-medium">{viewCourse.max_participants}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <p className="font-medium">{viewCourse.is_live ? "🔴 En Direct" : viewCourse.status}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Inscrits</p>
                  <p className="font-medium">{enrollments.filter(e => e.course_id === viewCourse.id).length}</p>
                </div>
              </div>
              {viewCourse.scheduled_at && (
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="text-xs text-muted-foreground">Session planifiée</p>
                  <p className="font-medium">
                    {new Date(viewCourse.scheduled_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Cette action est irréversible. Le cours et toutes les inscriptions associées seront supprimés.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteCourse(deleteConfirm)}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AIAssistant isAdmin />
    </div>
  );
};

export default AdminDashboard;
