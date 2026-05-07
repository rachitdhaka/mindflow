import { useStore } from '../store';
import { ItemCard } from './ItemCard';
import { QuickCaptureInput } from './QuickCaptureInput';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export function Dashboard() {
  const items = useStore(state => state.items);
  const searchQuery = useStore(state => state.searchQuery);
  const setSearchQuery = useStore(state => state.setSearchQuery);
  
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const filteredItems = useMemo(() => {
    let result = items.filter(i => activeTab === 'pending' ? !i.completed : i.completed);
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.content.toLowerCase().includes(q) || 
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [items, searchQuery, activeTab]);

  const tasks = filteredItems.filter(i => i.type === 'task');
  const ideas = filteredItems.filter(i => i.type === 'idea');

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 lg:pb-12 pt-8 md:pt-10 px-4 md:px-8 flex flex-col items-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <QuickCaptureInput />
      </motion.div>

      {/* Mini Navbar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-8 bg-mf-border/30 dark:bg-mf-border-dark/30 p-1 rounded-xl border border-mf-border/50 dark:border-mf-border-dark/50 max-w-sm w-full justify-center"
      >
        {[
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-mf-surface dark:bg-mf-surface-dark shadow-sm text-mf-text dark:text-mf-text-dark'
                : 'text-mf-text-muted dark:text-mf-text-muted-dark hover:bg-mf-surface/50 dark:hover:bg-mf-surface-dark/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Search Input for many items */}
      {items.length > 5 && searchQuery && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 relative w-full max-w-2xl"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mf-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search items, #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-mf-surface-light dark:bg-mf-surface-light-dark border border-mf-border dark:border-mf-border-dark outline-none rounded-xl py-3 pl-10 pr-4 text-sm placeholder:text-mf-text-muted transition-colors focus:bg-mf-surface dark:focus:bg-mf-surface-dark"
          />
        </motion.div>
      )}

      {/* Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-5xl"
      >
        {filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center text-mf-text-muted dark:text-mf-text-muted-dark border border-dashed border-mf-border dark:border-mf-border-dark rounded-2xl w-full max-w-2xl mx-auto"
          >
            {searchQuery ? "No matching items found." : (
              activeTab === 'completed' ? "No completed tasks yet." : "Your mind is clear. 🧘"
            )}
          </motion.div>
        ) : (
          <div className={`grid grid-cols-1 ${activeTab === 'pending' ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-8 w-full`}>
            
            {activeTab === 'completed' ? (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-mf-text-lighter dark:text-mf-text-lighter-dark">Completed</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-mf-border dark:bg-mf-border-dark rounded-full font-bold">{filteredItems.length}</span>
                </div>
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {filteredItems.map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            ) : (
              <>
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-mf-text-lighter dark:text-mf-text-lighter-dark">Pending Tasks</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-mf-border dark:bg-mf-border-dark rounded-full font-bold">{tasks.length}</span>
                  </div>
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {tasks.map(item => (
                        <ItemCard key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-mf-text-lighter dark:text-mf-text-lighter-dark">Quick Thoughts</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-mf-border dark:bg-mf-border-dark rounded-full font-bold">{ideas.length}</span>
                  </div>
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {ideas.map(item => (
                        <ItemCard key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              </>
            )}

          </div>
        )}
      </motion.div>
    </div>
  );
}
