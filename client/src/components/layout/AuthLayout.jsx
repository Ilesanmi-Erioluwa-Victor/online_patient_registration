export const AuthLayout = ({ children }) => (
  <main className="grid min-h-screen bg-neutral-50 md:grid-cols-[1fr_1.1fr]">
    <section className="hidden bg-primary-dark p-10 text-white md:flex md:flex-col md:justify-between">
      <div>
        <div className="mb-12 text-xl font-bold">Hospital Records</div>
        <h1 className="max-w-lg text-4xl font-bold leading-tight">Online Patient Registration and Records Management System</h1>
      </div>
      <p className="max-w-md text-sm text-primary-pale">Secure role-based patient intake, consultations, medical records, appointments, reports, and audit trails.</p>
    </section>
    <section className="flex items-center justify-center p-5">{children}</section>
  </main>
);
