import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, BookOpen, Radio, User, LogOut, GraduationCap, FileQuestion, MessageCircle, FileText, Eye, Download
} from "lucide-react";
import usfurLogo from "@/assets/usfur-logo.jpg";
import NotificationBell from "@/components/NotificationBell";
import QuizTaker from "@/components/QuizTaker";
import LiveRoom from "@/components/LiveRoom";
import MobileSidebar from "@/components/MobileSidebar";

const WHATSAPP = "https://wa.me/237690895554";

type Tab = "overview" | "courses" | "live" | "quizzes" | "proformas" | "profile";

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [courses, setCourses] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeLiveRoom, setActiveLiveRoom] = useState<any>(null);
  const [myProformas, setMyProformas] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchProfile();
    fetchProformas();

    // Realtime subscriptions
    const coursesChannel = supabase
      .channel("student-courses-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => {
        fetchCourses();
      })
      .subscribe();

    const enrollmentsChannel = supabase
      .channel("student-enrollments-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => {
        fetchEnrollments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(enrollmentsChannel);
    };
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

  const fetchProformas = async () => {
    if (!user) return;
    const { data } = await supabase.from("proformas").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setMyProformas(data);
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
    { icon: FileQuestion, label: "Quiz", tab: "quizzes" },
    { icon: FileText, label: "Mes Proformas", tab: "proformas" },
    { icon: User, label: "Mon Profil", tab: "profile" },
  ];

  if (activeLiveRoom) {
    return (
      <LiveRoom
        courseId={activeLiveRoom.id}
        courseTitle={activeLiveRoom.title}
        roomId={activeLiveRoom.live_room_id}
        isTeacher={false}
        onLeave={() => setActiveLiveRoom(null)}
      />
    );
  }

  const sidebarContent = (
    <>
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
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
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

        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Bienvenue, {profile?.full_name || user?.email} 👋</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Mes Cours</p>
                <p className="text-3xl font-bold text-primary">{myEnrollments.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Cours Disponibles</p>
                <p className="text-3xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">En Direct Maintenant</p>
                <p className="text-3xl font-bold text-accent">{liveCourses.length}</p>
              </div>
            </div>

            {liveCourses.length > 0 && (
              <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20">
                <h3 className="font-semibold text-destructive flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" /> Cours en direct
                </h3>
                {liveCourses.map(c => (
                  <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                    <span className="text-sm">{c.title}</span>
                    <Button size="sm" onClick={() => setActiveLiveRoom(c)}>Rejoindre</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "courses" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Cours Disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <div key={course.id} className="bg-card p-4 sm:p-5 rounded-xl border border-border space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">Module {course.module_number}: {course.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{course.description?.slice(0, 120)}</p>
                      </div>
                      {course.is_live && <div className="w-2 h-2 bg-destructive rounded-full animate-pulse mt-1" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>⏱ {course.duration_minutes} min</span>
                      <span>👥 Max {course.max_participants}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {isEnrolled ? (
                        <Button variant="outline" size="sm" disabled className="gap-2">
                          <GraduationCap className="w-4 h-4" /> Inscrit ✓
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => enroll(course.id)}>S'inscrire</Button>
                      )}
                      {course.is_live && isEnrolled && (
                        <Button size="sm" variant="destructive" onClick={() => setActiveLiveRoom(course)} className="gap-1">
                          <Radio className="w-3 h-3" /> Rejoindre en direct
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-1 text-xs" asChild>
                        <a href={`${WHATSAPP}?text=${encodeURIComponent(`Bonjour, je souhaite obtenir les modalités et le proforma pour le module "${course.title}". Merci.`)}`} target="_blank" rel="noopener">
                          <MessageCircle className="w-3 h-3" /> Modalités & Proforma
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
              {courses.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-12">Aucun cours disponible.</p>
              )}
            </div>
          </div>
        )}

        {tab === "live" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Cours en Direct</h1>
            {liveCourses.length > 0 ? (
              liveCourses.map(course => (
                <div key={course.id} className="bg-card p-4 sm:p-6 rounded-xl border-2 border-destructive/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    <h2 className="text-lg font-bold">🔴 {course.title}</h2>
                  </div>
                  <Button onClick={() => setActiveLiveRoom(course)} className="gap-2">
                    <Radio className="w-4 h-4" /> Rejoindre la session
                  </Button>
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

        {tab === "quizzes" && <QuizTaker courseIds={enrolledCourseIds} />}

        {tab === "proformas" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Mes Proformas</h1>
            {myProformas.length > 0 ? (
              <div className="space-y-3">
                {myProformas.map((p) => {
                  const downloadPDF = () => {
                    const items = (p.items as any[]) || [];
                    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Proforma ${p.proforma_number}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1a1a1a;max-width:800px;margin:0 auto}.header{border-bottom:3px solid #0d6b3d;padding-bottom:20px;margin-bottom:30px}.header h1{color:#0d6b3d;font-size:22px}.proforma-title{text-align:center;background:#0d6b3d;color:white;padding:10px 30px;font-size:18px;font-weight:bold;border-radius:4px;margin-bottom:25px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:25px}.info-box{background:#f8f9fa;padding:15px;border-radius:6px;border-left:3px solid #0d6b3d}.info-box h3{font-size:11px;text-transform:uppercase;color:#0d6b3d;margin-bottom:8px}table{width:100%;border-collapse:collapse;margin-bottom:20px}thead th{background:#0d6b3d;color:white;padding:10px;text-align:left;font-size:11px}tbody td{padding:10px;border-bottom:1px solid #e5e5e5;font-size:12px}.total-row{background:#0d6b3d!important;color:white;font-weight:bold;font-size:14px}.total-row td{border:none;padding:12px}.footer{text-align:center;border-top:2px solid #e5e5e5;padding-top:20px;margin-top:30px;font-size:10px;color:#888}@media print{body{padding:20px}}</style></head><body>
<div class="header"><h1>USFUR Islamic Finance Training & Consulting</h1></div>
<div class="proforma-title">FACTURE PROFORMA N° ${p.proforma_number}</div>
<div class="info-grid"><div class="info-box"><h3>Client</h3><p><strong>${p.client_name}</strong>${p.client_phone ? `<br>Tél: ${p.client_phone}` : ""}</p></div><div class="info-box"><h3>Date</h3><p>${new Date(p.created_at).toLocaleDateString("fr-FR")}</p></div></div>
<table><thead><tr><th>#</th><th>Description</th><th>Qté</th><th style="text-align:right">P.U.</th><th style="text-align:right">Total</th></tr></thead><tbody>
${items.map((item: any, i: number) => `<tr><td>${i+1}</td><td>${item.description}</td><td>${item.quantity}</td><td style="text-align:right">${item.unit_price?.toLocaleString("fr-FR")} FCFA</td><td style="text-align:right">${item.total?.toLocaleString("fr-FR")} FCFA</td></tr>`).join("")}
<tr class="total-row"><td colspan="4" style="text-align:right">TOTAL</td><td style="text-align:right">${p.total?.toLocaleString("fr-FR")} FCFA</td></tr></tbody></table>
<div class="footer"><p>Pour toute question: +237 690 895 554</p></div></body></html>`;
                    const blob = new Blob([html], { type: "text/html" });
                    const win = window.open(URL.createObjectURL(blob), "_blank");
                    if (win) win.onload = () => setTimeout(() => win.print(), 500);
                  };
                  return (
                    <div key={p.id} className="bg-card p-4 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-sm">{p.proforma_number}</h3>
                        <p className="text-sm font-bold">{p.total?.toLocaleString()} FCFA</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{p.status === "paid" ? "Payé" : p.status === "sent" ? "Envoyé" : "Brouillon"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={downloadPDF}>
                          <Download className="w-3 h-3" /> PDF
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1" asChild>
                          <a href={`${WHATSAPP}?text=${encodeURIComponent(`Bonjour, je souhaite procéder au paiement du proforma ${p.proforma_number} d'un montant de ${p.total?.toLocaleString()} FCFA. Merci.`)}`} target="_blank" rel="noopener">
                            <MessageCircle className="w-3 h-3" /> Payer via WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-xl border border-border text-center space-y-4">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Aucun proforma pour le moment.</p>
                <Button variant="outline" asChild>
                  <a href={`${WHATSAPP}?text=${encodeURIComponent("Bonjour, je souhaite obtenir un proforma pour une formation USFUR. Merci.")}`} target="_blank" rel="noopener">
                    <MessageCircle className="w-4 h-4 mr-2" /> Demander un proforma
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Mon Profil</h1>
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

export default StudentDashboard;
