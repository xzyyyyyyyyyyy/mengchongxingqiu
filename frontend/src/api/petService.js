import axios from './axios';

export const petService = {
  getPets: async () => {
    return await axios.get('/pets');
  },

  getPet: async (petId) => {
    return await axios.get(`/pets/${petId}`);
  },

  createPet: async (petData) => {
    return await axios.post('/pets', petData);
  },

  updatePet: async (petId, petData) => {
    return await axios.put(`/pets/${petId}`, petData);
  },

  deletePet: async (petId) => {
    return await axios.delete(`/pets/${petId}`);
  },

  addHealthRecord: async (petId, recordData) => {
    return await axios.post(`/pets/${petId}/health`, recordData);
  },

  addReminder: async (petId, reminderData) => {
    return await axios.post(`/pets/${petId}/reminders`, reminderData);
  },
};
