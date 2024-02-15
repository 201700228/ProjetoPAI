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
import { FaSignOutAlt, FaHome, FaGamepad, FaTrophy } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat/chat";
import GameOptions from "./layout/Carousel/GameOptions/GameOptions";
import GameTypes from "./layout/Carousel/GameTypes/GameTypes";
import HomeGame from "./pages/Games/HomeGame";
import { Navigate } from "react-router-dom";
import TabsGames from "./layout/Tabs/Games/Games";
import TabsLeaderboards from "./layout/Tabs/Leaderboards/Leaderboards";
import Forum from "./pages/Forum/forum";

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
      } catch (error) {}
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
                    <NavLink className="link" to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/" className="link" title="Home Page">
                      <FaHome size={20} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/games" className="link" title="Games">
                      <FaGamepad size={20} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/leaderboards"
                      className="link"
                      title="Leaderboards"
                    >
                      <FaTrophy size={20} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/profile"
                      className="link-user"
                      title="Profile"
                    >
                      {authState.username}
                    </NavLink>
                  </li>

                  <li>
                    {authState.status && (
                      <NavLink
                        to="/"
                        className="link"
                        onClick={logout}
                        title="Logout"
                      >
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
              path="/register"
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
            <Route path="/chat" element={<Chat authState={authState} />} />
            <Route
              path="/play"
              element={
                authState.status ? <GameOptions /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/games"
              element={
                authState.status ? <TabsGames /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/play/games/:gameId"
              element={
                authState.status ? <GameTypes /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/play/games/:gameId/:gameOptionId"
              element={
                authState.status ? (
                  <HomeGame authState={authState} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/leaderboards"
              element={
                authState.status ? (
                  <TabsLeaderboards />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/forum"
              element={
                authState.status ? (
                  <Forum authState={authState} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
