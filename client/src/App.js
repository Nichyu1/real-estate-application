import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import EmailVerification from "./pages/EmailVerification"
import SellerVerification from "./pages/SellerVerification"
import Buy from "./pages/Buy"
import Sell from "./pages/Sell"
import Rent from "./pages/Rent"
import Properties from "./pages/Properties"
import BuyerDashboard from "./pages/BuyerDashboard"
import SellerDashboard from "./pages/SellerDashboard"
import OAuthSuccess from "./pages/OAuthSuccess"
import MortgageCalculator from "./pages/MortgageCalculator"

import "./styles/global.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/mortgage-calculator" element={<MortgageCalculator />} />

              {/* Protected Routes */}
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
              <Route
                path="/seller-verification"
                element={
                  <ProtectedRoute>
                    <SellerVerification />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
{/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import EmailVerification from "./pages/EmailVerification"
import SellerVerification from "./pages/SellerVerification"
import Buy from "./pages/Buy"
import Sell from "./pages/Sell"
import Rent from "./pages/Rent"
import Properties from "./pages/Properties"
import BuyerDashboard from "./pages/BuyerDashboard"
import SellerDashboard from "./pages/SellerDashboard"
import OAuthSuccess from "./pages/OAuthSuccess"
import MortgageCalculator from "./pages/MortgageCalculator"
import "./styles/global.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
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
            <Route
              path="/seller-verification"
              element={
                <ProtectedRoute>
                  <SellerVerification />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
*/}