import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from '@/stores/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import GardensListPage from './pages/gardens/GardensListPage';
import GardenDetailPage from './pages/gardens/GardenDetailPage';
import GardenFormPage from './pages/gardens/GardenFormPage';
import CultivationsListPage from './pages/cultivations/CultivationsListPage';
import CultivationFormPage from './pages/cultivations/CultivationFormPage';
import CultivationDetailPage from './pages/cultivations/CultivationDetailPage';
import SensorsListPage from './pages/sensors/SensorsListPage';
import SensorFormPage from './pages/sensors/SensorFormPage';
import SensorDetailPage from './pages/sensors/SensorDetailPage';
import AuthPage from './pages/auth/AuthPage';


const App = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    initializeAuth();
  }, [initializeAuth]);

  // Show loading screen while initializing auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              {/* Root route - redirect based on auth status */}
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

              {/* Auth route - redirect to dashboard if already authenticated */}
              <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

              {/* Protected routes with sidebar layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout title="Dashboard" description="Panoramica del tuo giardino smart">
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens"
                element={
                  <ProtectedRoute>
                    <Layout title="Gardens" description="Gestione dei tuoi giardini">
                      <GardensListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens/new"
                element={
                  <ProtectedRoute>
                    <Layout title="Nuovo Garden" description="Crea un nuovo spazio verde">
                      <GardenFormPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens/:id"
                element={
                  <ProtectedRoute>
                    <Layout title="Garden Details" description="Dettagli del giardino">
                      <GardenDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gardens/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout title="Modifica Garden" description="Modifica il tuo giardino">
                      <GardenFormPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cultivations"
                element={
                  <ProtectedRoute>
                    <Layout title="Coltivazioni" description="Gestione delle tue piante">
                      <CultivationsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cultivations/new"
                element={
                  <ProtectedRoute>
                    <Layout title="Nuova Coltivazione" description="Aggiungi una nuova pianta">
                      <CultivationFormPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cultivations/:id"
                element={
                  <ProtectedRoute>
                    <Layout title="Dettagli Coltivazione" description="Informazioni sulla pianta">
                      <CultivationDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cultivations/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout title="Modifica Coltivazione" description="Modifica la tua pianta">
                      <CultivationFormPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sensors"
                element={
                  <ProtectedRoute>
                    <Layout title="Sensori" description="Gestione dei sensori IoT">
                      <SensorsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sensors/new"
                element={
                  <ProtectedRoute>
                    <Layout title="Nuovo Sensore" description="Aggiungi un nuovo sensore IoT">
                      <SensorFormPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sensors/:id"
                element={
                  <ProtectedRoute>
                    <Layout title="Dettagli Sensore" description="Monitoraggio e controllo del sensore">
                      <SensorDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sensors/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout title="Modifica Sensore" description="Modifica la configurazione del sensore">
                      <SensorFormPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
  );
};

export default App;
