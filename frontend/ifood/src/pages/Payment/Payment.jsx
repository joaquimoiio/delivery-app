import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MapSelector from './MapSelector/MapSelector';
import { useAuth } from '../../context/AuthContext';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    endereco: '',
    nuLatitude: '',
    nuLongitude: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const savedOrder = localStorage.getItem('currentOrder');
    if (!savedOrder) {
      navigate('/');
      return;
    }

    setOrderData(JSON.parse(savedOrder));
  }, [isLoggedIn, navigate]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleSelectCoordinates = (coordinatesData) => {
    setDeliveryData(prev => ({
      ...prev,
      nuLatitude: coordinatesData.latitude,
      nuLongitude: coordinatesData.longitude,
      endereco: coordinatesData.address || 'Endereço selecionado no mapa'
    }));
  };

  const handleCoordinateChange = (field, value) => {
    // Validação para coordenadas
    const coordenadaRegex = /^-?\d*\.?\d*$/;
    if (value !== '' && !coordenadaRegex.test(value)) {
      return;
    }
    
    setDeliveryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFinalizePurchase = () => {
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento');
      return;
    }

    if (!deliveryData.nuLatitude || !deliveryData.nuLongitude) {
      alert('Informe as coordenadas de entrega');
      return;
    }

    // Validar coordenadas
    const lat = parseFloat(deliveryData.nuLatitude);
    const lng = parseFloat(deliveryData.nuLongitude);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      alert('Latitude deve estar entre -90 e 90');
      return;
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      alert('Longitude deve estar entre -180 e 180');
      return;
    }

    const finalOrder = {
      ...orderData,
      paymentMethod,
      delivery: deliveryData,
      orderId: Date.now(),
      status: 'Confirmado'
    };

    console.log('Pedido finalizado:', finalOrder);
    localStorage.removeItem('currentOrder');
    alert('Pedido realizado com sucesso!');
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!orderData) {
    return (
      <div className="payment-page">
        <Navbar />
        <div className="loading-container">
          <p>Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Navbar />
      
      <div className="payment-content">
        <div className="payment-container">
          <h1>Finalizar Pagamento</h1>
          
          {/* Resumo do Pedido */}
          <div className="order-summary">
            <h2>Resumo do Pedido</h2>
            <div className="order-item">
              <img src={orderData.product.imagem} alt={orderData.product.nome} />
              <div className="item-details">
                <h3>{orderData.product.nome}</h3>
                <p>Quantidade: {orderData.quantity}</p>
                <p>Preço unitário: {formatPrice(orderData.product.valor)}</p>
                {orderData.observacao && (
                  <p className="observation"><strong>Observações:</strong> {orderData.observacao}</p>
                )}
                <p className="total-price">Total: {formatPrice(orderData.total)}</p>
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="delivery-section">
            <h2>Endereço de Entrega</h2>
            
            <div className="address-input-group">
              <input
                type="text"
                placeholder="Digite seu endereço de referência"
                value={deliveryData.endereco}
                onChange={(e) => setDeliveryData(prev => ({...prev, endereco: e.target.value}))}
                className="address-input"
              />
              <button className="map-btn" onClick={handleOpenMap}>
                📍 Selecionar no Mapa
              </button>
            </div>
            
            <div className="coordinates-section">
              <h4>Coordenadas de Entrega</h4>
              <div className="coordinates-grid">
                <div className="coordinate-field">
                  <label>Latitude</label>
                  <input
                    type="text"
                    placeholder="Ex: -22.7000000"
                    value={deliveryData.nuLatitude}
                    onChange={(e) => handleCoordinateChange('nuLatitude', e.target.value)}
                    className="coordinate-input"
                  />
                  <span className="coordinate-help">Entre -90 e 90</span>
                </div>
                
                <div className="coordinate-field">
                  <label>Longitude</label>
                  <input
                    type="text"
                    placeholder="Ex: -47.6000000"
                    value={deliveryData.nuLongitude}
                    onChange={(e) => handleCoordinateChange('nuLongitude', e.target.value)}
                    className="coordinate-input"
                  />
                  <span className="coordinate-help">Entre -180 e 180</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="payment-methods">
            <h2>Forma de Pagamento</h2>
            
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'pix' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-icon">💳</span>
                  <span>PIX</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'debito' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="debito"
                  checked={paymentMethod === 'debito'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-icon">💳</span>
                  <span>Cartão de Débito</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'credito' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="credito"
                  checked={paymentMethod === 'credito'}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                />
                <div className="payment-info">
                  <span className="payment-icon">💳</span>
                  <span>Cartão de Crédito</span>
                </div>
              </label>
            </div>
          </div>

          <button className="finalize-btn" onClick={handleFinalizePurchase}>
            Finalizar Pedido - {formatPrice(orderData.total)}
          </button>
        </div>
      </div>

      {isMapOpen && (
        <MapSelector
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onSelectCoordinates={handleSelectCoordinates}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Payment;
