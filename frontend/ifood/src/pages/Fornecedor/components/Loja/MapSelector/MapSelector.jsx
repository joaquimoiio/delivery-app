import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSelector.css';

// Fix para os ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      // Geocoding reverso para obter o endereço
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(error => console.error('Erro ao buscar endereço:', error));
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({ isOpen, onClose, onSelectAddress, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || [-3.1190, -60.0217]); // Manaus como padrão
  const [selectedAddress, setSelectedAddress] = useState('');
  const mapRef = useRef();

  const handleConfirm = () => {
    if (position && selectedAddress) {
      onSelectAddress({
        address: selectedAddress,
        coordinates: position
      });
      onClose();
    } else {
      alert('Por favor, clique no mapa para selecionar um endereço');
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        setSelectedAddress(display_name);
        
        // Centralizar o mapa na nova posição
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 15);
        }
      } else {
        alert('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao buscar endereço');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="map-selector-overlay">
      <div className="map-selector-modal">
        <div className="map-selector-header">
          <h3>Selecionar Endereço</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="map-selector-search">
          <input
            type="text"
            placeholder="Digite um endereço para buscar..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.target.value);
              }
            }}
            className="search-input"
          />
          <p className="search-hint">Ou clique no mapa para selecionar uma localização</p>
        </div>

        <div className="map-container">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker 
              position={position} 
              setPosition={setPosition}
              setAddress={setSelectedAddress}
            />
          </MapContainer>
        </div>

        {selectedAddress && (
          <div className="selected-address">
            <strong>Endereço selecionado:</strong>
            <p>{selectedAddress}</p>
          </div>
        )}

        <div className="map-selector-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirmar Endereço
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
