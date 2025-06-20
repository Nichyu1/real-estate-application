"use client"

import { useState } from "react"

const MortgageCalculator = () => {
  const [values, setValues] = useState({
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
  })
  const [monthlyPayment, setMonthlyPayment] = useState(null)

  const calculatePayment = () => {
    const principal = Number.parseFloat(values.loanAmount)
    const rate = Number.parseFloat(values.interestRate) / 100 / 12
    const payments = Number.parseFloat(values.loanTerm) * 12

    if (principal && rate && payments) {
      const payment = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1)
      setMonthlyPayment(payment.toFixed(2))
    }
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ color: "#fff", marginBottom: "2rem", textAlign: "center" }}>Mortgage Calculator</h1>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "2rem",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#fff", display: "block", marginBottom: "0.5rem" }}>Loan Amount ($)</label>
            <input
              type="number"
              value={values.loanAmount}
              onChange={(e) => setValues({ ...values, loanAmount: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "#fff", display: "block", marginBottom: "0.5rem" }}>Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={values.interestRate}
              onChange={(e) => setValues({ ...values, interestRate: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ color: "#fff", display: "block", marginBottom: "0.5rem" }}>Loan Term (years)</label>
            <input
              type="number"
              value={values.loanTerm}
              onChange={(e) => setValues({ ...values, loanTerm: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                color: "#fff",
              }}
            />
          </div>

          <button
            onClick={calculatePayment}
            style={{
              width: "100%",
              padding: "1rem",
              background: "linear-gradient(45deg, #2563EB, #1E40AF)",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Calculate Payment
          </button>

          {monthlyPayment && (
            <div
              style={{
                background: "rgba(37, 99, 235, 0.1)",
                padding: "1rem",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#2563EB", marginBottom: "0.5rem" }}>Monthly Payment</h3>
              <p style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold" }}>${monthlyPayment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MortgageCalculator
