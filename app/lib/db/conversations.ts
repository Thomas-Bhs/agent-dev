import clientPromise from '../mongodb'
import { ObjectId } from 'mongodb'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface ConversationRecord {
  _id?: ObjectId
  conversationId: string
  title: string
  agentId: string
  agentColor: string
  messages: Message[]
  tokenCount: number
  cost: number
  createdAt: Date
  updatedAt: Date
}

export async function saveConversation(conversation: Omit<ConversationRecord, '_id' | 'createdAt' | 'updatedAt'>) {
  const client = await clientPromise
  const db = client.db('agent-dev')

  return db.collection('conversations').updateOne(
    { conversationId: conversation.conversationId },
    {
      $set: {
        ...conversation,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  )
}

export async function getConversations(limit = 20) {
  const client = await clientPromise
  const db = client.db('agent-dev')

  return db.collection('conversations')
    .find({})
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray()
}

export async function getConversation(conversationId: string) {
  const client = await clientPromise
  const db = client.db('agent-dev')

  return db.collection('conversations').findOne({ conversationId })
}

export async function deleteConversation(conversationId: string) {
  const client = await clientPromise
  const db = client.db('agent-dev')

  return db.collection('conversations').deleteOne({ conversationId })
}

export async function deleteAllConversations() {
  const client = await clientPromise
  const db = client.db('agent-dev')

  return db.collection('conversations').deleteMany({})
}