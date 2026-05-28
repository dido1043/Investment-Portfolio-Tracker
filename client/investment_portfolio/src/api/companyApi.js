import api from './axios'

export const getAllCompanies = () => api.get('/company/all')
export const getCompany = (id) => api.get(`/company/${id}`)
export const createCompany = (data) => api.post('/company/create', data)
export const updateCompany = (id, data) => api.put(`/company/update/${id}`, data)
export const deleteCompany = (id) => api.delete(`/company/delete/${id}`)
