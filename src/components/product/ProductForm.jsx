import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from '../../hooks/useCategories'
import { Button, FormField, Input, Textarea, Select } from '../ui'
import { addProductImages, deleteProductImage } from '../../api/productApi'

export default function ProductForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = 'Lưu',
  onPendingFiles,
}) {
  const { categories, loading: catLoading, error: catError } = useCategories('PRODUCT')
  const fileInputRef = useRef(null)

  const isEditMode = !!defaultValues?.id

  const [images, setImages]           = useState(defaultValues?.images || [])
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [deletingId, setDeletingId]   = useState(null)

  const [pendingFiles, setPendingFiles] = useState([])
  const [previews, setPreviews]         = useState([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    // Chờ categories load xong mới reset để <select> có đủ option để chọn đúng
    if (defaultValues && !catLoading) {
      reset({
        ...defaultValues,
        categoryId: defaultValues.categoryId != null ? String(defaultValues.categoryId) : '',
      })
      if (isEditMode) setImages(defaultValues.images || [])
    }
  }, [defaultValues, catLoading, reset, isEditMode])

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url))
  }, [previews])

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (!isEditMode) {
      const newPreviews = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))
      setPendingFiles((prev) => [...prev, ...files])
      setPreviews((prev) => [...prev, ...newPreviews])
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setUploadError('')
    setUploading(true)
    try {
      const res = await addProductImages(defaultValues.id, files)
      if (!res.success) throw new Error(res.message)
      setImages((prev) => [...prev, ...(res.data || [])])
    } catch (err) {
      setUploadError(err?.response?.data?.message || err?.message || 'Upload thất bại')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteImage = async (imageId) => {
    setDeletingId(imageId)
    try {
      await deleteProductImage(defaultValues.id, imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      setUploadError(err?.response?.data?.message || err?.message || 'Xóa ảnh thất bại')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRemovePending = (index) => {
    URL.revokeObjectURL(previews[index].url)
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = (data) => {
    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    if (clean.categoryId) clean.categoryId = Number(clean.categoryId)
    if (clean.isActive !== undefined) clean.isActive = clean.isActive === 'true' || clean.isActive === true

    if (onPendingFiles) onPendingFiles(pendingFiles)
    onSubmit(clean)
  }

  const totalImageCount = isEditMode ? images.length : previews.length

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-2 gap-x-5">

        {/* Product Code */}
        <div className="col-span-2">
          <FormField label="Mã sản phẩm" required error={errors.productCode?.message} hint="Chỉ chữ hoa, số, dấu gạch. VD: SP_001">
            <Input
              placeholder="VD: SP_001"
              error={errors.productCode}
              {...register('productCode', {
                required: 'Mã sản phẩm không được để trống',
                maxLength: { value: 50, message: 'Tối đa 50 ký tự' },
                pattern: { value: /^[A-Z0-9_-]+$/, message: 'Chỉ chứa chữ hoa, số, dấu gạch' },
              })}
            />
          </FormField>
        </div>

        {/* Name */}
        <div className="col-span-2">
          <FormField label="Tên sản phẩm" required error={errors.name?.message}>
            <Input
              placeholder="VD: Áo thun cao cấp"
              error={errors.name}
              {...register('name', {
                required: 'Tên sản phẩm không được để trống',
                minLength: { value: 2, message: 'Tối thiểu 2 ký tự' },
                maxLength: { value: 200, message: 'Tối đa 200 ký tự' },
              })}
            />
          </FormField>
        </div>

        {/* Category */}
        <FormField label="Danh mục" required error={catError || errors.categoryId?.message}>
          <Select error={catError || errors.categoryId} disabled={catLoading} {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}>
            {catLoading
              ? <option value="">Đang tải danh mục...</option>
              : catError
                ? <option value="">Lỗi tải danh mục — thử lại</option>
                : <>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                    {categories.length === 0 && <option disabled value="">Chưa có danh mục nào</option>}
                  </>
            }
          </Select>
        </FormField>

        {/* Status */}
        <FormField label="Trạng thái" error={errors.isActive?.message}>
          <Select error={errors.isActive} {...register('isActive')}>
            <option value="true">Hiển thị</option>
            <option value="false">Ẩn</option>
          </Select>
        </FormField>

        {/* Description */}
        <div className="col-span-2">
          <FormField label="Mô tả sản phẩm" error={errors.description?.message}>
            <Textarea
              rows={5}
              placeholder="Mô tả chi tiết sản phẩm..."
              error={errors.description}
              {...register('description', { maxLength: { value: 5000, message: 'Tối đa 5000 ký tự' } })}
            />
          </FormField>
        </div>

        {/* IMAGE SECTION */}
        <div className="col-span-2">
          <FormField label="Hình ảnh sản phẩm" hint="PNG, JPG, WEBP · tối đa 5MB mỗi ảnh">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* EDIT MODE: ảnh đã lưu trên server */}
              {isEditMode && images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                  {images.map((img) => (
                    <div key={img.id} style={thumbWrap}>
                      {/* FIX: dùng img.url thay vì img.imageUrl */}
                      <img src={img.url} alt="" style={thumbImg} onError={(e) => { e.target.style.display = 'none' }} />
                      <button type="button" onClick={() => handleDeleteImage(img.id)} disabled={deletingId === img.id} style={deleteBtn} title="Xóa ảnh">
                        {deletingId === img.id ? '…' : '×'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* CREATE MODE: preview ảnh chọn trước khi upload */}
              {!isEditMode && previews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                  {previews.map((p, i) => (
                    <div key={i} style={thumbWrap}>
                      <img src={p.url} alt={p.name} style={thumbImg} />
                      <button type="button" onClick={() => handleRemovePending(i)} style={deleteBtn} title="Bỏ ảnh">×</button>
                      <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                        PREVIEW
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Nút chọn ảnh */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', border: '1.5px dashed var(--border)',
                    borderRadius: 8, background: uploading ? '#f9fafb' : 'var(--bg)',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: 13, color: 'var(--text-mute)', fontWeight: 500,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' } }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mute)' }}
                >
                  <UploadIcon />
                  {uploading ? 'Đang tải lên...' : '+ Chọn ảnh'}
                </button>

                {totalImageCount > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                    {totalImageCount} ảnh{!isEditMode ? ' (sẽ được tải lên sau khi tạo sản phẩm)' : ''}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {uploadError && (
                <p style={{ color: 'var(--red)', fontSize: 12, margin: 0 }}>{uploadError}</p>
              )}
            </div>
          </FormField>
        </div>

      </div>

      <div className="flex gap-2.5 justify-end mt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}

const thumbWrap = {
  position: 'relative', borderRadius: 8, overflow: 'hidden',
  border: '1px solid var(--border)', aspectRatio: '1', background: '#f9fafb',
}
const thumbImg = {
  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
}
const deleteBtn = {
  position: 'absolute', top: 4, right: 4,
  background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
  width: 22, height: 22, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontSize: 14, lineHeight: 1, fontWeight: 700,
}