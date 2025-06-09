"use client";

import { useState, useEffect, useCallback } from "react";
import { Pet, Reminder, ReminderFormData } from "@/lib/types";
import Calendar from "@/components/Calendar";
import ReminderForm from "@/components/ReminderForm";
import { Plus } from "lucide-react";
import ReminderList from "@/components/ReminderList";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<
    Reminder | undefined
  >();
  const [selectedPet, setSelectedPet] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReminders = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        date: selectedDate.toISOString().split("T")[0],
      });

      if (selectedPet !== "all") params.append("petId", selectedPet);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);

      const response = await fetch(`/api/reminders?${params}`);
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  }, [selectedDate, selectedPet, selectedCategory]);

  // Fetch pets and reminders
  useEffect(() => {
    fetchPets();
    fetchReminders();
  }, [fetchReminders]);

  const fetchPets = async () => {
    try {
      const response = await fetch("/api/pets");
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleSaveReminder = async (formData: ReminderFormData) => {
    setIsLoading(true);
    try {
      const url = editingReminder
        ? `/api/reminders/${editingReminder.id}`
        : "/api/reminders";
      const method = editingReminder ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchReminders();
        setShowForm(false);
        setEditingReminder(undefined);
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (reminder: Reminder) => {
    try {
      const response = await fetch(`/api/reminders/${reminder.id}/toggle`, {
        method: "PUT",
      });

      if (response.ok) {
        fetchReminders();
      }
    } catch (error) {
      console.error("Error toggling reminder status:", error);
    }
  };

  const handleDeleteReminder = async (reminder: Reminder) => {
    if (
      !confirm(
        `Are you sure you want to delete the reminder "${reminder.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/reminders/${reminder.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the reminder from the local state
        setReminders((prevReminders) =>
          prevReminders.filter((r) => r.id !== reminder.id)
        );
      } else {
        const error = await response.json();
        alert(`Failed to delete reminder: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      alert("Failed to delete reminder. Please try again.");
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <ReminderForm
        pets={pets}
        reminder={editingReminder}
        onSave={handleSaveReminder}
        onCancel={() => {
          setShowForm(false);
          setEditingReminder(undefined);
        }}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">daily reminders</h1>
        <button className="text-green-600 text-sm font-medium">view all</button>
      </div>

      {/* Your streaks section */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>⚡</span>
          <span>your streaks</span>
        </div>
      </div>

      {/* Calendar */}
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Filters */}
      <div className="px-4 mb-4 flex gap-2">
        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Pets</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Categories</option>
          <option value="General">General</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Health">Health</option>
        </select>
      </div>

      {/* Reminders List */}
      <div className="px-4">
        <ReminderList
          reminders={reminders}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditReminder}
          onDelete={handleDeleteReminder}
        />
      </div>

      {/* Add Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
