import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const reminder = await db.collection('reminders').findOne({ id });
    
    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error fetching reminder:', error);
    return NextResponse.json({ error: 'Failed to fetch reminder' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const updateData = await request.json();
    
    // Get pet name if petId is being updated
    if (updateData.petId) {
      const pet = await db.collection('pets').findOne({ id: updateData.petId });
      updateData.petName = pet?.name || 'Unknown Pet';
    }
    
    updateData.updatedAt = new Date().toISOString();
    
    const result = await db.collection('reminders').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    const updatedReminder = await db.collection('reminders').findOne({ id });
    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    
    // Delete the reminder
    const result = await db.collection('reminders').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'Reminder not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Reminder deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 