const PALETTE = [
  { bg: '#eeeefd', text: '#2d2d9c' },
  { bg: '#f3ecff', text: '#5a2bb8' },
  { bg: '#ecf9f0', text: '#1f7a45' },
  { bg: '#fff7d6', text: '#7a6a00' },
  { bg: '#ffece2', text: '#a13a14' },
  { bg: '#f0f0f3', text: '#4b5160' },
];

export interface AreaColors { bg: string; text: string }

export function colorForArea(area: string | null): AreaColors {
  if (!area) return PALETTE[5];
  let hash = 0;
  for (let i = 0; i < area.length; i++) hash = (hash * 31 + area.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % (PALETTE.length - 1)];
}

export function relativeTime(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diff = (Date.now() - date.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return 'hace un momento';
  if (abs < 3600) return `hace ${Math.floor(abs / 60)} min`;
  if (abs < 86400) return `hace ${Math.floor(abs / 3600)} h`;
  if (abs < 604800) return `hace ${Math.floor(abs / 86400)} d`;
  if (abs < 2592000) return `hace ${Math.floor(abs / 604800)} sem`;
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}
