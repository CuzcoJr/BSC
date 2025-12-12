import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PublishStudy() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return setMessage("Título e conteúdo são obrigatórios.");

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("studies").insert({
        title,
        content,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setMessage("Estudo publicado com sucesso!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao publicar estudo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-orange-600">Publicar Estudo de Caso</h2>
      {message && (
        <div className={`p-2 rounded ${message.includes("sucesso") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Conteúdo</label>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          {loading ? "Publicando..." : "Publicar Estudo"}
        </button>
      </form>
    </div>
  );
}
