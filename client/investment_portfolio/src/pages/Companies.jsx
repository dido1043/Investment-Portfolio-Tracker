import { useEffect, useState } from 'react'
import { Building2, Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from '../api/companyApi'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

const SECTORS = [
  'Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods',
  'Industrials', 'Materials', 'Real Estate', 'Utilities', 'Communication',
]

const emptyForm = { companyName: '', tickerSymbol: '', industrySector: '' }

const sectorColor = (sector) => {
  const map = {
    Technology: 'primary', Healthcare: 'success', Finance: 'warning',
    Energy: 'danger', 'Consumer Goods': 'default',
  }
  return map[sector] ?? 'default'
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      const { data } = await getAllCompanies()
      setCompanies(data)
    } catch {
      toast.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal('create') }
  const openEdit = (c) => { setForm({ id: c.id, companyName: c.companyName, tickerSymbol: c.tickerSymbol, industrySector: c.industrySector ?? '' }); setErrors({}); setModal('edit') }

  const validate = () => {
    const e = {}
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    if (!form.tickerSymbol.trim()) e.tickerSymbol = 'Ticker symbol is required'
    else if (form.tickerSymbol.length > 10) e.tickerSymbol = 'Max 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { companyName: form.companyName, tickerSymbol: form.tickerSymbol.toUpperCase(), industrySector: form.industrySector || null }
      if (modal === 'create') {
        await createCompany(payload)
        toast.success('Company added')
      } else {
        await updateCompany(form.id, payload)
        toast.success('Company updated')
      }
      setModal(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (c) => {
    if (!confirm(`Delete ${c.companyName} (${c.tickerSymbol})?`)) return
    try {
      await deleteCompany(c.id)
      toast.success('Company deleted')
      load()
    } catch {
      toast.error('Failed to delete — company may have associated transactions')
    }
  }

  const filtered = companies.filter((c) => {
    if (!search) return true
    const s = search.toLowerCase()
    return c.companyName.toLowerCase().includes(s) || c.tickerSymbol.toLowerCase().includes(s) || c.industrySector?.toLowerCase().includes(s)
  })

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Companies</h1>
          <p className="text-slate-400 text-sm mt-1">Manage tradeable securities</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input
          placeholder="Search by name, ticker, or sector..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filtered.length === 0 && !loading ? (
        <EmptyState
          icon={Building2}
          title={search ? 'No companies match your search' : 'No companies yet'}
          description={search ? 'Try a different search.' : 'Add companies to link them with your transactions.'}
          action={!search && <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Company</Button>}
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Ticker', 'Company', 'Sector', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-400">{c.tickerSymbol.slice(0, 3)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-200">{c.companyName}</p>
                    <p className="text-xs text-slate-500">{c.tickerSymbol}</p>
                  </td>
                  <td className="px-5 py-4">
                    {c.industrySector ? (
                      <Badge variant={sectorColor(c.industrySector)}>{c.industrySector}</Badge>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-500">
            {filtered.length} of {companies.length} companies
          </div>
        </div>
      )}

      <Modal
        open={modal === 'create' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add Company' : 'Edit Company'}
      >
        <div className="space-y-4">
          <Input
            label="Company Name"
            placeholder="Apple Inc."
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            error={errors.companyName}
          />
          <Input
            label="Ticker Symbol"
            placeholder="AAPL"
            value={form.tickerSymbol}
            onChange={(e) => setForm({ ...form, tickerSymbol: e.target.value.toUpperCase() })}
            error={errors.tickerSymbol}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Industry Sector</label>
            <select
              value={form.industrySector}
              onChange={(e) => setForm({ ...form, industrySector: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select sector (optional)</option>
              {SECTORS.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {modal === 'create' ? 'Add Company' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
