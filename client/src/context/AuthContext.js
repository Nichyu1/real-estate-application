"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include", // Send session cookies
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [API_URL])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Required to receive session cookies
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const register = async (name, email, password, userType) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, userType }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.requiresVerification) {
          return {
            success: true,
            message: data.message,
            requiresVerification: true,
            email: data.email,
          }
        }

        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isBuyer: user?.userType === "buyer",
    isSeller: user?.userType === "seller",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


{/*"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              "x-auth-token": storedToken,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setToken(storedToken)
          } else {
            localStorage.removeItem("token")
            setToken(null)
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [API_URL])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const register = async (name, email, password, userType) => {
    try {
      console.log("Attempting registration with:", { name, email, userType })

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, userType }),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (response.ok) {
        // If email verification is required, don't set user yet
        if (data.requiresVerification) {
          return {
            success: true,
            message: data.message,
            requiresVerification: true,
            email: data.email,
          }
        }

        // Otherwise proceed with normal login
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        console.error("Registration failed:", data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Registration network error:", error)
      return { success: false, message: "Network error. Please check your connection and try again." }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isBuyer: user?.userType === "buyer",
    isSeller: user?.userType === "seller",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
*/}