// src/pages/Crew.tsx
import { Card } from '../components/Card';

export const Crew = () => {
  // Aquí definimos los datos de tu tripulación
  const crewMembers = [
    { 
      name: 'ALEX SHEPARD', 
      role: 'COMANDANTE', 
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' 
    },
    { 
      name: 'SARAH CONNOR', 
      role: 'INGENIERA', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' 
    },
    { 
      name: 'DR. HOUSE', 
      role: 'MÉDICO', 
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' 
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ borderBottom: '1px solid #e25822', paddingBottom: '10px', color: 'white' }}>
        👨‍🚀 Tripulación Activa
      </h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '20px', 
        flexWrap: 'wrap' // Esto permite que bajen a la siguiente línea si no caben
      }}>
        {/* Aquí usamos el .map que intentabas hacer */}
        {crewMembers.map((member) => (
          <Card 
            key={member.name}
            title={member.role}
            value={member.name}
            image={member.image}
          />
        ))}
      </div>
    </div>
  );
};
