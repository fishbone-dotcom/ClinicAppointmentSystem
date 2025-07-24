'use client';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import NewPatientModal from '@/app/components/NewPatientModal';

interface Patient {
  Id: number;
  FirstName: string;
  LastName: string;
  FormalName?: string;
  Email: string | null;
  Phone: string | null;
  CreatedAt: string;
}

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/patients/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setPatients(data?.data || []);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setPatients([]);
      }
    };

    fetchPatients();
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
      <Header />
      <main className="container mx-auto py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Patient</span>
            </button>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled
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

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase">Patient Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600 uppercase">Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4">{patient.FormalName ?? `${patient.FirstName} ${patient.LastName}`}</td>
                      <td className="py-3 px-4">{patient.Email || 'N/A'}</td>
                      <td className="py-3 px-4">{patient.Phone || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <div key={patient.Id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="font-semibold text-gray-800">
                    {patient.FormalName ?? `${patient.FirstName} ${patient.LastName}`}
                  </p>
                  <p className="text-sm text-gray-600">Email: {patient.Email || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Phone: {patient.Phone || 'N/A'}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No patients found.</p>
            )}
          </div>
        </div>
      </main>

      <NewPatientModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default PatientsPage;
