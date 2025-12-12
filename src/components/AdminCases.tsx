import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { X } from "lucide-react";

interface Case {
  id: string;
  title: string;
  description: string;
}

export default function AdminCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setCases(data || []);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const { error } = await supabase.from("cases").insert([{ title: form.title, description: form.description }]);
    if (error) console.error(error);
    else {
      setForm({ title: "", description: "" });
      loadCases();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cases").delete().eq("id", id);
    if (error) console.error(error);
    else loadCases();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow">
        <input
          name="title"
          placeholder="Título do caso"
          value={form.title}
          onChange={handleChange}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
        />
        <textarea
          name="description"
          placeholder="Descrição do caso"
          value={form.description}
          onChange={handleChange}
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
        />
        <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity">Adicionar Caso</button>
      </form>

      {loading ? <p>Carregando casos...</p> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow relative">
              <h3 className="font-semibold text-orange-600">{c.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{c.description}</p>
              <button
                onClick={() => handleDelete(c.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              ><X /></button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
