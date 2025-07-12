import React from "react";
import bpslogo from "../assets/bps-logo.png"; // untuk akses ke gambar
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { id: "publications", label: "Daftar Publikasi", path: "/publications" },
  { id: "add", label: "Tambah Publikasi", path: "/publications/add" },
  { id: "logout", label: "Logout", path: "/logout" },
];

function BpsLogo() {
  // react hanya bisa mengubah HTML via function
  return (
    <img
      src={bpslogo}
      alt="BPS Logo"
      className="h-12 w-12" //height dan width 48px
    />
  );
}

export default function Navbar() {
  const location = useLocation();
  const { logoutAction,error} = useAuth();
  const navigate = useNavigate();

   const handleLogout = async () => {
    try {
      await logoutAction();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Jangan tampilkan navbar di halaman login
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-[#0369A1] shadow-lg sticky top-0 z-50">      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}          
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BpsLogo />
            <span
              className="text-white text-base md:text-lg font-bold tracking-wider hidden sm:block"
            >
              BPS PROVINSI JAWA TENGAH
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.id === "add" &&
                  location.pathname.startsWith("/publications/add")) ||
                (item.id === "publications" &&
                  location.pathname === "/publications");
              if (item.id === "logout") {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 border border-transparent cursor-pointer ${
                    isActive
                      ? "bg-white text-sky-900 shadow-md font-bold"
                      : "text-sky-100 hover:bg-sky-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
