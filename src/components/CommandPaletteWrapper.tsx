import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lightbulb, Package, Settings, Search, Trash2 } from 'lucide-react';

export function CommandPaletteWrapper() {
  const [open, setOpen] = useState(false);
  const setFilter = useStore(state => state.setFilter);
  const setSearchQuery = useStore(state => state.setSearchQuery);
  const clearCompleted = useStore(state => state.clearCompleted);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-mf-bg/80 dark:bg-mf-bg-dark/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4">
      <div className="w-full max-w-xl bg-mf-surface dark:bg-mf-surface-dark rounded-2xl shadow-2xl border border-mf-border dark:border-mf-border-dark overflow-hidden flex flex-col">
        <Command label="Command Menu" loop>
          <div className="flex items-center px-4 border-b border-mf-border dark:border-mf-border-dark">
            <Search className="w-5 h-5 text-mf-text-muted shrink-0" />
            <Command.Input 
              placeholder="Type a command or search..." 
              autoFocus 
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollable">
            <Command.Empty>No results found.</Command.Empty>

            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => { setFilter('all'); navigate('/'); setOpen(false); }}>
                <Package className="w-4 h-4 mr-2" /> Everything
              </Command.Item>
              <Command.Item onSelect={() => { setFilter('task'); navigate('/'); setOpen(false); }}>
                <CheckSquare className="w-4 h-4 mr-2" /> Tasks
              </Command.Item>
              <Command.Item onSelect={() => { setFilter('idea'); navigate('/'); setOpen(false); }}>
                <Lightbulb className="w-4 h-4 mr-2" /> Ideas
              </Command.Item>
              <Command.Item onSelect={() => { navigate('/settings'); setOpen(false); }}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item 
                onSelect={() => { 
                  // Close and simulate focus on main input
                  setOpen(false);
                  setTimeout(() => {
                    const e = new KeyboardEvent('keydown', { metaKey: true, key: 'i' });
                    window.dispatchEvent(e);
                  }, 100);
                }}
              >
                <div className="w-4 h-4 flex items-center justify-center mr-2 font-mono text-xs border rounded">I</div>
                Focus Input (⌘I)
              </Command.Item>
              <Command.Item onSelect={() => { clearCompleted(); setOpen(false); }}>
                <Trash2 className="w-4 h-4 mr-2" /> Clear Completed Tasks
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
      
      {/* Background click listener to close */}
      <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
    </div>
  );
}
