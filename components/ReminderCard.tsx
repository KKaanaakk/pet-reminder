"use client";

import { Reminder } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { Clock, CheckCircle2, Edit3 } from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (reminderId: string) => void;
  onEdit: (reminder: Reminder) => void;
}

export default function ReminderCard({
  reminder,
  onToggleComplete,
  onEdit,
}: ReminderCardProps) {
  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "Daily":
        return "🔄";
      case "Weekly":
        return "📅";
      case "Monthly":
        return "📆";
      default:
        return "⏰";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
        reminder.status === "completed"
          ? "opacity-60 bg-gray-50"
          : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`font-medium ${
                reminder.status === "completed"
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {reminder.title}
            </h3>
            <button
              onClick={() => onEdit(reminder)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              <span>For {reminder.petName}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>At {formatTime(reminder.time)}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>{getFrequencyIcon(reminder.frequency)}</span>
              <span>{reminder.frequency}</span>
            </div>
          </div>

          {reminder.notes && (
            <p className="text-xs text-gray-500 mt-2">{reminder.notes}</p>
          )}
        </div>

        <button
          onClick={() => onToggleComplete(reminder.id)}
          className={`p-2 rounded-full transition-all ${
            reminder.status === "completed"
              ? "bg-green-100 text-green-600"
              : "hover:bg-gray-100 text-gray-400"
          }`}
        >
          <CheckCircle2
            className={`w-5 h-5 ${
              reminder.status === "completed" ? "fill-current" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
