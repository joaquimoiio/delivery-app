import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-placeholder"></div>
        </div>
        <ul className="navbar-menu">
          <li><a href="#" className="navbar-link">Hamburgueria</a></li>
          <li><a href="#" className="navbar-link">Restaurante Japonês</a></li>
          <li><a href="#" className="navbar-link">Pizzas</a></li>
        </ul>
        <button className="navbar-button">
          Entrar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
