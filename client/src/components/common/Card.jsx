export const Card = ({ children, className = '' }) => (
  <section className={`rounded-lg border border-neutral-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>
);
