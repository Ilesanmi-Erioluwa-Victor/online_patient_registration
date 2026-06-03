import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserAPI } from '../../api/services';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { departments, roles } from '../../utils/constants';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ role: 'doctor', password: 'Temp@1234' });
  const load = () => UserAPI.list().then((res) => setUsers(res.data));
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    await UserAPI.create(form);
    toast.success('User created');
    setOpen(false);
    load();
  };
  const deactivate = async (id) => {
    if (!confirm('Deactivate this user?')) return;
    await UserAPI.remove(id);
    toast.success('User deactivated');
    load();
  };
  return (
    <PageWrapper title="User Management" actions={<Button onClick={() => setOpen(true)}>Create New User</Button>}>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-primary-pale text-primary-dark"><tr><th className="p-3">Name</th><th>Role</th><th>Department</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>{users.map((u) => <tr key={u._id} className="border-t border-neutral-200"><td className="p-3">{u.fullName}</td><td className="capitalize">{u.role}</td><td>{u.department}</td><td><Badge tone={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td><td>{new Date(u.createdAt).toLocaleDateString('en-GB')}</td><td><Button variant="danger" onClick={() => deactivate(u._id)}>Deactivate</Button></td></tr>)}</tbody></table>
      </Card>
      <Modal open={open} title="Create Staff User" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Input label="Full Name" required onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roles.map((r) => <option key={r}>{r}</option>)}</Select>
          <Select label="Department" value={form.department || ''} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            <option value="">Select department</option>
            {departments.map((department) => <option key={department} value={department}>{department}</option>)}
          </Select>
          <Input label="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Temporary Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button className="md:col-span-2">Save User</Button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
