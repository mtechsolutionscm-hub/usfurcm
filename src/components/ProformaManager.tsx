import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Plus, Trash2, Eye, MessageCircle, FileText, Pencil, Building, UserPlus, Download, UsersRound, Package, Briefcase } from "lucide-react";

const WHATSAPP = "https://wa.me/237690895554";

const SERVICES_CATALOG = [
  { description: "Consultation en Finance Islamique", price: 150000 },
  { description: "Audit de Conformité Charia", price: 500000 },
  { description: "Formation sur Mesure (par jour)", price: 300000 },
  { description: "Accompagnement Institutionnel", price: 750000 },
  { description: "Étude de Faisabilité Produit Islamique", price: 400000 },
];

const PRODUCTS_CATALOG = [
  { description: "Manuel de Finance Islamique USFUR", price: 25000 },
  { description: "Kit de Formation Complet (8 modules)", price: 1800000 },
  { description: "Certificat de Compétence USFUR", price: 100000 },
  { description: "Abonnement Plateforme Annuel", price: 200000 },
];

interface ProformaItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface ProformaManagerProps {
  courses: any[];
}

const ProformaManager = ({ courses }: ProformaManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proformas, setProformas] = useState<any[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [viewProforma, setViewProforma] = useState<any>(null);
  const [editingProforma, setEditingProforma] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    notes: "",
    valid_days: 30,
    items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }] as ProformaItem[],
  });

  const [companyForm, setCompanyForm] = useState({
    name: "", address: "", phone: "", email: "", niu: "", rccm: "",
  });

  useEffect(() => {
    fetchProformas();
    fetchCompanyInfo();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select("student_id, course_id, courses:course_id(title, module_number), profiles:student_id(full_name, phone)");
    if (!data) return;
    const studentMap: Record<string, { id: string; name: string; phone: string; courses: any[] }> = {};
    for (const e of data) {
      const profile = e.profiles as any;
      const course = e.courses as any;
      if (!studentMap[e.student_id]) {
        studentMap[e.student_id] = { id: e.student_id, name: profile?.full_name || "Étudiant", phone: profile?.phone || "", courses: [] };
      }
      if (course) studentMap[e.student_id].courses.push(course);
    }
    setStudents(Object.values(studentMap));
  };

  const fetchProformas = async () => {
    const { data } = await supabase.from("proformas").select("*").order("created_at", { ascending: false });
    if (data) setProformas(data);
  };

  const fetchCompanyInfo = async () => {
    const { data } = await supabase.from("company_info").select("*").maybeSingle();
    if (data) {
      setCompanyInfo(data);
      setCompanyForm({ name: data.name || "", address: data.address || "", phone: data.phone || "", email: data.email || "", niu: data.niu || "", rccm: data.rccm || "" });
    }
  };

  const generateProformaNumber = () => {
    const d = new Date();
    return `PF-${d.getFullYear().toString().slice(-2)}${(d.getMonth() + 1).toString().padStart(2, "0")}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
  };

  const updateItem = (index: number, field: keyof ProformaItem, value: any) => {
    const items = [...form.items];
    (items[index] as any)[field] = value;
    items[index].total = items[index].quantity * items[index].unit_price;
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unit_price: 0, total: 0 }] });
  const removeItem = (index: number) => { if (form.items.length > 1) setForm({ ...form, items: form.items.filter((_, i) => i !== index) }); };

  const addCourseAsItem = (course: any) => {
    const price = 250000;
    setForm({ ...form, items: [...form.items.filter(i => i.description), { description: `Module ${course.module_number}: ${course.title}`, quantity: 1, unit_price: price, total: price }] });
  };

  const addServiceAsItem = (svc: { description: string; price: number }) => {
    setForm({ ...form, items: [...form.items.filter(i => i.description), { description: svc.description, quantity: 1, unit_price: svc.price, total: svc.price }] });
  };

  const addProductAsItem = (prod: { description: string; price: number }) => {
    setForm({ ...form, items: [...form.items.filter(i => i.description), { description: prod.description, quantity: 1, unit_price: prod.price, total: prod.price }] });
  };

  const getSubtotal = () => form.items.reduce((sum, i) => sum + i.total, 0);

  const openCreate = () => {
    setEditingProforma(null);
    setSelectedStudentId(null);
    setForm({ client_name: "", client_email: "", client_phone: "", notes: "", valid_days: 30, items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }] });
    setDialogOpen(true);
  };

  const generateForStudent = (student: any) => {
    const price = 250000;
    const items: ProformaItem[] = student.courses
      .sort((a: any, b: any) => (a.module_number || 0) - (b.module_number || 0))
      .map((c: any) => ({ description: `Module ${c.module_number}: ${c.title}`, quantity: 1, unit_price: price, total: price }));
    if (items.length === 0) items.push({ description: "", quantity: 1, unit_price: 0, total: 0 });
    setEditingProforma(null);
    setSelectedStudentId(student.id);
    setForm({ client_name: student.name, client_email: "", client_phone: student.phone || "", notes: "", valid_days: 30, items });
    setStudentPickerOpen(false);
    setDialogOpen(true);
  };

  const generateBulkForAllStudents = async () => {
    if (students.length === 0) { toast({ variant: "destructive", title: "Aucun étudiant inscrit" }); return; }
    setBulkGenerating(true);
    let count = 0;
    for (const student of students) {
      const price = 250000;
      const items: ProformaItem[] = student.courses
        .sort((a: any, b: any) => (a.module_number || 0) - (b.module_number || 0))
        .map((c: any) => ({ description: `Module ${c.module_number}: ${c.title}`, quantity: 1, unit_price: price, total: price }));
      if (items.length === 0) continue;
      const subtotal = items.reduce((s, i) => s + i.total, 0);
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      const { error } = await supabase.from("proformas").insert({
        proforma_number: generateProformaNumber(),
        client_name: student.name,
        client_phone: student.phone || null,
        items: items as any, subtotal, tax_rate: 0, tax_amount: 0, total: subtotal,
        status: "sent", valid_until: validUntil.toISOString(),
        created_by: user?.id, user_id: student.id,
      } as any);
      if (!error) count++;
    }
    setBulkGenerating(false);
    toast({ title: `${count} proforma(s) généré(s) pour les étudiants` });
    fetchProformas();
  };

  const openEdit = (p: any) => {
    setEditingProforma(p);
    const items = (p.items as any[]) || [];
    setForm({ client_name: p.client_name, client_email: p.client_email || "", client_phone: p.client_phone || "", notes: p.notes || "", valid_days: 30, items: items.length > 0 ? items : [{ description: "", quantity: 1, unit_price: 0, total: 0 }] });
    setDialogOpen(true);
  };

  const saveProforma = async (status: string = "draft") => {
    if (!form.client_name.trim()) { toast({ variant: "destructive", title: "Erreur", description: "Le nom du client est requis" }); return; }
    const validItems = form.items.filter(i => i.description.trim());
    if (validItems.length === 0) { toast({ variant: "destructive", title: "Erreur", description: "Ajoutez au moins un article" }); return; }
    const subtotal = validItems.reduce((s, i) => s + i.total, 0);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + form.valid_days);
    const payload: any = {
      proforma_number: editingProforma?.proforma_number || generateProformaNumber(),
      client_name: form.client_name.trim(), client_email: form.client_email.trim() || null, client_phone: form.client_phone.trim() || null,
      items: validItems, subtotal, tax_rate: 0, tax_amount: 0, total: subtotal, status,
      notes: form.notes.trim() || null, valid_until: validUntil.toISOString(), created_by: user?.id, user_id: selectedStudentId || null,
    };
    if (editingProforma) {
      const { error } = await supabase.from("proformas").update(payload).eq("id", editingProforma.id);
      if (error) { toast({ variant: "destructive", title: "Erreur", description: error.message }); return; }
      toast({ title: "Proforma modifié" });
    } else {
      const { error } = await supabase.from("proformas").insert(payload);
      if (error) { toast({ variant: "destructive", title: "Erreur", description: error.message }); return; }
      toast({ title: "Proforma créé" });
    }
    setDialogOpen(false);
    fetchProformas();
  };

  const deleteProforma = async (id: string) => {
    await supabase.from("proformas").delete().eq("id", id);
    fetchProformas();
    toast({ title: "Proforma supprimé" });
  };

  const saveCompanyInfo = async () => {
    if (!companyInfo?.id) return;
    const { error } = await supabase.from("company_info").update(companyForm).eq("id", companyInfo.id);
    if (error) { toast({ variant: "destructive", title: "Erreur", description: error.message }); return; }
    toast({ title: "Informations mises à jour" });
    setCompanyDialogOpen(false);
    fetchCompanyInfo();
  };

  const sendViaWhatsApp = (p: any) => {
    const items = (p.items as ProformaItem[]) || [];
    const itemsList = items.map((i, idx) => `${idx + 1}. ${i.description} - ${i.quantity}x ${i.unit_price.toLocaleString()} = ${i.total.toLocaleString()} FCFA`).join("\n");
    const msg = `📄 *PROFORMA ${p.proforma_number}*\n\n👤 Client: ${p.client_name}\n\n📋 Articles:\n${itemsList}\n\n💰 *Total: ${p.total.toLocaleString()} FCFA*\n\nℹ️ Pour procéder au paiement, veuillez nous contacter.`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const downloadProformaPDF = (p: any) => {
    const items = (p.items as ProformaItem[]) || [];
    const ci = companyInfo;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Proforma ${p.proforma_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,sans-serif;padding:40px;color:#1a1a1a;max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0d6b3d;padding-bottom:20px;margin-bottom:30px}
.company h1{color:#0d6b3d;font-size:22px;margin-bottom:4px}.company p{font-size:11px;color:#555;line-height:1.6}
.proforma-title{text-align:center;background:#0d6b3d;color:white;padding:10px 30px;font-size:18px;font-weight:bold;border-radius:4px;margin-bottom:25px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:25px}
.info-box{background:#f8f9fa;padding:15px;border-radius:6px;border-left:3px solid #0d6b3d}
.info-box h3{font-size:11px;text-transform:uppercase;color:#0d6b3d;margin-bottom:8px;letter-spacing:1px}
.info-box p{font-size:12px;line-height:1.6}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
thead th{background:#0d6b3d;color:white;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
tbody td{padding:10px 12px;border-bottom:1px solid #e5e5e5;font-size:12px}
tbody tr:nth-child(even){background:#f8f9fa}
.total-row{background:#0d6b3d !important;color:white;font-weight:bold;font-size:14px}
.total-row td{border:none;padding:12px}
.notes{background:#fefce8;border:1px solid #fde047;padding:15px;border-radius:6px;margin-bottom:20px}
.notes h3{font-size:11px;text-transform:uppercase;color:#854d0e;margin-bottom:6px}.notes p{font-size:11px;color:#713f12}
.footer{text-align:center;border-top:2px solid #e5e5e5;padding-top:20px;margin-top:30px}
.footer p{font-size:10px;color:#888;line-height:1.8}
.validity{background:#f0fdf4;border:1px solid #bbf7d0;padding:10px;border-radius:6px;text-align:center;margin-bottom:20px}
.validity p{font-size:11px;color:#166534}
.whatsapp{background:#25D366;color:white;padding:8px 16px;border-radius:20px;font-size:11px;text-decoration:none;display:inline-block;margin-top:10px}
@media print{body{padding:20px}@page{margin:15mm}}
</style></head><body>
<div class="header">
<div class="company">
<h1>${ci?.name || "USFUR"}</h1>
<p>${ci?.address || ""}<br>Tél: ${ci?.phone || ""} | Email: ${ci?.email || ""}<br>${ci?.niu ? `NIU: ${ci.niu}` : ""} ${ci?.rccm ? `| RCCM: ${ci.rccm}` : ""}</p>
</div>
</div>
<div class="proforma-title">FACTURE PROFORMA N° ${p.proforma_number}</div>
<div class="info-grid">
<div class="info-box"><h3>Client</h3><p><strong>${p.client_name}</strong>${p.client_phone ? `<br>Tél: ${p.client_phone}` : ""}${p.client_email ? `<br>Email: ${p.client_email}` : ""}</p></div>
<div class="info-box"><h3>Informations</h3><p>Date: ${new Date(p.created_at).toLocaleDateString("fr-FR")}<br>Devise: ${p.currency || "FCFA"}<br>Statut: ${p.status === "paid" ? "Payé" : p.status === "sent" ? "Envoyé" : "Brouillon"}</p></div>
</div>
<table>
<thead><tr><th style="width:50px">#</th><th>Description</th><th style="width:60px;text-align:center">Qté</th><th style="width:120px;text-align:right">Prix Unit.</th><th style="width:120px;text-align:right">Total</th></tr></thead>
<tbody>
${items.map((item, i) => `<tr><td>${i + 1}</td><td>${item.description}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${item.unit_price.toLocaleString("fr-FR")} FCFA</td><td style="text-align:right">${item.total.toLocaleString("fr-FR")} FCFA</td></tr>`).join("")}
<tr class="total-row"><td colspan="4" style="text-align:right">TOTAL</td><td style="text-align:right">${p.total.toLocaleString("fr-FR")} FCFA</td></tr>
</tbody></table>
${p.valid_until ? `<div class="validity"><p>📅 Ce proforma est valide jusqu'au <strong>${new Date(p.valid_until).toLocaleDateString("fr-FR")}</strong></p></div>` : ""}
${p.notes ? `<div class="notes"><h3>Notes & Conditions</h3><p>${p.notes}</p></div>` : ""}
<div class="footer">
<p><strong>${ci?.name || "USFUR Islamic Finance Training & Consulting"}</strong><br>
Pour toute question, contactez-nous au <strong>${ci?.phone || "+237 690 895 554"}</strong><br>
<a href="${WHATSAPP}" class="whatsapp">💬 Nous contacter via WhatsApp</a></p>
</div>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => { setTimeout(() => { win.print(); }, 500); };
    }
  };

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} FCFA`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft": return { label: "Brouillon", cls: "bg-muted text-muted-foreground" };
      case "sent": return { label: "Envoyé", cls: "bg-blue-100 text-blue-700" };
      case "paid": return { label: "Payé", cls: "bg-primary/10 text-primary" };
      case "cancelled": return { label: "Annulé", cls: "bg-destructive/10 text-destructive" };
      default: return { label: status, cls: "bg-muted text-muted-foreground" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Proformas</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setCompanyDialogOpen(true)} className="gap-1">
            <Building className="w-4 h-4" /> Infos Entreprise
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setStudentSearch(""); setStudentPickerOpen(true); }} className="gap-1">
            <UserPlus className="w-4 h-4" /> Depuis un étudiant
          </Button>
          <Button variant="outline" size="sm" onClick={generateBulkForAllStudents} disabled={bulkGenerating} className="gap-1">
            <UsersRound className="w-4 h-4" /> {bulkGenerating ? "Génération..." : "Tous les étudiants"}
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Nouveau Proforma
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {proformas.map((p) => {
          const badge = getStatusBadge(p.status);
          return (
            <div key={p.id} className="bg-card p-4 rounded-xl border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{p.proforma_number}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Client: {p.client_name}</p>
                  <p className="text-sm font-bold mt-1">{formatCurrency(p.total)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <Button variant="ghost" size="sm" onClick={() => setViewProforma(p)} title="Aperçu"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)} title="Modifier"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => downloadProformaPDF(p)} title="Télécharger PDF"><Download className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => sendViaWhatsApp(p)} className="gap-1 text-xs">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteProforma(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          );
        })}
        {proformas.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Aucun proforma. Créez-en un pour commencer.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProforma ? "Modifier le proforma" : "Nouveau proforma"}</DialogTitle>
            <DialogDescription>Remplissez les informations du client et les articles.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nom du client *</Label>
                <Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Nom complet" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Téléphone</Label>
                <Input value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} placeholder="+237..." />
              </div>
            </div>

            {/* Quick add: Courses */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1"><Package className="w-3 h-3" /> Cours</Label>
              <div className="flex flex-wrap gap-1.5">
                {courses.map(c => (
                  <Button key={c.id} variant="outline" size="sm" className="text-xs h-7" onClick={() => addCourseAsItem(c)}>
                    + M{c.module_number}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setForm({
                  ...form, items: [...form.items.filter(i => i.description), { description: "Frais d'admission", quantity: 1, unit_price: 50000, total: 50000 }]
                })}>+ Admission</Button>
              </div>
            </div>

            {/* Quick add: Services */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1"><Briefcase className="w-3 h-3" /> Services</Label>
              <div className="flex flex-wrap gap-1.5">
                {SERVICES_CATALOG.map((svc, i) => (
                  <Button key={i} variant="outline" size="sm" className="text-xs h-7" onClick={() => addServiceAsItem(svc)}>
                    + {svc.description.split(" ").slice(0, 3).join(" ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick add: Products */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1"><Package className="w-3 h-3" /> Produits</Label>
              <div className="flex flex-wrap gap-1.5">
                {PRODUCTS_CATALOG.map((prod, i) => (
                  <Button key={i} variant="outline" size="sm" className="text-xs h-7" onClick={() => addProductAsItem(prod)}>
                    + {prod.description.split(" ").slice(0, 3).join(" ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Articles</Label>
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    {idx === 0 && <Label className="text-[10px]">Description</Label>}
                    <Input value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="Description" className="text-sm" />
                  </div>
                  <div className="w-16 space-y-1">
                    {idx === 0 && <Label className="text-[10px]">Qté</Label>}
                    <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} className="text-sm" />
                  </div>
                  <div className="w-28 space-y-1">
                    {idx === 0 && <Label className="text-[10px]">Prix unit.</Label>}
                    <Input type="number" min={0} value={item.unit_price} onChange={(e) => updateItem(idx, "unit_price", parseInt(e.target.value) || 0)} className="text-sm" />
                  </div>
                  <div className="w-24 text-right text-sm font-medium pt-1">{item.total.toLocaleString()}</div>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} disabled={form.items.length <= 1}><Trash2 className="w-3 h-3" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem} className="gap-1 text-xs"><Plus className="w-3 h-3" /> Ajouter un article</Button>
            </div>

            <div className="flex justify-end text-sm"><span className="font-bold">Total: {formatCurrency(getSubtotal())}</span></div>

            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Conditions de paiement, remarques..." />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button variant="secondary" onClick={() => saveProforma("draft")}>Enregistrer brouillon</Button>
            <Button onClick={() => saveProforma("sent")}>Enregistrer & Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Proforma Dialog */}
      <Dialog open={!!viewProforma} onOpenChange={() => setViewProforma(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Proforma {viewProforma?.proforma_number}</DialogTitle>
            <DialogDescription>Aperçu du proforma</DialogDescription>
          </DialogHeader>
          {viewProforma && (
            <div className="space-y-4 text-sm">
              {companyInfo && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <p className="font-bold text-primary">{companyInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{companyInfo.address}</p>
                  <p className="text-xs text-muted-foreground">Tél: {companyInfo.phone} | Email: {companyInfo.email}</p>
                  {companyInfo.niu && <p className="text-xs text-muted-foreground">NIU: {companyInfo.niu} | RCCM: {companyInfo.rccm}</p>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="font-medium">{viewProforma.client_name}</p>
                  {viewProforma.client_phone && <p className="text-xs">{viewProforma.client_phone}</p>}
                  {viewProforma.client_email && <p className="text-xs">{viewProforma.client_email}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(viewProforma.created_at).toLocaleDateString("fr-FR")}</p>
                  {viewProforma.valid_until && <p className="text-xs text-muted-foreground">Valide jusqu'au {new Date(viewProforma.valid_until).toLocaleDateString("fr-FR")}</p>}
                </div>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="border-b border-border"><th className="text-left py-2">Description</th><th className="text-center py-2 w-12">Qté</th><th className="text-right py-2 w-24">P.U.</th><th className="text-right py-2 w-24">Total</th></tr></thead>
                <tbody>
                  {((viewProforma.items as ProformaItem[]) || []).map((item, i) => (
                    <tr key={i} className="border-b border-border/50"><td className="py-2">{item.description}</td><td className="text-center py-2">{item.quantity}</td><td className="text-right py-2">{item.unit_price.toLocaleString()}</td><td className="text-right py-2 font-medium">{item.total.toLocaleString()}</td></tr>
                  ))}
                </tbody>
                <tfoot><tr className="font-bold"><td colSpan={3} className="text-right py-2">Total:</td><td className="text-right py-2">{formatCurrency(viewProforma.total)}</td></tr></tfoot>
              </table>
              {viewProforma.notes && (
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Notes</p><p className="text-xs">{viewProforma.notes}</p></div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" variant="outline" onClick={() => downloadProformaPDF(viewProforma)}>
                  <Download className="w-4 h-4" /> Télécharger PDF
                </Button>
                <Button className="flex-1 gap-2" onClick={() => sendViaWhatsApp(viewProforma)}>
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Company Info Dialog */}
      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Informations de l'entreprise</DialogTitle>
            <DialogDescription>Ces informations apparaîtront sur les proformas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1"><Label className="text-xs">Nom</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Adresse</Label><Input value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Téléphone</Label><Input value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">NIU</Label><Input value={companyForm.niu} onChange={(e) => setCompanyForm({ ...companyForm, niu: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">RCCM</Label><Input value={companyForm.rccm} onChange={(e) => setCompanyForm({ ...companyForm, rccm: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyDialogOpen(false)}>Annuler</Button>
            <Button onClick={saveCompanyInfo}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Picker Dialog */}
      <Dialog open={studentPickerOpen} onOpenChange={setStudentPickerOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Générer un proforma pour un étudiant</DialogTitle>
            <DialogDescription>Sélectionnez un étudiant inscrit pour pré-remplir le proforma avec ses cours.</DialogDescription>
          </DialogHeader>
          <Input placeholder="Rechercher un étudiant..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="mb-3" />
          <div className="space-y-2">
            {students
              .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => generateForStudent(s)}>
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    {s.phone && <p className="text-xs text-muted-foreground">{s.phone}</p>}
                    <p className="text-xs text-muted-foreground">{s.courses.length} cours: {s.courses.map((c: any) => `M${c.module_number}`).join(", ")}</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1 text-xs shrink-0"><FileText className="w-3 h-3" /> Générer</Button>
                </div>
              ))}
            {students.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">Aucun étudiant inscrit trouvé.</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProformaManager;
