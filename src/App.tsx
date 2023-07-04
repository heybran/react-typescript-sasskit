import { Routes, Route } from "react-router-dom";
import Root from "./routes/Root.tsx";
import { GitHubAuth } from "./components/GithubAuth.tsx";
import useUser from "./hooks/useUser.tsx";
import { UserContext } from "./context/UserContext.tsx";
import About from "./routes/About.tsx";
import Account from "./routes/Account.tsx";
import Pricing from "./routes/Pricing.tsx";
import Home from "./routes/Home.tsx";
import "./index.css";
import Dashboard from "./routes/Dashboard.tsx";
import Register from "./routes/Register.tsx";
import Login from "./routes/Login.tsx";

export default function App() {
  const { isPending, user, setUser } = useUser();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {isPending ? (
        <div className="loading-container">
          <div className="loading">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : null}
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={user.isLoggedIn ? <Dashboard /> : <Home />}
        >
          <Route path="account" element={<Account />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="/auth/github/callback" element={<GitHubAuth />} />
      </Routes>
    </UserContext.Provider>
  );
}
