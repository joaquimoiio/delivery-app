import React, { useState } from 'react';
import './Loja.css';

const Loja = () => {
  const [formData, setFormData] = useState({
    nomeLoja: '',
    cnpj: '',
    id: '',
    telefone: '',
    endereco: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: '',
    descricao: '',
    linkLogo: ''
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
    console.log('Dados da loja:', formData);
    alert('Dados da loja salvos com sucesso!');
  };

  const handleConfirmarSenha = () => {
    if (!formData.novaSenha) {
      alert('Digite uma nova senha primeiro');
      return;
    }
    
    if (formData.novaSenha === formData.confirmarNovaSenha) {
      alert('Senha confirmada com sucesso!');
      setFormData(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarNovaSenha: ''
      }));
    } else {
      alert('As senhas não coincidem');
    }
  };

  return (
    <div className="loja-container">
      <div className="loja-header">
        <h2>Configurações da Loja</h2>
      </div>
      
      <div className="loja-content">
        <div className="loja-form-section">
          <form onSubmit={handleSubmit} className="loja-form">
            <div className="form-row">
              <input
                type="text"
                name="nomeLoja"
                placeholder="Nome da Loja"
                value={formData.nomeLoja}
                onChange={handleChange}
                className="form-input full-width"
                required
              />
            </div>
            
            <div className="form-row two-columns">
              <input
                type="text"
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleChange}
                className="form-input"
                pattern="[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}/?[0-9]{4}-?[0-9]{2}"
              />
              
              <input
                type="text"
                name="id"
                placeholder="ID"
                value={formData.id}
                onChange={handleChange}
                className="form-input"
                readOnly
              />
            </div>
            
            <div className="form-row two-columns">
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="form-input"
              />
              
              <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={formData.endereco}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-row three-columns">
              <input
                type="password"
                name="senhaAtual"
                placeholder="Senha Atual"
                value={formData.senhaAtual}
                onChange={handleChange}
                className="form-input"
              />
              
              <input
                type="password"
                name="novaSenha"
                placeholder="Nova Senha"
                value={formData.novaSenha}
                onChange={handleChange}
                className="form-input"
              />
              
              <input
                type="password"
                name="confirmarNovaSenha"
                placeholder="Confirmar Nova Senha"
                value={formData.confirmarNovaSenha}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-row">
              <button 
                type="button" 
                className="confirm-btn"
                onClick={handleConfirmarSenha}
              >
                Confirmar Nova Senha
              </button>
            </div>
            
            <div className="form-row">
              <textarea
                name="descricao"
                placeholder="Descrição da Loja"
                value={formData.descricao}
                onChange={handleChange}
                className="form-textarea full-width"
                rows="4"
              />
            </div>
            
            <div className="form-row">
              <input
                type="url"
                name="linkLogo"
                placeholder="Link da Logo"
                value={formData.linkLogo}
                onChange={handleChange}
                className="form-input full-width"
              />
            </div>
            
            <button type="submit" className="submit-btn">
              Salvar Configurações
            </button>
          </form>
        </div>
        
        <div className="logo-preview-section">
          <h3>Preview da Logo</h3>
          <div className="logo-container">
            {formData.linkLogo ? (
              <img 
                src={formData.linkLogo} 
                alt="Logo da Loja" 
                className="logo-preview"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="logo-placeholder">
                <span>📷</span>
                <p>Preview da Logo</p>
              </div>
            )}
          </div>
          
          {formData.nomeLoja && (
            <div className="loja-info-preview">
              <h4>{formData.nomeLoja}</h4>
              <p>{formData.descricao}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loja;
