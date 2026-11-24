/**
 * Utility helpers for CSV export and Apple Status Colour badges
 */

export function exportRowsToCsv(filename, rows) {
  if (!rows || rows.length === 0) return;

  const headers = ['Roll No', 'Student Name', 'Subject', 'Status', 'Time In', 'Date'];
  const escapeCell = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const csvLines = [
    headers.join(','),
    ...rows.map((r) =>
      [r.rollNo, r.name, r.subject, r.status, r.timeIn, r.date].map(escapeCell).join(',')
    ),
  ];

  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns Air Quality label and Apple status colour classes (#30d158, #ff9f0a, #ff453a).
 */
export function getAqiMeta(aqi) {
  if (aqi <= 50) {
    return {
      label: 'Good',
      badgeClass: 'bg-[#30d158]/12 text-[#30d158] border-[#30d158]/25',
      dotClass: 'bg-[#30d158]',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      badgeClass: 'bg-[#ff9f0a]/12 text-[#ff9f0a] border-[#ff9f0a]/25',
      dotClass: 'bg-[#ff9f0a]',
    };
  }
  return {
    label: 'Poor',
    badgeClass: 'bg-[#ff453a]/12 text-[#ff453a] border-[#ff453a]/25',
    dotClass: 'bg-[#ff453a]',
  };
}
