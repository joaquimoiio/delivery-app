import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        <div className="hero-section">
          <h1>Bem-vindo ao Delivery App</h1>
          <p>Encontre os melhores restaurantes da sua região</p>
        </div>
        
        <div className="categories-section">
          <h2>Categorias</h2>
          <div className="categories-grid">
            <div className="category-card">
              <h3>🍔 Hamburgueria</h3>
              <p>Os melhores hambúrgueres da cidade</p>
            </div>
            <div className="category-card">
              <h3>🍣 Japonês</h3>
              <p>Sushi e pratos orientais autênticos</p>
            </div>
            <div className="category-card">
              <h3>🍕 Pizza</h3>
              <p>Pizzas quentinhas direto do forno</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
