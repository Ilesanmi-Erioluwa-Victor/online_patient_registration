import { PrinterIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PatientAPI } from '../../api/services';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Select } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useDebounce } from '../../hooks/useDebounce';
import { ageFromDob, formatDate } from '../../utils/formatDate';
import { bloodGroups, genders } from '../../utils/constants';

export default function PatientList() {
  const [params, setParams] = useState({ page: 1, search: '', gender: '', bloodGroup: '' });
  const debounced = useDebounce(params.search);
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    PatientAPI.list({ ...params, search: debounced }).then((res) => setData(res.data));
  }, [params.page, params.gender, params.bloodGroup, debounced]);
  return (
    <PageWrapper title="Patients">
      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Input label="Search" placeholder="Name, PatientID, phone" value={params.search} onChange={(e) => setParams({ ...params, page: 1, search: e.target.value })} />
          <Select label="Gender" value={params.gender} onChange={(e) => setParams({ ...params, page: 1, gender: e.target.value })}><option value="">All</option>{genders.map((g) => <option key={g}>{g}</option>)}</Select>
          <Select label="Blood Group" value={params.bloodGroup} onChange={(e) => setParams({ ...params, page: 1, bloodGroup: e.target.value })}><option value="">All</option>{bloodGroups.map((g) => <option key={g}>{g}</option>)}</Select>
        </div>
      </Card>
      <Card className="overflow-x-auto p-0">
        {!data ? <div className="p-6"><Spinner /></div> : data.items.length === 0 ? <div className="p-6 text-neutral-500">No patients found.</div> : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-primary-pale text-primary-dark"><tr><th className="p-3">PatientID</th><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Blood</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>{data.items.map((p) => <tr key={p._id} className="border-t border-neutral-200"><td className="p-3 font-semibold">{p.patientID}</td><td>{p.firstName} {p.lastName}</td><td>{ageFromDob(p.dateOfBirth)}</td><td><Badge tone="neutral">{p.gender}</Badge></td><td>{p.phone}</td><td>{p.bloodGroup || 'N/A'}</td><td>{formatDate(p.createdAt)}</td><td className="flex gap-2 py-2"><Link to={`/patients/${p._id}`}><Button variant="secondary">View</Button></Link><a href={PatientAPI.summaryUrl(p._id)} target="_blank" rel="noreferrer"><Button variant="ghost" className="px-2" aria-label="Print"><PrinterIcon className="h-5 w-5" /></Button></a></td></tr>)}</tbody>
          </table>
        )}
      </Card>
      {data && <div className="mt-4 flex items-center justify-between text-sm"><span>Page {data.page} of {data.pages || 1}</span><div className="flex gap-2"><Button variant="secondary" disabled={params.page <= 1} onClick={() => setParams({ ...params, page: params.page - 1 })}>Previous</Button><Button variant="secondary" disabled={params.page >= data.pages} onClick={() => setParams({ ...params, page: params.page + 1 })}>Next</Button></div></div>}
    </PageWrapper>
  );
}
