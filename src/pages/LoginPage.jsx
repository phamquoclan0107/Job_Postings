import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect } from "react";

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "40px 36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  logo: {
    fontWeight: 800,
    fontSize: 20,
    color: "#111827",
    marginBottom: 28,
    display: "block",
  },
  h1: { fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 6px" },
  sub: { fontSize: 13, color: "#6b7280", marginBottom: 28 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  logoImg: {
  width: 70,
  height: 70,
  borderRadius: '50%',
  objectFit: 'cover',
  display: 'block',
  margin: '0 auto 28px',
  border: '2px solid #e5e7eb'
},
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  err: {
    fontSize: 13,
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 16,
  },
  link: { color: "#111827", fontWeight: 600, textDecoration: "none" },
};

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // if (isLoggedIn) { navigate('/admin/jobs', { replace: true }); return null }

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin/jobs", { replace: true });
    }
  }, [isLoggedIn, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success("Đăng nhập thành công!");
      navigate("/admin/jobs", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <img
          src="../../dist/assets/logo.jpg" // hoặc link logo của bạn
          alt="Logo"
          style={S.logoImg}
        />
        <h1 style={S.h1}>Đăng nhập</h1>
        <p style={S.sub}>Quản lý tin tuyển dụng & sản phẩm</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Tên đăng nhập</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
              autoComplete="username"
              style={S.input}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Mật khẩu</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              style={S.input}
            />
          </div>

          {error && <p style={S.err}>{error}</p>}

          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <Link
              to="/forgot-password"
              style={{ ...S.link, fontSize: 13, color: "#6b7280" }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link to="/register" style={S.link}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
