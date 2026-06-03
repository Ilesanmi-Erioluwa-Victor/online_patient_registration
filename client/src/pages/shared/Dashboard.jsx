import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReportAPI } from '../../api/services';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (user.role === 'admin') {
      Promise.all([ReportAPI.summary(), ReportAPI.patientsByMonth(), ReportAPI.gender(), ReportAPI.blood()])
        .then(([summary, months, gender, blood]) => setData({ summary: summary.data, months: months.data, gender: gender.data, blood: blood.data }))
        .catch(() => setData({ summary: {}, months: [], gender: [], blood: [] }));
    } else {
      ReportAPI.summary()
        .then((summary) => setData({ summary: summary.data, months: [], gender: [], blood: [] }))
        .catch(() => setData({ summary: {}, months: [], gender: [], blood: [] }));
    }
  }, [user.role]);
  if (!data) return <PageWrapper title="Dashboard"><Spinner /></PageWrapper>;
  const metrics = data.summary;
  return (
    <PageWrapper
      title={`${user.role[0].toUpperCase()}${user.role.slice(1)} Dashboard`}
      actions={<div className="flex gap-2">{['admin', 'receptionist'].includes(user.role) && <Link to="/receptionist/register-patient"><Button>Register Patient</Button></Link>}<Link to="/patients"><Button variant="secondary">Find Patient</Button></Link></div>}
    >
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(metrics).map(([key, value]) => <Card key={key}><div className="text-sm capitalize text-neutral-500">{key.replace(/([A-Z])/g, ' $1')}</div><div className="mt-2 text-2xl font-bold">{value ?? 0}</div></Card>)}
      </div>
      {user.role === 'admin' && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card><h2 className="mb-4 font-semibold">Patient registrations by month</h2><ResponsiveContainer width="100%" height={260}><BarChart data={data.months}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#0B6E4F" /></BarChart></ResponsiveContainer></Card>
          <Card><h2 className="mb-4 font-semibold">Gender distribution</h2><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={data.gender} dataKey="count" nameKey="_id" outerRadius={90} label>{data.gender.map((_, i) => <Cell key={i} fill={['#0B6E4F', '#1A73E8', '#D97706'][i % 3]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Card>
        </div>
      )}
    </PageWrapper>
  );
}
