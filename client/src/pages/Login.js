import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Aqui você pode salvar o token de autenticação no estado ou localStorage
        console.log('Login bem-sucedido:', data);
      } else {
        console.error('Erro ao fazer login:', response.statusText);
        // Trate os erros de acordo com a resposta recebida
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Trate os erros de requisição
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
