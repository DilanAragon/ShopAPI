import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { wishlistService } from '../services/wishlist.service'

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth()
    const [wishlist, setWishlist] = useState([])

    const fetchWishlist = async () => {
        if (!user) {
            setWishlist([])
            return
        }
        try {
            const data = await wishlistService.getMine()
            setWishlist(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [user])

    const toggleWishlist = async (product) => {
        if (!user) return
        try {
            const res = await wishlistService.toggle(product.id)
            if (res.added) {
                setWishlist([...wishlist, product])
            } else {
                setWishlist(wishlist.filter(p => p.id !== product.id))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const isInWishlist = (productId) => wishlist.some((p) => p.id === productId)

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}
