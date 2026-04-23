'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/app/lib/utils'

interface TokenStats {
  today: { tokens: number; cost: number }
  week: { tokens: number; cost: number }
  month: { tokens: number; cost: number }
  byAgent: { agent: string; tokens: number; cost: number }[]
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const agentColors: Record<string, string> = {
  dev: '#2563eb',
  debug: '#dc2626',
  qa: '#16a34a',
  orchestrator: '#0284c7',
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [stats, setStats] = useState<TokenStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isOpen])

  const totalAgentTokens = stats?.byAgent.reduce((acc, a) => acc + a.tokens, 0) || 1

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      <div className={cn(
        'fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-100 z-50 transition-transform duration-300 overflow-y-auto',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-900">Settings & Analytics</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
            </div>
          ) : stats ? (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Token usage
              </p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { label: 'Today', data: stats.today },
                  { label: 'This week', data: stats.week },
                  { label: 'This month', data: stats.month },
                ].map(({ label, data }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-900">
                      {data.tokens.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      ${data.cost.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                By agent
              </p>

              <div className="space-y-3 mb-6">
                {stats.byAgent
                  .sort((a, b) => b.tokens - a.tokens)
                  .map((agent) => (
                    <div key={agent.agent}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 capitalize">
                          {agent.agent}
                        </span>
                        <span className="text-xs text-gray-400">
                          {agent.tokens.toLocaleString()} tokens — ${agent.cost.toFixed(4)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(agent.tokens / totalAgentTokens) * 100}%`,
                            background: agentColors[agent.agent] || '#6b7280',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Models
              </p>
              <div className="bg-gray-50 rounded-2xl p-3 space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Dev</span>
                  <span className="font-medium text-gray-700">Claude Sonnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Debug</span>
                  <span className="font-medium text-gray-700">Claude Sonnet</span>
                </div>
                <div className="flex justify-between">
                  <span>QA</span>
                  <span className="font-medium text-gray-700">Claude Haiku</span>
                </div>
                <div className="flex justify-between">
                  <span>Orchestrator</span>
                  <span className="font-medium text-gray-700">Claude Sonnet</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">No data available yet</p>
          )}
        </div>
      </div>
    </>
  )
}