import React, { useState } from 'react';
import './TabelaRelatorios.css';

const TabelaRelatorios = () => {
  const [vendas] = useState([
    { 
      id: 1, 
      produto: 'Smartphone Samsung Galaxy', 
      cliente: 'João Silva', 
      quantidade: 2,
      valorUnitario: 850.00,
      valorTotal: 1700.00,
      dataVenda: '28/05/2025',
      horaVenda: '14:30',
      formaPagamento: 'Cartão de Crédito',
      status: 'Concluída'
    },
    { 
      id: 2, 
      produto: 'Notebook Dell Inspiron', 
      cliente: 'Maria Santos', 
      quantidade: 1,
      valorUnitario: 2800.00,
      valorTotal: 2800.00,
      dataVenda: '28/05/2025',
      horaVenda: '13:15',
      formaPagamento: 'PIX',
      status: 'Concluída'
    },
    { 
      id: 3, 
      produto: 'Fone Bluetooth JBL', 
      cliente: 'Pedro Costa', 
      quantidade: 1,
      valorUnitario: 95.00,
      valorTotal: 95.00,
      dataVenda: '28/05/2025',
      horaVenda: '12:45',
      formaPagamento: 'Dinheiro',
      status: 'Cancelada'
    },
    { 
      id: 4, 
      produto: 'Smart TV 55" LG', 
      cliente: 'Ana Oliveira', 
      quantidade: 1,
      valorUnitario: 2200.00,
      valorTotal: 2200.00,
      dataVenda: '28/05/2025',
      horaVenda: '11:20',
      formaPagamento: 'Cartão de Débito',
      status: 'Concluída'
    },
    { 
      id: 5, 
      produto: 'Tablet iPad Air', 
      cliente: 'Carlos Lima', 
      quantidade: 1,
      valorUnitario: 1800.00,
      valorTotal: 1800.00,
      dataVenda: '28/05/2025',
      horaVenda: '10:30',
      formaPagamento: 'Cartão de Crédito',
      status: 'Pendente'
    }
  ]);

  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');

  const vendasFiltradas = vendas.filter(venda => {
    const statusMatch = filtroStatus === 'todos' || venda.status.toLowerCase() === filtroStatus;
    const dataMatch = !filtroData || venda.dataVenda.includes(filtroData);
    return statusMatch && dataMatch;
  });

  const totalVendas = vendasFiltradas.reduce((total, venda) => {
    return venda.status === 'Concluída' ? total + venda.valorTotal : total;
  }, 0);

  const handleDetalhes = (id) => {
    const venda = vendas.find(v => v.id === id);
    alert(`Detalhes da Venda:\n\nID: ${venda.id}\nProduto: ${venda.produto}\nCliente: ${venda.cliente}\nQuantidade: ${venda.quantidade}\nValor Total: R$ ${venda.valorTotal.toFixed(2)}\nData: ${venda.dataVenda} às ${venda.horaVenda}\nPagamento: ${venda.formaPagamento}\nStatus: ${venda.status}`);
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'concluída':
        return 'concluida';
      case 'pendente':
        return 'pendente';
      case 'cancelada':
        return 'cancelada';
      default:
        return '';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="relatorio-vendas">
      <div className="relatorio-header">
        <button className="hamburger">☰</button>
        <h2>Relatório de Vendas</h2>
      </div>
      
      <div className="relatorio-content">
        <div className="filtros-section">
          <div className="filtros-container">
            <div className="filtro-group">
              <label>Status:</label>
              <select 
                value={filtroStatus} 
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="filtro-select"
              >
                <option value="todos">Todos</option>
                <option value="concluída">Concluída</option>
                <option value="pendente">Pendente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div className="filtro-group">
              <label>Data:</label>
              <input 
                type="date" 
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="filtro-input"
              />
            </div>
            
            <div className="total-vendas">
              <strong>Total de Vendas: {formatCurrency(totalVendas)}</strong>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="vendas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Cliente</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Total</th>
                <th>Data/Hora</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map(venda => (
                <tr key={venda.id}>
                  <td>{venda.id}</td>
                  <td>{venda.produto}</td>
                  <td>{venda.cliente}</td>
                  <td>{venda.quantidade}</td>
                  <td>{formatCurrency(venda.valorUnitario)}</td>
                  <td>{formatCurrency(venda.valorTotal)}</td>
                  <td>{venda.dataVenda} {venda.horaVenda}</td>
                  <td>{venda.formaPagamento}</td>
                  <td>
                    <span className={`status ${getStatusClass(venda.status)}`}>
                      {venda.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="detalhes-btn"
                      onClick={() => handleDetalhes(venda.id)}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {vendasFiltradas.length === 0 && (
          <div className="no-results">
            <p>Nenhuma venda encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabelaRelatorios;
