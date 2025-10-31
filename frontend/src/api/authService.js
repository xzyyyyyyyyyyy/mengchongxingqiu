import axios from './axios';

export const authService = {
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return await axios.get('/auth/me');
  },

  updateProfile: async (userData) => {
    return await axios.put('/auth/updatedetails', userData);
  },

  updatePassword: async (passwords) => {
    return await axios.put('/auth/updatepassword', passwords);
  },
};
