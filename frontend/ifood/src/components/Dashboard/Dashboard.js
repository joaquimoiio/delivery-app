import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="hamburger">☰</button>
      </div>
      
      <div className="dashboard-content">
        <div className="metrics-container">
          <div className="metric-card">
            <h3>Vendas</h3>
            <div className="metric-number">25</div>
          </div>
          
          <div className="metric-card">
            <h3>Lucro Mensal</h3>
            <div className="metric-number">25</div>
          </div>
        </div>
        
        <div className="recent-orders-section">
          <h3>Pedidos Recentes</h3>
          <div className="orders-list">
            {/* Lista de pedidos será implementada aqui */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
