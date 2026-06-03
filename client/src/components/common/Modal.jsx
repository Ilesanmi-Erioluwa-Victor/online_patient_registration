import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

export const Modal = ({ title, open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose} className="h-9 w-9 p-0" aria-label="Close">
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
