import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Trang chủ", to: "/" },
  { label: "Tuyển dụng", to: "/jobs" },
  // { label: "Liên hệ", to: "#lien-he" },
  { label: "Đăng nhập", to: "/login" },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setMenuOpen(false);

  return (
    <div style={{ background: "#fff", fontFamily: "DM Sans, sans-serif", minHeight: "100vh" }}>

      {/* HEADER (UI from FormHeader) */}
      <header className="fixed top-0 left-0 w-full z-[50] bg-white shadow-md border-b border-gray-100">
        <nav className="flex items-center justify-between px-5 py-4 mx-auto max-w-site">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-2">
            <img
              src="../../../dist/assets/logo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex gap-2.5 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`text-gray-900 text-[1rem] px-[16px] py-2 rounded-full transition-all duration-300 no-underline
                    hover:text-blue-600 hover:bg-gray-100
                    ${pathname === to ? "bg-gray-100 text-blue-600 font-medium" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile button */}
          <button
            className="md:hidden text-gray-900 text-2xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </nav>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={close}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] flex flex-col pt-20 gap-3 transition-transform duration-200 md:hidden
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-5 right-5 text-2xl"
          onClick={close}
        >
          ✕
        </button>

        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            onClick={close}
            className={`px-5 py-3 text-[1.1rem] text-gray-900 hover:bg-gray-100 hover:text-blue-600 no-underline
              ${pathname === to ? "bg-gray-100 text-blue-600 font-medium" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* PAGE CONTENT */}
      <main className="pt-[70px]">
        <Outlet />
      </main>

      {/* FOOTER (giữ nguyên của bạn) */}
      <footer style={{ background: "#111827", color: "#9ca3af", marginTop: 80, padding: "36px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>

          <div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, display: "block", marginBottom: 10 }}>
              FreMed
            </span>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 300 }}>
              Công ty Cổ phần Dược phẩm CKM - Nhãn Khoa Sài Gòn<br />
              1467/32 Phạm Thế Hiển, P.6, Q.8, TP.HCM
            </p>
          </div>

          <div>
            <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: 14 }}>
              Liên hệ
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>
              Email: talents@fremed.com.vn
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "20px auto 0", paddingTop: 20, borderTop: "1px solid #374151", fontSize: 12, textAlign: "center" }}>
          © 2025 FreMed. All rights reserved.
        </div>
      </footer>
    </div>
  );
}