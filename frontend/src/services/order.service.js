import api from './api'

export const orderService = {
  getAll: async () => {
    const res = await api.get('/orders')
    return res.data
  },

  getOne: async (id) => {
    const res = await api.get(`/orders/${id}`)
    return res.data
  },

  create: async (items) => {
    const res = await api.post('/orders', { items })
    return res.data
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status })
    return res.data
  },
}