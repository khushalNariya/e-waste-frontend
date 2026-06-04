import React from "react";

export default function FacilityCard({ f, distance, onSelect, isSelected }) {
  return (
    <div
      className={`facility-card card mb-3 shadow-sm ${isSelected ? "active-card" : ""}`}
      onClick={() => onSelect([f.lat, f.lon])}
    >
      <div className="card-body">

        {/* TITLE + VERIFIED */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="fw-bold mb-0">{f.name}</h6>

          {f.verified === 1 && (
            <span className="badge bg-success-subtle text-success">
              <i className="bi bi-check-circle-fill me-1"></i>
              Verified
            </span>
          )}
        </div>

        {/* ADDRESS */}
        <p className="text-muted small mb-1">
          <i className="bi bi-geo-alt-fill me-2"></i>
          {f.address}
        </p>

        {/* PHONE */}
        <p className="text-muted small mb-1">
          <i className="bi bi-telephone-fill me-2"></i>
          {f.phone}
        </p>

        {/* TIME */}
        <p className="text-muted small mb-2">
          <i className="bi bi-clock-fill me-2"></i>
          {f.open_time}
        </p>

        {/* DISTANCE */}
        <div className="fw-bold text-primary mb-3">
          {distance} km away
        </div>

        {/* BUTTONS */}
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm w-100">
            <i className="bi bi-cursor-fill me-1"></i>
            Directions
          </button>

          <button className="btn btn-success btn-sm w-100">
            Book Recycling
          </button>
        </div>

      </div>
    </div>
  );
}
