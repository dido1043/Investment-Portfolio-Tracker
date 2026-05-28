import { useEffect, useState } from 'react'
import { User, Mail, Save, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getUser, updateUser, deleteUser } from '../api/userApi'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user?.id) return
    getUser(user.id)
      .then(({ data }) => {
        setProfile(data)
        setForm({ firstName: data.firstName, lastName: data.lastName, email: data.email })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await updateUser(user.id, { ...form, authenticationType: profile?.authenticationType })
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUser(user.id)
      logout()
      toast.success('Account deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete account')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account settings</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-full bg-indigo-600/20 border-2 border-indigo-600/30 flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-400">
              {profile?.firstName?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-slate-100">
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-sm text-slate-400">{profile?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              icon={User}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              error={errors.lastName}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <div className="pt-2">
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Danger Zone</h3>
            <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all associated data.</p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete Account
        </Button>
      </div>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            This will permanently delete your account and all data. This action{' '}
            <strong className="text-slate-200">cannot be undone</strong>.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
