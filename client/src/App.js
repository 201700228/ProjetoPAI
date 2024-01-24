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
import { FaSignOutAlt, FaHome, FaGamepad } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat/chat"; 
import GameOptions from "./layout/Carousel/GameOptions/GameOptions";
import GameTypes from "./layout/Carousel/GameTypes/GameTypes";
import Galaga from "./pages/Games/Galaga/Game";
import Pong from "./pages/Games/Pong/Pong";
import { Navigate } from "react-router-dom";
import GamesTable from "./layout/Tabs/Games/Games";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        if (response.data.error) {
          setAuthState((prevState) => ({ ...prevState, status: false }));
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      } catch (error) {
        // Handle errors if needed
      }
    };

    fetchAuthStatus();
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
                    <NavLink className="link" to="/login">
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="link" to="/registration">
                      Registar
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/" className="link">
                      <FaHome size={20} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/games" className="link">
                      <FaGamepad size={20} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/profile" className="link-user">
                      {authState.username}
                    </NavLink>
                  </li>
                  <li>
                    {authState.status && (
                      <NavLink to="/" className="link" onClick={logout}>
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
            <Route
              path="/"
              element={
                authState.status ? <HomePage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/registration"
              element={
                authState.status ? <Navigate to="/" /> : <RegisterForm />
              }
            />

            <Route
              path="/login"
              element={authState.status ? <Navigate to="/" /> : <LoginForm />}
            />
            <Route
              path="/profile"
              element={
                authState.status ? <Profile /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/chat"
              element={authState.status ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              path="/play"
              element={
                authState.status ? <GameOptions /> : <GameOptions />
              }
            />
            <Route
              path="/games"
              element={
                authState.status ? <GamesTable /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/play/:gameOption"
              element={
                authState.status ? <GameTypes /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/play/galaga/single-player"
              element={authState.status ? <Galaga /> : <Navigate to="/login" />}
            />
            <Route
              path="/play/pong/single-player"
              element={authState.status ? <Pong /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
