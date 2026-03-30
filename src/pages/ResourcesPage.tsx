import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    toast({ title: "Recurso guardado 📌" });
  };

  const handleDelete = (id: number) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Recursos</h1>
        <p className="text-muted-foreground text-sm">Notas rápidas y enlaces para tu equipo</p>
      </div>

      <form onSubmit={handleAdd} className="glass-card p-5 space-y-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre del recurso" required />
        </div>
        <div className="space-y-2">
          <Label>Nota</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Descripción o notas..." rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Enlace (opcional)</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
        <Button type="submit"><Plus className="h-4 w-4 mr-2" /> Guardar</Button>
      </form>

      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r.id} className="glass-card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
              {r.content && <p className="text-sm text-muted-foreground mt-1">{r.content}</p>}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                  <ExternalLink className="h-3 w-3" /> {r.url}
                </a>
              )}
            </div>
            <button onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
