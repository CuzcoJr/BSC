import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPageBSC from './pages/landing_page_bsc_react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { user, loading } = useAuth();

  // Enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // ✅ Se estiver tentando acessar o painel
  if (window.location.pathname === '/admin') {
    // ✅ Se está logado → mostra dashboard
    if (user) {
      return <AdminDashboard />;
    }
    // ❌ Se não está logado → exibe tela de login
    return <AdminLogin />;
  }

  // ✅ Caso contrário, página pública normal
  return <LandingPageBSC />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
