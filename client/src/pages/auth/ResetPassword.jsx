import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { AuthLayout } from '../../components/layout/AuthLayout';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState } = useForm();
  const onSubmit = async ({ password }) => {
    await AuthAPI.reset(token, { password });
    toast.success('Password updated');
    navigate('/login');
  };
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Create new password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <Input label="New password" type="password" required minLength="8" {...register('password')} />
          <Input label="Confirm password" type="password" required {...register('confirm', { validate: (v) => v === watch('password') || 'Passwords do not match' })} />
          {formState.errors.confirm && <p className="text-sm text-status-danger">{formState.errors.confirm.message}</p>}
          <Button disabled={formState.isSubmitting}>Reset password</Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
