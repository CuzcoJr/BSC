import { useEffect, useState } from "react";
import { supabase, type Lead } from "../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface ServiceStats {
  service: string;
  new: number;
  contacted: number;
  converted: number;
}

export default function Analytics() {
  const [data, setData] = useState<ServiceStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: leads, error } = await supabase.from<Lead>("leads").select("*");
      if (error) throw error;
      if (leads) {
        const grouped: Record<string, ServiceStats> = {};
        leads.forEach((l) => {
          if (!grouped[l.service]) grouped[l.service] = { service: l.service, new: 0, contacted: 0, converted: 0 };
          grouped[l.service][l.status] += 1;
        });
        setData(Object.values(grouped));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando análises...</div>;
  if (!data.length) return <div>Nenhuma análise disponível.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-orange-600">Estatísticas por Serviço</h2>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="new" stackId="a" fill="#f97316" />
            <Bar dataKey="contacted" stackId="a" fill="#facc15" />
            <Bar dataKey="converted" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
