import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import JobForm from "../components/job/JobForm";
import { PageTitle, Card, Button } from "../components/ui";
import toast from "react-hot-toast";

export default function JobCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const created = await jobService.create(data);
      toast.success("Tạo tin tuyển dụng thành công!");
      navigate(`/admin/jobs/${created.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Tạo tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle
        title="Tạo tin tuyển dụng"
        subtitle="Điền thông tin bên dưới để đăng tin mới"
        action={
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/jobs")}
          >
            ← Quay lại
          </Button>
        }
      />
      <Card className="px-8 py-7 max-w-[860px]">
        <JobForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Tạo tin"
        />
      </Card>
    </div>
  );
}
