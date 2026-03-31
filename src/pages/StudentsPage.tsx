import { mockStudents, Student } from "@/lib/mock-data";
import { Search, Link2, Plus, ExternalLink, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─────────────────────────────────────────────────── */
interface LinkEntry {
  title: string;
  url: string;
}

interface StudentWithLinks extends Student {
  links: LinkEntry[];
}

/* ─── Link Manager Dialog ────────────────────────────────────── */
function LinksDialog({
  student,
  links,
  onClose,
  onAddLink,
  onDeleteLink,
}: {
  student: StudentWithLinks;
  links: LinkEntry[];
  onClose: () => void;
  onAddLink: (studentId: string, link: LinkEntry) => void;
  onDeleteLink: (studentId: string, index: number) => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    onAddLink(student.id, { title: newTitle.trim(), url });
    setNewTitle("");
    setNewUrl("");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-md glass-card p-6 glow-primary"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {student.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{student.name}</h2>
              <p className="text-xs text-muted-foreground">Gestión de enlaces</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground/50 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Link List */}
        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
          <AnimatePresence>
            {links.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground/50"
              >
                <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin enlaces aún</p>
              </motion.div>
            ) : (
              links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30 group hover:border-primary/30 transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Link2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Abrir enlace"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => onDeleteLink(student.id, index)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Add new link */}
        <div className="border-t border-border/20 pt-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Agregar enlace</p>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nombre del enlace (ej: Portfolio)"
            className="h-11 bg-secondary/30 border-border/50 focus:border-primary text-sm"
          />
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL (ej: https://instagram.com/...)"
            className="h-11 bg-secondary/30 border-border/50 focus:border-primary text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button
            onClick={handleAdd}
            disabled={!newTitle.trim() || !newUrl.trim()}
            className="w-full h-11 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentWithLinks[]>(
    mockStudents.map((s) => ({ ...s, links: s.links ?? [] }))
  );
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudent = students.find((s) => s.id === activeStudentId) ?? null;

  const handleAddLink = (studentId: string, link: LinkEntry) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, links: [...s.links, link] } : s
      )
    );
  };

  const handleDeleteLink = (studentId: string, index: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, links: s.links.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1>Alumnos</h1>
          <p>{mockStudents.length} alumnos registrados</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar alumno..."
            className="pl-9 h-11 bg-secondary/30 border-border/50"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-6 flex flex-col gap-4 hover:border-primary/20 transition-all"
          >
            {/* Card header */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{s.name}</h3>
                {s.needsAttention ? (
                  <span className="tag-attention">Atención</span>
                ) : (
                  <span className="tag-active">Activo</span>
                )}
              </div>
            </div>

            {/* Stats */}
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
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Racha</p>
                <p className="font-mono text-foreground">{s.streak} días</p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Última vez</p>
                <p className="font-mono text-foreground text-xs">{s.lastUpdate}</p>
              </div>
            </div>

            {/* Links section */}
            <div className="border-t border-border/20 pt-3">
              {/* Quick preview of existing links */}
              {s.links.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.links.slice(0, 3).map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      {link.title}
                    </a>
                  ))}
                  {s.links.length > 3 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/40 text-muted-foreground border border-border/30">
                      +{s.links.length - 3} más
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => setActiveStudentId(s.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border/40 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Link2 className="h-3.5 w-3.5" />
                {s.links.length === 0
                  ? "Agregar enlaces"
                  : `Ver todos (${s.links.length})`}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Links Dialog */}
      <AnimatePresence>
        {activeStudent && (
          <LinksDialog
            student={activeStudent}
            links={activeStudent.links}
            onClose={() => setActiveStudentId(null)}
            onAddLink={handleAddLink}
            onDeleteLink={handleDeleteLink}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
