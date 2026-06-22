import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoginPage from '@/components/auth/LoginPage';
import { AuthProvider } from '@/hooks/useAuth';
import { CompanyProvider } from '@/hooks/useCompany';
import Index from '@/pages/Index';
import AiAssistant from '@/pages/AiAssistant';
import Inbox from '@/pages/Inbox';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Invoices from '@/pages/Invoices';
import CashFlow from '@/pages/CashFlow';
import Reports from '@/pages/Reports';
import DeliveryNotes from '@/pages/DeliveryNotes';
import Quotes from '@/pages/Quotes';
import Procurement from '@/pages/Procurement';
import Safety from '@/pages/Safety';
import Documents from '@/pages/Documents';
import Admin from '@/pages/Admin';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CompanyProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/cash-flow" element={<CashFlow />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/delivery-notes" element={<DeliveryNotes />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </CompanyProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
