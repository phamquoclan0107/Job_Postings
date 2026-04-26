// src/hooks/useCart.js
import { useState, useEffect } from 'react'

const KEY = 'cart'

export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId))
  }

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((i) => i.id === productId ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)

  const isInCart = (productId) => cart.some((i) => i.id === productId)

  return { cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, isInCart }
}