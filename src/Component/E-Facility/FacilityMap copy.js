import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { fetchFacilities } from "./api";
import FacilityList from "./FacilityList";
import "./Facility.css";

// ================= ICONS =================
const greenIcon = new L.Icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png", iconSize: [25, 41], iconAnchor: [12, 41] });
const orangeIcon = new L.Icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png", iconSize: [25, 41], iconAnchor: [12, 41] });
const blueIcon = new L.Icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png", iconSize: [25, 41], iconAnchor: [12, 41] });
const bigGreenIcon = new L.Icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png", iconSize: [35, 55], iconAnchor: [17, 55] });

// ================= COMPONENTS =================
const MapAutoFocus = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 12, { duration: 1.5 });
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, [position, map]);
  return null;
};

// ====================== Routing ========================
const Routing = ({ from, to, setRouteInfo }) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    // Create the routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false, // Map ko har baar auto-zoom hone se rokne ke liye
      createMarker: () => null,
      lineOptions: { 
        styles: [{ color: 'blue', weight: 4, opacity: 0.6 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      }
    }).addTo(map);

    routingControl.on("routesfound", (e) => {
      const r = e.routes[0];
      setRouteInfo({ 
        km: (r.summary.totalDistance / 1000).toFixed(2), 
        min: Math.round(r.summary.totalTime / 60) 
      });
    });

    routingRef.current = routingControl;

    // cleanup function
    return () => {
      if (routingRef.current && map) {
        try {
          // Leaflet routing machine cleanup is tricky, 
          // we use try-catch to ignore internal null errors
          routingRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingRef.current);
        } catch (err) {
          console.warn("Routing cleanup error ignored:", err);
        }
      }
    };
  }, [map, from, to, setRouteInfo]);

  return null;
};


// ============================================================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ================= MAIN COMPONENT =================
export default function FacilityMap() {
  const [clientLocation, setClientLocation] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [facilities, setFacilities] = useState([]);

  // 1. Fetch Location Function
  const getUserLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setClientLocation([latitude, longitude]);
        // Console address details
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          console.log("📍 User Address:", data.display_name);
          console.log("🏙️ City:", data.address.city || data.address.town);
        } catch (e) { console.log("Geocoding failed"); }
      },
      () => setClientLocation([23.0225, 72.5714]), // Default to Ahmedabad
      { enableHighAccuracy: true }
    );
  };

  // 2. All Hooks at Top Level
  useEffect(() => {
    getUserLocation();
    fetchFacilities().then(res => setFacilities(res.data)).catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (!clientLocation || facilities.length === 0) return;
    let nearest = null;
    let minDist = 99999;
    facilities.forEach(f => {
      const d = calculateDistance(clientLocation[0], clientLocation[1], f.lat, f.lon);
      if (d < minDist) { minDist = d; nearest = [f.lat, f.lon]; }
    });
    setSelectedFacility(nearest);
  }, [clientLocation, facilities]);

  // 3. Conditional Rendering (Last step)
  if (!clientLocation) return <div className="text-center p-5"><h3>📍 Detecting your location...</h3></div>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT PANEL */}
      <div style={{ width: "30%", overflowY: "auto", borderRight: "1px solid #ddd" }}>
        <div className="p-2 bg-light border-bottom d-flex justify-content-between align-items-center">
            <h5 className="m-0">Facilities</h5>
            <button className="btn btn-sm btn-primary" onClick={getUserLocation}>📍 Refresh</button>
        </div>
        <FacilityList clientLocation={clientLocation} setSelectedFacility={setSelectedFacility} />
      </div>

      {/* MAP PANEL */}
      <div style={{ width: "70%", position: "relative" }}>
        <MapContainer center={clientLocation} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapAutoFocus position={selectedFacility} />
          
          <Marker position={clientLocation} icon={blueIcon}><Popup>You are here</Popup></Marker>
          
          {facilities.map((f, i) => (
            <Marker 
              key={i} 
              position={[f.lat, f.lon]} 
              icon={selectedFacility && selectedFacility[0] === f.lat ? bigGreenIcon : (f.verified ? greenIcon : orangeIcon)}
            >
              <Popup>{f.name}</Popup>
            </Marker>
          ))}

          {selectedFacility && <Routing from={clientLocation} to={selectedFacility} setRouteInfo={setRouteInfo} />}
        </MapContainer>

        {/* Route Info Overlay */}
        {routeInfo && (
          <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 1000, background: "#fff", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
            <b>Distance:</b> {routeInfo.km} km <br/>
            <b>Time:</b> {routeInfo.min} min
          </div>
        )}
      </div>
    </div>
  );
}