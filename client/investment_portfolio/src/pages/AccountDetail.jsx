import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, ArrowLeftRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAccount } from '../api/accountApi'
import { getTransactionsByAccount, createTransaction, updateTransaction, deleteTransaction } from '../api/transactionApi'
import { getAllCompanies } from '../api/companyApi'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

const emptyForm = {
  transactionType: 'BUY', quantity: '', pricePerShare: '', transactionDate: '', companyId: '',
}

export default function AccountDetail() {
  const { id } = useParams()
  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const [{ data: acc }, { data: txs }, { data: comps }] = await Promise.all([
        getAccount(id),
        getTransactionsByAccount(id),
        getAllCompanies(),
      ])
      setAccount(acc)
      setTransactions(txs)
      setCompanies(comps)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create') }
  const openEdit = (tx) => {
    setForm({
      id: tx.id,
      transactionType: tx.transactionType,
      quantity: tx.quantity,
      pricePerShare: tx.pricePerShare,
      transactionDate: tx.transactionDate,
      companyId: tx.companyId,
    })
    setErrors({})
    setModal('edit')
  }

  const validate = () => {
    const e = {}
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) e.quantity = 'Enter a positive quantity'
    if (!form.pricePerShare || isNaN(form.pricePerShare) || Number(form.pricePerShare) <= 0) e.pricePerShare = 'Enter a valid price'
    if (!form.transactionDate) e.transactionDate = 'Date is required'
    if (!form.companyId) e.companyId = 'Select a company'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        transactionType: form.transactionType,
        quantity: parseInt(form.quantity),
        pricePerShare: parseFloat(form.pricePerShare),
        transactionDate: form.transactionDate,
        accountId: parseInt(id),
        companyId: parseInt(form.companyId),
      }
      if (modal === 'create') {
        await createTransaction(payload)
        toast.success('Transaction added')
      } else {
        await updateTransaction(form.id, payload)
        toast.success('Transaction updated')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (tx) => {
    if (!confirm('Delete this transaction?')) return
    try {
      await deleteTransaction(tx.id)
      toast.success('Transaction deleted')
      load()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const companyOptions = [
    { value: '', label: 'Select company...' },
    ...companies.map((c) => ({ value: c.id, label: `${c.tickerSymbol} — ${c.companyName}` })),
  ]

  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))

  const totalBuy = transactions
    .filter((t) => t.transactionType === 'BUY')
    .reduce((s, t) => s + (t.quantity ?? 0) * parseFloat(t.pricePerShare ?? 0), 0)
  const totalSell = transactions
    .filter((t) => t.transactionType === 'SELL')
    .reduce((s, t) => s + (t.quantity ?? 0) * parseFloat(t.pricePerShare ?? 0), 0)

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!account) return <p className="text-slate-400">Account not found.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/accounts" className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{account.accountNumber}</h1>
          <p className="text-slate-400 text-sm">{account.currency} account</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Bought', value: fmt(totalBuy), color: 'text-emerald-400' },
          { label: 'Total Sold', value: fmt(totalSell), color: 'text-red-400' },
          { label: 'Net Invested', value: fmt(totalBuy - totalSell), color: 'text-indigo-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-300">
            Transactions <span className="text-slate-500 font-normal ml-1">({transactions.length})</span>
          </h2>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" />
            Add Transaction
          </Button>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Record your first trade for this account."
            action={<Button size="sm" onClick={openCreate}><Plus className="h-3.5 w-3.5" />Add Transaction</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Type', 'Company', 'Qty', 'Price/Share', 'Total Value', 'Date', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions
                  .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
                  .map((tx) => {
                    const company = companyMap[tx.companyId]
                    const total = (tx.quantity ?? 0) * parseFloat(tx.pricePerShare ?? 0)
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-5 py-3.5">
                          <Badge variant={tx.transactionType === 'BUY' ? 'buy' : 'sell'}>
                            {tx.transactionType}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-200">{company?.tickerSymbol ?? '—'}</p>
                          <p className="text-xs text-slate-500">{company?.companyName ?? `#${tx.companyId}`}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300">{tx.quantity}</td>
                        <td className="px-5 py-3.5 text-slate-300">{fmt(parseFloat(tx.pricePerShare ?? 0))}</td>
                        <td className="px-5 py-3.5">
                          <span className={`font-semibold ${tx.transactionType === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {fmt(total)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">{tx.transactionDate}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(tx)} className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(tx)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modal === 'create' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'New Transaction' : 'Edit Transaction'}
      >
        <div className="space-y-4">
          <Select
            label="Type"
            options={[{ value: 'BUY', label: 'BUY — Purchase shares' }, { value: 'SELL', label: 'SELL — Sell shares' }]}
            value={form.transactionType}
            onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
          />
          <Select
            label="Company"
            options={companyOptions}
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            error={errors.companyId}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity (shares)"
              type="number"
              min="1"
              placeholder="100"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              error={errors.quantity}
            />
            <Input
              label="Price per Share"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="150.00"
              value={form.pricePerShare}
              onChange={(e) => setForm({ ...form, pricePerShare: e.target.value })}
              error={errors.pricePerShare}
            />
          </div>
          <Input
            label="Transaction Date"
            type="date"
            value={form.transactionDate}
            onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
            error={errors.transactionDate}
          />
          {form.quantity && form.pricePerShare && (
            <div className="bg-slate-800 rounded-lg p-3 text-sm">
              <span className="text-slate-400">Total value: </span>
              <span className="font-semibold text-slate-100">
                {fmt(parseFloat(form.quantity || 0) * parseFloat(form.pricePerShare || 0))}
              </span>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {modal === 'create' ? 'Add Transaction' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
