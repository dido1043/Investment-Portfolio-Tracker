import api from './axios'

export const getAccountsByUser = (userId) => api.get(`/account/user/${userId}`)
export const getAccount = (id) => api.get(`/account/${id}`)
export const createAccount = (data) => api.post('/account/create', data)
export const updateAccount = (id, data) => api.put(`/account/update/${id}`, data)
export const deleteAccount = (id) => api.delete(`/account/delete/${id}`)
