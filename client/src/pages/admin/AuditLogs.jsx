import { useEffect, useState } from 'react';
import { ReportAPI } from '../../api/services';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { formatDate } from '../../utils/formatDate';

export default function AuditLogs() {
  const [action, setAction] = useState('');
  const [data, setData] = useState({ items: [] });
  useEffect(() => { ReportAPI.audit({ action }).then((res) => setData(res.data)); }, [action]);
  return (
    <PageWrapper title="Audit Logs">
      <Card className="mb-4"><Input label="Filter by action" value={action} onChange={(e) => setAction(e.target.value)} /></Card>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-primary-pale text-primary-dark"><tr><th className="p-3">Who</th><th>Action</th><th>Target</th><th>IP Address</th><th>Timestamp</th></tr></thead><tbody>{data.items.map((log) => <tr key={log._id} className="border-t border-neutral-200"><td className="p-3">{log.performedBy?.fullName || 'System'}</td><td>{log.action}</td><td>{log.targetModel}</td><td>{log.ipAddress}</td><td>{formatDate(log.timestamp)}</td></tr>)}</tbody></table>
        {!data.items.length && <div className="p-6 text-neutral-500">No audit logs found.</div>}
      </Card>
    </PageWrapper>
  );
}
