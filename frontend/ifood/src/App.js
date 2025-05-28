import React, { useState } from 'react';
import Menu from './components/Menu/Menu';
import Dashboard from './components/Dashboard/Dashboard';
import CadastroProdutos from './components/CadastroProdutos/CadastroProdutos';
import TabelaRelatorios from './components/TabelaRelatorios/TabelaRelatorios';
import Loja from './components/Loja/Loja';
import './index.css';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch(activeScreen) {
      case 'home':
        return <Dashboard />;
      case 'relatorio':
        return <TabelaRelatorios />;
      case 'vendas':
        return <div className="screen-placeholder">Tela de Vendas em desenvolvimento</div>;
      case 'produtos':
        return <CadastroProdutos />;
      case 'loja':
        return <Loja />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Menu 
        onNavigate={setActiveScreen} 
        activeScreen={activeScreen}
      />
      <main className="main-content">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
