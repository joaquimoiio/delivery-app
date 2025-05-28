import React, { useState, useEffect } from 'react';
import './Menu.css';

const Menu = ({ onNavigate, activeScreen, screenTitle, onMenuToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '🏠' },
    { id: 'relatorio', label: 'Relatório de Vendas', icon: '📊' },
    { id: 'vendas', label: 'Vendas', icon: '💰' },
    { id: 'produtos', label: 'Cadastro de Produtos', icon: '📦' },
    { id: 'loja', label: 'Configurações da Loja', icon: '🏪' }
  ];

  const handleToggle = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
      if (onMenuToggle) {
        onMenuToggle(!isCollapsed);
      }
    }
  };

  const handleMenuClick = (screenId) => {
    onNavigate(screenId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <div 
          className={`menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      )}
      
      <div className={`menu-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="menu-header">
          <button className="menu-toggle" onClick={handleToggle}>
            ☰
          </button>
          <span className="menu-brand">Sistema</span>
        </div>
        
        <nav className="menu-navigation">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`menu-item ${activeScreen === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Menu;
