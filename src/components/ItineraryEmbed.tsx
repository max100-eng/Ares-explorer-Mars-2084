import React, { useEffect, useRef } from "react";

const itineraryData = [
  {
    day: "DAY 1",
    title: "Arrival & Habitat Integration",
    place: "New Cydonia Spaceport / Habitat-7",
    coord: [10, 15],
    status: "SCHEDULED",
    desc: "Landing at New Cydonia Spaceport. Transfer to Habitat-7. Orientation and comprehensive briefing on Martian protocols, life support systems, and emergency procedures. Initial health and psychological evaluations."
  },
  {
    day: "DAY 1",
    title: "Acidalia Plains Rover Excursion",
    place: "Acidalia Planitia Outskirts",
    coord: [25, 30],
    status: "SCHEDULED",
    desc: "First surface excursion: guided pressurized rover tour of the immediate Acidalia Planitia region. Familiarization with Martian terrain, atmospheric conditions, and initial collection of environmental samples from designated safe zones."
  },
  {
    day: "DAY 2",
    title: "Ancient Cydonia Ruins Exploration",
    place: "Cydonia Mensae Sector Gamma",
    coord: [50, 60],
    status: "SCHEDULED",
    desc: "Full-day archaeological expedition to the Cydonia Mensae formations, famed for their 'Face on Mars' and other suspected ancient ruins. Detailed ground-penetrating radar scans and visual cataloging of surface anomalies."
  },
  {
    day: "DAY 2",
    title: "Geological Survey & Sample Collection",
    place: "Kasei Valles Proximal Site",
    coord: [70, 45],
    status: "SCHEDULED",
    desc: "Afternoon survey of nearby ancient riverbeds and geological formations believed to be part of the Kasei Valles system. Collection of rock and soil samples for exobiological analysis. Evening data analysis and debriefing at Habitat-7."
  },
  {
    day: "DAY 3",
    title: "Olympus Mons Observation",
    place: "Olympus Vista Point, Tharsis Rise Sector",
    coord: [85, 20],
    status: "SCHEDULED",
    desc: "Long-range telephoto imaging and spectroscopic analysis of the distant Olympus Mons from a designated observation point within the Tharsis Rise sector. Discussion on Martian geological history, volcanism, and future terraforming prospects."
  },
  {
    day: "DAY 3",
    title: "Departure Preparation & Souvenirs",
    place: "Habitat-7 Commissary / Spaceport",
    coord: [15, 10],
    status: "SCHEDULED",
    desc: "Final briefing for the return journey to Earth. Opportunity to visit the Habitat-7 commissary for approved Martian geological souvenirs and expedition merchandise. Comprehensive medical check-up and psychological assessment prior to boarding the Red Horizon Hauler."
  }
];

export default function ItineraryEmbed() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet if not already loaded
    if (!(window as any).L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([40, 0], 2);
      L.tileLayer("https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
        attribution: "© CARTO",
        maxZoom: 18
      }).addTo(map);

      itineraryData.forEach((item) => {
        L.circleMarker([item.coord[0], item.coord[1]], {
          radius: 6,
          fillColor: "#e25822",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        })
          .addTo(map)
          .bindPopup(`<strong style="color:#e25822;">${item.title}</strong><br/><em>${item.place}</em>`);
      });

      const coords = itineraryData.map(d => [d.coord[0], d.coord[1]]);
      if (coords.length) {
        try {
          map.fitBounds(coords, { padding: [40, 40] });
        } catch (e) {
          console.error("Error fitting bounds:", e);
        }
      }
    }
  }, []);

  return (
    <div style={{ width: "100%", background: "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('https://images.unsplash.com/photo-1614728853975-66630c56859f?q=80&w=2070')", backgroundSize: "cover", backgroundPosition: "center", color: "white", paddingTop: 20 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem", fontFamily: "Orbitron, sans-serif" }}>Ares Expedition Alpha: New Cydonia Recon</h1>
            <p style={{ margin: "6px 0 0 0", color: "#c2c2c2" }}>3 Days • CONFIRMED: 2084</p>
          </div>
          <button style={{ background: "#e25822", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            Exportar PDF
          </button>
        </header>

        <section style={{ paddingLeft: 20, paddingRight: 20 }}>
          {itineraryData.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(11, 13, 23, 0.8)", padding: 12, borderRadius: 8, marginBottom: 12, borderLeft: "3px solid #e25822" }}>
              <div style={{ minWidth: 140, flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: "#e25822", fontSize: "0.9rem" }}>{item.day}</div>
                <div style={{ marginTop: 6, color: "#cfcfcf", fontWeight: 600, fontSize: "0.95rem" }}>{item.title}</div>
                <div style={{ marginTop: 6, color: "#a9a9a9", fontSize: "0.85rem" }}>{item.place}</div>
                <div style={{ marginTop: 6, color: "#99aabb", fontSize: "0.8rem" }}>COORD: [{item.coord[0]}, {item.coord[1]}]</div>
                <div style={{ marginTop: 6, color: "#8866ee", fontSize: "0.8rem" }}>STATUS: {item.status}</div>
              </div>
              <div>
                <p style={{ color: "#ddd", fontSize: "0.9rem", lineHeight: 1.4, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <aside style={{ background: "rgba(226, 88, 34, 0.1)", borderLeft: "3px solid #e25822", padding: 12, borderRadius: 4, marginTop: 18, marginLeft: 20, marginRight: 20 }}>
          <h3 style={{ margin: "0 0 8px 0", fontFamily: "Orbitron, sans-serif" }}>Mission Critical Notices</h3>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.9rem" }}>
            <li style={{ marginTop: 6 }}>Always monitor suit pressure and oxygen reserves; Mars' atmosphere is lethal.</li>
            <li style={{ marginTop: 6 }}>Beware of sudden dust devils and larger Martian dust storms; seek immediate shelter in designated bunkers.</li>
            <li style={{ marginTop: 6 }}>Never venture beyond marked expedition routes without explicit permission and a fully charged comm-unit.</li>
            <li style={{ marginTop: 6 }}>Martian gravity is significantly lower; maintain situational awareness to prevent falls and equipment damage.</li>
            <li style={{ marginTop: 6 }}>Report any anomalies or structural damage to your habitat or rover immediately.</li>
          </ul>
        </aside>

        <section style={{ marginTop: 20, paddingLeft: 20, paddingRight: 20 }}>
          <h3 style={{ color: "white", fontFamily: "Orbitron, sans-serif" }}>Map (approximate coordinates)</h3>
          <div ref={mapRef} style={{ height: 360, borderRadius: 8, border: "1px solid #e25822", marginTop: 8 }} />
        </section>
      </div>
    </div>
  );
}
