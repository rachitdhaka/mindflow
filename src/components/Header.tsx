import { NavLink } from 'react-router-dom';
import { useStore } from '../store';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="w-full px-4 md:px-8 py-4 md:py-5 flex justify-between items-center border-b border-mf-border dark:border-mf-border-dark bg-mf-surface dark:bg-mf-surface-dark sticky top-0 z-50 shrink-0">
      <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
        <div className="w-7 h-7 bg-mf-text dark:bg-mf-text-dark rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
          <div className="w-3.5 h-3.5 border-[1.5px] border-mf-surface dark:border-mf-surface-dark rounded-sm rotate-45 transform"></div>
        </div>
        <span className="font-bold tracking-tight text-lg hidden sm:block">MindFlow</span>
      </NavLink>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full border border-mf-border dark:border-mf-border-dark hover:bg-mf-surface-light dark:hover:bg-mf-surface-light-dark transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }))}
          className="flex items-center gap-2 bg-mf-surface-light dark:bg-mf-surface-light-dark px-3 py-1.5 rounded-lg border border-mf-border dark:border-mf-border-dark hover:border-mf-text/30 transition-colors"
        >
          <span className="text-[10px] font-bold uppercase text-mf-text dark:text-mf-text-dark">⌘K</span>
          <span className="text-[10px] text-mf-text-muted dark:text-mf-text-muted-dark font-medium hidden sm:block">Search</span>
        </button>

        <NavLink 
          to="/settings"
          title="Settings"
          className={({isActive}) => `w-8 h-8 rounded-full border transition-colors
            ${isActive 
              ? 'border-mf-text dark:border-mf-text-dark' 
              : 'border-mf-border dark:border-mf-border-dark hover:border-mf-text/50 dark:hover:border-mf-text-dark/50'
            }
            bg-gradient-to-tr from-pink-100 to-orange-100 dark:from-pink-900/50 dark:to-orange-900/50
          `}
        />
      </div>
    </header>
  );
}
