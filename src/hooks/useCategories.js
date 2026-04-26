// src/hooks/useCategories.js
import { useState, useEffect, useCallback } from 'react'
import { categoryService } from '../services/categoryService'

/**
 * @param {'JOB'|'PRODUCT'|undefined} type - optional filter
 */
export function useCategories(type) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryService.getAll(type)
      // Đảm bảo luôn là array dù API trả về null/undefined
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể tải danh mục'
      setError(msg)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => { fetch() }, [fetch])

  return { categories, loading, error, refetch: fetch }
}