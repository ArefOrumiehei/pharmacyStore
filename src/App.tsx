/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import type { ReactNode } from 'react'

// Styles
import './App.css'

// Components
import ScrollToTop from './components/scroll/ScrollToTop'

// Layouts
import AuthLayout from './layouts/authLayout/AuthLayout'
import MainLayout from './layouts/mainLayout/MainLayout'
import BlogLayout from './layouts/blogLayout/BlogLayout'

// Store
import { useAuthStore } from './store/useAuthStore'

import Home from './pages/home/Home'
import { useCartStore } from './store/useCartStore'
import ErrorBoundary from './components/error-boundary/ErrorBoundary'

// ─── Auth pages ───────────────────────────────────────────────────────────────
const Login           = lazy(() => import('./pages/auth/login/Login'))
const LoginOTP        = lazy(() => import('./pages/auth/login-otp/LoginOTP'))
const ForgotPassword  = lazy(() => import('./pages/auth/forgot-password/ForgotPassword'))

// ─── Main pages ───────────────────────────────────────────────────────────────
const AboutUs         = lazy(() => import('./pages/about-us/AboutUs'))
const ContactUs       = lazy(() => import('./pages/contact-us/ContactUs'))
const FAQ             = lazy(() => import('./pages/faq/FAQ'))
const Terms           = lazy(() => import('./pages/terms/Terms'))
const ProductListPage = lazy(() => import('./pages/product-list/ProductListPage'))
const ProductPage     = lazy(() => import('./pages/product/ProductPage'))
const BrandPage       = lazy(() => import('./pages/brand/BrandPage'))
const NotFound        = lazy(() => import('./pages/not-found/NotFound'))

// ─── Checkout ─────────────────────────────────────────────────────────────────
const CheckoutLayout  = lazy(() => import('./pages/checkout/CheckoutLayout'))
const CartStep        = lazy(() => import('./pages/checkout/steps/cart/CartStep'))
const AddressStep     = lazy(() => import('./pages/checkout/steps/address/AddressStep'))
const PaymentStep     = lazy(() => import('./pages/checkout/steps/payment/PaymentStep'))
const OrderStatus     = lazy(() => import('./pages/checkout/order-status/OrderStatus'))

// ─── Profile ──────────────────────────────────────────────────────────────────
const Profile         = lazy(() => import('./pages/profile/Profile'))
const Overview        = lazy(() => import('./pages/profile/sections/Overview'))
const Account         = lazy(() => import('./pages/profile/sections/Account'))
const Orders          = lazy(() => import('./pages/profile/sections/orders/Orders'))
const OrderDetail     = lazy(() => import('./pages/profile/sections/orders/OrderDetails'))
const Favorites       = lazy(() => import('./pages/profile/sections/Favorites'))
const Addresses       = lazy(() => import('./pages/profile/sections/Addresses'))
const Notifications   = lazy(() => import('./pages/profile/sections/Notifications'))
const Settings        = lazy(() => import('./pages/profile/sections/Settings'))
const Comments        = lazy(() => import('./pages/profile/sections/Comments'))
const Tickets         = lazy(() => import('./pages/profile/sections/tickets/Tickets'))
const SendTicket      = lazy(() => import('./pages/profile/sections/tickets/SendTicket'))

// ─── Blog ─────────────────────────────────────────────────────────────────────
const BlogsPage       = lazy(() => import('./pages/blogs/BlogsPage'))
const BlogPostPage    = lazy(() => import('./pages/blog-post/BlogPostPage'))

// ─── Maintenance page ─────────────────────────────────
const Maintenance = lazy(() => import('./pages/maintenance/Maintenance'))

// ─── Server Error page ─────────────────────────────────
const ServerError = lazy(() => import('./pages/server-error/ServerError'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center w-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-800 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">در حال بارگذاری...</p>
      </div>
    </div>
  )
}


function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useAuthStore()
  const location = useLocation()
  if (!accessToken)
    return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />
  return <>{children}</>
}

function App() {
  const { loadGuestCart } = useCartStore();
  useEffect(() => { loadGuestCart(); }, []);

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* Auth */}
            <Route path="/login" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="otp" element={<LoginOTP />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Main */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="aboutus" element={<AboutUs />} />
              <Route path="contactus" element={<ContactUs />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="terms" element={<Terms />} />
              <Route path="plp/*" element={<ProductListPage />} />
              <Route path="product/:catgSlug/:pSlug" element={<ProductPage />} />
              <Route path="brand/:brandSlug" element={<BrandPage />} />

              {/* Checkout */}
              <Route path="checkout" element={<CheckoutLayout />}>
                <Route index element={<Navigate to="cart" replace />} />
                <Route path="cart" element={<CartStep />} />
                <Route path="address" element={<AddressStep />} />
                <Route path="payment" element={<PaymentStep />} />
              </Route>
              <Route path="cart" element={<Navigate to="/checkout" replace />} />
              <Route path="shop/orders/confirm-callback" element={<OrderStatus />} />

              {/* Profile */}
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}>
                <Route index element={<Overview />} />
                <Route path="account" element={<Account />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:orderId" element={<OrderDetail />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="comments" element={<Comments />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="tickets/new" element={<SendTicket />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Blog */}
            <Route path="blog" element={<BlogLayout />}>
              <Route index element={<BlogsPage />} />
              <Route path=":catgSlug/:slug" element={<BlogPostPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="server-error" element={<ServerError />} />

          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App