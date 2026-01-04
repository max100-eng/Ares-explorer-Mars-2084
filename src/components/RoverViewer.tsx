// /src/components/RoverViewer.tsx
import { useEffect, useState } from "react";
import { getRoverData } from "../api/roverApi";

interface RoverPhoto {
  id: number;
  img_src: string;
  earth_date: string;
}

export default function RoverViewer() {
  const [photos, setPhotos] = useState<RoverPhoto[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRoverData();
        setPhotos(data.latest_photos || []);
      } catch (error) {
        console.error("Error al cargar fotos del rover:", error);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2>Últimas fotos del Rover Curiosity</h2>

      {photos.length === 0 && <p>Cargando...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {photos.map((p) => (
          <div key={p.id}>
            <img src={p.img_src} alt="Mars" width="100%" />
            <p>{p.earth_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
