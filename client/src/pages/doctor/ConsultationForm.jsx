import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ConsultationAPI, PatientAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Select, Textarea } from '../../components/common/Input';
import { PageWrapper } from '../../components/layout/PageWrapper';

export default function ConsultationForm() {
  const [patients, setPatients] = useState([]);
  const { register, handleSubmit, formState } = useForm({ defaultValues: { date: new Date().toISOString().slice(0, 10), prescription: [{ drug: '', dosage: '', frequency: '', duration: '' }] } });
  useEffect(() => { PatientAPI.list({ limit: 50 }).then((res) => setPatients(res.data.items)); }, []);
  const onSubmit = async (values) => {
    await ConsultationAPI.create({ ...values, prescription: values.prescription?.filter((p) => p.drug) || [] });
    toast.success('Consultation saved');
  };
  return (
    <PageWrapper title="Add Consultation">
      <Card className="max-w-5xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Patient" required {...register('patient')}><option value="">Select patient</option>{patients.map((p) => <option key={p._id} value={p._id}>{p.patientID} - {p.firstName} {p.lastName}</option>)}</Select>
            <Input label="Date" type="date" required {...register('date')} />
            <Input label="Follow-up Date" type="date" {...register('followUpDate')} />
          </div>
          <Textarea label="Chief Complaint" required {...register('chiefComplaint')} />
          <div className="grid gap-4 md:grid-cols-2"><Textarea label="Diagnosis" {...register('diagnosis')} /><Textarea label="Treatment Plan" {...register('treatment')} /></div>
          <div className="grid gap-4 md:grid-cols-6"><Input label="Temperature" {...register('vitalSigns.temperature')} /><Input label="Blood Pressure" {...register('vitalSigns.bloodPressure')} /><Input label="Pulse" {...register('vitalSigns.pulse')} /><Input label="Weight" {...register('vitalSigns.weight')} /><Input label="Height" {...register('vitalSigns.height')} /><Input label="SpO2" {...register('vitalSigns.spO2')} /></div>
          <div className="grid gap-4 md:grid-cols-4"><Input label="Drug" {...register('prescription.0.drug')} /><Input label="Dosage" {...register('prescription.0.dosage')} /><Input label="Frequency" {...register('prescription.0.frequency')} /><Input label="Duration" {...register('prescription.0.duration')} /></div>
          <Textarea label="Notes" {...register('notes')} />
          <div className="flex gap-2"><Button type="button" variant="secondary">Save as Draft</Button><Button disabled={formState.isSubmitting}>Submit</Button></div>
        </form>
      </Card>
    </PageWrapper>
  );
}
