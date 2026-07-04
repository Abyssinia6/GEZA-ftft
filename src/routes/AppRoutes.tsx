import { Route, Routes } from 'react-router-dom'
import BookingUpload from '../pages/BookingUpload'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import Register from '../pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booking-upload" element={<BookingUpload />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
