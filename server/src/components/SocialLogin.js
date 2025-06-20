"use client"

const SocialLogin = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`
  }

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`
  }

  return (
    <div className="social-login">
      <button onClick={handleGoogleLogin} className="social-btn google-btn">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
      </button>
      <button onClick={handleGithubLogin} className="social-btn github-btn">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
      </button>
    </div>
  )
}

export default SocialLogin

