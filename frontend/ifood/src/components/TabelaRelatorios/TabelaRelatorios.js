import React, { useState } from 'react';
import './TabelaRelatorios.css';

const TabelaRelatorios = () => {
  const [dados] = useState([
    { id: 1, cliente: 'João Silva', valor: 'R$ 150,00', dataHora: '28/05/2025 14:30', situacao: 'Concluído' },
    { id: 2, cliente: 'Maria Santos', valor: 'R$ 280,00', dataHora: '28/05/2025 13:15', situacao: 'Pendente' },
    { id: 3, cliente: 'Pedro Costa', valor: 'R$ 95,00', dataHora: '28/05/2025 12:45', situacao: 'Cancelado' }
  ]);

  const handleDetalhes = (id) => {
    console.log('Detalhes do item:', id);
  };

  return (
    <div className="tabela-relatorios">
      <div className="tabela-header">
        <button className="hamburger">☰</button>
      </div>
      
      <div className="tabela-content">
        <table className="relatorios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Data e Hora</th>
              <th>Situação</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.cliente}</td>
                <td>{item.valor}</td>
                <td>{item.dataHora}</td>
                <td>
                  <span className={`status ${item.situacao.toLowerCase()}`}>
                    {item.situacao}
                  </span>
                </td>
                <td>
                  <button 
                    className="detalhes-btn"
                    onClick={() => handleDetalhes(item.id)}
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaRelatorios;
