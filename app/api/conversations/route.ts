import { NextResponse } from 'next/server';
import {
  getConversations,
  saveConversation,
  deleteAllConversations,
} from '@/app/lib/db/conversations';

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Conversations GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await saveConversation(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversations POST error:', error);
    return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteAllConversations();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversations DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete conversations' }, { status: 500 });
  }
}
