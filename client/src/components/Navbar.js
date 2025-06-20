"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated, isSeller } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="nav-left">
          <Link to="/" className="logo">
            <span>REALTOR</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/buy" className="nav-link">Buy</Link>

          {/* Only show Sell if user is a seller */}
          {isSeller && (
            <Link to="/sell" className="nav-link">Sell</Link>
          )}
               

          <Link to="/rent" className="nav-link">Rent</Link>
          <Link to="/properties" className="nav-link">Properties</Link>
          <Link to="/mortgage-calculator" className="nav-link">Calculator</Link>
        </div>

        {/* Auth Section */}
        <div className="nav-right">
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "#1a1a2e" }}>
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="login-btn"
                style={{ background: "#e91e63" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link
                to="/login"
                className="login-btn"
                style={{
                  background: "transparent",
                  color: "#1a1a2e",
                  border: "1px solid #1a1a2e",
                }}
              >
                Login
              </Link>
              <Link to="/signup" className="get-started-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar


{/*"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      
      <div className="nav-left">
        <Link to="/" className="logo">
          <span>REALTOR</span>
        </Link>
      </div>

    
      <div className="nav-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/buy" className="nav-link">Buy</Link>
        <Link to="/sell" className="nav-link">Sell</Link>
        <Link to="/rent" className="nav-link">Rent</Link>
        <Link to="/properties" className="nav-link">Properties</Link>
        <Link to="/mortgage-calculator" className="nav-link">Calculator</Link>
      </div>

      
      <div className="nav-right">
        {!loading && isAuthenticated ? (
          <>
            <span style={{ color: "#1a1a2e", marginRight: "1rem" }}>
              Welcome, {user?.name?.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="login-btn"
              style={{ background: "#e91e63", color: "white" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login-btn"
              style={{ background: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e" }}
            >
              Login
            </Link>
            <Link to="/signup" className="get-started-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
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
      {/* Logo 
      <div className="nav-left">
        <Link to="/" className="logo">
          <span>REALTOR</span>
        </Link>
      </div>

      {/* Navigation Links 
      <div className="nav-center">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/buy" className="nav-link">
          Buy
        </Link>
        <Link to="/sell" className="nav-link">
          Sell
        </Link>
        <Link to="/rent" className="nav-link">
          Rent
        </Link>
        <Link to="/properties" className="nav-link">
          Properties
        </Link>
        <Link to="/mortgage-calculator" className="nav-link">
          Calculator
        </Link>
      </div>

      
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span style={{ color: "#1a1a2e", marginRight: "1rem" }}>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="login-btn" style={{ background: "#e91e63" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login-btn"
              style={{ background: "transparent", color: "#1a1a2e", border: "1px solid #1a1a2e" }}
            >
              Login
            </Link>
            <Link to="/signup" className="get-started-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
*/}