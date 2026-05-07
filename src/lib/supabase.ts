import { createClient } from '@supabase/supabase-js';
import type { Item } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url');

export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Database wrapper that routes to Supabase or throws gracefully
export const db = {
  async getItems(): Promise<Item[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Item[];
  },

  async createItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Promise<Item> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('items')
      .insert([item])
      .select()
      .single();
      
    if (error) throw error;
    return data as Item;
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Item;
  },

  async deleteItem(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },
  
  async deleteAll(): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
    if (error) throw error;
  }
};
