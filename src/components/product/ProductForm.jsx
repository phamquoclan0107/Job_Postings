import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from '../../hooks/useCategories'
import { Button, FormField, Input, Textarea, Select } from '../ui'
import { addProductImages, deleteProductImage } from '../../api/productApi'

export default function ProductForm({ defaultValues, onSubmit, loading, submitLabel = 'Lưu' }) {
  const { categories, loading: catLoading, error: catError } = useCategories('PRODUCT')
  const fileInputRef = useRef(null)

  // images = list of { id, imageUrl } from server (for edit mode)
  // pendingFiles = files selected for upload after save (for create mode)
  const [images, setImages]           = useState(defaultValues?.images || [])
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [deletingId, setDeletingId]   = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
      setImages(defaultValues.images || [])
    }
  }, [defaultValues, reset])

  // Upload files immediately (only works when product already exists = edit mode)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (!defaultValues?.id) {
      setUploadError('Vui lòng tạo sản phẩm trước, sau đó thêm ảnh trong trang chỉnh sửa.')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const res = await addProductImages(defaultValues.id, files)
      if (!res.success) throw new Error(res.message)
      // append new images to list
      setImages((prev) => [...prev, ...(res.data || [])])
    } catch (err) {
      setUploadError(err?.response?.data?.message || err?.message || 'Upload thất bại')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!defaultValues?.id) return
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

  const handleFormSubmit = (data) => {
    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    if (clean.categoryId) clean.categoryId = Number(clean.categoryId)
    if (clean.isActive !== undefined) clean.isActive = clean.isActive === 'true' || clean.isActive === true
    onSubmit(clean)
  }

  const isEditMode = !!defaultValues?.id

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-2 gap-x-5">

        {/* Product Code — full width */}
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

        {/* Name — full width */}
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
        <FormField label="Trạng thái" error={errors.isActive?.message}>
          <Select error={errors.isActive} {...register('isActive')}>
            <option value="true">Hiển thị</option>
            <option value="false">Ẩn</option>
          </Select>
        </FormField>

        {/* Description — full width */}
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

        {/* IMAGE UPLOAD — full width, chỉ hiển thị ở edit mode */}
        <div className="col-span-2">
          <FormField
            label="Hình ảnh sản phẩm"
            hint={isEditMode ? 'PNG, JPG, WEBP · tối đa 5MB mỗi ảnh' : 'Tạo sản phẩm trước, sau đó thêm ảnh ở trang chỉnh sửa'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Existing images grid */}
              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  {images.map((img) => (
                    <div key={img.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '1' }}>
                      <img
                        src={img.imageUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingId === img.id}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
                          width: 22, height: 22, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 12, lineHeight: 1,
                        }}
                        title="Xóa ảnh"
                      >
                        {deletingId === img.id ? '…' : '×'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {isEditMode && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', border: '1.5px dashed var(--border)',
                      borderRadius: 8, background: 'var(--bg)', cursor: uploading ? 'not-allowed' : 'pointer',
                      fontSize: 13, color: 'var(--text-mute)', fontWeight: 500,
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <UploadIcon />
                    {uploading ? 'Đang tải lên...' : '+ Thêm ảnh'}
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                    {images.length} ảnh
                  </span>
                </div>
              )}

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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}