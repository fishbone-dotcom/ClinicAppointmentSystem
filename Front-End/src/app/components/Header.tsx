'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Appointments', href: '/appointments' },
  { name: 'Patients', href: '/patients' },
  { name: 'Settings', href: '/settings' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-800">Cliniko</div>

      {/* Right Side Container */}
      <div className="flex items-center ml-auto gap-4 sm:gap-6">
        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6">
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
        </div>
      )}
    </header>
  );
}
