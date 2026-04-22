import { useEffect, useRef } from 'react';
import { Message } from '@ai-sdk/react';
import MessageBubble from './MessageBubble';

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
      <div className='flex-1 flex flex-col items-center justify-center gap-4 text-center px-8'>
        <div className='w-16 h-16 rounded-3xl bg-gray-950 flex items-center justify-center'>
          <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
            <rect x='3' y='3' width='9' height='9' rx='2.5' fill='white' />
            <rect x='16' y='3' width='9' height='9' rx='2.5' fill='white' fillOpacity='0.5' />
            <rect x='3' y='16' width='9' height='9' rx='2.5' fill='white' fillOpacity='0.5' />
            <rect x='16' y='16' width='9' height='9' rx='2.5' fill='white' fillOpacity='0.3' />
          </svg>
        </div>
        <div>
          <p className='text-sm font-bold text-gray-900 mb-1'>Ready to code</p>
          <p className='text-xs text-gray-400 max-w-xs leading-relaxed'>
            Select an agent and ask your first question, or upload a file to analyze.
          </p>
        </div>
        <div className='flex gap-2 flex-wrap justify-center'>
          {['Create a React hook', 'Debug my code', 'Generate tests'].map((suggestion) => (
            <button
              key={suggestion}
              className='text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors'
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5'>
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          role={m.role === 'user' ? 'user' : 'assistant'}
          content={typeof m.content === 'string' ? m.content : ''}
          agentName='Agent Dev'
          agentColor='bg-gray-950 text-white'
          toolInvocations={m.toolInvocations?.map((t) => ({
            toolCallId: t.toolCallId,
            toolName: t.toolName,
            state: t.state as 'partial-call' | 'call' | 'result',
          }))}
        />
      ))}

      {isLoading && (
        <div className='flex gap-3 items-center'>
          <div className='w-8 h-8 rounded-xl bg-gray-950 flex items-center justify-center text-xs font-bold text-white flex-shrink-0'>
            D
          </div>
          <div className='bg-white border border-gray-100 rounded-2xl px-4 py-3 flex gap-1.5'>
            <div
              className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce'
              style={{ animationDelay: '0ms' }}
            />
            <div
              className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce'
              style={{ animationDelay: '150ms' }}
            />
            <div
              className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce'
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
