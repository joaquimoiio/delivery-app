import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main className="home-content">
        <section className="hero-section">
          <h1>Praticidade que transforma sua rotina</h1>
          <p>Receba o que você precisa, onde estiver. Simples assim.</p>
        </section>
        
        <section className="categories-section">
          <h2>Categorias</h2>
          <div className="categories-grid">
            <div className="category-card hamburgueria">
              <h3>Hamburgueria</h3>
            </div>
            
            <div className="category-card comida-japonesa">
              <h3>Comida Japonesa</h3>
            </div>
            
            <div className="category-card bebidas">
              <h3>Bebidas</h3>
            </div>
            
            <div className="category-card pizzaria">
              <h3>Pizzaria</h3>
            </div>
            
            <div className="category-card acai">
              <h3>Açaí</h3>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
