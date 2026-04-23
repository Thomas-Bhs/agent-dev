import clientPromise from '../mongodb';

export interface TokenRecord {
  agent: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  conversationId: string;
  createdAt: Date;
}

const COST_PER_MILLION: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-5': { input: 3, output: 15 },
  'claude-haiku-4-5-20251001': { input: 0.25, output: 1.25 },
  'llama-3.3-70b-versatile': { input: 0, output: 0 },
};

export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const rates = COST_PER_MILLION[model] || { input: 0, output: 0 };
  return (promptTokens / 1_000_000) * rates.input + (completionTokens / 1_000_000) * rates.output;
}

export async function trackTokens(record: Omit<TokenRecord, 'createdAt'>) {
  const client = await clientPromise;
  const db = client.db('agent-dev');
  return db.collection('tokens').insertOne({
    ...record,
    createdAt: new Date(),
  });
}

export async function getTokenStats() {
  const client = await clientPromise;
  const db = client.db('agent-dev');

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [today, week, month, byAgent] = await Promise.all([
    db
      .collection('tokens')
      .aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' } } },
      ])
      .toArray(),

    db
      .collection('tokens')
      .aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' } } },
      ])
      .toArray(),

    db
      .collection('tokens')
      .aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' } } },
      ])
      .toArray(),

    db
      .collection('tokens')
      .aggregate([
        { $group: { _id: '$agent', tokens: { $sum: '$totalTokens' }, cost: { $sum: '$cost' } } },
      ])
      .toArray(),
  ]);

  return {
    today: { tokens: today[0]?.tokens || 0, cost: today[0]?.cost || 0 },
    week: { tokens: week[0]?.tokens || 0, cost: week[0]?.cost || 0 },
    month: { tokens: month[0]?.tokens || 0, cost: month[0]?.cost || 0 },
    byAgent: byAgent.map((a) => ({ agent: a._id, tokens: a.tokens, cost: a.cost })),
  };
}
