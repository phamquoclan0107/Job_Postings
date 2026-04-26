import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from '../../hooks/useCategories'
import { Button, FormField, Input, Textarea, Select } from '../ui'
import { uploadJobImage } from '../../api/uploadApi'

export default function JobForm({ defaultValues, onSubmit, loading, submitLabel = 'Lưu' }) {
  const { categories, loading: catLoading, error: catError } = useCategories('JOB')
  const fileInputRef = useRef(null)

  const [imagePreview, setImagePreview] = useState(defaultValues?.imageUrl || '')
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
      setImagePreview(defaultValues.imageUrl || '')
    }
  }, [defaultValues, reset])

  const imageUrlValue = watch('imageUrl')
  useEffect(() => {
    setImagePreview(imageUrlValue || '')
  }, [imageUrlValue])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    const localUrl = URL.createObjectURL(file)
    setImagePreview(localUrl)
    setUploading(true)
    try {
      const res = await uploadJobImage(file)
      if (!res.success) throw new Error(res.message)
      const remoteUrl = res.data?.url || res.data
      setValue('imageUrl', remoteUrl, { shouldDirty: true })
      setImagePreview(remoteUrl)
    } catch (err) {
      setUploadError(err?.response?.data?.message || err?.message || 'Upload thất bại')
      setImagePreview('')
      setValue('imageUrl', '', { shouldDirty: true })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFormSubmit = (data) => {
    const min = data.salaryMin ? Number(data.salaryMin) : null
    const max = data.salaryMax ? Number(data.salaryMax) : null
    if (min !== null && max !== null && min > max) {
      setError('salaryMax', { type: 'manual', message: 'Lương tối đa phải >= lương tối thiểu' })
      return
    }
    clearErrors('salaryMax')

    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    if (clean.categoryId) clean.categoryId = Number(clean.categoryId)
    if (clean.salaryMin)  clean.salaryMin  = Number(clean.salaryMin)
    if (clean.salaryMax)  clean.salaryMax  = Number(clean.salaryMax)

    onSubmit(clean)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-2 gap-x-5">

        {/* Title — full width */}
        <div className="col-span-2">
          <FormField label="Tiêu đề công việc" required error={errors.title?.message}>
            <Input
              placeholder="Ví dụ: Senior React Developer"
              error={errors.title}
              {...register('title', {
                required: 'Tiêu đề không được để trống',
                minLength: { value: 5, message: 'Tối thiểu 5 ký tự' },
                maxLength: { value: 200, message: 'Tối đa 200 ký tự' },
              })}
            />
          </FormField>
        </div>

        {/* Company Name */}
        <div className="col-span-2">
          <FormField label="Tên công ty" error={errors.companyName?.message}>
            <Input
              placeholder="Ví dụ: Công ty Dược phẩm FreMed"
              error={errors.companyName}
              {...register('companyName', {
                maxLength: { value: 200, message: 'Tối đa 200 ký tự' },
              })}
            />
          </FormField>
        </div>

        {/* Category */}
        <FormField label="Danh mục" required error={catError || errors.categoryId?.message}>
          <Select
            error={catError || errors.categoryId}
            disabled={catLoading}
            {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
          >
            {catLoading
              ? <option value="">Đang tải danh mục...</option>
              : catError
                ? <option value="">Lỗi tải danh mục — thử lại</option>
                : <>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {categories.length === 0 && (
                      <option disabled value="">Chưa có danh mục nào</option>
                    )}
                  </>
            }
          </Select>
        </FormField>

        {/* Status */}
        <FormField label="Trạng thái" required error={errors.status?.message}>
          <Select error={errors.status} {...register('status', { required: 'Vui lòng chọn trạng thái' })}>
            <option value="">-- Chọn trạng thái --</option>
            <option value="ACTIVE">Đang tuyển (ACTIVE)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
          </Select>
        </FormField>

        {/* Job Type */}
        <FormField label="Hình thức làm việc" error={errors.jobType?.message}>
          <Select error={errors.jobType} {...register('jobType')}>
            <option value="">-- Chọn hình thức --</option>
            <option value="FULL_TIME">Toàn thời gian</option>
            <option value="PART_TIME">Bán thời gian</option>
            <option value="CONTRACT">Hợp đồng</option>
            <option value="REMOTE">Làm từ xa (Remote)</option>
            <option value="INTERNSHIP">Thực tập</option>
          </Select>
        </FormField>

        {/* Experience Level */}
        <FormField label="Cấp độ kinh nghiệm" error={errors.experienceLevel?.message}>
          <Select error={errors.experienceLevel} {...register('experienceLevel')}>
            <option value="">-- Chọn cấp độ --</option>
            <option value="FRESHER">Fresher (chưa có kinh nghiệm)</option>
            <option value="JUNIOR">Junior (1-2 năm)</option>
            <option value="MID">Mid-level (2-4 năm)</option>
            <option value="SENIOR">Senior (4+ năm)</option>
            <option value="LEAD">Lead / Manager</option>
          </Select>
        </FormField>

        {/* Salary Min */}
        <FormField label="Lương tối thiểu (VNĐ)" error={errors.salaryMin?.message} hint="Để trống nếu thỏa thuận">
          <Input
            type="number" placeholder="Ví dụ: 10000000" min="0"
            error={errors.salaryMin}
            {...register('salaryMin', { min: { value: 0, message: 'Không được âm' } })}
          />
        </FormField>

        {/* Salary Max */}
        <FormField label="Lương tối đa (VNĐ)" error={errors.salaryMax?.message}>
          <Input
            type="number" placeholder="Ví dụ: 20000000" min="0"
            error={errors.salaryMax}
            {...register('salaryMax', { min: { value: 0, message: 'Không được âm' } })}
          />
        </FormField>

        {/* Salary Type */}
        <FormField label="Loại lương" error={errors.salaryType?.message}>
          <Select error={errors.salaryType} {...register('salaryType')}>
            <option value="">-- Chọn loại lương --</option>
            <option value="GROSS">Gross</option>
            <option value="NET">Net</option>
            <option value="NEGOTIATE">Thỏa thuận</option>
          </Select>
        </FormField>

        {/* Location */}
        <FormField label="Địa điểm" error={errors.location?.message}>
          <Input
            placeholder="Ví dụ: Hà Nội, TP.HCM, Remote"
            error={errors.location}
            {...register('location', { maxLength: { value: 200, message: 'Tối đa 200 ký tự' } })}
          />
        </FormField>

        {/* Contact Email — required, dùng job.contactEmail thay vì hardcode */}
        <FormField label="Email liên hệ" required error={errors.contactEmail?.message}
          hint="Email này hiển thị cho ứng viên để nộp hồ sơ">
          <Input
            type="email"
            placeholder="Ví dụ: hr@company.com"
            error={errors.contactEmail}
            {...register('contactEmail', {
              required: 'Email liên hệ không được để trống',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email không đúng định dạng',
              },
              maxLength: { value: 255, message: 'Tối đa 255 ký tự' },
            })}
          />
        </FormField>

        {/* ExpiresAt */}
        <FormField label="Ngày hết hạn" error={errors.expiresAt?.message} hint="Phải là ngày trong tương lai">
          <Input type="date" error={errors.expiresAt} {...register('expiresAt')} />
        </FormField>

        {/* IMAGE UPLOAD — full width */}
        <div className="col-span-2">
          <FormField label="Hình ảnh (tuỳ chọn)" error={uploadError || errors.imageUrl?.message}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  height: imagePreview ? 'auto' : 160,
                  minHeight: 160,
                  border: '2px dashed var(--border)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg)',
                  position: 'relative',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                {uploading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" opacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span style={{ fontSize: 13, color: 'var(--text-mute)' }}>Đang tải lên...</span>
                  </div>
                ) : imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 6, opacity: 0, transition: 'opacity 0.2s',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = 1 }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = 0 }}
                    >
                      <UploadIcon />
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Thay ảnh</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <UploadIcon muted />
                    <span style={{ fontSize: 13, color: 'var(--text-mute)', fontWeight: 500 }}>Nhấn để chọn ảnh</span>
                    <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>PNG, JPG, WEBP · tối đa 5MB</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Hoặc nhập URL ảnh: https://..."
                    error={errors.imageUrl}
                    {...register('imageUrl', { maxLength: { value: 500, message: 'Tối đa 500 ký tự' } })}
                  />
                </div>
                <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <UploadIcon small /> {uploading ? 'Đang up...' : 'Chọn file'}
                </Button>
              </div>

              {uploadError && (
                <p style={{ color: 'var(--red)', fontSize: 12, margin: 0 }}>{uploadError}</p>
              )}
            </div>
          </FormField>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <FormField label="Mô tả công việc" error={errors.description?.message}>
            <Textarea
              rows={5}
              placeholder="Mô tả chi tiết về vị trí công việc..."
              error={errors.description}
              {...register('description', { maxLength: { value: 5000, message: 'Tối đa 5000 ký tự' } })}
            />
          </FormField>
        </div>

        {/* Requirements */}
        <div className="col-span-2">
          <FormField label="Yêu cầu ứng viên" error={errors.requirements?.message}>
            <Textarea
              rows={4}
              placeholder="Ví dụ: Tốt nghiệp Đại học, 2+ năm kinh nghiệm React..."
              error={errors.requirements}
              {...register('requirements')}
            />
          </FormField>
        </div>

        {/* Benefits */}
        <div className="col-span-2">
          <FormField label="Quyền lợi" error={errors.benefits?.message}>
            <Textarea
              rows={4}
              placeholder="Ví dụ: Thưởng tháng 13, Bảo hiểm sức khỏe, Du lịch hàng năm..."
              error={errors.benefits}
              {...register('benefits')}
            />
          </FormField>
        </div>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="flex gap-2.5 justify-end mt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}

function UploadIcon({ muted, small }) {
  const size  = small ? 16 : 28
  const color = muted ? 'var(--text-mute)' : '#fff'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}