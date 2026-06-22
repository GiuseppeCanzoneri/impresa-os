import { useState } from 'react';
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import LoginPage from '@/components/auth/LoginPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
      <div className="min-h-dvh bg-slate-50 text-slate-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-h-dvh lg:pl-72">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
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
        <BrowserRouter>
          <AuthProvider>
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
