import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdSenseScript } from './components/AdSenseScript';
import { WheelPage } from './pages/WheelPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';

const STORAGE_SOUND_KEY = 'wheel_spinner_sound_active';

function MainAppLayout() {
  const { currentPath } = useRouter();

  // Sound preference with localStorage persistence
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(STORAGE_SOUND_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOUND_KEY, String(soundEnabled));
    } catch {
      // Safe
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/contact':
        return <ContactPage />;
      case '/wheel-spinner':
      case '/':
      default:
        return <WheelPage soundEnabled={soundEnabled} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* AdSense loader placeholder (inactive by default with placeholder ID) */}
      <AdSenseScript publisherId="ca-pub-0000000000000000" enabled={false} />

      {/* Persistent Site Header */}
      <Header soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full pb-12">
        {renderCurrentPage()}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeModeProvider>
      <ToastProvider>
        <RouterProvider>
          <MainAppLayout />
        </RouterProvider>
      </ToastProvider>
    </ThemeModeProvider>
  );
}
