import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer
      style={{
        background: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        padding: "3rem 2rem 1rem",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Company Info */}
          <div>
            <h3 style={{ marginBottom: "1rem", color: "#2563EB" }}>RealEstate</h3>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Your trusted partner in finding the perfect home. We connect buyers, sellers, and renters with their ideal
              properties.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link to="/buy" style={{ color: "#ccc", textDecoration: "none" }}>
                Buy Properties
              </Link>
              <Link to="/sell" style={{ color: "#ccc", textDecoration: "none" }}>
                Sell Properties
              </Link>
              <Link to="/rent" style={{ color: "#ccc", textDecoration: "none" }}>
                Rent Properties
              </Link>
              <Link to="/mortgage-calculator" style={{ color: "#ccc", textDecoration: "none" }}>
                Mortgage Calculator
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Contact Info</h4>
            <div style={{ color: "#ccc", lineHeight: "1.6" }}>
              <p>📧 nichyuthak@gmail.com</p>
              <p>📞 +91 8886224656</p>
              <p>📍 WARANGAL,TELANGANA,INDIA</p>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "1rem",
            textAlign: "center",
            color: "#ccc",
          }}
        >
          <p>&copy; 2024 RealEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
