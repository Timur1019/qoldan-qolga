import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout, ProtectedRoute, AdminRoute, AdminLayout } from './components'
import {
  Home,
  Dashboard,
  AdminDashboard,
  AdsList,
  AdDetail,
  MyAds,
  CreateAd,
  Favorites,
  CategoryView,
} from './pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Navigate to="/?auth=login" replace />} />
        <Route path="register" element={<Navigate to="/?auth=register" replace />} />
        <Route path="ads" element={<AdsList />} />
        <Route path="categories/:code" element={<CategoryView />} />
        <Route
          path="ads/my"
          element={
            <ProtectedRoute>
              <MyAds />
            </ProtectedRoute>
          }
        />
        <Route
          path="ads/create"
          element={
            <ProtectedRoute>
              <CreateAd />
            </ProtectedRoute>
          }
        />
        <Route path="ads/:id" element={<AdDetail />} />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}
