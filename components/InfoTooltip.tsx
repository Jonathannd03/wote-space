'use client';

import { useState, useRef, useEffect } from 'react';

interface InfoTooltipProps {
  content: string;
  position?: 'top' | 'bottom';
}

export default function InfoTooltip({ content, position = 'top' }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-gray-500 hover:text-brand-red transition-colors focus:outline-none"
        aria-label="More information"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {open && (
        <span
          className={`
            absolute z-50 w-64 bg-brand-black border border-brand-red/40 rounded-sm p-3
            text-xs text-gray-300 leading-relaxed shadow-xl font-normal
            left-1/2 -translate-x-1/2
            ${position === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'}
          `}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Arrow */}
          <span
            className={`
              absolute left-1/2 -translate-x-1/2 w-0 h-0
              border-l-4 border-r-4 border-l-transparent border-r-transparent
              ${position === 'top'
                ? 'bottom-[-7px] border-t-[7px] border-t-brand-red/40'
                : 'top-[-7px] border-b-[7px] border-b-brand-red/40'}
            `}
          />
          {content}
        </span>
      )}
    </span>
  );
}
