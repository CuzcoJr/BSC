import { useState, useEffect } from "react";
import { supabase, type Lead } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import LeadsList from "./LeadsList";
import Analytics from "./Analytics";
import PublishStudy from "./PublishStudy"; // Novo componente

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"leads" | "analytics" | "publish">("leads");
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: leads, error } = await supabase.from("leads").select("status");
      if (error) throw error;
      if (leads) {
        setStats({
          total: leads.length,
          new: leads.filter((l) => l.status === "new").length,
          contacted: leads.filter((l) => l.status === "contacted").length,
          converted: leads.filter((l) => l.status === "converted").length,
        });
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans transition-colors duration-500">
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <div>
                <h1 className="text-lg font-bold">Painel BSC</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Gestão de Leads e Análises</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl shadow hover:opacity-90 transition-opacity"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex flex-col items-start gap-2">
              <Users className="w-8 h-8 text-orange-500" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total de Leads</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex flex-col items-start gap-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="text-2xl font-bold">{stats.new}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Novos</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex flex-col items-start gap-2">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
              <div className="text-2xl font-bold">{stats.contacted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Contactados</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex flex-col items-start gap-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="text-2xl font-bold">{stats.converted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Convertidos</div>
            </div>
          </div>

          {/* TABS */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex-1 text-center px-6 py-4 font-medium transition-colors ${
                  activeTab === "leads"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-500"
                }`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 text-center px-6 py-4 font-medium transition-colors ${
                  activeTab === "analytics"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-500"
                }`}
              >
                Análises
              </button>
              <button
                onClick={() => setActiveTab("publish")}
                className={`flex-1 text-center px-6 py-4 font-medium transition-colors ${
                  activeTab === "publish"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-500"
                }`}
              >
                Publicar Estudo
              </button>
            </div>

            <div className="p-6">
              {activeTab === "leads" && <LeadsList onUpdate={loadStats} filterStatus="all" searchQuery="" />}
              {activeTab === "analytics" && <Analytics />}
              {activeTab === "publish" && <PublishStudy />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
