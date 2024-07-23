import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust the base URL as needed
});

export const getCalls = () => api.get('/calls');
export const getCallById = (id: number) => api.get(`/calls/${id}`);
export const createCall = (callData: any) => api.post('/calls', callData);
export const updateCall = (id: number, callData: any) => api.put(`/calls/${id}`, callData);
export const deleteCall = (id: number) => api.delete(`/calls/${id}`);
