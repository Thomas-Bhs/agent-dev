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
  agentColor = 'bg-indigo-50 text-indigo-600',
  toolInvocations,
}: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className='flex justify-end'>
        <div className='max-w-[75%] bg-gray-900 text-white px-4 py-2.5 rounded-xl rounded-br-sm text-sm leading-relaxed'>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className='flex gap-2.5 items-start'>
      <div
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5',
          agentColor
        )}
      >
        {agentName.slice(0, 1)}
      </div>

      <div className='flex-1'>
        <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1'>
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
          <div className='bg-white border border-gray-100 rounded-sm rounded-tl-none rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed'>
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const isBlock = className?.includes('language-');
                  return isBlock ? (
                    <pre className='bg-gray-950 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-xs leading-relaxed'>
                      <code>{children}</code>
                    </pre>
                  ) : (
                    <code className='bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-xs'>
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
