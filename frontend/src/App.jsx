import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Layout, ProfileLayout, ProtectedRoute, AdminRoute, AdminLayout } from './components'
import { AdDetail, AdsList, CategoryView, CreateAd, Favorites } from './features/ad'
import {
  Home,
  Dashboard,
  AdminDashboard,
  MyAds,
  MyReviews,
  EditProfile,
  Chat,
  SellerProfile,
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
        <Route path="ads/my" element={<Navigate to="/dashboard/ads" replace />} />
        <Route path="favorites" element={<Navigate to="/dashboard/favorites" replace />} />
        <Route
          path="ads/create"
          element={
            <ProtectedRoute>
              <CreateAd />
            </ProtectedRoute>
          }
        />
        <Route
          path="ads/:id/edit"
          element={
            <ProtectedRoute>
              <CreateAd edit />
            </ProtectedRoute>
          }
        />
        <Route path="ads/:id" element={<AdDetail />} />
        <Route path="users/:id" element={<SellerProfile />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <ProfileLayout>
                <Outlet />
              </ProfileLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="ads" element={<MyAds />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="reviews" element={<MyReviews />} />
          <Route path="chat" element={<Chat />} />
        </Route>
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
