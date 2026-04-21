import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: {
    toolCallId: string;
    toolName: string;
    state: 'partial-call' | 'call' | 'result';
  }[];
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-3 text-center px-8'>
        <div className='w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <path
              d='M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z'
              stroke='#6366f1'
              strokeWidth='1.5'
            />
            <path d='M12 8v4l3 3' stroke='#6366f1' strokeWidth='1.5' strokeLinecap='round' />
          </svg>
        </div>
        <p className='text-sm font-medium text-gray-700'>Prêt à coder</p>
        <p className='text-xs text-gray-400 max-w-xs'>
          Sélectionne un agent et pose ta première question ou uploade un fichier à analyser.
        </p>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto px-5 py-5 space-y-4'>
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          role={m.role}
          content={m.content}
          agentName='Agent Dev'
          agentColor='bg-indigo-50 text-indigo-600'
          toolInvocations={m.toolInvocations}
        />
      ))}

      {isLoading && (
        <div className='flex gap-2.5 items-center'>
          <div className='w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600'>
            D
          </div>
          <div className='flex gap-1'>
            <div
              className='w-1.5 h-1.5 rounded-full bg-indigo-300 animate-bounce'
              style={{ animationDelay: '0ms' }}
            />
            <div
              className='w-1.5 h-1.5 rounded-full bg-indigo-300 animate-bounce'
              style={{ animationDelay: '150ms' }}
            />
            <div
              className='w-1.5 h-1.5 rounded-full bg-indigo-300 animate-bounce'
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
