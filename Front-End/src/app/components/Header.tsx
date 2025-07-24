'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUserCircle, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Appointments', href: '/appointments' },
  { name: 'Patients', href: '/patients' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter(); // 🔧
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // 🔧

  const handleLogout = async () => {
    try {
    await fetch('http://localhost:3000/api/logout', {
      method: 'POST',
      credentials: 'include', // important to include cookies
    });
  } catch (err) {
    console.error('Logout error:', err);
  }
    // ✅ You can also remove cookies/localStorage here
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between relative z-50">
      <div className="text-xl font-bold text-gray-800">Cliniko</div>

      <div className="flex items-center ml-auto gap-4 sm:gap-6 relative">
        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium ${pathname === link.href
                ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* 🔧 Settings dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <FaUserCircle className="text-lg" />
              <span>Settings</span>
              <FaChevronDown className="text-xs" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md sm:hidden flex flex-col gap-4 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium ${pathname === link.href
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-left text-sm font-medium text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
