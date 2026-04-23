import { NextResponse } from 'next/server';
import { deleteConversation } from '@/app/lib/db/conversations';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await deleteConversation(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversation DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
