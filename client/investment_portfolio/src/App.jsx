import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import AccountDetail from './pages/AccountDetail'
import Transactions from './pages/Transactions'
import Companies from './pages/Companies'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route
        path="/dashboard"
        element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>}
      />
      <Route
        path="/accounts"
        element={<PrivateRoute><Layout><Accounts /></Layout></PrivateRoute>}
      />
      <Route
        path="/accounts/:id"
        element={<PrivateRoute><Layout><AccountDetail /></Layout></PrivateRoute>}
      />
      <Route
        path="/transactions"
        element={<PrivateRoute><Layout><Transactions /></Layout></PrivateRoute>}
      />
      <Route
        path="/companies"
        element={<PrivateRoute><Layout><Companies /></Layout></PrivateRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
