import React from "react";
import { Reminder } from "@/lib/types";
import { format } from "date-fns";
import { Check, MoreVertical, Filter, Trash2 } from "lucide-react";
import { timeSlots, groupRemindersByTimeSlot } from "@/lib/utils";

interface ReminderListProps {
  reminders: Reminder[];
  onToggleStatus: (reminder: Reminder) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
}

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const pendingReminders = reminders.filter((r) => r.status === "pending");
  const completedReminders = reminders.filter((r) => r.status === "completed");
  const groupedPendingReminders = groupRemindersByTimeSlot(pendingReminders);

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => (
    <div
      className="bg-white rounded-lg p-4 mb-3 shadow-sm transform transition-all duration-200 ease-in-out hover:shadow-md"
      style={{
        opacity: reminder.status === "completed" ? 0.7 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleStatus(reminder)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${
                reminder.status === "completed"
                  ? "bg-green-500 border-green-500 scale-105"
                  : "border-gray-300 hover:border-green-500"
              }`}
          >
            <Check
              className={`w-4 h-4 text-white transform transition-all duration-200 ${
                reminder.status === "completed" ? "scale-100" : "scale-0"
              }`}
            />
          </button>
          <div>
            <h3
              className={`text-lg font-medium transition-all duration-200 ${
                reminder.status === "completed"
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {reminder.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>For {reminder.petName}</span>
              <span>•</span>
              <span>
                At {format(new Date(`2000-01-01T${reminder.time}`), "h:mm a")}
              </span>
              <span>•</span>
              <span>{reminder.frequency}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(reminder)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(reminder)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Pending Goals Section */}
      <div>
        <h2 className="text-gray-500 text-sm font-medium mb-3">
          pending goals
        </h2>
        {timeSlots.map((slot) => {
          const slotReminders =
            groupedPendingReminders[slot.label.toLowerCase()] || [];
          if (slotReminders.length === 0) return null;

          return (
            <div key={slot.label} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{slot.icon}</span>
                <h3 className="text-gray-600 text-sm font-medium">
                  {slot.label.toLowerCase()}
                </h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                {slotReminders.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Goals Section */}
      {completedReminders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-gray-500 text-sm font-medium mb-3">
            completed goals
          </h2>
          <div className="space-y-3">
            {completedReminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderList;
