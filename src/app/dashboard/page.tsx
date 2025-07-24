'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';
import StatsCards from '@/app/components/StatsCards';
import Calendar from '@/app/components/Calendar';
import AppointmentList from '@/app/components/AppointmentList';
import dayjs, { Dayjs } from 'dayjs';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const handleDateChange = (date: Dayjs) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <Header />
      <StatsCards selectedDate={selectedDate} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Calendar selectedDate={selectedDate} onSelectDate={handleDateChange} />
        <AppointmentList selectedDate={selectedDate} />
      </div>
    </div>
  );
}
