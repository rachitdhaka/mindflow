import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { Check, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { Item } from '../types';
import { useStore } from '../store';
import { cn } from '../lib/utils';

interface ItemCardProps {
  key?: React.Key;
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [showOptions, setShowOptions] = useState(false);
  
  const updateItem = useStore(state => state.updateItem);
  const deleteItem = useStore(state => state.deleteItem);
  const toggleCompletion = useStore(state => state.toggleCompletion);

  const handleSave = () => {
    if (editContent.trim() !== item.content) {
      updateItem(item.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const isTask = item.type === 'task';
  
  if (isTask) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.01 }}
        className={cn(
          "group relative bg-mf-surface dark:bg-mf-surface-dark border p-4 rounded-xl transition-all duration-200 flex items-center gap-4",
          item.completed 
            ? "border-mf-border/50 dark:border-mf-border-dark/50 opacity-60 bg-transparent" 
            : "border-mf-border dark:border-mf-border-dark shadow-sm hover:border-black/20 dark:hover:border-white/20"
        )}
      >
        {/* Checkbox */}
        <button 
          onClick={() => toggleCompletion(item.id)}
          className={cn(
            "w-5 h-5 rounded border flex shrink-0 items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-mf-border",
            item.completed 
              ? "bg-mf-text border-mf-text text-mf-surface dark:bg-mf-text-dark dark:border-mf-text-dark dark:text-mf-surface-dark" 
              : "border-mf-border-darker dark:border-mf-border-darker-dark group-hover:border-mf-text dark:group-hover:border-mf-text-dark bg-transparent"
          )}
        >
          {item.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditContent(item.content);
                }
              }}
              className="w-full bg-mf-surface-light dark:bg-mf-surface-light-dark rounded px-2 py-1 outline-none text-sm focus:ring-1 focus:ring-mf-border-darker"
            />
          ) : (
            <p className={cn(
              "text-sm font-medium transition-all mb-0.5",
              item.completed && "line-through text-mf-text-muted dark:text-mf-text-muted-dark"
            )}>
              {item.content}
            </p>
          )}

          {!isEditing && item.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {item.tags.map((tag) => (
                <span 
                  key={tag} 
                  className={cn(
                    "text-[10px] font-bold uppercase",
                    tag.toLowerCase() === 'highpriority' ? "text-red-500" :
                    tag.toLowerCase() === 'marketing' ? "text-green-500" :
                    "text-blue-500"
                  )}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Options & Metadata */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-mf-text-lighter dark:text-mf-text-lighter-dark whitespace-nowrap hidden sm:block">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true }).replace('about ', '')}
          </span>
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded text-mf-text-lighter hover:text-mf-text dark:hover:text-mf-text-dark opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={14} />
            </button>
            <AnimatePresence>
              {showOptions && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10" onClick={() => setShowOptions(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-6 z-20 w-32 py-1 bg-mf-surface dark:bg-mf-surface-dark border border-mf-border dark:border-mf-border-dark rounded-lg shadow-lg"
                  >
                    <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-mf-surface-light dark:hover:bg-mf-surface-light-dark">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => { deleteItem(item.id); setShowOptions(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- IDEA CARD ---
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.005 }}
      className="group relative bg-mf-surface dark:bg-mf-surface-dark p-5 rounded-xl border border-mf-border dark:border-mf-border-dark shadow-sm hover:shadow transition-all duration-200"
    >
      <div className="relative">
        {isEditing ? (
          <textarea
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
              if (e.key === 'Escape') { setIsEditing(false); setEditContent(item.content); }
            }}
            className="w-full bg-mf-surface-light dark:bg-mf-surface-light-dark rounded p-2 outline-none text-sm focus:ring-1 focus:ring-mf-border-darker resize-none mb-3"
            rows={Math.max(2, editContent.split('\n').length)}
          />
        ) : (
          <p className="text-sm text-mf-text dark:text-mf-text-dark leading-relaxed mb-3 whitespace-pre-wrap pr-6">
            {item.content}
          </p>
        )}

        <div className="absolute top-0 right-0">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded text-mf-text-lighter hover:text-mf-text dark:hover:text-mf-text-dark opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={14} />
            </button>
            <AnimatePresence>
              {showOptions && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10" onClick={() => setShowOptions(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-6 z-20 w-32 py-1 bg-mf-surface dark:bg-mf-surface-dark border border-mf-border dark:border-mf-border-dark rounded-lg shadow-lg"
                  >
                    <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-mf-surface-light dark:hover:bg-mf-surface-light-dark">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => { deleteItem(item.id); setShowOptions(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex gap-2 flex-wrap">
          {item.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] bg-mf-surface-light dark:bg-mf-surface-light-dark px-2 py-1 rounded-md border border-mf-border dark:border-mf-border-dark text-mf-text-muted dark:text-mf-text-muted-dark uppercase font-medium tracking-wide"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-mf-text-lighter dark:text-mf-text-lighter-dark whitespace-nowrap shrink-0 ml-2">
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true }).replace('about ', '')}
        </span>
      </div>
    </motion.div>
  );
}
