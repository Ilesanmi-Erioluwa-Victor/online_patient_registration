import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetModel: String,
  targetId: mongoose.Schema.Types.ObjectId,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);
