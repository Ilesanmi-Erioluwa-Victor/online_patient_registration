import { forwardRef } from 'react';

export const Input = forwardRef(({ label, className = '', ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>}
    <input ref={ref} className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-pale ${className}`} {...props} />
  </label>
));

export const Select = forwardRef(({ label, children, className = '', ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>}
    <select ref={ref} className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-pale ${className}`} {...props}>
      {children}
    </select>
  </label>
));

export const Textarea = forwardRef(({ label, className = '', ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>}
    <textarea ref={ref} className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-pale ${className}`} {...props} />
  </label>
));
