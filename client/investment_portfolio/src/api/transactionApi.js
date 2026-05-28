import api from './axios'

export const getTransactionsByAccount = (accountId) => api.get(`/transcation/account/${accountId}`)
export const getTransaction = (id) => api.get(`/transcation/${id}`)
export const createTransaction = (data) => api.post('/transcation/create', data)
export const updateTransaction = (id, data) => api.put(`/transcation/update/${id}`, data)
export const deleteTransaction = (id) => api.delete(`/transcation/delete/${id}`)
