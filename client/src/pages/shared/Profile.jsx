import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Select } from '../../components/common/Input';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useAuth } from '../../context/AuthContext';
import { departments } from '../../utils/constants';

export default function Profile() {
  const { user } = useAuth();
  const { register, handleSubmit, formState } = useForm({ defaultValues: user });
  const onSubmit = async (values) => {
    await AuthAPI.profile(values);
    toast.success('Profile updated');
  };
  return (
    <PageWrapper title="My Profile">
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <Input label="Full Name" {...register('fullName')} />
          <Input label="Phone" {...register('phone')} />
          <Select label="Department" {...register('department')}>
            <option value="">Select department</option>
            {departments.map((department) => <option key={department} value={department}>{department}</option>)}
          </Select>
          <Input label="Current Password" type="password" {...register('currentPassword')} />
          <Input label="New Password" type="password" {...register('newPassword')} />
          <Button className="md:col-span-2" disabled={formState.isSubmitting}>Update Profile</Button>
        </form>
      </Card>
    </PageWrapper>
  );
}
