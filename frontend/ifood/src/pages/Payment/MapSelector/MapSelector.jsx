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

const LocationMarker = ({ position, setPosition, setCoordinates }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition = [lat, lng];
      setPosition(newPosition);
      setCoordinates({
        latitude: lat.toFixed(7),
        longitude: lng.toFixed(7)
      });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const MapSelector = ({ isOpen, onClose, onSelectCoordinates }) => {
  const [position, setPosition] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: '',
    longitude: ''
  });
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (coordinates.latitude && coordinates.longitude) {
      onSelectCoordinates({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: address || `Localização: ${coordinates.latitude}, ${coordinates.longitude}`
      });
      onClose();
    } else {
      alert('Por favor, selecione uma localização no mapa');
    }
  };

  const handleManualInput = () => {
    const lat = prompt('Digite a latitude (-90 a 90):');
    const lng = prompt('Digite a longitude (-180 a 180):');
    
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      if (latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
        const newPosition = [latNum, lngNum];
        setPosition(newPosition);
        setCoordinates({
          latitude: latNum.toFixed(7),
          longitude: lngNum.toFixed(7)
        });
        setAddress(`Coordenadas inseridas: ${lat}, ${lng}`);
      } else {
        alert('Coordenadas inválidas! Latitude: -90 a 90, Longitude: -180 a 180');
      }
    }
  };

  return (
    <div className="map-selector-overlay" onClick={onClose}>
      <div className="map-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="map-selector-header">
          <h3>Selecionar Localização de Entrega</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="map-selector-search">
          <input
            type="text"
            placeholder="Digite o endereço para referência..."
            className="search-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="search-hint">Clique no mapa para selecionar a localização exata</p>
        </div>

        <div className="map-container">
          <MapContainer
            center={[-22.7, -47.6]}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker
              position={position}
              setPosition={setPosition}
              setCoordinates={setCoordinates}
            />
          </MapContainer>
        </div>

        {coordinates.latitude && coordinates.longitude && (
          <div className="selected-address">
            <strong>Localização Selecionada:</strong>
            <p><strong>Latitude:</strong> {coordinates.latitude}</p>
            <p><strong>Longitude:</strong> {coordinates.longitude}</p>
            <p><strong>Endereço:</strong> {address || 'Localização selecionada no mapa'}</p>
          </div>
        )}

        <div className="map-selector-actions">
          <button className="manual-input-btn" onClick={handleManualInput}>
            Inserir Coordenadas Manualmente
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirmar Localização
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
