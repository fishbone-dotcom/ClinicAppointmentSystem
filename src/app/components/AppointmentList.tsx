'use client';

import React, { useEffect, useState } from 'react';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/dashboard/get_appointment_upcoming');
        const data = await res.json();
        setAppointments(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Upcoming Appointments
      </h2>

      {/* Scrollable list container */}
      <div className="max-h-50 overflow-y-auto pr-2">
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li
              key={appt.Id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-4 py-3"
            >
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{appt.Patient}</p>
                <p className="text-gray-500 text-xs">
                  {appt.Date} • {appt.Time}
                </p>
              </div>
              <span className="text-blue-600 text-xs font-medium">
                Confirmed
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
