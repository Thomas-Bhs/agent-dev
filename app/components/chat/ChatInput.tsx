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
    <div className='px-6 py-4 bg-white border-t border-gray-100'>
      {fileContent && (
        <div className='flex items-center gap-2 mb-3 px-3 py-2 bg-gray-950 rounded-xl w-fit'>
          <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <rect
              x='1.5'
              y='0.5'
              width='7'
              height='10'
              rx='1'
              stroke='white'
              strokeOpacity='0.6'
              strokeWidth='1'
            />
            <path
              d='M3 4h5M3 6h4'
              stroke='white'
              strokeOpacity='0.6'
              strokeWidth='0.8'
              strokeLinecap='round'
            />
          </svg>
          <span className='text-xs text-white font-medium'>{fileContent.name}</span>
          <button
            onClick={() => onFileChange(null)}
            className='text-white/40 hover:text-white text-sm leading-none ml-1 transition-colors'
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className='flex gap-2 items-center'>
        <input
          value={input}
          onChange={onInputChange}
          placeholder='Ask a question or give an instruction...'
          disabled={isLoading}
          className={cn(
            'flex-1 px-4 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-400 focus:bg-white',
            'placeholder:text-gray-400 disabled:opacity-50 transition-all'
          )}
        />

        <label
          className={cn(
            'cursor-pointer flex items-center justify-center w-11 h-11',
            'border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors'
          )}
        >
          <svg width='15' height='15' viewBox='0 0 15 15' fill='none'>
            <rect x='1' y='2.5' width='12' height='10' rx='2' stroke='#9ca3af' strokeWidth='1' />
            <path d='M5 2.5V1.5h5v1' stroke='#9ca3af' strokeWidth='1' strokeLinecap='round' />
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
            'w-11 h-11 flex items-center justify-center rounded-2xl transition-all',
            'bg-blue-500 text-white hover:bg-blue-600 active:scale-95',
            'disabled:opacity-30 disabled:cursor-not-allowed shadow-sm shadow-blue-200'
          )}
        >
          {isLoading ? (
            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          ) : (
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path
                d='M3 8h10M9 4l4 4-4 4'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
