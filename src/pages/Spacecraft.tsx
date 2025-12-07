// src/pages/Spacecraft.tsx
import { Card } from '../components/Card';

export const Spacecraft = () => {
  const spacecraft = [
    {
      name: 'HERMES IX',
      role: 'TRANSBORDADOR DE CARGA',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=150&h=150&fit=crop'
    },
    {
      name: 'ARES LANDER',
      role: 'MÓDULO DE ATERRIZAJE',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002edc5?w=150&h=150&fit=crop'
    },
    {
      name: 'ODYSSEY',
      role: 'EXPLORADOR ORBITAL',
      image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=150&h=150&fit=crop'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ borderBottom: '1px solid #e25822', paddingBottom: '10px', color: 'white' }}>
        🚀 Naves Disponibles
      </h2>

      <div style={{
        display: 'flex',
        gap: '20px',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        {spacecraft.map((ship) => (
          <Card
            key={ship.name}
            title={ship.role}
            value={ship.name}
            image={ship.image}
          />
        ))}
      </div>

      <p style={{ marginTop: '20px', color: '#c2c2c2' }}>
        Todas las naves están operacionales y listas para el despegue.
      </p>
    </div>
  );
};
