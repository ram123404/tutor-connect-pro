
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (data: any) => {
    return await api.post('/auth/register', data);
  },
  login: async (data: any) => {
    return await api.post('/auth/login', data);
  },
};

// User API functions
export const userAPI = {
  getMe: async () => {
    return await api.get('/users/me');
  },
  updateProfile: async (data: any) => {
    return await api.put('/users/update', data);
  },
};

// Tutor API functions
export const tutorAPI = {
  getAllTutors: async (params?: any) => {
    return await api.get('/tutors', { params });
  },
  getTutor: async (id: string) => {
    return await api.get(`/tutors/${id}`);
  },
  updateTutorProfile: async (id: string, data: any) => {
    return await api.put(`/tutors/${id}`, data);
  },
};

// Request API functions
export const requestAPI = {
  createRequest: async (data: any) => {
    return await api.post('/requests', data);
  },
  getRequests: async () => {
    return await api.get('/requests');
  },
  acceptRequest: async (id: string) => {
    return await api.put(`/requests/${id}/accept`);
  },
  rejectRequest: async (id: string) => {
    return await api.put(`/requests/${id}/reject`);
  },
  extendBooking: async (data: any) => {
    return await api.post('/requests/extend', data);
  },
};

// Booking API functions
export const bookingAPI = {
  getBookings: async () => {
    return await api.get('/bookings');
  },
  updateBookingStatus: async (id: string, status: string) => {
    return await api.put(`/bookings/${id}/status`, { status });
  },
};

// Admin API functions
export const adminAPI = {
  getAllUsers: async () => {
    return await api.get('/admin/users');
  },
  getAllRequests: async () => {
    return await api.get('/admin/requests');
  },
  toggleBlockUser: async (id: string) => {
    return await api.put(`/admin/users/${id}/block`);
  },
};
