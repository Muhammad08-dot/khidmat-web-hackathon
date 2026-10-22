import React, { useEffect, Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './layouts/Navbar';
import { BottomNav } from './layouts/BottomNav';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Footer } from './layouts/Footer';
import { SiteAgentWidget } from './components/features/SiteAgentWidget';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/auth/Auth'));
const AIMatching = lazy(() => import('./pages/AIMatching'));
const ProviderList = lazy(() => import('./pages/provider/ProviderList'));
const ProviderProfile = lazy(() => import('./pages/provider/ProviderProfile'));
const ConfirmBooking = lazy(() => import('./pages/booking/ConfirmBooking'));
const Chat = lazy(() => import('./pages/chat/Chat'));
const MyBookings = lazy(() => import('./pages/booking/MyBookings'));
const Inbox = lazy(() => import('./pages/chat/Inbox'));
const Profile = lazy(() => import('./pages/Profile'));
const Safety = lazy(() => import('./pages/Safety').then(m => ({ default: m.Safety })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));

// Loading Fallback Component
const PageLoadingFallback: React.FC = () => (
  <div className="flex-grow flex items-center justify-center min-h-[50vh] p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading Khidmat...</p>
    </div>
  </div>
);

// Layout component to selectively wrap pages with header/footer navigation
const AppLayout: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Run database seeding only in DEV mode
    if (import.meta.env.DEV) {
      import('../scripts/seedData').then(({ seedDatabase }) => {
        seedDatabase();
      }).catch((err) => {
        console.warn('Could not run seedDatabase in DEV:', err);
      });
    }
  }, []);
  
  // Suppress navigation on Auth screen (as per "The Filter" rule for transactional/onboarding pages)
  const isAuthScreen = location.pathname.startsWith('/auth');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthScreen && <Navbar />}
      <main className="flex-grow flex flex-col">
        <div className="flex-grow flex flex-col">
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
        {!isAuthScreen && <Footer />}
      </main>
      {!isAuthScreen && <BottomNav />}
      {!isAuthScreen && <SiteAgentWidget />}
    </div>
  );
};

// Router definition
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { 
        path: '', 
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'auth', 
        element: <Auth /> 
      },
      { 
        path: 'matching', 
        element: (
          <ProtectedRoute>
            <AIMatching />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'providers', 
        element: (
          <ProtectedRoute>
            <ProviderList />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'provider/:id', 
        element: (
          <ProtectedRoute>
            <ProviderProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'booking', 
        element: (
          <ProtectedRoute>
            <ConfirmBooking />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'chat', 
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'inbox', 
        element: (
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'bookings', 
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'safety', 
        element: (
          <ProtectedRoute>
            <Safety />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'categories', 
        element: (
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        ) 
      },
    ],
  },
]);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
