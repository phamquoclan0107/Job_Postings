// src/hooks/useCategories.js
import { useState, useEffect } from 'react'
import { categoryService } from '../services/categoryService'

/**
 * @param {'JOB'|'PRODUCT'|undefined} type - optional filter
 */
export function useCategories(type) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const fetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryService.getAll(type)
      setCategories(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [type])

  return { categories, loading, error, refetch: fetch }
}
