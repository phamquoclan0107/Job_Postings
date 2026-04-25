// src/hooks/useJobs.js
import { useState, useEffect, useCallback } from 'react'
import { jobService } from '../services/jobService'

const DEFAULT_PARAMS = {
  title:      '',
  categoryId: '',
  status:     '',
  page:       0,
  size:       10,
  sort:       'createdAt,desc',
}

export function useJobs(initialParams = {}) {
  const [params, setParams]       = useState({ ...DEFAULT_PARAMS, ...initialParams })
  const [data, setData]           = useState(null)   // Page object
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const fetch = useCallback(async (p = params) => {
    setLoading(true)
    setError(null)
    try {
      // strip empty strings
      const clean = Object.fromEntries(
        Object.entries(p).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )
      const page = await jobService.search(clean)
      setData(page)
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi tải danh sách job')
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
