import './MapDashboard.css';
import React, { useEffect, useState } from 'react';
import './App.css';



const buildings = [
  { name: 'Alwyn Hall', left: '42.6%', top: '72.1%' },
  { name: 'Beech Glade', left: '82.3%', top: '92.5%' },
  { name: 'Bowers Building', left: '50.9%', top: '74.8%' },
  { name: 'Burma Road Student Village', left: '51.8%', top: '56.2%' },
  { name: 'Centre for Sport', left: '54.5%', top: '80.1%' },
  { name: 'Chapel', left: '64.4%', top: '65.3%' },
  { name: 'The Cottage', left: '53.9%', top: '61.2%' },
  { name: 'Fred Wheeler Building', left: '56.8%', top: '73.0%' },
  { name: 'Herbert Jarman Building', left: '59.1%', top: '62.7%' },
  { name: 'Holm Lodge', left: '73.9%', top: '31.0%' },
  { name: 'Kenneth Kettle Building', left: '57.1%', top: '66.7%' },
  { name: 'King Alfred Centre', left: '79.7%', top: '63.6%' },
  { name: 'Martial Rose Library', left: '63.9%', top: '70.8%' },
  { name: 'Masters Lodge', left: '5.5%', top: '35.0%' },
  { name: 'Medecroft', left: '89.2%', top: '95.4%' },
  { name: 'Medecroft Annexe', left: '96.7%', top: '93.6%' },
  { name: 'Paul Chamberlain Building', left: '49.3%', top: '80.4%' },
  { name: 'Queen’s Road Student Village', left: '34.8%', top: '65.3%' },
  { name: 'St Alphege', left: '72.6%', top: '72.5%' },
  { name: 'St Edburga', left: '69.3%', top: '69.5%' },
  { name: 'St Elizabeth’s Hall', left: '80.9%', top: '48.7%' },
  { name: 'St Grimbald’s Court', left: '80.9%', top: '54.9%' },
  { name: 'St James’ Hall', left: '78.3%', top: '40.5%' },
  { name: 'St Swithun’s Lodge', left: '49.3%', top: '61.0%' },
  { name: 'The Stripe', left: '76.9%', top: '75.7%' },
  { name: 'Business School', left: '11.0%', top: '29.3%' },
  { name: 'Tom Atkinson Building', left: '60.4%', top: '72.4%' },
  { name: 'West Downs Centre', left: '24.1%', top: '23.8%' },
  { name: 'West Downs Student Village', left: '15.6%', top: '9.5%' },
  { name: 'Winton Building', left: '70.1%', top: '64.1%' },
  { name: 'Students’ Union', left: '79.4%', top: '70.7%' }
];

function MapDashboard({ wardens }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // 🔁 force re-render every 60s
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getWardenInfo = (building) => {
    const today = new Date().toDateString();
    const record = wardens.find((w) => {
      const loggedDate = new Date(w.time_logged).toDateString();
      return w.location === building && loggedDate === today;
    });

if (record) {
  const minsAgo = Math.round((new Date() - new Date(record.time_logged)) / 60000);
  return {
    status: 'active',
    name: record.full_name,
    minsAgo
  };
}

    return { status: 'inactive' };
  };

  return (
    <div className="map-dashboard">
      <h2>Fire Warden Location Map</h2>
      <div className="map-wrapper">
        <img src="/campus_map.png" alt="Campus Map" className="campus-map" />
        {buildings.map((b, idx) => {
          const info = getWardenInfo(b.name);
          return (
            <div
              key={idx}
              className={`map-dot ${info.status}`}
              style={{ top: b.top, left: b.left }}
              title={
                info.status === 'active'
                  ? `${b.name}\n${info.name}\n${info.minsAgo} minutes ago`
                  : `${b.name}\nNo warden assigned`
              }
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default MapDashboard;
