import { api } from './client';

export const AuthAPI = {
  login: (body) => api.post('/auth/login', body),
  forgot: (body) => api.post('/auth/forgot-password', body),
  reset: (token, body) => api.post(`/auth/reset-password/${token}`, body),
  me: () => api.get('/auth/me'),
  profile: (body) => api.put('/auth/profile', body)
};

export const PatientAPI = {
  list: (params) => api.get('/patients', { params }),
  create: (body) => api.post('/patients', body),
  get: (id) => api.get(`/patients/${id}`),
  update: (id, body) => api.put(`/patients/${id}`, body),
  remove: (id) => api.delete(`/patients/${id}`),
  summaryUrl: (id) => `${api.defaults.baseURL}/patients/${id}/summary`
};

export const RecordAPI = {
  byPatient: (id) => api.get(`/records/patient/${id}`),
  create: (body) => api.post('/records', body)
};

export const ConsultationAPI = {
  byPatient: (id) => api.get(`/consultations/patient/${id}`),
  create: (body) => api.post('/consultations', body)
};

export const AppointmentAPI = {
  list: (params) => api.get('/appointments', { params }),
  create: (body) => api.post('/appointments', body),
  update: (id, body) => api.put(`/appointments/${id}`, body),
  remove: (id) => api.delete(`/appointments/${id}`)
};

export const UserAPI = {
  list: (params) => api.get('/users', { params }),
  doctors: () => api.get('/users/doctors'),
  create: (body) => api.post('/users', body),
  update: (id, body) => api.put(`/users/${id}`, body),
  remove: (id) => api.delete(`/users/${id}`)
};

export const ReportAPI = {
  summary: () => api.get('/reports/summary'),
  patientsByMonth: () => api.get('/reports/patients-by-month'),
  gender: () => api.get('/reports/gender-breakdown'),
  blood: () => api.get('/reports/blood-group-stats'),
  appointments: () => api.get('/reports/appointments-stats'),
  audit: (params) => api.get('/audit', { params }),
  exportPatients: () => `${api.defaults.baseURL}/reports/export/patients`,
  exportRecords: () => `${api.defaults.baseURL}/reports/export/records`
};
