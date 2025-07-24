// src/app/page.tsx

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HeroImage from './../../public/landing-illustration.svg'; // Make sure this file exists in /public

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <div className="text-2xl font-bold text-blue-600">Cliniko</div>
        <nav className="flex gap-6 text-sm">
          <a href="#explore" className="hover:text-blue-500">Explore</a>
          <a href="#solutions" className="hover:text-blue-500">Solutions</a>
          <a href="#about" className="hover:text-blue-500">About</a>
          <a href="#blog" className="hover:text-blue-500">Blog</a>
          <a href="/login" className="hover:text-blue-500">Log In</a>
        </nav>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => router.push('/login')}
          >
            Sign In
          </button>
          <button
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => router.push('/register')}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-10 py-20 max-w-7xl mx-auto gap-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Your Clinic, One Tap Away</h1>
          <p className="mb-6 text-gray-600">
            Book and manage clinic appointments instantly. Safe, reliable, and simple—anywhere in your city.
          </p>
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
              onClick={() => router.push('/appointments')}
            >
              Book Appointment
            </button>
            <button
              className="border border-gray-400 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition"
            >
              Learn More
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-gray-800">10K+</p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">4.8/5</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">98%</p>
              <p className="text-sm text-gray-500">Satisfied Patients</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <Image
            src={HeroImage}
            alt="Landing Illustration"
            className="w-full h-auto drop-shadow-xl"
            priority
          />
        </div>
      </main>
    </div>
  );
}
