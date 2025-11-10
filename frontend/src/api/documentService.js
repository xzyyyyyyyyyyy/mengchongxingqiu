import axios from './axios';

export const documentService = {
  // Get all documents
  getDocuments: (params = {}) => {
    return axios.get('/documents', { params });
  },

  // Get document statistics
  getStats: () => {
    return axios.get('/documents/stats');
  },

  // Get document by ID
  getDocument: (id) => {
    return axios.get(`/documents/${id}`);
  },

  // Upload a new document
  uploadDocument: (formData) => {
    return axios.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Update a document
  updateDocument: (id, data) => {
    return axios.put(`/documents/${id}`, data);
  },

  // Delete a document
  deleteDocument: (id) => {
    return axios.delete(`/documents/${id}`);
  }
};
