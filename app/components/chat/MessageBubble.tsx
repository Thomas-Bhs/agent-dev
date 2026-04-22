import ReactMarkdown from 'react-markdown';
import { cn } from '@/app/lib/utils';
import ToolPill from './ToolPill';

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: 'partial-call' | 'call' | 'result';
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  agentColor?: string;
  toolInvocations?: ToolInvocation[];
}

export default function MessageBubble({
  role,
  content,
  agentName = 'Agent',
  agentColor = 'bg-gray-950 text-white',
  toolInvocations,
}: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className='flex justify-end'>
        <div className='max-w-[75%] bg-gray-950 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed'>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className='flex gap-3 items-start'>
      <div
        className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5',
          agentColor
        )}
      >
        {agentName.slice(0, 1)}
      </div>

      <div className='flex-1 min-w-0'>
        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5'>
          {agentName}
        </p>

        {toolInvocations?.map((tool) => (
          <ToolPill
            key={tool.toolCallId}
            toolName={tool.toolName}
            state={tool.state === 'partial-call' || tool.state === 'call' ? 'running' : 'completed'}
          />
        ))}

        {content && (
          <div className='bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed'>
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const isBlock = className?.includes('language-');
                  return isBlock ? (
                    <pre className='bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto my-3 text-xs leading-relaxed'>
                      <code>{children}</code>
                    </pre>
                  ) : (
                    <code className='bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-lg text-xs font-mono'>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className='mb-2 last:mb-0'>{children}</p>;
                },
                ul({ children }) {
                  return <ul className='list-disc pl-4 mb-2 space-y-1'>{children}</ul>;
                },
                ol({ children }) {
                  return <ol className='list-decimal pl-4 mb-2 space-y-1'>{children}</ol>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
