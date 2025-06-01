import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    
    // Get current reminder
    const reminder = await db.collection('reminders').findOne({ id });
    
    if (!reminder) {
      return NextResponse.json({ 
        success: false,
        message: 'Reminder not found' 
      }, { status: 404 });
    }
    
    // Toggle status and update completedAt
    const newStatus = reminder.status === 'completed' ? 'pending' : 'completed';
    const updateData = {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };
    
    // Update the reminder
    await db.collection('reminders').updateOne(
      { id },
      { $set: updateData }
    );
    
    // Get updated reminder
    const updatedReminder = await db.collection('reminders').findOne({ id });
    
    return NextResponse.json({ 
      success: true,
      data: updatedReminder
    });
  } catch (error) {
    console.error('Error toggling reminder status:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 