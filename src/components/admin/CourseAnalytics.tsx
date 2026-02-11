import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";

const COLORS = ["hsl(152, 69%, 22%)", "hsl(40, 60%, 50%)", "hsl(200, 60%, 50%)", "hsl(0, 60%, 50%)", "hsl(280, 60%, 50%)", "hsl(120, 40%, 40%)", "hsl(30, 70%, 50%)", "hsl(180, 50%, 40%)"];

const CourseAnalytics = () => {
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [proformaData, setProformaData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const [enrollRes, coursesRes, proformaRes] = await Promise.all([
      supabase.from("enrollments").select("course_id, status, progress"),
      supabase.from("courses").select("id, title, module_number"),
      supabase.from("proformas").select("status, total, created_at"),
    ]);

    const courses = coursesRes.data || [];
    const enrollments = enrollRes.data || [];
    const proformas = proformaRes.data || [];

    // Enrollments per course
    const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));
    const enrollByCourse: Record<string, number> = {};
    const statusCount: Record<string, number> = { active: 0, completed: 0, dropped: 0 };

    for (const e of enrollments) {
      const course = courseMap[e.course_id];
      const name = course ? `M${course.module_number}` : "?";
      enrollByCourse[name] = (enrollByCourse[name] || 0) + 1;
      const s = e.status || "active";
      statusCount[s] = (statusCount[s] || 0) + 1;
    }

    setEnrollmentData(Object.entries(enrollByCourse).map(([name, count]) => ({ name, inscriptions: count })).sort((a, b) => a.name.localeCompare(b.name)));
    setStatusData(Object.entries(statusCount).filter(([_, v]) => v > 0).map(([name, value]) => ({
      name: name === "active" ? "Actif" : name === "completed" ? "Terminé" : "Abandonné",
      value,
    })));

    // Monthly proforma revenue
    const monthly: Record<string, number> = {};
    for (const p of proformas) {
      if (p.status === "paid") {
        const month = new Date(p.created_at).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
        monthly[month] = (monthly[month] || 0) + (p.total || 0);
      }
    }
    setProformaData(Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" /> Analytique
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollments per module */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="font-semibold text-sm mb-4">Inscriptions par Module</h3>
          {enrollmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="inscriptions" fill="hsl(152, 69%, 22%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">Aucune donnée disponible</p>
          )}
        </div>

        {/* Status distribution */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="font-semibold text-sm mb-4">Statut des Inscriptions</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend fontSize={11} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">Aucune donnée disponible</p>
          )}
        </div>

        {/* Revenue over time */}
        <div className="bg-card p-6 rounded-xl border border-border lg:col-span-2">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Revenus Mensuels (FCFA)
          </h3>
          {proformaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={proformaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 90%)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} FCFA`} />
                <Bar dataKey="revenue" fill="hsl(40, 60%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">Aucune donnée de revenu disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;
