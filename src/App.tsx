import { Route, Routes } from 'react-router'

// Styles
import './App.css'

// Components
import ScrollToTop from './components/scroll/ScrollToTop'

// Layouts
import AuthLayout from './layouts/authLayout/AuthLayout'
import MainLayout from './layouts/mainLayout/MainLayout'
import BlogLayout from './layouts/blogLayout/BlogLayout'

// Pages
import Login from './pages/auth/login/Login'
import SignUp from './pages/auth/signup/Signup'
import Home from './pages/home/Home'
import AboutUs from './pages/about-us/AboutUs'
import ContactUs from './pages/contact-us/ContactUs'
import FAQ from './pages/faq/FAQ'
import Terms from './pages/terms/Terms'
import ProductListPage from './pages/product-list/ProductListPage'
import ProductPage from './pages/product/ProductPage'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import OrderStatus from './pages/checkout/orderStatus/OrderStatus'
import Profile from './pages/profile/Profile'
import Overview from './pages/profile/sections/Overview'
import Account from './pages/profile/sections/Account'
import Orders from './pages/profile/sections/orders/Orders'
import Favorites from './pages/profile/sections/Favorites'
import Addresses from './pages/profile/sections/Addresses'
import Notifications from './pages/profile/sections/Notifications'
import Settings from './pages/profile/sections/Settings'
import BlogsPage from './pages/blogs/BlogsPage'
import BlogPostPage from './pages/blog-post/BlogPostPage'
import SendTicket from './pages/send-ticket/SendTicket'
import Tickets from './pages/profile/sections/Tickets'
import Comments from './pages/profile/sections/Comments'
import NotFound from './pages/not-found/NotFound'
import OrderDetail from './pages/profile/sections/orders/OrderDetails'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* Auth */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        {/* Main */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="terms" element={<Terms />} />
          <Route path="plp" element={<ProductListPage />} />
          <Route path="product/:catgSlug/:pSlug" element={<ProductPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="shop/orders/confirm-callback" element={<OrderStatus />} />
          <Route path="profile" element={<Profile />}>
            <Route index element={<Overview />} />
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path='comments' element={<Comments />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path='tickets' element={<Tickets />} />
            <Route path='tickets/new' element={<SendTicket />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Blog */}
        <Route path="blog" element={<BlogLayout />}>
          <Route index element={<BlogsPage />} />
          <Route path=":slug" element={<BlogPostPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />  
      </Routes>
    </>
  )
}

export default App