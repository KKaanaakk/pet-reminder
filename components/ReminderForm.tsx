"use client";

import { useState, useEffect } from "react";
import { Pet, Reminder, ReminderFormData } from "@/lib/types";
import { ArrowLeft, Calendar, Clock, ChevronDown } from "lucide-react";

interface ReminderFormProps {
  pets: Pet[];
  reminder?: Reminder;
  onSave: (data: ReminderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ReminderForm({
  pets,
  reminder,
  onSave,
  onCancel,
  isLoading,
}: ReminderFormProps) {
  const [formData, setFormData] = useState<ReminderFormData>({
    title: "",
    petId: "",
    category: "General",
    notes: "",
    startDate: new Date().toISOString().split("T")[0],
    time: "12:00",
    frequency: "Daily",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSettings, setShowSettings] = useState(true);

  const defaultPets = [
    { id: "browney", name: "Browney" },
    { id: "max", name: "Max" },
    { id: "luna", name: "Luna" },
    { id: "shera", name: "Shera" },
    { id: "chango", name: "Chango" },
  ];

  const petOptions =
    Array.isArray(pets) && pets.length > 0 ? pets : defaultPets;

  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title,
        petId: reminder.petId,
        category: reminder.category,
        notes: reminder.notes || "",
        startDate: reminder.startDate,
        endDate: reminder.endDate,
        time: reminder.time,
        frequency: reminder.frequency,
      });
    }
  }, [reminder]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Reminder title is required";
    }

    if (!formData.petId) {
      newErrors.petId = "Please select a pet";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof ReminderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">
            {reminder ? "Edit Reminder" : "Add Reminder"}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-green-600 font-medium hover:text-green-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Pet and Category Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Select Pet
            </label>
            <div className="relative">
              <select
                value={formData.petId}
                onChange={(e) => handleInputChange("petId", e.target.value)}
                className={`w-full p-3 bg-white border rounded-lg appearance-none ${
                  errors.petId ? "border-red-300" : "border-gray-200"
                }`}
              >
                <option value="">Choose pet</option>
                {petOptions.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    🐕 {pet.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.petId && (
              <p className="text-red-500 text-xs mt-1">{errors.petId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Select Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg appearance-none"
              >
                <option value="General">🔵 General</option>
                <option value="Lifestyle">🏃 Lifestyle</option>
                <option value="Health">❤️ Health</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reminder Info */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Reminder Info</h3>
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Set a reminder for...
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Type here..."
              className={`w-full p-3 bg-transparent border-b text-white placeholder-gray-400 focus:outline-none focus:border-green-400 ${
                errors.title ? "border-red-400" : "border-gray-600"
              }`}
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title && (
                <p className="text-red-400 text-xs">{errors.title}</p>
              )}
              <span className="text-gray-400 text-xs">
                {formData.title.length}/100
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 text-sm">
                Add Notes (Optional)
              </label>
              <button
                type="button"
                className="text-green-400 text-sm hover:text-green-300"
              >
                Add
              </button>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Optional notes..."
              className="w-full mt-2 p-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="bg-gray-900 rounded-lg p-4">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between text-white font-medium"
          >
            <span>Reminder Settings</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showSettings ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSettings && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className={`w-full p-3 bg-white border rounded-lg ${
                      errors.startDate ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.startDate && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  className="text-gray-400 text-sm hover:text-gray-300"
                >
                  + Add End Date
                </button>
                {formData.endDate && (
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className="w-full mt-2 p-3 bg-white border border-gray-200 rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Reminder Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className={`w-full p-3 bg-white border rounded-lg ${
                      errors.time ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.time && (
                  <p className="text-red-400 text-xs mt-1">{errors.time}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Reminder Frequency
                </label>
                <p className="text-gray-400 text-xs mb-2">
                  How often should this reminder repeat?
                </p>
                <div className="relative">
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      handleInputChange("frequency", e.target.value)
                    }
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg appearance-none"
                  >
                    <option value="Once">Once</option>
                    <option value="Daily">Everyday</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
