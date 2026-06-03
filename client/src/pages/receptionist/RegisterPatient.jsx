import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PatientAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Select } from '../../components/common/Input';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { bloodGroups, genders } from '../../utils/constants';

const steps = ['Personal Info', 'Contact Info', 'Next of Kin', 'Medical History'];

export default function RegisterPatient() {
  const [step, setStep] = useState(0);
  const [created, setCreated] = useState(null);
  const { register, handleSubmit, formState } = useForm({ defaultValues: { address: { country: 'Nigeria' }, allergies: '', chronicConditions: '' } });
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const goNext = (event) => {
    event.preventDefault();
    next();
  };
  const submit = async (values) => {
    const body = {
      ...values,
      allergies: String(values.allergies || '').split(',').map((x) => x.trim()).filter(Boolean),
      chronicConditions: String(values.chronicConditions || '').split(',').map((x) => x.trim()).filter(Boolean)
    };
    try {
      const { data } = await PatientAPI.create(body);
      setCreated(data);
      toast.success(`Patient registered: ${data.patientID}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };
  return (
    <PageWrapper title="Register Patient">
      <Card className="max-w-4xl">
        <div className="mb-6 grid gap-2 md:grid-cols-4">
          {steps.map((label, index) => <div key={label} className={`rounded-md px-3 py-2 text-sm font-semibold ${index === step ? 'bg-primary-light text-white' : 'bg-primary-pale text-primary-dark'}`}>{index + 1}. {label}</div>)}
        </div>
        {created ? (
          <div className="grid gap-4">
            <h2 className="text-xl font-bold">Registration successful</h2>
            <p>Patient ID: <strong>{created.patientID}</strong></p>
            <div className="flex gap-2"><a href={PatientAPI.summaryUrl(created._id)} target="_blank" rel="noreferrer"><Button>Print Patient Card</Button></a><Button variant="secondary" onClick={() => location.reload()}>Register Another</Button></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(submit)} className="grid gap-4">
            {step === 0 && <div className="grid gap-4 md:grid-cols-2"><Input label="First Name" required {...register('firstName')} /><Input label="Last Name" required {...register('lastName')} /><Input label="Date of Birth" type="date" required {...register('dateOfBirth')} /><Select label="Gender" required {...register('gender')}><option value="">Select</option>{genders.map((g) => <option key={g}>{g}</option>)}</Select><Select label="Blood Group" {...register('bloodGroup')}><option value="">Select</option>{bloodGroups.map((g) => <option key={g}>{g}</option>)}</Select></div>}
            {step === 1 && <div className="grid gap-4 md:grid-cols-2"><Input label="Phone" required {...register('phone')} /><Input label="Email" type="email" {...register('email')} /><Input label="Street" {...register('address.street')} /><Input label="City" {...register('address.city')} /><Input label="State" {...register('address.state')} /><Input label="Country" {...register('address.country')} /></div>}
            {step === 2 && <div className="grid gap-4 md:grid-cols-3"><Input label="Name" {...register('nextOfKin.name')} /><Input label="Relationship" {...register('nextOfKin.relationship')} /><Input label="Phone" {...register('nextOfKin.phone')} /></div>}
            {step === 3 && <div className="grid gap-4 md:grid-cols-2"><Input label="Known Allergies" placeholder="Penicillin, Sulphur" {...register('allergies')} /><Input label="Chronic Conditions" placeholder="Hypertension, Diabetes" {...register('chronicConditions')} /></div>}
            <div className="flex justify-between border-t border-neutral-200 pt-4">
              <Button type="button" variant="secondary" onClick={back} disabled={step === 0}>Back</Button>
              {step < steps.length - 1 ? <Button key="next" type="button" onClick={goNext}>Next</Button> : <Button key="submit" type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Saving...' : 'Submit Registration'}</Button>}
            </div>
          </form>
        )}
      </Card>
    </PageWrapper>
  );
}
