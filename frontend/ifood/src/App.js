import React, { useState } from 'react';
import Menu from './components/Menu/Menu';
import Dashboard from './components/Dashboard/Dashboard';
import CadastroProdutos from './components/CadastroProdutos/CadastroProdutos';
import Relatorio from './components/Relatorio/Relatorio';
import TabelaVendas from './components/TabelaVendas/TabelaVendas';
import Loja from './components/Loja/Loja';
import './index.css';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch(activeScreen) {
      case 'home':
        return <Dashboard />;
      case 'relatorio':
        return <Relatorio />;
      case 'vendas':
        return <TabelaVendas />;
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
