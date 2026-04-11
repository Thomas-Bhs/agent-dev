'use client';

import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

export default function Home() {
  const [fileContent, setFileContent] = useState<{ name: string; content: string } | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/agent',
    body: { fileContent },
    onError: (error) => console.error('useChat error:', error),
  });

  useEffect(() => {
    const saved = localStorage.getItem('agent-history');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agent-history', JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <main className='max-w-2xl mx-auto p-4 flex flex-col h-screen'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl font-medium'>Agent Dev</h1>
        <button
          onClick={() => {
            setMessages([]);
            localStorage.removeItem('agent-history');
          }}
          className='text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded'
        >
          Effacer
        </button>
      </div>

      <div className='flex-1 overflow-y-auto space-y-4 mb-4'>
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === 'assistant' &&
              m.toolInvocations?.map((tool) => (
                <div key={tool.toolCallId} className='text-xs text-gray-400 italic px-3 py-1 mb-1'>
                  {tool.state === 'call' || tool.state === 'partial-call'
                    ? `L'agent utilise : ${tool.toolName}...`
                    : `Outil terminé : ${tool.toolName}`}
                </div>
              ))}
            <div
              className={`p-3 rounded-lg text-sm ${
                m.role === 'user' ? 'border border-blue-200 ml-8' : 'border border-gray-200 mr-8'
              }`}
            >
              <span className='font-medium text-xs text-gray-400 block mb-2'>
                {m.role === 'user' ? 'Toi' : 'Agent'}
              </span>
              {m.role === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    code({ className, children }) {
                      const isBlock = className?.includes('language-');
                      return isBlock ? (
                        <pre className='bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto my-2 text-xs'>
                          <code>{children}</code>
                        </pre>
                      ) : (
                        <code className='bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs'>
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
                  {m.content}
                </ReactMarkdown>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className='text-sm text-gray-400 italic px-3'>L'agent réfléchit...</div>}
      </div>

      {fileContent && (
        <div className='flex items-center gap-2 mb-2 px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-500'>
          <span>Fichier : {fileContent.name}</span>
          <button
            onClick={() => setFileContent(null)}
            className='text-gray-400 hover:text-gray-600 ml-auto'
          >
            x
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder='Pose une question sur ton code...'
          className='flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300'
        />

        <label className='cursor-pointer text-xs text-gray-400 border border-gray-200 px-2 py-2 rounded-lg hover:bg-gray-50 flex items-center'>
          Fichier
          <input
            type='file'
            accept='.ts,.tsx,.js,.jsx,.json,.css'
            className='hidden'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const content = await file.text();
              setFileContent({ name: file.name, content: content.slice(0, 2000) });
              e.target.value = '';
            }}
          />
        </label>
        <button
          type='submit'
          disabled={isLoading}
          className='bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40'
        >
          Envoyer
        </button>
      </form>
    </main>
  );
}
