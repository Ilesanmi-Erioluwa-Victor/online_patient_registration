import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConsultationAPI, PatientAPI, RecordAPI } from '../../api/services';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { ageFromDob, formatDate } from '../../utils/formatDate';

export default function PatientProfile() {
  const { id } = useParams();
  const [tab, setTab] = useState('Overview');
  const [state, setState] = useState(null);
  useEffect(() => {
    Promise.all([PatientAPI.get(id), RecordAPI.byPatient(id), ConsultationAPI.byPatient(id)])
      .then(([patient, records, consultations]) => setState({ patient: patient.data, records: records.data, consultations: consultations.data }));
  }, [id]);
  if (!state) return <PageWrapper title="Patient Profile"><Spinner /></PageWrapper>;
  const { patient, records, consultations } = state;
  const tabs = ['Overview', 'Medical Records', 'Consultations', 'Vitals'];
  return (
    <PageWrapper title={`${patient.firstName} ${patient.lastName}`} actions={<a href={PatientAPI.summaryUrl(patient._id)} target="_blank" rel="noreferrer"><Button>Print Summary</Button></a>}>
      <Card className="print-card mb-4">
        <div className="grid gap-3 md:grid-cols-6">
          <div><span className="text-sm text-neutral-500">PatientID</span><div className="font-bold">{patient.patientID}</div></div>
          <div><span className="text-sm text-neutral-500">Age</span><div>{ageFromDob(patient.dateOfBirth)}</div></div>
          <div><span className="text-sm text-neutral-500">Gender</span><div>{patient.gender}</div></div>
          <div><span className="text-sm text-neutral-500">Blood</span><div>{patient.bloodGroup || 'N/A'}</div></div>
          <div><span className="text-sm text-neutral-500">Phone</span><div>{patient.phone}</div></div>
          <div><span className="text-sm text-neutral-500">Address</span><div>{patient.address?.city || 'N/A'}</div></div>
        </div>
      </Card>
      <div className="no-print mb-4 flex flex-wrap gap-2">{tabs.map((name) => <Button key={name} variant={tab === name ? 'primary' : 'secondary'} onClick={() => setTab(name)}>{name}</Button>)}</div>
      <Card>
        {tab === 'Overview' && <div className="grid gap-4 md:grid-cols-3"><Info label="Next of Kin" value={`${patient.nextOfKin?.name || 'N/A'} ${patient.nextOfKin?.phone || ''}`} /><Info label="Allergies" value={patient.allergies?.length ? patient.allergies.join(', ') : 'None'} /><Info label="Chronic Conditions" value={patient.chronicConditions?.length ? patient.chronicConditions.join(', ') : 'None'} /></div>}
        {tab === 'Medical Records' && (records.length ? <div className="grid gap-3">{records.map((r) => <div key={r._id} className="rounded-md border border-neutral-200 p-3"><div className="flex justify-between"><strong>{r.title}</strong><Badge tone={r.isConfidential ? 'warning' : 'info'}>{r.recordType}</Badge></div><p className="mt-1 text-sm text-neutral-600">{r.description || 'No description'}</p></div>)}</div> : <p className="text-neutral-500">No medical records uploaded yet.</p>)}
        {tab === 'Consultations' && (consultations.length ? <div className="grid gap-3">{consultations.map((c) => <div key={c._id} className="rounded-md border border-neutral-200 p-3"><div className="font-semibold">{formatDate(c.date)} - {c.chiefComplaint}</div><p className="text-sm text-neutral-600">{c.diagnosis || 'No diagnosis recorded'}</p></div>)}</div> : <p className="text-neutral-500">No consultations recorded yet.</p>)}
        {tab === 'Vitals' && <div className="grid gap-3 md:grid-cols-3">{Object.entries(consultations[0]?.vitalSigns || {}).map(([k, v]) => <Info key={k} label={k} value={v || 'N/A'} />)}{!consultations[0]?.vitalSigns && <p className="text-neutral-500">No vital signs recorded yet.</p>}</div>}
      </Card>
    </PageWrapper>
  );
}

const Info = ({ label, value }) => <div><div className="text-sm capitalize text-neutral-500">{label}</div><div className="font-semibold">{value}</div></div>;
