// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = () => {
    // Simular login
    const userData = {
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      avatar: null
    };
    login(userData);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <div className="logo-placeholder"></div>
        </div>

        {/* Menu de navegação */}
        <ul className="navbar-menu">
          <li><a href="/" className="navbar-link">Hamburgueria</a></li>
          <li><a href="/" className="navbar-link">Restaurante Japonês</a></li>
          <li><a href="/" className="navbar-link">Pizzaria</a></li>
        </ul>

        {/* Área direita - condicional baseada no login */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              {/* Barra de pesquisa */}
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Busca comida japonesa, Pizzaria" 
                  className="search-input"
                />
                <button className="search-button">🔍</button>
              </div>

              {/* Dropdown do perfil */}
              <div className="profile-dropdown">
                <button className="profile-button" onClick={toggleDropdown}>
                  <div className="profile-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item">
                      <a href="/profile">Seu Perfil</a>
                    </div>
                    <div className="dropdown-item">
                      <a href="/orders">Histórico de Pedidos</a>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item">
                      <button onClick={handleLogout}>Sair</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Botão de login para usuários não logados */
            <button className="navbar-button" onClick={handleLogin}>
              Entrar/Cadastro
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
