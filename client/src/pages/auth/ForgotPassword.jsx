import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { AuthLayout } from '../../components/layout/AuthLayout';

export default function ForgotPassword() {
  const { register, handleSubmit, formState } = useForm();
  const onSubmit = async (values) => {
    await AuthAPI.forgot(values);
    toast.success('Reset instructions sent if the account exists');
  };
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
          <Input label="Staff email" type="email" required {...register('email')} />
          <Button disabled={formState.isSubmitting}>Send reset link</Button>
          <Link to="/login" className="text-sm text-accent">Back to login</Link>
        </form>
      </Card>
    </AuthLayout>
  );
}
