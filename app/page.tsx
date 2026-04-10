'use client';

import { useChat } from '@ai-sdk/react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agent',
    onError: (error) => console.error('useChat error:', error),
  });

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Agent Dev</h1>

      <div>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: '12px' }}>
            <strong>{m.role === 'user' ? 'Toi' : 'Agent'} :</strong>
            <p style={{ margin: '4px 0' }}>{m.content}</p>
          </div>
        ))}
        {isLoading && <p style={{ color: 'gray' }}>L'agent réfléchit...</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder='Pose une question sur ton code...'
          style={{ width: '400px', padding: '8px', marginRight: '8px' }}
        />
        <button type='submit'>Envoyer</button>
      </form>
    </main>
  );
}
