import { Shield, Key, AlertTriangle } from 'lucide-react'

export default function StatsBar({ passwords }) {
  const total = passwords.length
  const weak = passwords.filter(p => {
    if (!p.password) return false
    let score = 0
    if (p.password.length >= 8) score++
    if (/[A-Z]/.test(p.password) && /[a-z]/.test(p.password)) score++
    if (/[0-9]/.test(p.password)) score++
    if (/[^A-Za-z0-9]/.test(p.password)) score++
    return score < 2
  }).length

  const stats = [
    { icon: Key, label: 'Total', value: total, color: 'text-vault-500' },
    { icon: Shield, label: 'Secure', value: total - weak, color: 'text-green-500' },
    { icon: AlertTriangle, label: 'Weak', value: weak, color: weak > 0 ? 'text-orange-500' : 'text-[var(--text-muted)]' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="card px-4 py-3 flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color} shrink-0`} />
          <div>
            <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
