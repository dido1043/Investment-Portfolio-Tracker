import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet, ArrowLeftRight, TrendingUp, TrendingDown,
  Building2, ArrowUpRight, ChevronRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { getAccountsByUser } from '../api/accountApi'
import { getTransactionsByAccount } from '../api/transactionApi'
import { getCompany } from '../api/companyApi'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

function StatCard({ title, value, icon: Icon, change, color = 'indigo', sub }) {
  const colors = {
    indigo: 'text-indigo-400 bg-indigo-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      {change !== undefined && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(change).toFixed(1)}% total
        </div>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-slate-100 font-semibold">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [allTransactions, setAllTransactions] = useState([])
  const [companies, setCompanies] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const load = async () => {
      try {
        const { data: accs } = await getAccountsByUser(user.id)
        setAccounts(accs)

        const txArrays = await Promise.all(
          accs.map((a) => getTransactionsByAccount(a.id).then((r) => r.data).catch(() => []))
        )
        const txs = txArrays.flat()
        setAllTransactions(txs)

        const companyIds = [...new Set(txs.map((t) => t.companyId).filter(Boolean))]
        const companyData = await Promise.all(
          companyIds.map((id) => getCompany(id).then((r) => ({ id, ...r.data })).catch(() => null))
        )
        const compMap = {}
        companyData.filter(Boolean).forEach((c) => { compMap[c.id] = c })
        setCompanies(compMap)
      } catch {
        /* no-op */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const stats = useMemo(() => {
    let totalInvested = 0
    let totalReturned = 0
    const byDate = {}
    const byCompany = {}

    allTransactions.forEach((t) => {
      const val = (t.quantity ?? 0) * parseFloat(t.pricePerShare ?? 0)
      const date = t.transactionDate?.slice(0, 7) ?? 'Unknown'
      if (t.transactionType === 'BUY') {
        totalInvested += val
        byDate[date] = (byDate[date] ?? 0) + val
        const ticker = companies[t.companyId]?.tickerSymbol ?? `#${t.companyId}`
        byCompany[ticker] = (byCompany[ticker] ?? 0) + val
      } else if (t.transactionType === 'SELL') {
        totalReturned += val
      }
    })

    const netInvested = totalInvested - totalReturned

    const chartData = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((acc, [date, val], i) => {
        const prev = i > 0 ? acc[i - 1].value : 0
        acc.push({ date, value: prev + val })
        return acc
      }, [])

    const pieData = Object.entries(byCompany)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([name, value]) => ({ name, value }))

    return { totalInvested, totalReturned, netInvested, chartData, pieData }
  }, [allTransactions, companies])

  const recentTx = [...allTransactions]
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, 6)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of your investment portfolio</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Invested"
          value={fmt(stats.totalInvested)}
          icon={TrendingUp}
          color="indigo"
          sub="All-time cost basis"
        />
        <StatCard
          title="Net Invested"
          value={fmt(stats.netInvested)}
          icon={Wallet}
          color="emerald"
          sub="After sell proceeds"
        />
        <StatCard
          title="Accounts"
          value={accounts.length}
          icon={Wallet}
          color="amber"
          sub={accounts.map((a) => a.currency).join(', ') || 'No accounts yet'}
        />
        <StatCard
          title="Transactions"
          value={allTransactions.length}
          icon={ArrowLeftRight}
          color="violet"
          sub={`${allTransactions.filter((t) => t.transactionType === 'BUY').length} buys, ${allTransactions.filter((t) => t.transactionType === 'SELL').length} sells`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-slate-300">Cumulative Invested</h2>
            <Badge variant="primary">All time</Badge>
          </div>
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats.chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              No transaction data yet
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-5">Holdings Breakdown</h2>
          {stats.pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.pieData} cx="50%" cy="45%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={3}>
                  {stats.pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => <span className="text-xs text-slate-400">{v}</span>}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              No holdings yet
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {recentTx.length === 0 ? (
          <div className="p-10 text-center">
            <ArrowLeftRight className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No transactions yet</p>
            <Link to="/transactions" className="text-indigo-400 text-xs hover:underline mt-1 inline-block">
              Add your first transaction
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentTx.map((tx, i) => {
              const company = companies[tx.companyId]
              const value = (tx.quantity ?? 0) * parseFloat(tx.pricePerShare ?? 0)
              return (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.transactionType === 'BUY' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                      {tx.transactionType === 'BUY' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {company?.tickerSymbol ?? `Company #${tx.companyId}`}
                        <span className="text-slate-500 font-normal ml-1.5">×{tx.quantity}</span>
                      </p>
                      <p className="text-xs text-slate-500">{tx.transactionDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.transactionType === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.transactionType === 'BUY' ? '+' : '-'}{fmt(value)}
                    </p>
                    <p className="text-xs text-slate-500">{fmt(parseFloat(tx.pricePerShare ?? 0))} / share</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
