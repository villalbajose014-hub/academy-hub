import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ExternalLink, Trash2, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Resource {
  id: number;
  title: string;
  content: string;
  url?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: "Notion CRM", content: "Link al CRM principal de la academia", url: "https://notion.so" },
    { id: 2, title: "Guía de Ventas", content: "Pasos para cerrar una venta de tatuaje premium. Incluye script de WhatsApp y seguimiento." },
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setResources([...resources, { id: Date.now(), title, content, url: url || undefined }]);
    setTitle("");
    setContent("");
    setUrl("");
    toast({ title: "Recurso guardado" });
  };

  const handleDelete = (id: number) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="page-header">
        <h1>Recursos</h1>
        <p>Notas rápidas y enlaces para tu equipo</p>
      </div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd} className="glass-card p-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre del recurso" required className="h-11 bg-secondary/30 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nota</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Descripción o notas..." rows={3} className="bg-secondary/30 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Enlace (opcional)</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="h-11 bg-secondary/30 border-border/50" />
        </div>
        <Button type="submit" className="h-11"><Plus className="h-4 w-4 mr-2" /> Guardar</Button>
      </motion.form>

      <div className="space-y-3">
        {resources.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-5 flex items-start justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary/60 flex-shrink-0" />
                <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
              </div>
              {r.content && <p className="text-sm text-muted-foreground mt-1 ml-6">{r.content}</p>}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-2 ml-6 hover:underline">
                  <ExternalLink className="h-3 w-3" /> {r.url}
                </a>
              )}
            </div>
            <button onClick={() => handleDelete(r.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors flex-shrink-0 p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
