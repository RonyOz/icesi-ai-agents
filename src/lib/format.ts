const PALETTE = [
  { bg: 'bg-icesi-blue-soft', text: 'text-icesi-blue-deep' },
  { bg: 'bg-[#f3ecff]', text: 'text-[#5a2bb8]' },
  { bg: 'bg-[#ecf9f0]', text: 'text-[#1f7a45]' },
  { bg: 'bg-[#fff7d6]', text: 'text-[#7a6a00]' },
  { bg: 'bg-[#ffece2]', text: 'text-[#a13a14]' },
  { bg: 'bg-[#f0f0f3]', text: 'text-[#4b5160]' },
];

export function colorForArea(area: string | null): { bg: string; text: string } {
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
