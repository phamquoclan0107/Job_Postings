// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/productService'

const DEFAULT_PARAMS = {
  categoryId: '',
  isActive:   '',
  page:       0,
  size:       12,
  sort:       'createdAt,desc',
}

export function useProducts(initialParams = {}) {
  const [params, setParams]   = useState({ ...DEFAULT_PARAMS, ...initialParams })
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async (p) => {
    const current = p || params
    setLoading(true)
    setError(null)
    try {
      const clean = Object.fromEntries(
        Object.entries(current).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
      const page = await productService.search(clean)
      setData(page)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Lỗi tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => { fetch(params) }, [params])

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 0 }))
  }, [])

  const setPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  return { data, loading, error, params, updateParams, setPage, refetch: fetch }
}