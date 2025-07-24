'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import NewAppointmentModal from '@/app/components/NewAppointmentModal';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const fetchAppointments = async (status: string) => {
      try {
        let params = {
          ClinicId: 0,
          UserId: 0,
          PatientId: 0,
          StatusId: 0,
        };

        if (status === 'Pending') params.StatusId = 1;
        if (status === 'Confirmed') params.StatusId = 2;

        const res = await fetch('http://localhost:3000/api/appointments/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ params }),
        });

        const data = await res.json();
        setAppointments(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments(filter);
  }, [filter, isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
      <Header />
      <main className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Top controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Appointment</span>
            </button>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-200 mb-6 overflow-x-auto">
            {['All', 'Confirmed', 'Pending'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2 px-4 whitespace-nowrap transition-colors duration-200 ${
                  filter === tab
                    ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Appointments Table / Cards */}
          <div className="overflow-x-auto w-full">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full bg-white text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-3 px-4 text-gray-800">{appointment.Patient}</td>
                        <td className="py-3 px-4 text-gray-800">{appointment.Date}</td>
                        <td className="py-3 px-4 text-gray-800">{appointment.Time}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                              appointment.Status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.Status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : ''
                            }`}
                          >
                            {appointment.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden flex flex-col space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.Id} className="border rounded-lg p-4 shadow-sm bg-white">
                  <p className="font-semibold">{appointment.Patient}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.Date} at {appointment.Time}
                  </p>
                  <span
                    className={`mt-2 inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      appointment.Status === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.Status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ''
                    }`}
                  >
                    {appointment.Status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <NewAppointmentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default AppointmentsPage;
