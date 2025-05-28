import React, { useState } from 'react';
import './CadastroProdutos.css';

const CadastroProdutos = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: '',
    categoria: '',
    linkImagem: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Produto cadastrado:', formData);
  };

  return (
    <div className="cadastro-produtos">
      <div className="cadastro-header">
        <button className="hamburger">☰</button>
      </div>
      
      <div className="cadastro-content">
        <form onSubmit={handleSubmit} className="produto-form">
          <div className="form-row">
            <input
              type="text"
              name="nome"
              placeholder="Nome do Produto"
              value={formData.nome}
              onChange={handleChange}
              className="form-input full-width"
            />
          </div>
          
          <div className="form-row">
            <textarea
              name="descricao"
              placeholder="Descrição"
              value={formData.descricao}
              onChange={handleChange}
              className="form-textarea full-width"
              rows="3"
            />
          </div>
          
          <div className="form-row two-columns">
            <input
              type="number"
              name="valor"
              placeholder="Valor"
              value={formData.valor}
              onChange={handleChange}
              className="form-input"
            />
            
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Categoria</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="roupas">Roupas</option>
              <option value="casa">Casa</option>
            </select>
          </div>
          
          <div className="form-row">
            <input
              type="url"
              name="linkImagem"
              placeholder="Link da Imagem"
              value={formData.linkImagem}
              onChange={handleChange}
              className="form-input full-width"
            />
          </div>
        </form>
        
        <div className="preview-section">
          {/* Preview do produto */}
        </div>
      </div>
    </div>
  );
};

export default CadastroProdutos;
