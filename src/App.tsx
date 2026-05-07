/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { SettingsPanel } from './components/SettingsPanel';
import { CommandPaletteWrapper } from './components/CommandPaletteWrapper';
import { useStore } from './store';

export default function App() {
  const fetchItems = useStore(state => state.fetchItems);
  const setupRealtime = useStore(state => state.setupRealtime);
  const theme = useStore(state => state.theme);

  useEffect(() => {
    // Apply theme
    document.body.classList.toggle('dark', theme === 'dark');
    
    // Initial fetch
    fetchItems().then(() => {
      // Setup realtime subscription after initial fetch
      setupRealtime();
    });
  }, [fetchItems, setupRealtime, theme]);

  // Global theme toggle shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (!isInput && e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const currentTheme = useStore.getState().theme;
        useStore.getState().setTheme(currentTheme === 'light' ? 'dark' : 'light');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-mf-bg dark:bg-mf-bg-dark transition-colors duration-300 text-mf-text dark:text-mf-text-dark font-sans">
        <Header />
        
        <main className="flex-1 overflow-y-auto relative flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPanel />} />
            {/* Catch-all */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>

        <Footer />
        <CommandPaletteWrapper />
      </div>
    </BrowserRouter>
  );
}

