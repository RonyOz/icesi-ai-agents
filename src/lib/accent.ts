export type Accent = 'indigo' | 'amber' | 'emerald' | 'violet' | 'orange' | 'sky';

export const accentVar: Record<Accent, string> = {
  indigo: 'var(--color-accent-indigo)',
  amber: 'var(--color-accent-amber)',
  emerald: 'var(--color-accent-emerald)',
  violet: 'var(--color-accent-violet)',
  orange: 'var(--color-accent-orange)',
  sky: 'var(--color-accent-sky)',
};

export const statusLabel: Record<string, { label: string; tone: string }> = {
  Idea: { label: 'Idea', tone: 'var(--color-subtle)' },
  Prototipo: { label: 'Prototipo', tone: 'var(--color-accent-amber)' },
  Beta: { label: 'Beta', tone: 'var(--color-accent-sky)' },
  Producción: { label: 'Producción', tone: 'var(--color-accent-emerald)' },
};
