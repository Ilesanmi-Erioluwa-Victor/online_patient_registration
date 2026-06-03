export const Button = ({ variant = 'primary', className = '', ...props }) => {
  const styles = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'border border-primary bg-white text-primary hover:bg-primary-pale',
    danger: 'bg-status-danger text-white hover:bg-red-700',
    ghost: 'text-primary hover:bg-primary-pale'
  };
  return <button className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`} {...props} />;
};
