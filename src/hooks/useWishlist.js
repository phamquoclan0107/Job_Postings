// src/hooks/useWishlist.js
import { useState, useEffect } from 'react'

const KEY = 'wishlist'

export function useWishlist() {
  const [list, setList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(list))
  }, [list])

  const toggle = (productId) => {
    setList((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const isWishlisted = (productId) => list.includes(productId)

  return { list, toggle, isWishlisted }
}