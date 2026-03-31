import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ExternalLink, Trash2, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

interface Resource {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
}

export default function ResourcesPage() {
  const { user, role } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data as Resource[]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("resources")
        .insert({
          mentor_id: user.id,
          title,
          content: content || null,
          url: url || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      setResources([data as Resource, ...resources]);
      setTitle("");
      setContent("");
      setUrl("");
      toast({ title: "Recurso guardado" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
      setResources(resources.filter((r) => r.id !== id));
      toast({ title: "Recurso eliminado" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="page-header">
        <h1>Recursos y Herramientas</h1>
        <p>Notas rápidas y enlaces útiles para toda la academia</p>
      </div>

      {role === "mentor" && (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAdd} className="glass-card p-6 space-y-5">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-widest flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" /> Nuevo Recurso
          </h2>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre del recurso" required className="h-11 bg-secondary/30 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nota / Descripción</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Descripción o notas..." rows={3} className="bg-secondary/30 border-border/50 text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Enlace (opcional)</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="h-11 bg-secondary/30 border-border/50" />
          </div>
          <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Recurso"}
          </Button>
        </motion.form>
      )}

      <div className="space-y-3">
        {resources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground/30">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-10" />
            <p>No hay recursos publicados todavía.</p>
          </div>
        ) : (
          resources.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-5 flex items-start justify-between gap-4 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-primary/5 text-primary/60">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
                </div>
                {r.content && <p className="text-sm text-muted-foreground mt-2 ml-9 leading-relaxed">{r.content}</p>}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary mt-3 ml-9 hover:underline font-medium">
                    <ExternalLink className="h-3 w-3" /> Abrir enlace externo
                  </a>
                )}
              </div>
              {role === "mentor" && (
                <button onClick={() => handleDelete(id!)} className="text-muted-foreground/20 hover:text-destructive transition-colors flex-shrink-0 p-1 opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
