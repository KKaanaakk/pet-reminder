import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ReminderFormData } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Maximum number of retries for database operations
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES) {
        console.log(`Attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  throw lastError;
}

export async function GET(request: NextRequest) {
  try {
    return await withRetry(async () => {
      const { db } = await connectToDatabase();
      const { searchParams } = new URL(request.url);
      const petId = searchParams.get('petId');
      const category = searchParams.get('category');
      const date = searchParams.get('date');

      const query: Record<string, unknown> = {};
      
      if (petId && petId !== 'all') {
        query.petId = petId;
      }
      
      if (category && category !== 'all') {
        query.category = category;
      }
      
      if (date) {
        query.startDate = { $lte: date };
        query.$or = [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: date } }
        ];
      }

      const reminders = await db.collection('reminders').find(query).sort({ time: 1 }).toArray();
      return NextResponse.json(reminders);
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const formData: ReminderFormData = await request.json();
    
    // Get pet name
    const pet = await db.collection('pets').findOne({ id: formData.petId });
    
    const newReminder = {
      id: generateId(),
      title: formData.title,
      petId: formData.petId,
      petName: pet?.name || 'Unknown Pet',
      category: formData.category,
      notes: formData.notes,
      startDate: formData.startDate,
      endDate: formData.endDate,
      time: formData.time,
      frequency: formData.frequency,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await db.collection('reminders').insertOne(newReminder);
    return NextResponse.json(newReminder, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
} 