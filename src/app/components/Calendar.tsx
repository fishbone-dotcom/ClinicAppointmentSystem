'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import dayjs, { Dayjs } from 'dayjs';

type CalendarProps = {
  onSelectDate?: (date: Dayjs) => void;
};

export default function Calendar({ onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);

  const today = dayjs();

  useEffect(() => {
    // Set today as selected if it's in the current month
    if (today.isSame(currentMonth, 'month')) {
      setSelectedDay(today);
      onSelectDate?.(today); // auto-trigger callback
    } else {
      setSelectedDay(null);
    }
  }, [currentMonth]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const daysInMonth = endOfMonth.date();
  const startDay = startOfMonth.day();

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleSelectDay = (day: number) => {
    const selected = currentMonth.date(day);
    setSelectedDay(selected);
    onSelectDate?.(selected);
  };

  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = currentMonth.date(day);
    const isSelected = selectedDay?.isSame(dayDate, 'day');

    calendarDays.push(
      <div
        key={day}
        className={`text-center p-2 rounded cursor-pointer text-sm font-medium 
          ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-800'}`}
        onClick={() => handleSelectDay(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPreviousMonth}>
          <FiChevronLeft className="text-gray-600 text-xl" />
        </button>
        <h2 className="text-lg font-semibold text-gray-700">
          {currentMonth.format('MMMM YYYY')}
        </h2>
        <button onClick={goToNextMonth}>
          <FiChevronRight className="text-gray-600 text-xl" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">{calendarDays}</div>
    </div>
  );
}
