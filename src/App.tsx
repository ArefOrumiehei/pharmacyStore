import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/home/Home'
import MainLayout from './layouts/mainLayout/MainLayout'
import AboutUs from './pages/about-us/AboutUs'
import ContactUs from './pages/contact-us/ContactUs'
import FAQ from './pages/faq/FAQ'
import Login from './pages/auth/login/Login'
import SignUp from './pages/auth/signup/Signup'
import AuthLayout from './layouts/authLayout/AuthLayout'
import ProductPage from './pages/product/ProductPage'
import ProductList from './pages/product-list/ProductList'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import OrderStatus from './pages/checkout/orderStatus/OrderStatus'
import Terms from './pages/terms/Terms'
import ScrollToTop from './components/scroll/ScrollToTop'
import Profile from './pages/profile/Profile'
import Account from './pages/profile/sections/Account'
import Orders from './pages/profile/sections/Orders'
import Favorites from './pages/profile/sections/Favorites'
import Addresses from './pages/profile/sections/Addresses'
import Notifications from './pages/profile/sections/Notifications'
import Settings from './pages/profile/sections/Settings'
import Overview from './pages/profile/sections/Overview'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='aboutus' element={<AboutUs />} />
          <Route path='contactus' element={<ContactUs />} />
          <Route path='faq' element={<FAQ />} />
          <Route path='plp' element={<ProductList />} />
          <Route path='product/:catgSlug/:pSlug' element={<ProductPage />} />
          <Route path='cart' element={<Cart />} />
          <Route path='checkout' element={<Checkout />} />
          <Route path='shop/orders/confirm-callback' element={<OrderStatus />} />
          <Route path='terms' element={<Terms />} />
          <Route path='profile' element={<Profile />}>
            <Route index element={<Overview />} />
            <Route path='account' element={<Account />} />
            <Route path='orders' element={<Orders />} />
            <Route path='favorites' element={<Favorites />} />
            <Route path='addresses' element={<Addresses />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Route>

      </Routes>
    </>
  )
}

export default App
