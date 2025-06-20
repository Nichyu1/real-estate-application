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
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
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
              <Link to="/buy" style={footerLinkStyle}>
                Buy Properties
              </Link>
              <Link to="/sell" style={footerLinkStyle}>
                Sell Properties
              </Link>
              <Link to="/rent" style={footerLinkStyle}>
                Rent Properties
              </Link>
              <Link to="/mortgage-calculator" style={footerLinkStyle}>
                Mortgage Calculator
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link to="/contact" style={footerLinkStyle}>
                Contact Us
              </Link>
              <Link to="/help" style={footerLinkStyle}>
                Help Center
              </Link>
              <Link to="/terms" style={footerLinkStyle}>
                Terms of Service
              </Link>
              <Link to="/privacy" style={footerLinkStyle}>
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: "1rem" }}>Contact Info</h4>
            <div style={{ color: "#ccc", lineHeight: "1.6" }}>
              <p>📧 info@realestate.com</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 123 Real Estate St, City, State 12345</p>
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

const footerLinkStyle = {
  color: "#ccc",
  textDecoration: "none",
  transition: "color 0.3s ease",
}

export default Footer
