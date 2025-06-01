import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Test the connection by trying to list collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({ 
      status: 'Connected successfully!',
      collections: collections.map(col => col.name)
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'Connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 