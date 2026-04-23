import { Link } from 'react-router-dom'
import { Shield, Lock, Zap, Eye, Copy, RefreshCw, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const FEATURES = [
  { icon: Lock, title: 'AES-256 Encryption', desc: 'All passwords encrypted before being stored. We never see your plain text data.' },
  { icon: Zap, title: 'Instant Access', desc: 'One-click copy, show/hide toggle, and fast search across all your credentials.' },
  { icon: RefreshCw, title: 'Password Generator', desc: 'Generate strong, unique passwords with configurable strength requirements.' },
  { icon: Eye, title: 'Zero Knowledge', desc: 'Your encryption key never leaves your device. True privacy by design.' },
]

export default function LandingPage() {
  const { isDark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-vault-500 rounded-lg flex items-center justify-center shadow-lg shadow-vault-500/20">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Vault<span className="text-vault-500">Key</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/sign-in" className="btn-secondary text-sm py-2">Sign In</Link>
            <Link to="/sign-up" className="btn-primary text-sm py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-vault-50 dark:bg-vault-950/40 text-vault-600 dark:text-vault-400 text-xs font-semibold px-4 py-2 rounded-full border border-vault-200 dark:border-vault-900 mb-8">
          <Shield className="w-3.5 h-3.5" />
          Military-grade encryption
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)] mb-6 leading-tight">
          Your passwords,<br />
          <span className="text-vault-500">fortress-grade</span> secure.
        </h1>

        <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
          VaultKey stores and encrypts all your credentials. One master login, total peace of mind.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/sign-up" className="btn-primary text-base px-8 py-3">
            Start for free →
          </Link>
          <Link to="/sign-in" className="btn-secondary text-base px-8 py-3">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 bg-vault-50 dark:bg-vault-950/40 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-vault-500" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <p className="text-center text-sm text-[var(--text-muted)]">
          © {new Date().getFullYear()} VaultKey. Built with ❤️ for your security.
        </p>
      </footer>
    </div>
  )
}
