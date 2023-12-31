import "./App.css";
import "./css/Navbar.css"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import HomePage from "./layout/Home";
import LoginForm from "./pages/Login/Login";
import RegisterForm from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile"
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "./assets/background.gif";
import logoImage from "./assets/logo.png";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const history = useHistory();

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
            <img src={logoImage} alt="RetroReunion Logo" className="logo" />
            <ul className="nav-list">
              {!authState.status ? (
                <>
                  <li>
                    <Link className="link" to="/login">
                      {" "}
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/registration">
                      {" "}
                      Registar
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="link">
                      <FaHome size={20} />
                    </Link>
                  </li>

                  <li>
                    <Link to="/profile" className="link-user">
                      {authState.username}
                    </Link>
                  </li>
                  <li>
                    {authState.status && (
                      <Link to="/" className="link" onClick={logout}>
                        <FaSignOutAlt size={20} />
                      </Link>
                    )}
                  </li>
                </>
              )}
            </ul>
          </nav>
          <ToastContainer /> 
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/registration" exact component={RegisterForm} />
            <Route path="/login" exact component={LoginForm} />
            <Route path="/profile" exact component={Profile} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
