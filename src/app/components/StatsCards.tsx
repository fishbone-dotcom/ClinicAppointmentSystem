'use client';

import React, { useEffect, useState } from 'react';
import {
  FaCalendarDay,
  FaClock,
  FaExclamationTriangle,
  FaPaperPlane,
} from 'react-icons/fa';
import dayjs, { Dayjs } from 'dayjs';

type StatsCardsProps = {
  selectedDate: Dayjs;
};

export default function StatsCards({ selectedDate }: StatsCardsProps) {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    const fetchStats = async () => {

      selectedDate.format('YYYY-MM-DD')

      try {
        let params = {
          ClinicId: 0,
          UserId: 0,
          PatientId: 0,
          StatusId: 0,
          Date: selectedDate.format('MM/DD/YYYY')
        };

        const res = await fetch('http://localhost:3000/api/dashboard/get_appointment_stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ params }),
        });;

        const data = await res.json();


        setStats(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setStats([]);
      }
    };

    fetchStats();
  }, [selectedDate])

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat) => {

        return (
          <div
            key={stat.label}
            className="bg-white shadow rounded-lg px-5 py-4 flex items-center gap-4"
          >
            {stat.icon === 'FaCalendarDay' ? <div className={`p-3 rounded-full bg-blue-100`}><FaCalendarDay className={`text-blue-500 text-xl`} /></div> : ''}
            {stat.icon === 'FaClock' ? <div className={`p-3 rounded-full bg-blue-100`}><FaClock className={`text-blue-500 text-xl`} /></div> : ''}
            {stat.icon === 'FaExclamationTriangle' ? <div className={`p-3 rounded-full bg-blue-100`}><FaExclamationTriangle className={`text-blue-500 text-xl`} /></div> : ''}
            {stat.icon === 'FaPaperPlane' ? <div className={`p-3 rounded-full bg-blue-100`}><FaPaperPlane className={`text-blue-500 text-xl`} /></div> : ''}
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
