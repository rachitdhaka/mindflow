import { hasSupabaseConfig } from '../lib/supabase';
import { useStore } from '../store';

export function Footer() {
  const isSyncing = useStore(state => state.isSyncing);

  return (
    <footer className="px-4 md:px-8 py-3 bg-mf-surface dark:bg-mf-surface-dark border-t border-mf-border dark:border-mf-border-dark flex justify-between items-center shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {hasSupabaseConfig ? (
            <>
              <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] ${isSyncing ? 'bg-orange-500 animate-pulse shadow-orange-500' : 'bg-green-500'}`}></div>
              <span className="text-[11px] font-medium text-mf-text-muted dark:text-mf-text-muted-dark">
                {isSyncing ? 'Syncing...' : 'Cloud Sync Active'}
              </span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-mf-text-lighter dark:bg-mf-text-lighter-dark"></div>
              <span className="text-[11px] font-medium text-mf-text-muted dark:text-mf-text-muted-dark">Local Only</span>
            </>
          )}
        </div>
        <span className="text-[11px] text-mf-text-lighter dark:text-mf-text-lighter-dark hidden sm:block">v1.2.0</span>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => {
            const e = new KeyboardEvent('keydown', { metaKey: true, key: 's' });
            // We can just open settings or trigger command palette
            window.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }));
          }}
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="w-4 h-4 flex items-center justify-center bg-mf-surface-light dark:bg-mf-surface-light-dark border border-mf-border dark:border-mf-border-dark rounded text-[9px] font-bold uppercase text-mf-text-muted dark:text-mf-text-muted-dark">⌘K</span>
          <span className="text-[11px] text-mf-text-muted dark:text-mf-text-muted-dark hidden sm:block">Commands</span>
        </button>
      </div>
    </footer>
  );
}
