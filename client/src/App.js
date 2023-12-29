import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './layout//Home/Home';
import LoginForm from './pages/Login/Login';
import RegisterForm from './pages/Register/Register';
import Navbar from './layout/Navbar/Navbar';
import Footer from './layout/Footer/Footer';
import backgroundImage from './assets/background.gif'; 

const App = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    // Outros estilos para o fundo, se necessário
  };

  return (
    <Router>
      <div style={backgroundStyle}>
        <Navbar />
        
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
        </Switch>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;