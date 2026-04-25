// src/pages/JobEditPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../services/jobService'
import JobForm from '../components/job/JobForm'
import { PageTitle, Card, Button, Spinner } from '../components/ui'
import toast from 'react-hot-toast'

export default function JobEditPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [job, setJob]         = useState(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [fetchErr, setFetchErr] = useState(null)

  useEffect(() => {
    jobService.getById(id)
      .then((data) => { setJob(data); setFetching(false) })
      .catch((err) => { setFetchErr(err?.response?.data?.message || 'Không tải được dữ liệu'); setFetching(false) })
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      await jobService.update(id, data)
      toast.success('Cập nhật thành công!')
      navigate(`/jobs/${id}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  // Map DetailResponse → form default values
  const defaultValues = job
    ? {
        title:       job.title      || '',
        categoryId:  job.categoryId || '',
        description: job.description || '',
        salary:      job.salary      || '',
        location:    job.location    || '',
        imageUrl:    job.imageUrl    || '',
        status:      job.status      || '',
        expiresAt:   job.expiresAt   || '',
      }
    : undefined

  return (
    <div>
      <PageTitle
        title="Chỉnh sửa tin tuyển dụng"
        subtitle={job ? `#${job.id} · ${job.title}` : ''}
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={() => navigate(`/jobs/${id}`)}>← Chi tiết</Button>
            <Button variant="ghost" onClick={() => navigate('/jobs')}>Danh sách</Button>
          </div>
        }
      />

      <Card style={{ padding: '28px 32px', maxWidth: 860 }}>
        {fetching ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spinner size={32} />
          </div>
        ) : fetchErr ? (
          <p style={{ color: 'var(--red)', fontSize: 14 }}>{fetchErr}</p>
        ) : (
          <JobForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Lưu thay đổi"
          />
        )}
      </Card>
    </div>
  )
}
