import { Search, Link2, Plus, ExternalLink, Trash2, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { differenceInDays } from "date-fns";

/* ─── Types ─────────────────────────────────────────────────── */
interface LinkEntry {
  id?: string;
  title: string;
  url: string;
}

interface StudentWithStats {
  id: string;
  name: string;
  avatar: string;
  totalRevenue: number;
  lastIncome: number;
  lastUpdate: string;
  streak: number;
  needsAttention: boolean;
  links: LinkEntry[];
}

/* ─── Link Manager Dialog ────────────────────────────────────── */
function LinksDialog({
  student,
  onClose,
  onRefresh,
}: {
  student: StudentWithStats;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setLoading(true);
    const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    
    try {
      const { error } = await supabase
        .from("student_links")
        .insert({
          user_id: student.id, // Associated with the student, even if added by mentor
          title: newTitle.trim(),
          url,
        });

      if (error) throw error;
      setNewTitle("");
      setNewUrl("");
      onRefresh();
      toast({ title: "Enlace añadido" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al actualizar";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from("student_links")
        .delete()
        .eq("id", linkId);

      if (error) throw error;
      onRefresh();
      toast({ title: "Enlace eliminado" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div className="relative z-10 w-full max-w-md glass-card p-6 glow-primary">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
              {student.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{student.name}</h2>
              <p className="text-xs text-muted-foreground">Gestión de enlaces</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground/50 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
          {student.links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground/50">
              <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sin enlaces aún</p>
            </div>
          ) : (
            student.links.map((link) => (
              <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30 group hover:border-primary/30 transition-all">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Link2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button onClick={() => handleDelete(link.id!)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border/20 pt-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Agregar enlace</p>
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nombre del enlace (ej: Portfolio)" className="h-11 bg-secondary/30 border-border/50 text-sm" />
          <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="URL (ej: instagram.com/user)" className="h-11 bg-secondary/30 border-border/50 text-sm" />
          <Button onClick={handleAdd} disabled={loading || !newTitle.trim() || !newUrl.trim()} className="w-full h-11 font-semibold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Agregar</>}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      // 1. Fetch profiles
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student");

      if (pError) throw pError;

      // 2. Fetch all transactions and links to calculate in memory (for performance in small sets)
      const { data: transactions } = await supabase.from("transactions").select("*");
      const { data: links } = await supabase.from("student_links").select("*");

      const studentsData = (profiles || []).map((p) => {
        const userTrans = transactions?.filter(t => t.user_id === p.user_id) || [];
        const userLinks = links?.filter(l => l.user_id === p.user_id).map(l => ({ id: l.id, title: l.title, url: l.url })) || [];
        
        const incomes = userTrans.filter(t => t.type === 'income');
        const sortedIncomes = incomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const totalRevenue = incomes.reduce((s, t) => s + t.amount, 0);
        const lastIncome = sortedIncomes[0]?.amount || 0;
        const lastUpdate = sortedIncomes[0]?.date ? new Date(sortedIncomes[0].date).toLocaleDateString() : "Sin actividad";
        
        // Streak: Unique days of activity
        const streak = new Set(userTrans.map(t => new Date(t.date).toDateString())).size;
        
        const daysSinceLast = sortedIncomes[0] ? differenceInDays(new Date(), new Date(sortedIncomes[0].date)) : 999;

        return {
          id: p.user_id,
          name: p.full_name,
          avatar: p.full_name.slice(0, 2),
          totalRevenue,
          lastIncome,
          lastUpdate,
          streak,
          needsAttention: daysSinceLast > 10,
          links: userLinks,
        };
      });

      setStudents(studentsData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudent = students.find((s) => s.id === activeStudentId) ?? null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1>Alumnos</h1>
          <p>{students.length} alumnos registrados en la plataforma</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar alumno..." className="pl-9 h-11 bg-secondary/30 border-border/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-6 flex flex-col gap-4 hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 uppercase">
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{s.name}</h3>
                {s.needsAttention ? <span className="tag-attention">Requiere Atención</span> : <span className="tag-active">Saludable</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-secondary/20 rounded-xl p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Último ingreso</p>
                <p className="font-mono font-semibold text-foreground">${s.lastIncome.toLocaleString()}</p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total</p>
                <p className="font-mono font-semibold text-foreground">${s.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Días Activo</p>
                <p className="font-mono text-foreground">{s.streak}</p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Actividad</p>
                <p className="font-mono text-foreground text-[10px]">{s.lastUpdate}</p>
              </div>
            </div>

            <div className="border-t border-border/20 pt-3">
              {s.links.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.links.slice(0, 3).map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
                      <ExternalLink className="h-2.5 w-2.5" />
                      {link.title}
                    </a>
                  ))}
                  {s.links.length > 3 && <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/40 text-muted-foreground">+{s.links.length - 3}</span>}
                </div>
              )}

              <button onClick={() => setActiveStudentId(s.id)} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border/40 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
                <Link2 className="h-3.5 w-3.5" />
                {s.links.length === 0 ? "Gestionar enlaces" : `Ver todos (${s.links.length})`}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeStudent && (
          <LinksDialog student={activeStudent} onClose={() => setActiveStudentId(null)} onRefresh={fetchStudents} />
        )}
      </AnimatePresence>
    </div>
  );
}
