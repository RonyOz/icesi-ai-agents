import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';

type Props = {
  categories: string[];
  statuses: string[];
};

type IndexedCard = {
  el: HTMLElement;
  name: string;
  category: string;
  status: string;
  tags: string;
};

export default function FilterBar({ categories, statuses }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<IndexedCard[]>([]);
  const fuseRef = useRef<Fuse<IndexedCard> | null>(null);

  useEffect(() => {
    const grid = document.getElementById('agents-grid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll<HTMLAnchorElement>('a[data-name]'));
    cardsRef.current = items.map((a) => ({
      el: a.closest('li') ?? a,
      name: a.dataset.name ?? '',
      category: a.dataset.category ?? '',
      status: a.dataset.status ?? '',
      tags: a.dataset.tags ?? '',
    }));

    fuseRef.current = new Fuse(cardsRef.current, {
      keys: ['name', 'tags', 'category'],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const cards = cardsRef.current;
    if (cards.length === 0) return;

    let visibleSet: Set<HTMLElement>;

    if (query.trim() && fuseRef.current) {
      const results = fuseRef.current.search(query.trim());
      visibleSet = new Set(results.map((r) => r.item.el));
    } else {
      visibleSet = new Set(cards.map((c) => c.el));
    }

    let visibleCount = 0;
    for (const card of cards) {
      const matchesCat = !category || card.category === category;
      const matchesStatus = !status || card.status === status;
      const matchesSearch = visibleSet.has(card.el);
      const visible = matchesCat && matchesStatus && matchesSearch;
      card.el.toggleAttribute('hidden', !visible);
      if (visible) visibleCount++;
    }

    const empty = document.getElementById('empty-state');
    if (empty) empty.classList.toggle('hidden', visibleCount > 0);
  }, [query, category, status]);

  const hasFilters = useMemo(
    () => Boolean(query || category || status),
    [query, category, status],
  );

  const clearAll = () => {
    setQuery('');
    setCategory('');
    setStatus('');
  };

  return (
    <div className="mb-10 border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar agentes</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-subtle)]"
          >
            ⌕
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, categoría o tag…"
            aria-label="Buscar agentes"
            className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-16 text-sm text-[var(--color-text)] placeholder:text-[var(--color-subtle)] focus:border-[var(--color-brand)] focus:outline-none rounded"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-subtle)]"
          >
            /
          </kbd>
        </label>

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-brand-ink)] hover:border-[var(--color-brand)] transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-8">
        <Pills label="Categoría" value={category} onChange={setCategory} options={categories} />
        <Pills label="Estado" value={status} onChange={setStatus} options={statuses} />
      </div>
    </div>
  );
}

function Pills({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-1.5">
      <legend className="sr-only">{label}</legend>
      <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-subtle)]">
        {label}
      </span>
      <Pill active={value === ''} onClick={() => onChange('')}>
        Todos
      </Pill>
      {options.map((opt) => (
        <Pill key={opt} active={value === opt} onClick={() => onChange(opt)}>
          {opt}
        </Pill>
      ))}
    </fieldset>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'rounded px-3 py-1 text-xs font-medium transition-colors border ' +
        (active
          ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-ink)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-brand-ink)] hover:border-[var(--color-brand)]')
      }
    >
      {children}
    </button>
  );
}
