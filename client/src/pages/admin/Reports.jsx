import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ReportAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageWrapper } from '../../components/layout/PageWrapper';

export default function Reports() {
  const [data, setData] = useState({ summary: {}, gender: [], blood: [], appointments: [] });
  useEffect(() => {
    Promise.all([ReportAPI.summary(), ReportAPI.gender(), ReportAPI.blood(), ReportAPI.appointments()]).then(([summary, gender, blood, appointments]) => setData({ summary: summary.data, gender: gender.data, blood: blood.data, appointments: appointments.data }));
  }, []);
  return (
    <PageWrapper title="Reports" actions={<div className="flex gap-2"><a href={ReportAPI.exportPatients()}><Button>Export Patients PDF</Button></a><a href={ReportAPI.exportRecords()}><Button variant="secondary">Export Records PDF</Button></a></div>}>
      <div className="grid gap-4 md:grid-cols-4">{Object.entries(data.summary).map(([k, v]) => <Card key={k}><div className="text-sm text-neutral-500">{k}</div><div className="text-2xl font-bold">{v}</div></Card>)}</div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Gender" rows={data.gender} />
        <ChartCard title="Blood Groups" rows={data.blood} />
        <ChartCard title="Appointments" rows={data.appointments} />
      </div>
    </PageWrapper>
  );
}

const ChartCard = ({ title, rows }) => <Card><h2 className="mb-3 font-semibold">{title}</h2><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={rows} dataKey="count" nameKey="_id" outerRadius={85} label>{rows.map((_, i) => <Cell key={i} fill={['#0B6E4F', '#1A73E8', '#D97706', '#0891B2'][i % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Card>;
