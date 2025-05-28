import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Home</h2>
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
            <p>Nenhum pedido recente encontrado.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
