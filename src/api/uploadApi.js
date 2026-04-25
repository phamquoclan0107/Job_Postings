// src/api/uploadApi.js
import axiosInstance from './axiosInstance'

/**
 * POST /api/upload/jobs  (requires JWT)
 * Body: FormData { file: File }
 * Response: ApiResponse<{ url: string }>
 */
export const uploadJobImage = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return axiosInstance
    .post('/api/upload/jobs', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}

/**
 * POST /api/upload/jobs/multiple  (requires JWT)
 * Body: FormData { files: File[] }
 * Response: ApiResponse<{ urls: string[] }>
 */
export const uploadMultipleJobImages = (files) => {
  const fd = new FormData()
  files.forEach((f) => fd.append('files', f))
  return axiosInstance
    .post('/api/upload/jobs/multiple', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}
