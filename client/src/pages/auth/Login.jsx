import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { dashboards } from '../../utils/constants';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm({ defaultValues: { email: 'admin@hospital.com', password: 'Admin@1234' } });
  const { login } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      navigate(dashboards[user.role]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">Use your assigned hospital staff account.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <Input label="Email" type="email" required {...register('email')} />
          <div className="relative">
            <Input label="Password" type={showPassword ? 'text' : 'password'} required {...register('password')} />
            <button type="button" className="absolute bottom-2.5 right-3 text-neutral-500" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-accent hover:text-accent-dark">Forgot Password?</Link>
          </div>
          <Button disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Signing in...' : 'Login'}</Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
