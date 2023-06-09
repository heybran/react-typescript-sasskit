import { useEffect } from "react"

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
  // useEffect(() => {
  //   const code = new URLSearchParams(window.location.search).get('code')
  //   if (!code) {
  //     return console.error(`code is missing`)
  //   }

  //   const url = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${GITHUB_CALLBACK_URL}`

  //   fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json'
  //     }
  //   })
  //   .then(response => {
  //     const access_token = response.data.access_token;
  //     console.log(access_token)
  //     // handle success

  //   })
  //   .catch(error => {
  //     // handle error
  //   })
  // }, [])

  return (
    <div>Authenticating...</div>
  )
}

export { GitHubLoginButton, GitHubAuth }