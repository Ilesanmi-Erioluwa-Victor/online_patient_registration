import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AppointmentAPI, PatientAPI, UserAPI } from '../../api/services';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { statuses } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function Appointments() {
  const [data, setData] = useState({ items: [] });
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ status: 'Pending' });
  const load = () => AppointmentAPI.list().then((res) => setData(res.data));
  useEffect(() => {
    load();
    PatientAPI.list({ limit: 50 }).then((res) => setPatients(res.data.items));
    UserAPI.doctors().then((res) => setDoctors(res.data)).catch(() => setDoctors([]));
  }, []);
  const save = async (e) => {
    e.preventDefault();
    await AppointmentAPI.create(form);
    toast.success('Appointment created');
    setOpen(false);
    load();
  };
  const setStatus = async (id, status) => {
    await AppointmentAPI.update(id, { status });
    toast.success('Appointment updated');
    load();
  };
  return (
    <PageWrapper title="Appointments" actions={<Button onClick={() => setOpen(true)}>Create Appointment</Button>}>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-primary-pale text-primary-dark"><tr><th className="p-3">Patient</th><th>Doctor</th><th>Date</th><th>Reason</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>{data.items.map((a) => <tr key={a._id} className="border-t border-neutral-200"><td className="p-3">{a.patient?.firstName} {a.patient?.lastName}</td><td>{a.doctor?.fullName}</td><td>{formatDate(a.scheduledDate)}</td><td>{a.reason || 'N/A'}</td><td><Badge tone={a.status === 'Confirmed' ? 'success' : a.status === 'Cancelled' ? 'danger' : 'warning'}>{a.status}</Badge></td><td><Select value={a.status} onChange={(e) => setStatus(a._id, e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</Select></td></tr>)}</tbody>
        </table>
        {!data.items.length && <div className="p-6 text-neutral-500">No appointments found.</div>}
      </Card>
      <Modal open={open} title="Create Appointment" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="grid gap-4">
          <Select label="Patient" required onChange={(e) => setForm({ ...form, patient: e.target.value })}><option value="">Select</option>{patients.map((p) => <option key={p._id} value={p._id}>{p.patientID} - {p.firstName} {p.lastName}</option>)}</Select>
          <Select label="Doctor" required onChange={(e) => setForm({ ...form, doctor: e.target.value })}><option value="">Select</option>{doctors.map((d) => <option key={d._id} value={d._id}>{d.fullName}</option>)}</Select>
          <Input label="Date and Time" type="datetime-local" required onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
          <Input label="Reason" onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((s) => <option key={s}>{s}</option>)}</Select>
          <Button>Create</Button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
