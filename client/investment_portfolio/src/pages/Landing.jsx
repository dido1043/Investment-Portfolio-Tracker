import { Link } from 'react-router-dom'
import { TrendingUp, Wallet, ArrowLeftRight, Building2, BarChart3, Shield } from 'lucide-react'

const features = [
  { icon: Wallet, title: 'Multiple Accounts', desc: 'Organize investments across different accounts with custom currencies.' },
  { icon: ArrowLeftRight, title: 'Transaction Tracking', desc: 'Log every buy and sell with full history and cost basis tracking.' },
  { icon: Building2, title: 'Company Research', desc: 'Manage your universe of tradeable companies by sector and ticker.' },
  { icon: BarChart3, title: 'Portfolio Analytics', desc: 'Visualize your holdings breakdown and cumulative investment over time.' },
  { icon: Shield, title: 'Secure by Default', desc: 'JWT-authenticated API with per-user data isolation.' },
  { icon: TrendingUp, title: 'Performance Overview', desc: 'Dashboard with key stats and recent activity at a glance.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-100">PortfolioIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-100 font-medium transition-colors">
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Open-source portfolio tracker
          </div>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight">
            Track every trade.{' '}
            <span className="gradient-text">Know your edge.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            PortfolioIQ gives you a clean dashboard to manage accounts, log transactions,
            and analyze your investment performance — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Start for free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-sm"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Everything you need</h2>
            <p className="text-slate-400">A complete toolkit for serious investors.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                  <Icon className="h-4.5 w-4.5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-100 mb-1 text-sm">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to take control?</h2>
          <p className="text-slate-400 mb-6">Join and start tracking your portfolio in minutes.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <TrendingUp className="h-4 w-4" />
            Create free account
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} PortfolioIQ — Investment Portfolio Tracker
      </footer>
    </div>
  )
}
