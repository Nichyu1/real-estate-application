import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Buy from "./pages/Buy"
import Sell from "./pages/Sell"
import Rent from "./pages/Rent"
import Properties from "./pages/Properties"
import MortgageCalculator from "./pages/MortgageCalculator"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import OAuthSuccess from "./pages/OAuthSuccess"
import BuyerDashboard from "./pages/BuyerDashboard"
import SellerDashboard from "./pages/SellerDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import "./styles/global.css"

function AppContent() {
  const location = useLocation()
  const authPages = ["/login", "/signup", "/oauth-success"]
  const isAuthPage = authPages.includes(location.pathname)

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAuthPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <Sell />
              </ProtectedRoute>
            }
          />
          <Route path="/rent" element={<Rent />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-dashboard"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
