import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Wallet, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { getAccountsByUser, createAccount, updateAccount, deleteAccount } from '../api/accountApi'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'BGN', label: 'BGN — Bulgarian Lev' },
  { value: 'CHF', label: 'CHF — Swiss Franc' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
]

const emptyForm = { accountNumber: '', currency: 'USD' }

export default function Accounts() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    if (!user?.id) return
    try {
      const { data } = await getAccountsByUser(user.id)
      setAccounts(data)
    } catch {
      toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user?.id])

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create') }
  const openEdit = (acc) => { setForm({ accountNumber: acc.accountNumber, currency: acc.currency, id: acc.id }); setErrors({}); setModal('edit') }

  const validate = () => {
    const e = {}
    if (!form.accountNumber.trim()) e.accountNumber = 'Account number is required'
    if (!form.currency) e.currency = 'Currency is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (modal === 'create') {
        await createAccount({ accountNumber: form.accountNumber, currency: form.currency, userId: user.id })
        toast.success('Account created')
      } else {
        await updateAccount(form.id, { accountNumber: form.accountNumber, currency: form.currency, userId: user.id })
        toast.success('Account updated')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save account')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (acc) => {
    if (!confirm(`Delete account ${acc.accountNumber}? This action cannot be undone.`)) return
    try {
      await deleteAccount(acc.id)
      toast.success('Account deleted')
      load()
    } catch {
      toast.error('Failed to delete account')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Accounts</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your investment accounts</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No accounts yet"
          description="Create your first investment account to get started."
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Create Account</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(acc)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-base font-semibold text-slate-100 mb-0.5">{acc.accountNumber}</p>
              <p className="text-sm text-slate-500">{acc.currency}</p>
              <Link
                to={`/accounts/${acc.id}`}
                className="mt-4 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View transactions <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal === 'create' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'New Account' : 'Edit Account'}
      >
        <div className="space-y-4">
          <Input
            label="Account Number"
            placeholder="e.g. ACC-001"
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            error={errors.accountNumber}
          />
          <Select
            label="Currency"
            options={CURRENCIES}
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            error={errors.currency}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {modal === 'create' ? 'Create Account' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
