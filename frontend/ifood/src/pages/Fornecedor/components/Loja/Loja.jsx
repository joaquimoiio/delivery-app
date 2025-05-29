import React, { useState } from 'react';
import MapSelector from './MapSelector/MapSelector';
import './Loja.css';

const Loja = () => {
  const [formData, setFormData] = useState({
    nomeLoja: '',
    cnpj: '',
    id: '',
    telefone: '',
    endereco: '',
    coordinates: null,
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: '',
    descricao: '',
    linkLogo: ''
  });

  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleSelectAddress = (addressData) => {
    setFormData(prev => ({
      ...prev,
      endereco: addressData.address,
      coordinates: addressData.coordinates
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
        <h2>🏪 Configurações da Loja</h2>
      </div>

      <div className="loja-content">
        <div className="loja-form-section">
          <form className="loja-form" onSubmit={handleSubmit}>
            <div className="form-row two-columns">
              <input
                type="text"
                name="nomeLoja"
                placeholder="Nome da Loja"
                value={formData.nomeLoja}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="text"
                name="cnpj"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-row two-columns">
              <input
                type="text"
                name="id"
                placeholder="ID da Loja"
                value={formData.id}
                onChange={handleChange}
                className="form-input"
                readOnly
              />
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-row">
              <div className="endereco-input-group">
                <input
                  type="text"
                  name="endereco"
                  placeholder="Endereço da Loja"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={handleOpenMap}
                  className="map-btn"
                >
                  📍 Selecionar no Mapa
                </button>
              </div>
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
              <button
                type="button"
                onClick={handleConfirmarSenha}
                className="confirm-btn"
              >
                Confirmar
              </button>
            </div>

            <div className="form-row">
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
              <textarea
                name="descricao"
                placeholder="Descrição da Loja"
                value={formData.descricao}
                onChange={handleChange}
                className="form-textarea"
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
                className="form-input"
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
                alt="Logo da loja"
                className="logo-preview"
              />
            ) : (
              <div className="logo-placeholder">
                <span>🏪</span>
                <p>Nenhuma logo</p>
              </div>
            )}
          </div>
          <div className="loja-info-preview">
            <h4>{formData.nomeLoja || 'Nome da Loja'}</h4>
            <p>{formData.descricao || 'Descrição da loja aparecerá aqui...'}</p>
          </div>
        </div>
      </div>

      <MapSelector
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectAddress={handleSelectAddress}
        initialPosition={formData.coordinates}
      />
    </div>
  );
};

export default Loja;
