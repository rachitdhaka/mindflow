import { useStore } from '../store';
import { Database, Moon, Sun, Trash2, Download } from 'lucide-react';
import { hasSupabaseConfig } from '../lib/supabase';

export function SettingsPanel() {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const clearCompleted = useStore((state) => state.clearCompleted);
  const deleteAll = useStore((state) => state.deleteAll);
  const items = useStore((state) => state.items);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "mindflow_export.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-24 lg:pb-12 pt-8 md:pt-16 px-4 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Supabase Status */}
        <section>
          <h2 className="text-xs font-semibold text-mf-text-muted uppercase tracking-wider mb-4">Cloud Sync</h2>
          <div className="bg-mf-surface dark:bg-mf-surface-dark border border-mf-border dark:border-mf-border-dark p-4 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${hasSupabaseConfig ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
              <Database size={20} />
            </div>
            <div>
              <p className="font-medium text-sm">
                {hasSupabaseConfig ? 'Connected to Supabase' : 'Not Configured (Memory Only)'}
              </p>
              <p className="text-sm text-mf-text-muted mt-1">
                {hasSupabaseConfig 
                  ? 'Your data is securely synced to the cloud.' 
                  : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable database storage.'}
              </p>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="text-xs font-semibold text-mf-text-muted uppercase tracking-wider mb-4">Appearance</h2>
          <div className="bg-mf-surface dark:bg-mf-surface-dark border border-mf-border dark:border-mf-border-dark rounded-2xl overflow-hidden divide-y divide-mf-border dark:divide-mf-border-dark">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 hover:bg-mf-text/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                <span className="font-medium text-sm">Theme</span>
              </div>
              <span className="text-sm text-mf-text-muted capitalize">{theme}</span>
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-xs font-semibold text-mf-text-muted uppercase tracking-wider mb-4">Data</h2>
          <div className="bg-mf-surface dark:bg-mf-surface-dark border border-mf-border dark:border-mf-border-dark rounded-2xl overflow-hidden divide-y divide-mf-border dark:divide-mf-border-dark">
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 hover:bg-mf-text/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Download size={18} />
                <span className="font-medium text-sm">Export Data</span>
              </div>
            </button>
            <button 
              onClick={() => {
                if(window.confirm('Are you sure you want to delete all completed tasks?')) {
                  clearCompleted();
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-500/10 text-left text-red-600 dark:text-red-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} />
                <span className="font-medium text-sm">Clear Completed Tasks</span>
              </div>
            </button>
            <button 
              onClick={() => {
                if(window.confirm('WARNING: This will permanently delete ALL data. Are you sure?')) {
                  deleteAll();
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-500/10 text-left text-red-600 dark:text-red-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} />
                <span className="font-medium text-sm font-bold">Delete Everything</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
