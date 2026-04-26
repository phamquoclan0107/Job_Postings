// src/hooks/useSavedJobs.js
import { useState, useEffect } from 'react'

const KEY = 'savedJobs'

export function useSavedJobs() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved))
  }, [saved])

  const toggle = (jobId) => {
    setSaved((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  const isSaved = (jobId) => saved.includes(jobId)

  return { saved, toggle, isSaved }
}