import React from 'react';

export type MonoColor = 'cyan' | 'amber' | 'purple' | 'emerald' | 'slate' | 'white';

interface MonoProps {
  children: React.ReactNode;
  color?: MonoColor;
  className?: string;
}

const COLOR_CLASSES: Record<MonoColor, string> = {
  cyan: 'text-cyan-300',
  amber: 'text-amber-300',
  purple: 'text-purple-300',
  emerald: 'text-emerald-300',
  slate: 'text-slate-200',
  white: 'text-white',
};

export const Mono: React.FC<MonoProps> = ({ children, color = 'cyan', className = '' }) => {
  return (
    <code className={`font-mono ${COLOR_CLASSES[color]} ${className}`}>
      {children}
    </code>
  );
};
