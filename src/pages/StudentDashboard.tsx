import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  LayoutDashboard, BookOpen, Radio, User, LogOut, GraduationCap, FileQuestion,
  MessageCircle, FileText, Download, Building2, Send, Briefcase, Package
} from "lucide-react";
import usfurLogo from "@/assets/usfur-logo.jpg";
import NotificationBell from "@/components/NotificationBell";
import QuizTaker from "@/components/QuizTaker";
import LiveRoom from "@/components/LiveRoom";
import MobileSidebar from "@/components/MobileSidebar";
import AIAssistant from "@/components/AIAssistant";

const WHATSAPP = "https://wa.me/237690895554";

const SERVICES_CATALOG = [
  { id: "consultation", label: "Consultation en Finance Islamique", price: 150000 },
  { id: "audit_charia", label: "Audit de Conformité Charia", price: 500000 },
  { id: "formation_mesure", label: "Formation sur Mesure (par jour)", price: 300000 },
  { id: "accompagnement", label: "Accompagnement Institutionnel", price: 750000 },
  { id: "etude_faisabilite", label: "Étude de Faisabilité Produit Islamique", price: 400000 },
  { id: "ingenierie_juridique", label: "Ingénierie Juridique Islamique", price: 350000 },
  { id: "conseil_strategique", label: "Conseil Stratégique", price: 450000 },
];

const PRODUCTS_CATALOG = [
  { id: "manuel", label: "Manuel de Finance Islamique USFUR", price: 25000 },
  { id: "kit_formation", label: "Kit de Formation Complet (8 modules)", price: 1800000 },
  { id: "certificat", label: "Certificat de Compétence USFUR", price: 100000 },
  { id: "abonnement_annuel", label: "Abonnement Plateforme Annuel", price: 200000 },
];

type Tab = "overview" | "courses" | "live" | "quizzes" | "proformas" | "profile";

interface ProformaItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [courses, setCourses] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeLiveRoom, setActiveLiveRoom] = useState<any>(null);
  const [myProformas, setMyProformas] = useState<any[]>([]);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchProfile();
    fetchProformas();

    const coursesChannel = supabase
      .channel("student-courses-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => fetchCourses())
      .subscribe();
    const enrollmentsChannel = supabase
      .channel("student-enrollments-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => fetchEnrollments())
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
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
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

  const saveProfile = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      organization_name: profile.organization_name || null,
      organization_type: profile.organization_type || "individual",
      position: profile.position || null,
      address: profile.address || null,
      city: profile.city || null,
      country: profile.country || "Cameroun",
      responsible_name: profile.responsible_name || null,
      responsible_phone: profile.responsible_phone || null,
      responsible_email: profile.responsible_email || null,
      subscribed_services: profile.subscribed_services || [],
      subscribed_products: profile.subscribed_products || [],
    }).eq("user_id", user.id);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Profil mis à jour ✅" });
    }
  };

  const generateProformaNumber = () => {
    const d = new Date();
    return `PF-${d.getFullYear().toString().slice(-2)}${(d.getMonth() + 1).toString().padStart(2, "0")}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
  };

  const buildProformaPDFHtml = (p: any) => {
    const items = (p.items as ProformaItem[]) || [];
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Proforma ${p.proforma_number}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1a1a1a;max-width:800px;margin:0 auto}.header{border-bottom:3px solid #0d6b3d;padding-bottom:20px;margin-bottom:30px}.header h1{color:#0d6b3d;font-size:22px}.header p{font-size:11px;color:#555;line-height:1.6}.proforma-title{text-align:center;background:#0d6b3d;color:white;padding:10px 30px;font-size:18px;font-weight:bold;border-radius:4px;margin-bottom:25px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:25px}.info-box{background:#f8f9fa;padding:15px;border-radius:6px;border-left:3px solid #0d6b3d}.info-box h3{font-size:11px;text-transform:uppercase;color:#0d6b3d;margin-bottom:8px}table{width:100%;border-collapse:collapse;margin-bottom:20px}thead th{background:#0d6b3d;color:white;padding:10px;text-align:left;font-size:11px}tbody td{padding:10px;border-bottom:1px solid #e5e5e5;font-size:12px}tbody tr:nth-child(even){background:#f8f9fa}.total-row{background:#0d6b3d!important;color:white;font-weight:bold;font-size:14px}.total-row td{border:none;padding:12px}.notes{background:#fefce8;border:1px solid #fde047;padding:15px;border-radius:6px;margin-bottom:20px}.notes h3{font-size:11px;color:#854d0e;margin-bottom:6px}.footer{text-align:center;border-top:2px solid #e5e5e5;padding-top:20px;margin-top:30px;font-size:10px;color:#888}@media print{body{padding:20px}@page{margin:15mm}}</style></head><body>
<div class="header"><h1>USFUR Islamic Finance Training & Consulting</h1><p>Cameroun - Zone CEMAC | Tél: +237 690 895 554</p></div>
<div class="proforma-title">FACTURE PROFORMA N° ${p.proforma_number}</div>
<div class="info-grid">
<div class="info-box"><h3>Client</h3><p><strong>${p.client_name}</strong>${p.client_phone ? `<br>Tél: ${p.client_phone}` : ""}${p.client_email ? `<br>Email: ${p.client_email}` : ""}</p></div>
<div class="info-box"><h3>Informations</h3><p>Date: ${new Date(p.created_at).toLocaleDateString("fr-FR")}<br>Devise: FCFA${p.valid_until ? `<br>Valide jusqu'au: ${new Date(p.valid_until).toLocaleDateString("fr-FR")}` : ""}</p></div>
</div>
<table><thead><tr><th style="width:40px">#</th><th>Description</th><th style="width:50px;text-align:center">Qté</th><th style="width:110px;text-align:right">Prix Unit.</th><th style="width:110px;text-align:right">Total</th></tr></thead><tbody>
${items.map((item, i) => `<tr><td>${i + 1}</td><td>${item.description}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${item.unit_price?.toLocaleString("fr-FR")} FCFA</td><td style="text-align:right">${item.total?.toLocaleString("fr-FR")} FCFA</td></tr>`).join("")}
<tr class="total-row"><td colspan="4" style="text-align:right">TOTAL</td><td style="text-align:right">${p.total?.toLocaleString("fr-FR")} FCFA</td></tr></tbody></table>
${p.notes ? `<div class="notes"><h3>Notes</h3><p>${p.notes}</p></div>` : ""}
<div class="footer"><p><strong>USFUR Islamic Finance Training & Consulting</strong><br>Pour toute question: +237 690 895 554<br>💬 WhatsApp: wa.me/237690895554</p></div></body></html>`;
  };

  const downloadPDF = (p: any) => {
    const html = buildProformaPDFHtml(p);
    const blob = new Blob([html], { type: "text/html" });
    const win = window.open(URL.createObjectURL(blob), "_blank");
    if (win) win.onload = () => setTimeout(() => win.print(), 500);
  };

  const generateAndSendProforma = async () => {
    if (!user || !profile) return;
    const items: ProformaItem[] = [];

    // Add selected courses
    for (const cId of selectedCourses) {
      const course = courses.find(c => c.id === cId);
      if (course) items.push({ description: `Module ${course.module_number}: ${course.title}`, quantity: 1, unit_price: 250000, total: 250000 });
    }
    // Add selected services
    for (const sId of selectedServices) {
      const svc = SERVICES_CATALOG.find(s => s.id === sId);
      if (svc) items.push({ description: svc.label, quantity: 1, unit_price: svc.price, total: svc.price });
    }
    // Add selected products
    for (const pId of selectedProducts) {
      const prod = PRODUCTS_CATALOG.find(p => p.id === pId);
      if (prod) items.push({ description: prod.label, quantity: 1, unit_price: prod.price, total: prod.price });
    }

    if (items.length === 0) {
      toast({ variant: "destructive", title: "Sélectionnez au moins un élément" });
      return;
    }

    setGenerating(true);
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    const proformaNumber = generateProformaNumber();
    const clientName = profile.organization_name
      ? `${profile.organization_name} (${profile.full_name || ""})`
      : profile.full_name || user.email || "";

    const payload = {
      proforma_number: proformaNumber,
      client_name: clientName,
      client_email: profile.responsible_email || user.email || null,
      client_phone: profile.responsible_phone || profile.phone || null,
      items: items as any,
      subtotal, tax_rate: 0, tax_amount: 0, total: subtotal,
      status: "sent",
      notes: profile.organization_name ? `Institution: ${profile.organization_name} | Type: ${profile.organization_type || "N/A"}` : null,
      valid_until: validUntil.toISOString(),
      user_id: user.id,
      created_by: user.id,
    };

    const { data, error } = await supabase.from("proformas").insert(payload as any).select().maybeSingle();
    setGenerating(false);

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
      return;
    }

    toast({ title: "Proforma généré et envoyé ! ✅" });
    fetchProformas();
    setGenerateDialogOpen(false);

    // Open PDF and WhatsApp simultaneously
    if (data) {
      downloadPDF(data);
      const itemsList = items.map((i, idx) => `${idx + 1}. ${i.description} - ${i.total.toLocaleString()} FCFA`).join("\n");
      const msg = `📄 *PROFORMA ${proformaNumber}*\n\n👤 Client: ${clientName}\n📧 ${user.email || ""}\n📱 ${profile.phone || ""}\n${profile.organization_name ? `🏢 ${profile.organization_name}\n` : ""}\n📋 Articles:\n${itemsList}\n\n💰 *Total: ${subtotal.toLocaleString()} FCFA*\n\n✅ Proforma généré depuis la plateforme USFUR.\nVeuillez confirmer la réception et les modalités de paiement.`;
      window.open(`${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    setSelectedServices([]);
    setSelectedProducts([]);
    setSelectedCourses([]);
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

  const toggleSelection = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

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
            {profile?.organization_name && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {profile.organization_name}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Mes Cours</p>
                <p className="text-3xl font-bold text-primary">{myEnrollments.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Cours Disponibles</p>
                <p className="text-3xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">En Direct</p>
                <p className="text-3xl font-bold text-accent">{liveCourses.length}</p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">Mes Proformas</p>
                <p className="text-3xl font-bold text-primary">{myProformas.length}</p>
              </div>
            </div>

            {/* Quick action: Generate proforma */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <h3 className="font-semibold text-sm mb-2">🚀 Action rapide</h3>
              <Button size="sm" className="gap-2" onClick={() => setGenerateDialogOpen(true)}>
                <Send className="w-4 h-4" /> Générer un proforma & envoyer
              </Button>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold">Mes Proformas</h1>
              <Button size="sm" className="gap-2" onClick={() => setGenerateDialogOpen(true)}>
                <Send className="w-4 h-4" /> Générer & Envoyer
              </Button>
            </div>
            {myProformas.length > 0 ? (
              <div className="space-y-3">
                {myProformas.map((p) => (
                  <div key={p.id} className="bg-card p-4 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-sm">{p.proforma_number}</h3>
                      <p className="text-sm font-bold">{p.total?.toLocaleString()} FCFA</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {p.status === "paid" ? "Payé" : p.status === "sent" ? "Envoyé" : "Brouillon"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => downloadPDF(p)}>
                        <Download className="w-3 h-3" /> PDF
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" asChild>
                        <a href={`${WHATSAPP}?text=${encodeURIComponent(`Bonjour, je souhaite procéder au paiement du proforma ${p.proforma_number} d'un montant de ${p.total?.toLocaleString()} FCFA. Merci.`)}`} target="_blank" rel="noopener">
                          <MessageCircle className="w-3 h-3" /> Payer via WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-xl border border-border text-center space-y-4">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Aucun proforma pour le moment.</p>
                <Button variant="outline" onClick={() => setGenerateDialogOpen(true)}>
                  <Send className="w-4 h-4 mr-2" /> Générer mon premier proforma
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold">Mon Profil</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><User className="w-4 h-4" /> Informations personnelles</h2>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nom complet</Label>
                    <Input value={profile?.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Téléphone</Label>
                    <Input value={profile?.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+237..." />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input value={user?.email || ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Type de compte</Label>
                    <Select value={profile?.organization_type || "individual"} onValueChange={(v) => setProfile({ ...profile, organization_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Particulier / Étudiant</SelectItem>
                        <SelectItem value="institution">Institution Financière</SelectItem>
                        <SelectItem value="company">Entreprise</SelectItem>
                        <SelectItem value="ngo">ONG / Association</SelectItem>
                        <SelectItem value="government">Administration Publique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><Building2 className="w-4 h-4" /> Organisation / Institution</h2>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nom de l'organisation</Label>
                    <Input value={profile?.organization_name || ""} onChange={(e) => setProfile({ ...profile, organization_name: e.target.value })} placeholder="Ex: Banque Islamique du Cameroun" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Fonction / Poste</Label>
                    <Input value={profile?.position || ""} onChange={(e) => setProfile({ ...profile, position: e.target.value })} placeholder="Directeur, Responsable..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Ville</Label>
                      <Input value={profile?.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="Douala" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Pays</Label>
                      <Input value={profile?.country || "Cameroun"} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Adresse</Label>
                    <Input value={profile?.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Adresse complète" />
                  </div>
                </div>
              </div>

              {/* Responsible Contact */}
              <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><User className="w-4 h-4" /> Contact du responsable (entreprise/institution)</h2>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nom du responsable</Label>
                    <Input value={profile?.responsible_name || ""} onChange={(e) => setProfile({ ...profile, responsible_name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Téléphone du responsable</Label>
                    <Input value={profile?.responsible_phone || ""} onChange={(e) => setProfile({ ...profile, responsible_phone: e.target.value })} placeholder="+237..." />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email du responsable</Label>
                    <Input value={profile?.responsible_email || ""} onChange={(e) => setProfile({ ...profile, responsible_email: e.target.value })} placeholder="responsable@institution.com" />
                  </div>
                </div>
              </div>

              {/* Subscriptions summary */}
              <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                <h2 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4" /> Résumé</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Cours inscrits:</span> <strong>{myEnrollments.length}</strong></p>
                  <p><span className="text-muted-foreground">Proformas:</span> <strong>{myProformas.length}</strong></p>
                  <p><span className="text-muted-foreground">Type:</span> <strong>{
                    profile?.organization_type === "institution" ? "Institution Financière" :
                    profile?.organization_type === "company" ? "Entreprise" :
                    profile?.organization_type === "ngo" ? "ONG / Association" :
                    profile?.organization_type === "government" ? "Administration Publique" :
                    "Particulier / Étudiant"
                  }</strong></p>
                </div>
                <Button className="w-full gap-2" onClick={() => setGenerateDialogOpen(true)}>
                  <Send className="w-4 h-4" /> Générer un proforma
                </Button>
              </div>
            </div>

            <Button onClick={saveProfile} className="gap-2">
              Sauvegarder le profil
            </Button>
          </div>
        )}
      </main>

      {/* Generate Proforma Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Générer un proforma</DialogTitle>
            <DialogDescription>Sélectionnez les cours, services et produits souhaités. Le proforma sera généré en PDF et envoyé via WhatsApp.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {/* Courses */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1"><BookOpen className="w-3 h-3" /> Modules de formation</Label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {courses.map(c => (
                  <label key={c.id} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/30 cursor-pointer text-sm">
                    <Checkbox
                      checked={selectedCourses.includes(c.id)}
                      onCheckedChange={() => toggleSelection(selectedCourses, setSelectedCourses, c.id)}
                    />
                    <span className="flex-1">M{c.module_number}: {c.title}</span>
                    <span className="text-xs text-muted-foreground">250 000 FCFA</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1"><Briefcase className="w-3 h-3" /> Services</Label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {SERVICES_CATALOG.map(s => (
                  <label key={s.id} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/30 cursor-pointer text-sm">
                    <Checkbox
                      checked={selectedServices.includes(s.id)}
                      onCheckedChange={() => toggleSelection(selectedServices, setSelectedServices, s.id)}
                    />
                    <span className="flex-1">{s.label}</span>
                    <span className="text-xs text-muted-foreground">{s.price.toLocaleString()} FCFA</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1"><Package className="w-3 h-3" /> Produits</Label>
              <div className="space-y-1.5">
                {PRODUCTS_CATALOG.map(p => (
                  <label key={p.id} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/30 cursor-pointer text-sm">
                    <Checkbox
                      checked={selectedProducts.includes(p.id)}
                      onCheckedChange={() => toggleSelection(selectedProducts, setSelectedProducts, p.id)}
                    />
                    <span className="flex-1">{p.label}</span>
                    <span className="text-xs text-muted-foreground">{p.price.toLocaleString()} FCFA</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Total preview */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <p className="text-sm font-bold">
                Total estimé:{" "}
                {(
                  selectedCourses.length * 250000 +
                  selectedServices.reduce((s, id) => s + (SERVICES_CATALOG.find(x => x.id === id)?.price || 0), 0) +
                  selectedProducts.reduce((s, id) => s + (PRODUCTS_CATALOG.find(x => x.id === id)?.price || 0), 0)
                ).toLocaleString()}{" "}
                FCFA
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedCourses.length + selectedServices.length + selectedProducts.length} élément(s) sélectionné(s)
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>Annuler</Button>
            <Button onClick={generateAndSendProforma} disabled={generating} className="gap-2">
              <Send className="w-4 h-4" /> {generating ? "Génération..." : "Générer PDF & Envoyer WhatsApp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AIAssistant />
    </div>
  );
};

export default StudentDashboard;
