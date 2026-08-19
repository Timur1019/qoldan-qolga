import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Layout, ProtectedRoute, AdminRoute } from './components'
import { IdVerificationProvider } from './context/IdVerificationContext'
import { AdDetail, AdsList, CategoryView, CreateAd, Favorites } from './features/ad'
import {
  AdminDashboard,
  AdminStats,
  AdminUsers,
  AdminReports,
  AdminBanners,
  AdminTopBanners,
  AdminSellBanners,
  AdminLogin,
  AdminBusinessApplications,
  AdminLayout,
} from './features/admin'
import {
  EditProfile,
  MyAds,
  MyReviews,
  SellerProfile,
  ProfileLayout,
} from './features/profile'
import { Home } from './features/home'
import { Chat } from './features/chat'
import { BusinessSignup } from './features/business'
import {
  About,
  Regions,
  Rules,
  RuleDocument,
  PromoResult,
  VerificationCallback,
} from './features/content'

export default function App() {
  return (
    <IdVerificationProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="regions" element={<Regions />} />
        <Route path="rules" element={<Rules />} />
        <Route path="rules/:slug" element={<RuleDocument />} />
        <Route path="login" element={<Navigate to="/?auth=login" replace />} />
        <Route path="register" element={<Navigate to="/?auth=login" replace />} />
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
        <Route path="business" element={<BusinessSignup />} />
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
          <Route index element={<Navigate to="/dashboard/profile/edit" replace />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="ads" element={<MyAds />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="reviews" element={<MyReviews />} />
          <Route path="chat" element={<Chat />} />
          <Route path="rules" element={<Rules embedded />} />
          <Route path="verification/callback" element={<VerificationCallback />} />
          <Route path="promo/result" element={<PromoResult />} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="business-applications" element={<AdminBusinessApplications />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="top-banners" element={<AdminTopBanners />} />
        <Route path="sell-banners" element={<AdminSellBanners />} />
      </Route>
    </Routes>
    </IdVerificationProvider>
  )
}
