import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item, ItemType, Priority, CreateItemDTO } from '../types';
import { generateId } from '../lib/utils';
import { db, hasSupabaseConfig, supabase } from '../lib/supabase';

interface AppState {
  items: Item[];
  filter: 'all' | ItemType | 'completed';
  searchQuery: string;
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;
  isSyncing: boolean;
  
  // Actions
  setFilter: (filter: 'all' | ItemType | 'completed') => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // CRUD
  fetchItems: () => Promise<void>;
  addItem: (item: CreateItemDTO) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleCompletion: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  deleteAll: () => Promise<void>;
  
  // Realtime
  setupRealtime: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],
      filter: 'all',
      searchQuery: '',
      theme: 'light',
      isLoading: false,
      error: null,
      isSyncing: false,

      setFilter: (filter) => set({ filter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setTheme: (theme) => set({ theme }),

      fetchItems: async () => {
        if (!hasSupabaseConfig) return;
        set({ isLoading: true, error: null });
        try {
          const items = await db.getItems();
          set({ items, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch items', isLoading: false });
        }
      },

      addItem: async (itemData) => {
        const now = new Date().toISOString();
        const newItem: Item = {
          ...itemData,
          id: generateId(), // Optimistic ID, will be replaced by DB
          created_at: now,
          updated_at: now,
        };

        // Optimistic update
        set((state) => ({ items: [newItem, ...state.items] }));

        if (hasSupabaseConfig) {
          set({ isSyncing: true });
          try {
            const savedItem = await db.createItem(itemData);
            // Replace optimistic item with saved item (real ID)
            set((state) => ({
              items: state.items.map((i) => (i.id === newItem.id ? savedItem : i)),
              isSyncing: false
            }));
          } catch (error: any) {
            // Revert on failure
            set((state) => ({
              items: state.items.filter((i) => i.id !== newItem.id),
              error: 'Failed to save item',
              isSyncing: false
            }));
          }
        }
      },

      updateItem: async (id, updates) => {
        // Optimistic update
        const previousItems = get().items;
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
          )
        }));

        if (hasSupabaseConfig && id.length > 10) { // Check if it's a real UUID, not a local optimistic ID
          set({ isSyncing: true });
          try {
            const savedItem = await db.updateItem(id, updates);
            set((state) => ({
              items: state.items.map((i) => (i.id === id ? savedItem : i)),
              isSyncing: false
            }));
          } catch (error: any) {
            set({ items: previousItems, error: 'Failed to update item', isSyncing: false });
          }
        }
      },
      
      toggleCompletion: async (id) => {
        const item = get().items.find(i => i.id === id);
        if (item) {
          await get().updateItem(id, { completed: !item.completed });
        }
      },

      deleteItem: async (id) => {
        const previousItems = get().items;
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));

        if (hasSupabaseConfig && id.length > 10) {
          set({ isSyncing: true });
          try {
            await db.deleteItem(id);
            set({ isSyncing: false });
          } catch (error: any) {
            set({ items: previousItems, error: 'Failed to delete item', isSyncing: false });
          }
        }
      },
      
      clearCompleted: async () => {
        const completedItems = get().items.filter(i => i.completed);
        const previousItems = get().items;
        
        set((state) => ({
          items: state.items.filter((item) => !item.completed)
        }));
        
        if (hasSupabaseConfig) {
           set({ isSyncing: true });
           try {
             await Promise.all(completedItems.map(item => db.deleteItem(item.id)));
             set({ isSyncing: false });
           } catch {
             set({ items: previousItems, error: 'Failed to clear completed items', isSyncing: false });
           }
        }
      },

      deleteAll: async () => {
        const previousItems = get().items;
        set({ items: [] });
        
        if (hasSupabaseConfig) {
          set({ isSyncing: true });
          try {
            await db.deleteAll();
            set({ isSyncing: false });
          } catch (error) {
            set({ items: previousItems, error: 'Failed to delete all items', isSyncing: false });
          }
        }
      },

      setupRealtime: () => {
        if (!hasSupabaseConfig || !supabase) return;
        
        supabase
          .channel('items_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, (payload) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;
            
            // Wait for optimistic updates to settle if needed, or just apply
            if (eventType === 'INSERT') {
              set((state) => {
                // Check if we already have it (from optimistic update)
                const exists = state.items.some(i => i.id === newRecord.id);
                if (exists) return state;
                return { items: [newRecord as Item, ...state.items] };
              });
            } else if (eventType === 'UPDATE') {
              set((state) => ({
                items: state.items.map(i => i.id === newRecord.id ? newRecord as Item : i)
              }));
            } else if (eventType === 'DELETE') {
              set((state) => ({
                items: state.items.filter(i => i.id !== oldRecord.id)
              }));
            }
          })
          .subscribe();
      }
    }),
    {
      name: 'mindflow-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
