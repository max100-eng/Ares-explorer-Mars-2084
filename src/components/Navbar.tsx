// src/components/Navbar.tsx
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#0a0a0a',
      borderBottom: '2px solid #e25822',
      boxShadow: '0 4px 12px rgba(226, 88, 34, 0.15)'
    }}>
      <h2
        style={{
          margin: 0,
          color: 'white',
          cursor: 'pointer',
          fontSize: '1.4rem',
          fontWeight: 700
        }}
        onClick={() => navigate('/')}
      >
        🚀 ARES EXPLORER
      </h2>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#c2c2c2',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e25822';
            e.currentTarget.style.backgroundColor = 'rgba(226, 88, 34, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#c2c2c2';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Misión
        </button>

        <button
          onClick={() => navigate('/crew')}
          style={{
            background: 'transparent',
            color: '#c2c2c2',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e25822';
            e.currentTarget.style.backgroundColor = 'rgba(226, 88, 34, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#c2c2c2';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Tripulación
        </button>
        <button
          onClick={() => navigate('/itinerario')}
          style={{
            background: 'transparent',
            color: '#c2c2c2',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e25822';
            e.currentTarget.style.backgroundColor = 'rgba(226, 88, 34, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#c2c2c2';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Itinerario
        </button>

        <button
          onClick={() => navigate('/spacecraft')}
          style={{
            background: '#e25822',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d04015';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 88, 34, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e25822';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Naves
        </button>
      </div>
    </nav>
  );
};