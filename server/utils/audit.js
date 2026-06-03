import AuditLog from '../models/AuditLog.js';

export const writeAudit = async (req, action, targetModel, targetId) => {
  await AuditLog.create({
    performedBy: req.user?._id,
    action,
    targetModel,
    targetId,
    ipAddress: req.ip
  });
};
