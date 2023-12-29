import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Bem-vindo à Minha App</h1>
      <div className="buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Registrar</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;