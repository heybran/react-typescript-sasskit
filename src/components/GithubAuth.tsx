import { useEffect } from "react"
import { redirect } from 'react-router-dom'

const GITHUB_CLIENT_ID = '0b3d7ed9ff20b068f060'
const GITHUB_CALLBACK_URL = 'http://localhost:5173/auth/github/callback'
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_url=${GITHUB_CALLBACK_URL}&scope=user`

const GitHubLoginButton = () => {
  const handleLogin = () => {
    window.location.href = githubOAuthURL;
  }

  return (
    <button onClick={handleLogin}>Signin with GitHub</button>
  )
}

const GitHubAuth = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      return console.error(`code is missing`)
    }

    fetch(`http://localhost:5000/api/auth/github/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code }),
    })
    .then(response => response.json())
    .then(data => {
      // Save the access token to local storage or a cookie
      localStorage.setItem('access_token', data.access_token);
      redirect('/')
    })
    .catch(error => {
      console.error(error);
      // handle error
    })
  }, []);

  return (
    <div>Authenticating...</div>
  )
}

export { GitHubLoginButton, GitHubAuth }