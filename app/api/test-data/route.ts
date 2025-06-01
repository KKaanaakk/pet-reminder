import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const testPets = [
  { 
    id: '1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever'
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian'
  }
];

const testReminders = [
  {
    id: '1',
    title: 'Morning Walk',
    petId: '1',
    petName: 'Max',
    category: 'Lifestyle',
    notes: 'Take Max for a 30-minute walk',
    startDate: new Date().toISOString().split('T')[0],
    time: '08:00',
    timeSlot: 'morning',
    frequency: 'Daily',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Feed Luna',
    petId: '2',
    petName: 'Luna',
    category: 'General',
    notes: 'Give Luna her special cat food',
    startDate: new Date().toISOString().split('T')[0],
    time: '09:00',
    timeSlot: 'morning',
    frequency: 'Daily',
    status: 'completed',
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Evening Walk',
    petId: '1',
    petName: 'Max',
    category: 'Lifestyle',
    notes: 'Evening stroll in the park',
    startDate: new Date().toISOString().split('T')[0],
    time: '18:00',
    timeSlot: 'evening',
    frequency: 'Daily',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing data
    await db.collection('pets').deleteMany({});
    await db.collection('reminders').deleteMany({});
    
    // Insert test data
    await db.collection('pets').insertMany(testPets);
    await db.collection('reminders').insertMany(testReminders);
    
    // Verify the data was inserted
    const insertedPets = await db.collection('pets').find({}).toArray();
    const insertedReminders = await db.collection('reminders').find({}).toArray();
    
    return NextResponse.json({
      status: 'Test data created successfully!',
      data: {
        pets: insertedPets,
        reminders: insertedReminders
      }
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({
      status: 'Failed to create test data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 