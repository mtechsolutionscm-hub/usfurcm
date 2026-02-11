import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Building2, Search, Phone, Mail, MapPin, Globe, User, FileText } from "lucide-react";

interface Institution {
  id: string;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  responsible_name: string | null;
  responsible_phone: string | null;
  responsible_email: string | null;
  responsible_position: string | null;
  niu: string | null;
  rccm: string | null;
  notes: string | null;
  subscribed_services: any;
  subscribed_products: any;
  is_active: boolean;
  created_at: string;
}

const institutionTypes = [
  { value: "institution_financiere", label: "Institution Financière" },
  { value: "banque_islamique", label: "Banque Islamique" },
  { value: "microfinance", label: "Microfinance" },
  { value: "assurance_takaful", label: "Assurance Takaful" },
  { value: "entreprise", label: "Entreprise" },
  { value: "ong", label: "ONG" },
  { value: "gouvernement", label: "Organisme Gouvernemental" },
  { value: "universite", label: "Université / École" },
  { value: "autre", label: "Autre" },
];

const emptyForm = {
  name: "", type: "institution_financiere", address: "", city: "", country: "Cameroun",
  phone: "", email: "", website: "", responsible_name: "", responsible_phone: "",
  responsible_email: "", responsible_position: "", niu: "", rccm: "", notes: "",
};

const InstitutionsManager = () => {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewInstitution, setViewInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    fetchInstitutions();
    const channel = supabase
      .channel("admin-institutions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "institutions" }, () => fetchInstitutions())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchInstitutions = async () => {
    const { data } = await supabase.from("institutions").select("*").order("name");
    if (data) setInstitutions(data as Institution[]);
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (inst: Institution) => {
    setEditing(inst);
    setForm({
      name: inst.name, type: inst.type, address: inst.address || "", city: inst.city || "",
      country: inst.country || "Cameroun", phone: inst.phone || "", email: inst.email || "",
      website: inst.website || "", responsible_name: inst.responsible_name || "",
      responsible_phone: inst.responsible_phone || "", responsible_email: inst.responsible_email || "",
      responsible_position: inst.responsible_position || "", niu: inst.niu || "", rccm: inst.rccm || "",
      notes: inst.notes || "",
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast({ variant: "destructive", title: "Erreur", description: "Le nom est requis" });
      return;
    }
    const payload = {
      name: form.name.trim(), type: form.type, address: form.address || null,
      city: form.city || null, country: form.country || null, phone: form.phone || null,
      email: form.email || null, website: form.website || null,
      responsible_name: form.responsible_name || null, responsible_phone: form.responsible_phone || null,
      responsible_email: form.responsible_email || null, responsible_position: form.responsible_position || null,
      niu: form.niu || null, rccm: form.rccm || null, notes: form.notes || null,
    };

    if (editing) {
      const { error } = await supabase.from("institutions").update(payload).eq("id", editing.id);
      if (error) { toast({ variant: "destructive", title: "Erreur", description: error.message }); return; }
      toast({ title: "Institution mise à jour ✅" });
    } else {
      const { error } = await supabase.from("institutions").insert(payload);
      if (error) { toast({ variant: "destructive", title: "Erreur", description: error.message }); return; }
      toast({ title: "Institution créée ✅" });
    }
    setDialogOpen(false);
  };

  const deleteInstitution = async (id: string) => {
    await supabase.from("institutions").delete().eq("id", id);
    setDeleteConfirm(null);
    toast({ title: "Institution supprimée" });
  };

  const filtered = institutions.filter(i => {
    const s = search.toLowerCase();
    return !s || i.name.toLowerCase().includes(s) || (i.city || "").toLowerCase().includes(s) ||
      (i.responsible_name || "").toLowerCase().includes(s) || (i.type || "").toLowerCase().includes(s);
  });

  const getTypeLabel = (type: string) => institutionTypes.find(t => t.value === type)?.label || type;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" /> Établissements & Institutions ({filtered.length})
        </h1>
        <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" /> Ajouter</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, ville, responsable..." className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(inst => (
          <div key={inst.id} className="bg-card p-4 rounded-xl border border-border space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm">{inst.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{getTypeLabel(inst.type)}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setViewInstitution(inst)}><FileText className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(inst)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(inst.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {inst.city && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{inst.city}, {inst.country}</p>}
              {inst.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{inst.phone}</p>}
              {inst.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{inst.email}</p>}
              {inst.responsible_name && <p className="flex items-center gap-1"><User className="w-3 h-3" />{inst.responsible_name} {inst.responsible_position ? `(${inst.responsible_position})` : ""}</p>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{search ? "Aucun résultat" : "Aucune institution enregistrée"}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'institution" : "Nouvelle institution"}</DialogTitle>
            <DialogDescription>Remplissez les informations de l'établissement.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Afriland First Bank" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {institutionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Adresse</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              <div className="space-y-2"><Label>Ville</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Douala" /></div>
              <div className="space-y-2"><Label>Pays</Label><Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" /></div>
              <div className="space-y-2"><Label>Site Web</Label><Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://" /></div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Responsable</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nom du responsable</Label><Input value={form.responsible_name} onChange={e => setForm({ ...form, responsible_name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Poste</Label><Input value={form.responsible_position} onChange={e => setForm({ ...form, responsible_position: e.target.value })} placeholder="Directeur Général" /></div>
                <div className="space-y-2"><Label>Tél. responsable</Label><Input value={form.responsible_phone} onChange={e => setForm({ ...form, responsible_phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email responsable</Label><Input value={form.responsible_email} onChange={e => setForm({ ...form, responsible_email: e.target.value })} type="email" /></div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-sm mb-3">Informations Légales</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>NIU</Label><Input value={form.niu} onChange={e => setForm({ ...form, niu: e.target.value })} /></div>
                <div className="space-y-2"><Label>RCCM</Label><Input value={form.rccm} onChange={e => setForm({ ...form, rccm: e.target.value })} /></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Informations complémentaires..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={save}>{editing ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewInstitution} onOpenChange={() => setViewInstitution(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewInstitution?.name}</DialogTitle>
            <DialogDescription>{viewInstitution ? getTypeLabel(viewInstitution.type) : ""}</DialogDescription>
          </DialogHeader>
          {viewInstitution && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {viewInstitution.city && <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Localisation</p><p className="font-medium">{viewInstitution.city}, {viewInstitution.country}</p></div>}
                {viewInstitution.phone && <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Téléphone</p><p className="font-medium">{viewInstitution.phone}</p></div>}
                {viewInstitution.email && <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{viewInstitution.email}</p></div>}
                {viewInstitution.website && <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Site Web</p><p className="font-medium">{viewInstitution.website}</p></div>}
                {viewInstitution.niu && <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">NIU</p><p className="font-medium">{viewInstitution.niu}</p></div>}
                {viewInstitution.rccm && <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">RCCM</p><p className="font-medium">{viewInstitution.rccm}</p></div>}
              </div>
              {viewInstitution.responsible_name && (
                <div className="border-t border-border pt-3">
                  <h4 className="text-xs text-muted-foreground mb-1">Responsable</h4>
                  <p className="font-medium">{viewInstitution.responsible_name} {viewInstitution.responsible_position ? `— ${viewInstitution.responsible_position}` : ""}</p>
                  {viewInstitution.responsible_phone && <p className="text-xs text-muted-foreground">{viewInstitution.responsible_phone}</p>}
                  {viewInstitution.responsible_email && <p className="text-xs text-muted-foreground">{viewInstitution.responsible_email}</p>}
                </div>
              )}
              {viewInstitution.notes && <div className="border-t border-border pt-3"><h4 className="text-xs text-muted-foreground mb-1">Notes</h4><p>{viewInstitution.notes}</p></div>}
              <p className="text-xs text-muted-foreground">Créée le {new Date(viewInstitution.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteInstitution(deleteConfirm)}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionsManager;
