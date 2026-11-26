export function formatDate(dateValue, options = { day: 'numeric', month: 'short', hour:'numeric', minute:'numeric' }) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('fr-FR', options);
}

export function toUtcIsoString(dateInput) {
  if (!dateInput) return undefined;

  const [year, month, day] = String(dateInput).split('-').map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}