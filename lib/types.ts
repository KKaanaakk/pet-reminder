export interface Pet {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  avatar?: string;
}

export interface Reminder {
  _id?: string;
  id: string;
  title: string;
  petId: string;
  petName: string;
  category: 'General' | 'Lifestyle' | 'Health';
  notes?: string;
  startDate: string;
  endDate?: string;
  time: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'pending' | 'completed';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderFormData {
  title: string;
  petId: string;
  category: 'General' | 'Lifestyle' | 'Health';
  notes?: string;
  startDate: string;
  endDate?: string;
  time: string;
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
}

export interface TimeSlot {
  label: string;
  range: [number, number];
  icon: string;
} 