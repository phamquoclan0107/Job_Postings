import { useState, useEffect, useCallback } from 'react'
import { getAllJobs } from '../api/jobApi'

export function useJobs(initialParams = {}) {
  const [params, setParams] = useState({
    keyword: '',
    location: '',
    categoryId: '',
    status: '',
    page: 0,
    size: 10,
    sort: 'createdAt,desc',
    ...initialParams,
  })

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchJobs = useCallback(() => {
    setLoading(true)
    setError(null)
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    )
    getAllJobs(cleanParams)
      .then((res) => setData(res?.data ?? res))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Lỗi tải danh sách việc làm'))
      .finally(() => setLoading(false))
  }, [params])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: 0 }))
  }, [])

  const setPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }))
  }, [])

  return { data, loading, error, params, updateParams, setPage, refetch: fetchJobs }
}