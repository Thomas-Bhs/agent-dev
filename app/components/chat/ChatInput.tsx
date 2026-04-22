import { useState } from 'react';
import { cn } from '@/app/lib/utils';

interface FileContent {
  name: string;
  content: string;
}

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  fileContent: FileContent | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (file: FileContent | null) => void;
}

export default function ChatInput({
  input,
  isLoading,
  fileContent,
  onInputChange,
  onSubmit,
  onFileChange,
}: ChatInputProps) {
  return (
    <div className='px-5 py-4 border-t border-gray-100 bg-white'>
      {fileContent && (
        <div className='flex items-center gap-2 mb-3 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg w-fit'>
          <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <rect x='1.5' y='0.5' width='7' height='10' rx='1' stroke='#6366f1' strokeWidth='1' />
            <path d='M3 4h5M3 6h4' stroke='#6366f1' strokeWidth='0.8' strokeLinecap='round' />
          </svg>
          <span className='text-xs text-indigo-600 font-medium'>{fileContent.name}</span>
          <button
            onClick={() => onFileChange(null)}
            className='text-indigo-300 hover:text-indigo-500 text-sm leading-none ml-1'
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className='flex gap-2 items-center'>
        <input
          value={input}
          onChange={onInputChange}
          placeholder='Pose une question ou donne une instruction...'
          disabled={isLoading}
          className={cn(
            'flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50',
            'focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300',
            'placeholder:text-gray-500 disabled:opacity-50 text-gray-800'
          )}
        />

        <label
          className={cn(
            'cursor-pointer flex items-center justify-center w-10 h-10',
            'border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors'
          )}
        >
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
            <rect x='1' y='2.5' width='11' height='9' rx='1.5' stroke='#9ca3af' strokeWidth='1' />
            <path d='M5 2.5V1.5h4v1' stroke='#9ca3af' strokeWidth='1' strokeLinecap='round' />
          </svg>
          <input
            type='file'
            accept='.ts,.tsx,.js,.jsx,.json,.css'
            className='hidden'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const content = await file.text();
              onFileChange({ name: file.name, content: content.slice(0, 2000) });
              e.target.value = '';
            }}
          />
        </label>

        <button
          type='submit'
          disabled={isLoading || !input.trim()}
          className={cn(
            'px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
            'bg-indigo-600 text-white hover:bg-indigo-700',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? '...' : 'Envoyer →'}
        </button>
      </form>
    </div>
  );
}
