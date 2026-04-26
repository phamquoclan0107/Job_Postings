import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const NAV_LINKS = [
  { label: "Trang chủ", to: "/" },
  { label: "Tuyển dụng", to: "/jobs" },
  { label: "Liên hệ", to: "#lien-he" },
  { label: "Đăng nhập", to: "/login" },
];

export default function FormHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-[5] bg-white shadow-md font-poppins border-b border-gray-100">
        <nav className="flex items-center justify-between px-5 py-5 mx-auto max-w-site">

          {/* Logo */}
          <Link to="/" className="no-underline" onClick={close}>
            <img
              src="../../../dist/Logo.jpg"
              alt="EYE STAR"
              className="h-14 w-14 rounded-full object-cover border border-gray-200"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex gap-2.5 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`text-gray-900 text-[1.12rem] px-[18px] py-2.5 rounded-pill transition-all duration-300 no-underline
                    hover:text-blue-600 hover:bg-gray-100
                    ${pathname === to ? "bg-gray-100 text-blue-600 font-medium" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-900 text-2xl bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            <i className="fas fa-bars" />
          </button>
        </nav>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9] md:hidden"
          onClick={close}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-10 flex flex-col items-center pt-24 gap-0
          transition-transform duration-200 ease-in-out md:hidden
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          className="absolute top-7 right-7 text-2xl text-gray-900"
          onClick={close}
        >
          <i className="fas fa-times" />
        </button>

        {/* Links */}
        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            onClick={close}
            className={`text-[1.3rem] mt-[17px] px-[18px] py-2 rounded-pill no-underline transition-all duration-300
              text-gray-900 hover:text-blue-600 hover:bg-gray-100
              ${pathname === to ? "bg-gray-100 text-blue-600 font-medium" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Page content */}
      <Outlet />

      {/* Spacer */}
      <div className="h-[72px]" />
    </>
  );
}