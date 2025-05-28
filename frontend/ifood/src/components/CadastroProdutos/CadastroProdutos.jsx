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
    alert('Produto cadastrado com sucesso!');
    setFormData({
      nome: '',
      descricao: '',
      valor: '',
      categoria: '',
      linkImagem: ''
    });
  };

  return (
    <div className="cadastro-produtos">
      <div className="cadastro-header">
        <button className="hamburger">☰</button>
      </div>
      
      <div className="cadastro-content">
        <form onSubmit={handleSubmit} className="produto-form">
          <h2>Cadastro de Produtos</h2>
          
          <div className="form-row">
            <input
              type="text"
              name="nome"
              placeholder="Nome do Produto"
              value={formData.nome}
              onChange={handleChange}
              className="form-input full-width"
              required
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
              required
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
              min="0"
              step="0.01"
              required
            />
            
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecione a Categoria</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="roupas">Roupas</option>
              <option value="casa">Casa e Decoração</option>
              <option value="esportes">Esportes</option>
              <option value="livros">Livros</option>
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
          
          <button type="submit" className="submit-btn">
            Cadastrar Produto
          </button>
        </form>
        
        <div className="preview-section">
          <h3>Preview do Produto</h3>
          <div className="product-preview">
            {formData.linkImagem && (
              <img 
                src={formData.linkImagem} 
                alt="Preview" 
                className="preview-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="preview-info">
              <h4>{formData.nome || 'Nome do Produto'}</h4>
              <p>{formData.descricao || 'Descrição do produto'}</p>
              <span className="preview-price">
                {formData.valor ? `R$ ${formData.valor}` : 'R$ 0,00'}
              </span>
              <span className="preview-category">
                {formData.categoria || 'Categoria'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroProdutos;
