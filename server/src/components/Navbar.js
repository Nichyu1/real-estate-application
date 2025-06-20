"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          RealEstate
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/buy" className="navbar-link">
              Buy
            </Link>
            <Link to="/sell" className="navbar-link">
              Sell
            </Link>
            <Link to="/rent" className="navbar-link">
              Rent
            </Link>
            <Link to="/properties" className="navbar-link">
              Properties
            </Link>
            <Link to="/mortgage-calculator" className="navbar-link">
              Calculator
            </Link>
          </div>

          {/* Auth Section */}
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="navbar-user">
                <span className="navbar-welcome">Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="navbar-login">
                  Login
                </Link>
                <Link to="/signup" className="navbar-signup">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="navbar-toggle">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-mobile">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/buy" className="navbar-link">
            Buy
          </Link>
          <Link to="/sell" className="navbar-link">
            Sell
          </Link>
          <Link to="/rent" className="navbar-link">
            Rent
          </Link>
          <Link to="/properties" className="navbar-link">
            Properties
          </Link>
          {!isAuthenticated && (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/signup" className="navbar-link">
                Sign Up
              </Link>
            </>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="navbar-link">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
