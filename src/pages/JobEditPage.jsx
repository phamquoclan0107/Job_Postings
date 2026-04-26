import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService } from '../services/jobService'
import JobForm from '../components/job/JobForm'
import { PageTitle, Card, Button, Spinner } from '../components/ui'
import toast from 'react-hot-toast'

export default function JobEditPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [job, setJob]           = useState(null)
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
      navigate(`/admin/jobs/${id}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Cập nhật thất bại')
    } finally { setSaving(false) }
  }

  const defaultValues = useMemo(() => {
    if (!job) return undefined
    return {
      title:           job.title           || '',
      categoryId:      job.categoryId      != null ? String(job.categoryId) : '',
      jobType:         job.jobType         || '',
      contactEmail:    job.contactEmail    || '',
      description:     job.description     || '',
      requirements:    job.requirements    || '',
      benefits:        job.benefits        || '',
      location:        job.location        || '',
      experienceLevel: job.experienceLevel || '',
      incomeLevel:     job.incomeLevel     || '',   // ← THÊM DÒNG NÀY
      status:          job.status          || '',
      expiresAt:       job.expiresAt       || '',
      imageUrl:        job.imageUrl        || '',
    }
  }, [job])

  return (
    <div>
      <PageTitle
        title="Chỉnh sửa tin tuyển dụng"
        subtitle={job ? `#${job.id} · ${job.title}` : ''}
        action={
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => navigate(`/admin/jobs/${id}`)}>← Chi tiết</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/jobs')}>Danh sách</Button>
          </div>
        }
      />
      <Card className="px-8 py-7 max-w-[860px]">
        {fetching ? (
          <div className="flex justify-center py-10"><Spinner size={32} /></div>
        ) : fetchErr ? (
          <p className="text-red text-sm">{fetchErr}</p>
        ) : (
          <JobForm defaultValues={defaultValues} onSubmit={handleSubmit} loading={saving} submitLabel="Lưu thay đổi" />
        )}
      </Card>
    </div>
  )
}