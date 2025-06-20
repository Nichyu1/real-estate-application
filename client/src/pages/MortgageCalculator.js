"use client"

import { useState } from "react"
import "../styles/MortgageCalculator.css"

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    homePrice: 500000,
    downPayment: 20,
    loanTerm: 30,
    interestRate: 5.5,
  })

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: Number.parseFloat(value),
    }))
  }

  const calculateMortgage = (e) => {
    e.preventDefault()

    const principal = formData.homePrice * (1 - formData.downPayment / 100)
    const monthlyRate = formData.interestRate / 100 / 12
    const numberOfPayments = formData.loanTerm * 12

    // Calculate monthly payment
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    setMonthlyPayment(monthlyPayment)
    setTotalInterest(totalInterest)
    setTotalPayment(totalPayment)
  }

  return (
    <div className="mortgage-calculator">
      <div className="calculator-container">
        <h1>Mortgage Calculator</h1>
        <p className="subtitle">Calculate your monthly mortgage payments</p>

        <div className="calculator-grid">
          <div className="calculator-form">
            <form onSubmit={calculateMortgage}>
              <div className="form-group">
                <label htmlFor="homePrice">Home Price ($)</label>
                <input
                  type="number"
                  id="homePrice"
                  name="homePrice"
                  value={formData.homePrice}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="downPayment">Down Payment (%)</label>
                <input
                  type="number"
                  id="downPayment"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="loanTerm">Loan Term (years)</label>
                <select id="loanTerm" name="loanTerm" value={formData.loanTerm} onChange={handleChange} required>
                  <option value="10">10 years</option>
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interestRate">Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <button type="submit" className="calculate-btn">
                Calculate
              </button>
            </form>
          </div>

          <div className="calculator-results">
            <h2>Your Monthly Payment</h2>
            <div className="result-card">
              <div className="result-item">
                <span className="label">Monthly Payment</span>
                <span className="value">${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="result-item">
                <span className="label">Total Interest</span>
                <span className="value">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="result-item">
                <span className="label">Total Payment</span>
                <span className="value">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="calculator-info">
              <h3>How to Use This Calculator</h3>
              <ul>
                <li>Enter the total price of the home you're interested in</li>
                <li>Input your planned down payment percentage</li>
                <li>Select your preferred loan term</li>
                <li>Enter the current interest rate</li>
                <li>Click "Calculate" to see your estimated monthly payment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MortgageCalculator
