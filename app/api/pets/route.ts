import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Pet } from '@/lib/types';

// Default pets data
const defaultPets: Pet[] = [
  { id: '1', name: 'Browny', species: 'Dog', breed: 'Golden Retriever' },
  { id: '2', name: 'Whiskers', species: 'Cat', breed: 'Persian' },
  { id: '3', name: 'Buddy', species: 'Dog', breed: 'Labrador' },
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const pets = await db.collection('pets').find({}).toArray();
    
    // If no pets exist, return default pets
    if (pets.length === 0) {
      // Insert default pets
      await db.collection('pets').insertMany(defaultPets);
      return NextResponse.json(defaultPets);
    }
    
    return NextResponse.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const petData = await request.json();
    
    const newPet: Pet = {
      id: Date.now().toString(),
      ...petData,
    };
    
    await db.collection('pets').insertOne(newPet);
    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json({ error: 'Failed to create pet' }, { status: 500 });
  }
} 