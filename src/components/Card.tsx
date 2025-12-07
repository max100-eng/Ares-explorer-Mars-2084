// src/components/Card.tsx
type CardProps = {
  title: string;
  value: string;
  image?: string; // El "?" significa que es opcional (las tarjetas del dashboard no la usarán)
};

export const Card = ({ title, value, image }: CardProps) => {
  return (
    <div style={{ 
      border: '1px solid #333', 
      padding: '20px', 
      borderRadius: '8px', 
      backgroundColor: '#111', 
      minWidth: '200px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Si hay imagen, la mostramos. Si no, no hacemos nada. */}
      {image && (
        <img 
          src={image} 
          alt={value} 
          style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            marginBottom: '15px', 
            objectFit: 'cover', 
            border: '2px solid #e25822' 
          }} 
        />
      )}
      
      <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#888', letterSpacing: '1px' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
        {value}
      </p>
    </div>
  );
};
