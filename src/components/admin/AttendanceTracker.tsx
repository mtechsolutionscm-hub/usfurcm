import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, Save } from "lucide-react";

const AttendanceTracker = ({ courses }: { courses: any[] }) => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedCourse) fetchStudentsForCourse();
  }, [selectedCourse]);

  const fetchStudentsForCourse = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select("student_id, progress, status")
      .eq("course_id", selectedCourse);
    if (!data) return;

    const studentIds = data.map(e => e.student_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, phone")
      .in("user_id", studentIds);

    const profilesMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
    const enriched = data.map(e => ({ ...e, profile: profilesMap[e.student_id] }));
    setStudents(enriched);

    // Default all present
    const att: Record<string, boolean> = {};
    for (const s of enriched) att[s.student_id] = true;
    setAttendance(att);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const saveAttendance = async () => {
    // Update progress for present students (+5%)
    const presentIds = Object.entries(attendance).filter(([_, present]) => present).map(([id]) => id);
    let updated = 0;
    for (const sid of presentIds) {
      const student = students.find(s => s.student_id === sid);
      if (student) {
        const newProgress = Math.min(100, (student.progress || 0) + 5);
        await supabase
          .from("enrollments")
          .update({ progress: newProgress })
          .eq("student_id", sid)
          .eq("course_id", selectedCourse);
        updated++;
      }
    }
    toast({ title: `Présence enregistrée: ${presentIds.length}/${students.length} présent(s), progression mise à jour ✅` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <ClipboardCheck className="w-6 h-6 text-primary" /> Suivi de Présence
      </h1>

      <div className="max-w-xs">
        <select
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">Sélectionner un cours</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>Module {c.module_number}: {c.title}</option>
          ))}
        </select>
      </div>

      {selectedCourse && students.length > 0 && (
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <p className="text-sm font-medium">{students.length} étudiant(s) inscrit(s)</p>
            <Button onClick={saveAttendance} size="sm" className="gap-1">
              <Save className="w-4 h-4" /> Enregistrer
            </Button>
          </div>
          <div className="divide-y divide-border">
            {students.map(s => (
              <div key={s.student_id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{s.profile?.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{s.profile?.phone || "—"}</p>
                </div>
                <button
                  onClick={() => toggleAttendance(s.student_id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    attendance[s.student_id]
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive/10 text-destructive border border-destructive/30"
                  }`}
                >
                  {attendance[s.student_id] ? "P" : "A"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCourse && students.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun étudiant inscrit à ce cours.</p>
      )}
    </div>
  );
};

export default AttendanceTracker;
