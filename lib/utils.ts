import { format, parse, isToday } from 'date-fns';
import { TimeSlot, Reminder } from './types';

export const timeSlots: TimeSlot[] = [
  {
    label: 'Morning',
    range: [5, 11],
    icon: '🌅'
  },
  {
    label: 'Afternoon',
    range: [12, 16],
    icon: '☀️'
  },
  {
    label: 'Evening',
    range: [17, 20],
    icon: '🌆'  
  },
  {
    label: 'Night',
    range: [21, 4],
    icon: '🌙'
  }
];

export function getTimeSlot(time: string): string {
  const hour = parseInt(time.split(':')[0], 10);
  
  for (const slot of timeSlots) {
    const [start, end] = slot.range;
    if (end < start) {
      // Handle night slot that crosses midnight
      if (hour >= start || hour <= end) {
        return slot.label.toLowerCase();
      }
    } else if (hour >= start && hour <= end) {
      return slot.label.toLowerCase();
    }
  }
  
  return 'morning'; // Default fallback
}

export function groupRemindersByTimeSlot(reminders: Reminder[]): Record<string, Reminder[]> {
  const grouped: Record<string, Reminder[]> = {};
  
  timeSlots.forEach(slot => {
    grouped[slot.label.toLowerCase()] = [];
  });
  
  reminders.forEach(reminder => {
    const slot = getTimeSlot(reminder.time);
    if (!grouped[slot]) {
      grouped[slot] = [];
    }
    grouped[slot].push(reminder);
  });
  
  // Sort reminders within each slot by time
  Object.keys(grouped).forEach(slot => {
    grouped[slot].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  });
  
  return grouped;
}

export function formatTime(time: string): string {
  try {
    const parsed = parse(time, 'HH:mm', new Date());
    return format(parsed, 'h:mm a');
  } catch {
    return time;
  }
}

export function formatDate(date: string): string {
  try {
    return format(new Date(date), 'dd.MM.yyyy');
  } catch {
    return date;
  }
}

export function isReminderForToday(reminder: Reminder): boolean {
  const reminderDate = new Date(reminder.startDate);
  return isToday(reminderDate);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
}; 