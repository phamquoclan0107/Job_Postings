import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { categoryService } from "../services/categoryService";
import {
  PageTitle,
  Card,
  Button,
  Badge,
  Spinner,
  EmptyState,
  ConfirmModal,
  FormField,
  Input,
  Select,
} from "../components/ui";
import { formatDateTime, getCategoryTypeLabel } from "../utils/formatters";
import toast from "react-hot-toast";

const typeColor = (type) => (type === "JOB" ? "var(--accent)" : "var(--blue)");

export default function CategoryPage() {
  const { categories, loading, error, refetch } = useCategories();
  const [typeFilter, setTypeFilter] = useState("");
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", type: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formErr, setFormErr] = useState({});

  const openCreate = () => {
    setForm({ name: "", type: "" });
    setFormErr({});
    setModal("create");
  };
  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, type: cat.type });
    setFormErr({});
    setModal("edit");
  };
  const closeModal = () => {
    setModal(null);
    setEditTarget(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Tên không được để trống";
    else if (form.name.length < 2) errs.name = "Tối thiểu 2 ký tự";
    else if (form.name.length > 100) errs.name = "Tối đa 100 ký tự";
    if (!form.type) errs.type = "Vui lòng chọn loại";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setFormErr(errs);
      return;
    }
    setSaving(true);
    try {
      if (modal === "create") {
        await categoryService.create(form);
        toast.success("Tạo danh mục thành công!");
      } else {
        await categoryService.update(editTarget.id, form);
        toast.success("Cập nhật thành công!");
      }
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thao tác thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success(`Đã xóa "${deleteTarget.name}"`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xóa thất bại");
    } finally {
      setDeleting(false);
    }
  };

const filtered = typeFilter
  ? categories.filter((c) => c.type === typeFilter.toUpperCase())
  : categories;

  return (
    <div>
      <PageTitle
        title="Danh mục"
        subtitle={`${categories.length} danh mục`}
        action={
          <Button onClick={openCreate}>
            <PlusIcon /> Tạo danh mục
          </Button>
        }
      />

      {/* Filter bar */}
      <Card className="mb-5 px-5 py-3.5">
        <div className="flex gap-2.5 items-center">
          <span className="text-[13px] text-text-sec">Lọc theo loại:</span>
          {["", "JOB", "PRODUCT"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-[180ms] ${
                typeFilter === t
                  ? "border-accent bg-accent-dim text-accent"
                  : "border-border bg-transparent text-text-sec hover:bg-bg-hover"
              }`}
            >
              {t === "" ? "Tất cả" : getCategoryTypeLabel(t)}
            </button>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size={32} />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16 text-red text-sm">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Không có danh mục nào" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["ID", "Tên danh mục", "Loại", "Ngày tạo", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-bold text-text-mute uppercase tracking-[0.06em] border-b border-border whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-bg-hover transition-colors duration-[120ms]"
                  >
                    <td className="px-4 py-3.5 border-b border-border align-middle">
                      <span className="text-text-mute font-mono text-xs">
                        #{cat.id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-border align-middle font-medium">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3.5 border-b border-border align-middle">
                      <Badge color={typeColor(cat.type)}>
                        {getCategoryTypeLabel(cat.type)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 border-b border-border align-middle text-xs text-text-mute">
                      {formatDateTime(cat.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 border-b border-border align-middle">
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(cat)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget(cat)}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]"
          onClick={closeModal}
        >
          <div
            className="bg-bg-card border border-border rounded-xl p-8 max-w-[440px] w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-head text-[18px] font-bold mb-5">
              {modal === "create" ? "Tạo danh mục mới" : "Chỉnh sửa danh mục"}
            </h3>
            <FormField label="Tên danh mục" required error={formErr.name}>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Ví dụ: Kỹ thuật phần mềm"
                error={formErr.name}
                autoFocus
              />
            </FormField>
            <FormField label="Loại danh mục" required error={formErr.type}>
              <Select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
                error={formErr.type}
              >
                <option value="">-- Chọn loại --</option>
                <option value="JOB">JOB — Việc làm</option>
                <option value="PRODUCT">PRODUCT — Sản phẩm</option>
              </Select>
            </FormField>
            <div className="flex gap-2.5 justify-end mt-2">
              <Button variant="ghost" onClick={closeModal}>
                Hủy
              </Button>
              <Button onClick={handleSave} loading={saving}>
                {modal === "create" ? "Tạo" : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
