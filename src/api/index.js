import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
  profile: () => API.get('/auth/profile'),
  users: (role) => API.get(`/auth/users${role ? `?role=${role}` : ''}`),
};

export const sports = {
  getAll: () => API.get('/sports'),
  getById: (id) => API.get(`/sports/${id}`),
  create: (data) => API.post('/sports', data),
  update: (id, data) => API.put(`/sports/${id}`, data),
  remove: (id) => API.delete(`/sports/${id}`),
};

export const courts = {
  getAll: (sportId) => API.get(`/courts${sportId ? `?sport_id=${sportId}` : ''}`),
  getById: (id) => API.get(`/courts/${id}`),
  create: (data) => API.post('/courts', data),
  update: (id, data) => API.put(`/courts/${id}`, data),
  remove: (id) => API.delete(`/courts/${id}`),
};

export const equipment = {
  getAll: (sportId) => API.get(`/equipment${sportId ? `?sport_id=${sportId}` : ''}`),
  create: (data) => API.post('/equipment', data),
  update: (id, data) => API.put(`/equipment/${id}`, data),
  remove: (id) => API.delete(`/equipment/${id}`),
};

export const schedules = {
  getAll: (params) => API.get('/schedules', { params }),
  create: (data) => API.post('/schedules', data),
  update: (id, data) => API.put(`/schedules/${id}`, data),
  remove: (id) => API.delete(`/schedules/${id}`),
};

export const bookings = {
  availableSlots: (courtId, date) => API.get(`/bookings/available-slots?court_id=${courtId}&date=${date}`),
  getAll: () => API.get('/bookings'),
  getById: (id) => API.get(`/bookings/${id}`),
  create: (data) => API.post('/bookings', data),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
  stats: () => API.get('/bookings/stats'),
};

export const payments = {
  make: (data) => API.post('/payments', data),
  getByBooking: (bookingId) => API.get(`/payments/booking/${bookingId}`),
};

export const notifications = {
  getAll: () => API.get('/notifications'),
  send: (data) => API.post('/notifications', data),
  sendBulk: (data) => API.post('/notifications/bulk', data),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all'),
};

export const admissions = {
  getAll: () => API.get('/admissions'),
  create: (data) => API.post('/admissions', data),
  cancel: (id) => API.put(`/admissions/${id}/cancel`),
};

export default API;
