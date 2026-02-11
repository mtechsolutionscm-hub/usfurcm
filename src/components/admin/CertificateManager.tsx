import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Award, Download, CheckCircle } from "lucide-react";

const CertificateManager = () => {
  const { toast } = useToast();
  const [completedStudents, setCompletedStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchCompleted();
  }, []);

  const fetchCompleted = async () => {
    const { data: enrollData } = await supabase
      .from("enrollments")
      .select("student_id, course_id, progress, status");
    if (!enrollData) return;

    const studentIds = [...new Set(enrollData.map(e => e.student_id))];
    const courseIds = [...new Set(enrollData.map(e => e.course_id))];

    const [profilesRes, coursesRes] = await Promise.all([
      studentIds.length > 0 ? supabase.from("profiles").select("user_id, full_name, phone").in("user_id", studentIds) : { data: [] },
      courseIds.length > 0 ? supabase.from("courses").select("id, title, module_number").in("id", courseIds) : { data: [] },
    ]);

    const profilesMap = Object.fromEntries((profilesRes.data || []).map(p => [p.user_id, p]));
    const coursesMap = Object.fromEntries((coursesRes.data || []).map(c => [c.id, c]));

    // Group by student
    const studentMap: Record<string, { profile: any; modules: any[]; completedCount: number; totalCount: number }> = {};
    for (const e of enrollData) {
      if (!studentMap[e.student_id]) {
        studentMap[e.student_id] = { profile: profilesMap[e.student_id], modules: [], completedCount: 0, totalCount: 0 };
      }
      studentMap[e.student_id].totalCount++;
      if (e.progress >= 100 || e.status === "completed") {
        studentMap[e.student_id].completedCount++;
      }
      studentMap[e.student_id].modules.push({ ...e, course: coursesMap[e.course_id] });
    }

    setCompletedStudents(Object.entries(studentMap).map(([id, data]) => ({ id, ...data })));
  };

  const generateCertificate = (student: any) => {
    const completedModules = student.modules.filter((m: any) => m.progress >= 100 || m.status === "completed");
    const logoUrl = window.location.origin + '/favicon.jpg';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificat - ${student.profile?.full_name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,serif;background:#faf8f5;display:flex;align-items:center;justify-content:center;min-height:100vh}
.cert{width:800px;min-height:600px;border:3px solid #0d6b3d;padding:50px;text-align:center;background:white;position:relative}
.cert::before{content:'';position:absolute;inset:8px;border:1px solid #c8a415}
.logo{height:70px;margin-bottom:15px;border-radius:8px}
.company{font-size:18px;color:#0d6b3d;font-weight:bold;margin-bottom:5px}
.title{font-size:28px;color:#c8a415;margin:20px 0;font-weight:bold;text-transform:uppercase;letter-spacing:2px}
.name{font-size:24px;color:#0d6b3d;margin:15px 0;font-weight:bold;border-bottom:2px solid #c8a415;display:inline-block;padding-bottom:5px}
.desc{font-size:13px;color:#444;margin:15px 40px;line-height:1.8}
.modules{font-size:11px;color:#666;margin:15px 40px;text-align:left}
.modules li{margin:3px 0}
.date{font-size:12px;color:#888;margin-top:20px}
.footer{display:flex;justify-content:space-between;margin-top:30px;font-size:10px;color:#0d6b3d}
.footer div{text-align:center}
.footer .line{width:150px;border-top:1px solid #0d6b3d;margin:5px auto 3px}
@media print{body{background:white}@page{size:landscape;margin:10mm}}
</style></head><body>
<div class="cert">
<img src="${logoUrl}" alt="USFUR" class="logo">
<div class="company">USFUR Islamic Finance Training & Consulting</div>
<div style="font-size:9px;color:#888">l'indispensable pour réussir...</div>
<div class="title">Certificat de Compétence</div>
<p style="font-size:13px;color:#666">Ce certificat est décerné à</p>
<div class="name">${student.profile?.full_name || "Étudiant"}</div>
<p class="desc">Pour avoir complété avec succès ${completedModules.length} module(s) du programme de formation certifiante en Finance Islamique conforme aux normes AAOIFI.</p>
<ul class="modules">${completedModules.map((m: any) => `<li>✓ Module ${m.course?.module_number || "?"}: ${m.course?.title || "—"}</li>`).join("")}</ul>
<div class="date">Délivré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
<div class="footer">
<div><div class="line"></div>Le Directeur</div>
<div><div class="line"></div>RCCM: RC/DLA 2022/B/6388<br>NIU: M112217804579T</div>
</div>
</div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.onload = () => setTimeout(() => win.print(), 500);
    toast({ title: "Certificat généré ✅" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <Award className="w-6 h-6 text-primary" /> Certificats
      </h1>
      <p className="text-sm text-muted-foreground">Générez des certificats pour les étudiants ayant complété leurs modules.</p>

      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Étudiant</th>
              <th className="text-left p-3">Modules complétés</th>
              <th className="text-left p-3">Progression</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {completedStudents.map(s => (
              <tr key={s.id} className="border-t border-border hover:bg-muted/50">
                <td className="p-3 font-medium">{s.profile?.full_name || "—"}</td>
                <td className="p-3 text-xs">{s.completedCount}/{s.totalCount}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.totalCount > 0 ? (s.completedCount / s.totalCount) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs">{s.totalCount > 0 ? Math.round((s.completedCount / s.totalCount) * 100) : 0}%</span>
                  </div>
                </td>
                <td className="p-3">
                  {s.completedCount > 0 ? (
                    <Button variant="outline" size="sm" onClick={() => generateCertificate(s)} className="gap-1 text-xs">
                      <Download className="w-3 h-3" /> Certificat
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucun module terminé</span>
                  )}
                </td>
              </tr>
            ))}
            {completedStudents.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Aucun étudiant inscrit</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateManager;
