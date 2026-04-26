import { useState, useEffect, useCallback } from "react"
import { categoryService } from "../services/categoryService"

/**
 * type: "JOB" | "PRODUCT" | undefined
 */
export function useCategories(type) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await categoryService.getAll(type?.toUpperCase())
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể tải danh mục")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { categories, loading, error, refetch: fetch }
}