import "./App.css";
import "./css/Navbar.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import HomePage from "./layout/Home";
import LoginForm from "./pages/Login/Login";
import RegisterForm from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "./assets/background.gif";
import logoImage from "./assets/logo.png";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat/chat"; // Import the new Chat component
import GameOptions from "./pages/Games/Options/Options";
import GameTypes from "./pages/Games/Types/Types";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    minHeight: "100vh",
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <div style={backgroundStyle}>
          <nav className="navbar">
            <NavLink to="/" className="logo-link">
              <img src={logoImage} alt="RetroReunion Logo" className="logo" />
            </NavLink>
            <ul className="nav-list">
              {!authState.status ? (
                <>
                  <li>
                    <NavLink className="link" href="/login">
                      {" "}
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="link" href="/registration">
                      {" "}
                      Registar
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink href="/" className="link">
                      <FaHome size={20} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink href="/profile" className="link-user">
                      {authState.username}
                    </NavLink>
                  </li>
                  <li>
                    {authState.status && (
                      <NavLink href="/" className="link" onClick={logout}>
                        <FaSignOutAlt size={20} />
                      </NavLink>
                    )}
                  </li>
                </>
              )}
            </ul>
          </nav>
          <ToastContainer />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/play" element={<GameOptions />} />
            <Route path="/play/:gameType" element={<GameTypes />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
