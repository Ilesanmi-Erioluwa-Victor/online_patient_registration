export const Badge = ({ children, tone = 'info' }) => {
  const tones = {
    success: 'bg-green-50 text-status-success',
    warning: 'bg-amber-50 text-status-warning',
    danger: 'bg-red-50 text-status-danger',
    info: 'bg-cyan-50 text-status-info',
    neutral: 'bg-neutral-100 text-neutral-700'
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
};
