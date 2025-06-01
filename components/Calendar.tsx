"use client";

import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
  const currentMonth = format(selectedDate, "MMMM yyyy");

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="bg-green-400 rounded-2xl p-4 mx-4 mb-6">
      <div className="text-center mb-4">
        <h2 className="text-white font-medium text-lg">
          {currentMonth.toLowerCase()}
        </h2>
      </div>

      <div className="flex justify-between items-center">
        {weekDays.map((day) => {
          const dayNumber = format(day, "d");
          const dayName = format(day, "EEE").toLowerCase();
          const isCurrentDay = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                isCurrentDay || isSelected
                  ? "bg-white text-green-400 shadow-md"
                  : "text-white hover:bg-green-300"
              }`}
            >
              <span className="text-xs mb-1">{dayName}</span>
              <span className="text-lg font-semibold">{dayNumber}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-4">
        <div className="w-6 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
}
