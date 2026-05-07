import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { extractTags, detectType } from '../lib/utils';
import { useStore } from '../store';
import { Send, Hash } from 'lucide-react';

export function QuickCaptureInput() {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const addItem = useStore(state => state.addItem);

  // Auto-focus on load and keyboard shortcut (Ctrl+I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on Cmd/Ctrl + I
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Clear on Escape
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setInput('');
      }
    };
    
    // Initial focus with slight delay to ensure render
    setTimeout(() => inputRef.current?.focus(), 100);

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const { type, content } = detectType(input.trim());
    const { tags, cleanText } = extractTags(content);

    addItem({
      type,
      content: cleanText,
      completed: false,
      tags,
      priority: 'medium', // Default
    });

    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const detected = input ? detectType(input) : { type: 'idea' };
  const partialTags = extractTags(input).tags;

  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative w-full">
        <motion.div 
          animate={{ scale: isFocused ? 1.01 : 1, y: isFocused ? -2 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full"
        >
          <div className="flex-1 right-fade">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Capture a thought or task..."
              rows={1}
              className="w-full bg-mf-surface dark:bg-mf-surface-dark border border-mf-border dark:border-mf-border-dark shadow-sm rounded-2xl pl-6 pr-24 md:pr-40 py-5 text-lg outline-none ring-2 ring-transparent focus:ring-black/5 dark:focus:ring-white/5 transition-all placeholder:text-mf-text-lighter dark:placeholder:text-mf-text-lighter-dark resize-none overflow-hidden block min-h-[68px]"
            />
          </div>
          
          <AnimatePresence>
            {!input && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none"
              >
                <span className="text-[10px] font-bold text-mf-text-lighter dark:text-mf-text-lighter-dark bg-mf-surface-light dark:bg-mf-surface-light-dark px-1.5 py-0.5 rounded border border-mf-border dark:border-mf-border-dark">ENTER</span>
              </motion.div>
            )}
            {input && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 flex-shrink-0"
              >
                {partialTags.map((tag, i) => (
                  <span key={i} className="hidden md:flex text-xs bg-mf-surface-light dark:bg-mf-surface-light-dark text-mf-text-muted dark:text-mf-text-muted-dark px-2 py-1 rounded-md border border-mf-border dark:border-mf-border-dark items-center gap-1 font-medium">
                    <Hash size={12} className="opacity-50" />
                    {tag}
                  </span>
                ))}
                
                <div className={`
                  text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider border
                  ${detected.type === 'task' 
                    ? 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400' 
                    : 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400'}
                `}>
                  {detected.type}
                </div>
                
                <button 
                  type="submit"
                  className="bg-mf-accent text-mf-surface dark:bg-mf-accent-dark dark:text-mf-bg p-2 rounded-xl transition-transform active:scale-95 ml-1 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
      
      {/* Keyboard hints */}
      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-4 mt-3 px-2"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-mf-text-muted dark:text-mf-text-muted-dark">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Type "do..." for Tasks
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-mf-text-muted dark:text-mf-text-muted-dark">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Use #tags for Context
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-mf-text-muted dark:text-mf-text-muted-dark ml-auto">
              <span className="font-bold text-mf-text-muted/70">Shift + Enter</span> for new line
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
