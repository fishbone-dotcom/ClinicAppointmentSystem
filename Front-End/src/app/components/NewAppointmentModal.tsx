'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';

export default function NewAppointmentModal({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [patients, setPatients] = useState<{ id: number; value: string }[]>([]);
  const [patientId, setPatientId] = useState('');
  const [clinics, setClinics] = useState<{ id: number; value: string }[]>([]);
  const [clinicId, setClinicId] = useState('');
  const [status, setStatus] = useState<{ id: number; value: string }[]>([]);
  const [statusId, setStatusId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Fetch patient data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchPatients = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/patients/get_patient_look_ups');
          const json = await res.json();
          setPatients(json.data); // tama ba ang path mo sa response?
        } catch (err) {
          console.error('Failed to fetch patients:', err);
          setPatients([]);
        }
      };

      const fetchClinics = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/clinics/get_clinic_look_ups');
          const json = await res.json();
          setClinics(json.data); // tama ba ang path mo sa response?
        } catch (err) {
          console.error('Failed to fetch clinics:', err);
          setClinics([]);
        }
      };

      const fetchStatus = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/appointments/get_appointment_look_ups');
          const json = await res.json();
          console.log('json: ', json);
          setStatus(json.data); // tama ba ang path mo sa response?
        } catch (err) {
          console.error('Failed to fetch status:', err);
          setStatus([]);
        }
      };

      fetchClinics();
      fetchPatients();
      fetchStatus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientId || !clinicId || !clinicId || !date || !time) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/appointments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, clinicId, statusId, date, time, reason }),
      });

      if (res.ok) {
        setPatientId('');
        setClinicId('');
        setDate('');
        setTime('');
        setReason('');
        setIsOpen(false);
      } else {
        setError('Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-semibold text-gray-800 mb-4">
                  New Appointment
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dropdown for patient */}
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.value}
                      </option>
                    ))}
                  </select>
                  <select
                    value={clinicId}
                    onChange={(e) => setClinicId(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                  >
                    <option value="">Select Clinic</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.value}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                  >
                    <option value="">Select Status</option>
                    {status.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.value}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-4">
                    <input
                      type="date"
                      className="w-1/2 border px-4 py-2 rounded"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    <input
                      type="time"
                      className="w-1/2 border px-4 py-2 rounded"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Reason"
                    className="w-full border px-4 py-2 rounded"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
