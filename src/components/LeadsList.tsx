import { useState, useEffect } from "react";
import { supabase, type Lead } from "../lib/supabase";
import { Check, X, PhoneCall } from "lucide-react";

interface LeadsListProps {
  filterStatus?: "all" | "new" | "contacted" | "converted";
  searchQuery?: string;
  onUpdate?: () => void;
}

export default function LeadsList({ filterStatus = "all", searchQuery = "", onUpdate }: LeadsListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filterStatus, searchQuery]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase.from("leads").select("*");
      if (filterStatus !== "all") query = query.eq("status", filterStatus);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      if (data) {
        const filtered = data.filter(
          (l) =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setLeads(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "contacted" | "converted") => {
    try {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
      fetchLeads();
      onUpdate?.();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;
    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
      fetchLeads();
      onUpdate?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Carregando leads...</div>;
  if (!leads.length) return <div>Nenhum lead encontrado.</div>;

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
        >
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-50">{lead.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  lead.status === "new"
                    ? "bg-orange-100 text-orange-700"
                    : lead.status === "contacted"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {lead.status.toUpperCase()}
              </span>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {expandedId === lead.id ? <X /> : <Check />}
              </button>
            </div>
          </div>

          {expandedId === lead.id && (
            <div className="mt-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
              <div><strong>Telefone:</strong> {lead.phone}</div>
              <div><strong>Serviço:</strong> {lead.service}</div>
              <div><strong>Mensagem:</strong> {lead.message || "-"}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {lead.status !== "contacted" && (
                  <button onClick={() => updateStatus(lead.id, "contacted")} className="px-3 py-1 bg-yellow-500 text-white rounded-xl hover:opacity-90 transition-opacity text-sm">
                    Marcar como Contactado
                  </button>
                )}
                {lead.status !== "converted" && (
                  <button onClick={() => updateStatus(lead.id, "converted")} className="px-3 py-1 bg-green-500 text-white rounded-xl hover:opacity-90 transition-opacity text-sm">
                    Marcar como Convertido
                  </button>
                )}
                <button onClick={() => deleteLead(lead.id)} className="px-3 py-1 bg-red-500 text-white rounded-xl hover:opacity-90 transition-opacity text-sm">
                  Excluir
                </button>
                <a href={`https://wa.me/258${lead.phone}?text=Olá ${lead.name}`} target="_blank" className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center gap-1">
                  <PhoneCall className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
