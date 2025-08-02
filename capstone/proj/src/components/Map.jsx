import React, { useState } from 'react';

const Map = () => {
  const [mapView, setMapView] = useState('map');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [zoom, setZoom] = useState(14); // eslint-disable-line no-unused-vars

  const properties = [
    {
      id: 1,
      title: 'RHU Animal Bite Treatment Center',
      price: 'Free',
      sqm: '500',
      type: 'Medical Center',
      location: 'Poblacion, Bogo City',
      coordinates: { x: '50%', y: '50%' },
      image: '🏥'
    },
    {
      id: 2,
      title: 'Barangay Health Station',
      price: 'Free',
      sqm: '200',
      type: 'Clinic',
      location: 'Barangay 1, Bogo City',
      coordinates: { x: '30%', y: '40%' },
      image: '🏥'
    },
    {
      id: 3,
      title: 'Emergency Response Unit',
      price: 'Free',
      sqm: '300',
      type: 'Emergency',
      location: 'Barangay 2, Bogo City',
      coordinates: { x: '70%', y: '35%' },
      image: '🚑'
    },
    {
      id: 4,
      title: 'Vaccination Center',
      price: 'Free',
      sqm: '250',
      type: 'Vaccination',
      location: 'Barangay 3, Bogo City',
      coordinates: { x: '25%', y: '60%' },
      image: '💉'
    },
    {
      id: 5,
      title: 'Animal Control Office',
      price: 'Free',
      sqm: '150',
      type: 'Animal Control',
      location: 'Barangay 4, Bogo City',
      coordinates: { x: '75%', y: '65%' },
      image: '🐕'
    }
  ];

  const neighborhoods = [
    { name: 'POBLACION', x: '25%', y: '22%' },
    { name: 'BARANGAY 1', x: '55%', y: '22%' },
    { name: 'BARANGAY 2', x: '85%', y: '22%' },
    { name: 'BARANGAY 3', x: '25%', y: '52%' },
    { name: 'BARANGAY 4', x: '55%', y: '52%' },
    { name: 'BARANGAY 5', x: '85%', y: '52%' },
    { name: 'BARANGAY 6', x: '25%', y: '82%' },
    { name: 'BARANGAY 7', x: '55%', y: '82%' },
    { name: 'BARANGAY 8', x: '85%', y: '82%' },
    { name: 'BOGO CITY', x: '50%', y: '95%' }
  ];

  const handleZoom = (direction) => {
    setZoom(prev => Math.max(10, Math.min(18, prev + direction)));
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="content-section">
      {/* Top Navigation Bar */}
      <div style={{
        backgroundColor: '#f5f5dc',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px 8px 0 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          Filtros ▼
        </button>
        <button style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          LIST
        </button>
      </div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f8f9fa',
        overflow: 'hidden'
      }}>
        
        {/* Map Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: mapView === 'satellite' 
            ? 'linear-gradient(45deg, #2d5a2d 25%, #1a3d1a 25%, #1a3d1a 50%, #2d5a2d 50%, #2d5a2d 75%, #1a3d1a 75%)'
            : 'linear-gradient(45deg, #e8f5e8 25%, #d4e8d4 25%, #d4e8d4 50%, #e8f5e8 50%, #e8f5e8 75%, #d4e8d4 75%)',
          backgroundSize: '60px 60px',
          opacity: 0.3
        }} />

        {/* Major Roads */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '80%',
          height: '3px',
          backgroundColor: mapView === 'satellite' ? '#4a4a4a' : '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '80%',
          height: '3px',
          backgroundColor: mapView === 'satellite' ? '#4a4a4a' : '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />
        <div style={{
          position: 'absolute',
          top: '80%',
          left: '10%',
          width: '80%',
          height: '3px',
          backgroundColor: mapView === 'satellite' ? '#4a4a4a' : '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '30%',
          width: '3px',
          height: '80%',
          backgroundColor: mapView === 'satellite' ? '#4a4a4a' : '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '70%',
          width: '3px',
          height: '80%',
          backgroundColor: mapView === 'satellite' ? '#4a4a4a' : '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }} />

        {/* Secondary Roads */}
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '20%',
          width: '20%',
          height: '2px',
          backgroundColor: mapView === 'satellite' ? '#666' : '#e0e0e0'
        }} />
        <div style={{
          position: 'absolute',
          top: '65%',
          left: '60%',
          width: '25%',
          height: '2px',
          backgroundColor: mapView === 'satellite' ? '#666' : '#e0e0e0'
        }} />

        {/* Neighborhoods */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '45%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '75%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '15%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '45%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '75%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '15%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '45%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '75%',
          width: '20%',
          height: '15%',
          backgroundColor: mapView === 'satellite' ? '#1a1a1a' : '#f0f0f0',
          border: `1px solid ${mapView === 'satellite' ? '#333' : '#ddd'}`,
          borderRadius: '4px'
        }} />

        {/* Parks and Open Areas */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '15%',
          height: '20%',
          backgroundColor: mapView === 'satellite' ? '#2d5a2d' : '#d4e8d4',
          border: `1px solid ${mapView === 'satellite' ? '#1a3d1a' : '#b8d4b8'}`,
          borderRadius: '8px'
        }} />

        {/* Neighborhood Labels */}
        {neighborhoods.map((neighborhood, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: neighborhood.x,
              top: neighborhood.y,
              fontSize: '10px',
              color: mapView === 'satellite' ? '#ffffff' : '#333',
              fontWeight: '600',
              textShadow: mapView === 'satellite' ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)',
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap'
            }}
          >
            {neighborhood.name}
          </div>
        ))}

        {/* Property Markers */}
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              position: 'absolute',
              left: property.coordinates.x,
              top: property.coordinates.y,
              width: '12px',
              height: '12px',
              backgroundColor: '#dc2626',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 10,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            onClick={() => handleMarkerClick(property)}
          />
        ))}

        {/* Map View Toggle */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          gap: '2px'
        }}>
          <button 
            onClick={() => setMapView('map')}
            style={{
              padding: '8px 12px',
              backgroundColor: mapView === 'map' ? 'white' : '#666',
              color: mapView === 'map' ? '#333' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            Map
          </button>
          <button 
            onClick={() => setMapView('satellite')}
            style={{
              padding: '8px 12px',
              backgroundColor: mapView === 'satellite' ? 'white' : '#666',
              color: mapView === 'satellite' ? '#333' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            Satellite
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <button 
            onClick={() => handleZoom(1)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            +
          </button>
          <button 
            onClick={() => handleZoom(-1)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            −
          </button>
        </div>

        {/* Street View Control */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '60px',
          width: '32px',
          height: '32px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '16px'
        }}>
          👤
        </div>

        {/* Full Screen Control */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '32px',
          height: '32px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '16px'
        }}>
          ⛶
        </div>

        {/* Property Info Window */}
        {selectedProperty && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #ddd',
            maxWidth: '280px',
            zIndex: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>{selectedProperty.title}</h3>
              <button 
                onClick={() => setSelectedProperty(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              width: '100%',
              height: '120px',
              backgroundColor: '#f0f0f0',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              {selectedProperty.image}
            </div>
            
            <div style={{ fontSize: '14px', color: '#666' }}>
              <div style={{ marginBottom: '4px' }}><strong>Type:</strong> {selectedProperty.type}</div>
              <div style={{ marginBottom: '4px' }}><strong>Location:</strong> {selectedProperty.location}</div>
              <div style={{ marginBottom: '4px' }}><strong>Size:</strong> {selectedProperty.sqm} sqm</div>
              <div><strong>Service:</strong> {selectedProperty.price}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map; 