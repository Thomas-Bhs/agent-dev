import ReactMarkdown from 'react-markdown'
import { cn } from '@/app/lib/utils'
import ToolPill from './ToolPill'
import type { Theme } from '@/app/lib/theme'
import { themes } from '@/app/lib/theme'

interface ToolInvocation {
  toolCallId: string
  toolName: string
  state: 'partial-call' | 'call' | 'result'
}

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  agentName?: string
  agentColor?: string
  toolInvocations?: ToolInvocation[]
  theme: Theme
}

export default function MessageBubble({
  role,
  content,
  agentName = 'Agent',
  agentColor = 'bg-gray-950 text-white',
  toolInvocations,
  theme,
}: MessageBubbleProps) {
  const t = themes[theme]
  const isFallout = theme === 'fallout'

  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed"
          style={{
            background: isFallout ? `${t.border}20` : '#0f0f1a',
            color: isFallout ? t.border : 'white',
            border: isFallout ? `1px solid ${t.border}` : 'none',
            fontFamily: isFallout ? 'monospace' : 'inherit',
          }}
        >
          {isFallout ? `> ${content}_` : content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-start">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
        style={{
          background: isFallout ? `${t.border}20` : '#0f0f1a',
          color: isFallout ? t.border : 'white',
          border: isFallout ? `1px solid ${t.border}` : 'none',
          fontFamily: isFallout ? 'monospace' : 'inherit',
        }}
      >
        {isFallout ? '>' : agentName.slice(0, 1)}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{
            color: isFallout ? t.border : '#9ca3af',
            fontFamily: isFallout ? 'monospace' : 'inherit',
          }}
        >
          {isFallout ? `// ${agentName}` : agentName}
        </p>

        {toolInvocations?.map((tool) => (
          <ToolPill
            key={tool.toolCallId}
            toolName={tool.toolName}
            state={tool.state === 'partial-call' || tool.state === 'call' ? 'running' : 'completed'}
            theme={theme}
          />
        ))}

        {content && (
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
            style={{
              background: isFallout ? `${t.border}08` : 'white',
              border: `1px solid ${isFallout ? `${t.border}40` : '#f0f0f0'}`,
              color: isFallout ? t.text : '#374151',
              fontFamily: isFallout ? 'monospace' : 'inherit',
            }}
          >
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const isBlock = className?.includes('language-')
                  return isBlock ? (
                    <pre
                      className="p-4 rounded-xl overflow-x-auto my-3 text-xs leading-relaxed"
                      style={{
                        background: isFallout ? t.bg : '#0f0f1a',
                        color: isFallout ? t.border : '#f0f0f0',
                        border: isFallout ? `1px solid ${t.border}` : 'none',
                      }}
                    >
                      <code>{children}</code>
                    </pre>
                  ) : (
                    <code
                      className="px-1.5 py-0.5 rounded-lg text-xs font-mono"
                      style={{
                        background: isFallout ? `${t.border}20` : '#f0f0f0',
                        color: isFallout ? t.border : '#374151',
                      }}
                    >
                      {children}
                    </code>
                  )
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
