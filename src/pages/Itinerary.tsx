// src/pages/Itinerary.tsx
import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { callGemini } from '../services/apiBridge';

type ItineraryEntry = {
  dayLabel: string;
  title: string;
  description: string;
  status: string;
  coord: [number, number];
  location: string;
};

type ItineraryData = {
  title: string;
  duration: string;
  year: number;
  entries: ItineraryEntry[];
  notices: string[];
};

export const Itinerary = () => {
  const [data, setData] = useState<ItineraryData | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Fetch the JSON from public folder
    fetch('/data/itineraries.json')
      .then((res) => res.json())
      .then((json: ItineraryData) => setData(json))
      .catch((err) => console.error('Failed to load itinerary JSON', err));
  }, []);

  useEffect(() => {
    if (!data || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // initialize map
    const center: [number, number] = data.entries.length ? data.entries[0].coord : [0, 0];
    const map = L.map(mapContainerRef.current).setView([center[0], center[1]], 4);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO'
    }).addTo(map);

    // add markers
    data.entries.forEach((e) => {
      const marker = L.circleMarker([e.coord[0], e.coord[1]], {
        radius: 6,
        fillColor: '#e25822',
        color: 'white',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.8
      }).addTo(map);
      marker.bindPopup(`<strong>${e.title}</strong><br/>${e.location}`);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [data]);

  const exportPdf = async () => {
    const el = document.getElementById('itinerary-root');
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('itinerary.pdf');
  };

  if (!data) return <div style={{ padding: 20, color: '#cfcfcf' }}>Cargando itinerario…</div>;

  return (
    <main style={{ padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', marginBottom: 6 }}>{data.title}</h1>
          <div style={{ color: '#c2c2c2', marginBottom: 16 }}>{data.duration} • CONFIRMED: {data.year}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={exportPdf} style={{ background: '#e25822', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>
            Exportar PDF
          </button>
          <button onClick={async () => {
            try {
              const resp = await callGemini('Genera un resumen corto del itinerario en estilo de guía turística', { mock: true });
              // show in alert for quick test
              alert(JSON.stringify(resp, null, 2));
            } catch (err) {
              alert('Error calling mock API: ' + String(err));
            }
          }} style={{ background: '#2b2b2b', color: 'white', border: '1px solid #e25822', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>
            Probar AI (mock)
          </button>
        </div>
      </header>

      <div id="itinerary-root">
        <section aria-labelledby="itinerary-list">
          <div style={{ display: 'grid', gap: 12 }} id="itinerary-list">
            {data.entries.map((e, idx) => (
              <article key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(11,13,23,0.6)', padding: 12, borderRadius: 8 }}>
                <div style={{ minWidth: 140 }}>
                  <div style={{ fontWeight: 700, color: '#e25822' }}>{e.dayLabel}</div>
                  <div style={{ marginTop: 6, color: '#cfcfcf', fontWeight: 600 }}>{e.title}</div>
                  <div style={{ marginTop: 6, color: '#a9a9a9' }}>{e.location}</div>
                  <div style={{ marginTop: 6, color: '#9aa' }}>COORD: [{e.coord[0]}, {e.coord[1]}]</div>
                  <div style={{ marginTop: 6, color: '#86e' }}>STATUS: {e.status}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ color: '#ddd', margin: 0 }}>{e.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside style={{ marginTop: 18 }}>
          <h3 style={{ color: 'white' }}>Mission Critical Notices</h3>
          <ul style={{ color: '#d1d1d1' }}>
            {data.notices.map((n, i) => (
              <li key={i} style={{ marginTop: 8 }}>{n}</li>
            ))}
          </ul>
        </aside>

        <section style={{ marginTop: 20 }}>
          <h3 style={{ color: 'white' }}>Map (approximate coordinates)</h3>
          <div ref={mapContainerRef} id="itinerary-map" style={{ height: 360, borderRadius: 8, overflow: 'hidden', marginTop: 8 }} />
        </section>
      </div>
    </main>
  );
};

export default Itinerary;
