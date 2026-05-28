import { useEffect, useState, useMemo } from 'react'
import { ArrowLeftRight, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getAccountsByUser } from '../api/accountApi'
import { getTransactionsByAccount } from '../api/transactionApi'
import { getCompany } from '../api/companyApi'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { Link } from 'react-router-dom'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

export default function Transactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [companies, setCompanies] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterAccount, setFilterAccount] = useState('ALL')

  useEffect(() => {
    if (!user?.id) return
    const load = async () => {
      try {
        const { data: accs } = await getAccountsByUser(user.id)
        setAccounts(accs)
        const txArrays = await Promise.all(
          accs.map((a) =>
            getTransactionsByAccount(a.id)
              .then((r) => r.data.map((t) => ({ ...t, accountNumber: a.accountNumber })))
              .catch(() => [])
          )
        )
        const txs = txArrays.flat()
        setTransactions(txs)

        const ids = [...new Set(txs.map((t) => t.companyId).filter(Boolean))]
        const compData = await Promise.all(ids.map((id) => getCompany(id).then((r) => ({ id, ...r.data })).catch(() => null)))
        const map = {}
        compData.filter(Boolean).forEach((c) => { map[c.id] = c })
        setCompanies(map)
      } catch {
        /* no-op */
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filterType !== 'ALL' && t.transactionType !== filterType) return false
        if (filterAccount !== 'ALL' && String(t.accountId) !== filterAccount) return false
        if (search) {
          const s = search.toLowerCase()
          const comp = companies[t.companyId]
          return (
            comp?.tickerSymbol?.toLowerCase().includes(s) ||
            comp?.companyName?.toLowerCase().includes(s) ||
            t.accountNumber?.toLowerCase().includes(s)
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
  }, [transactions, filterType, filterAccount, search, companies])

  const totalBuy = filtered.filter((t) => t.transactionType === 'BUY').reduce((s, t) => s + (t.quantity ?? 0) * parseFloat(t.pricePerShare ?? 0), 0)
  const totalSell = filtered.filter((t) => t.transactionType === 'SELL').reduce((s, t) => s + (t.quantity ?? 0) * parseFloat(t.pricePerShare ?? 0), 0)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Transactions</h1>
        <p className="text-slate-400 text-sm mt-1">All trades across your accounts</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Filtered Buys', value: fmt(totalBuy), color: 'text-emerald-400' },
          { label: 'Filtered Sells', value: fmt(totalSell), color: 'text-red-400' },
          { label: 'Net', value: fmt(totalBuy - totalSell), color: 'text-indigo-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-800">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              placeholder="Search by company or account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'BUY', 'SELL'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.accountNumber}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            description={transactions.length === 0 ? 'Add transactions via your accounts.' : 'Try adjusting filters.'}
            action={
              transactions.length === 0 && (
                <Link to="/accounts" className="text-indigo-400 text-sm hover:underline">
                  Go to Accounts
                </Link>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Type', 'Company', 'Account', 'Qty', 'Price/Share', 'Total', 'Date'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((tx, i) => {
                  const company = companies[tx.companyId]
                  const total = (tx.quantity ?? 0) * parseFloat(tx.pricePerShare ?? 0)
                  return (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <Badge variant={tx.transactionType === 'BUY' ? 'buy' : 'sell'}>
                          {tx.transactionType}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-200">{company?.tickerSymbol ?? '—'}</p>
                        <p className="text-xs text-slate-500">{company?.companyName ?? `#${tx.companyId}`}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{tx.accountNumber}</td>
                      <td className="px-5 py-3.5 text-slate-300">{tx.quantity}</td>
                      <td className="px-5 py-3.5 text-slate-300">{fmt(parseFloat(tx.pricePerShare ?? 0))}</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold ${tx.transactionType === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {fmt(total)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{tx.transactionDate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-500">
              Showing {filtered.length} of {transactions.length} transactions
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
