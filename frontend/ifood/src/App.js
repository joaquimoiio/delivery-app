import React, { useState } from 'react';
import Menu from './components/Menu/Menu';
import Dashboard from './components/Dashboard/Dashboard';
import CadastroProdutos from './components/CadastroProdutos/CadastroProdutos';
import TabelaRelatorios from './components/TabelaRelatorios/TabelaRelatorios';
import Loja from './components/Loja/Loja';
import './index.css';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const handleNavigate = (screenId) => {
    setActiveScreen(screenId);
  };

  const handleMenuToggle = (collapsed) => {
    setMenuCollapsed(collapsed);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Dashboard />;
      case 'produtos':
        return <CadastroProdutos />;
      case 'relatorio':
        return <TabelaRelatorios />;
      case 'loja':
        return <Loja />;
      case 'vendas':
        return (
          <div className="screen-placeholder">
            <div className="placeholder-content">
              <h2>Vendas</h2>
              <p>Esta funcionalidade está em desenvolvimento</p>
              <div className="coming-soon">Em breve</div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Menu 
        onNavigate={handleNavigate} 
        activeScreen={activeScreen}
        onMenuToggle={handleMenuToggle}
      />
      <main className={`main-content ${menuCollapsed ? 'collapsed' : ''}`}>
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
