import api from './api'

export const wishlistService = {
    getMine: async () => {
        const res = await api.get('/wishlist')
        return res.data
    },
    toggle: async (productId) => {
        const res = await api.post(`/wishlist/${productId}`)
        return res.data
    }
}
