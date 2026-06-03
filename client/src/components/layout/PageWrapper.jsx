import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const PageWrapper = ({ title, actions, children }) => (
  <div className="min-h-screen bg-neutral-50 md:flex">
    <Sidebar />
    <div className="min-w-0 flex-1">
      <Navbar />
      <main className="p-4 md:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  </div>
);
