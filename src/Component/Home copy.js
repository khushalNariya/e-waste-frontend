import React from "react";
import { Link } from "react-router-dom";
// import "./Home.css";

const features = [
  { icon: "♻️", title: "Certified Recycling", desc: "Verified & government-approved e-waste facilities." },
  { icon: "📍", title: "Smart Finder", desc: "Locate the nearest recycling center instantly." },
  { icon: "📚", title: "Awareness Hub", desc: "Learn sustainable e-waste disposal practices." },
  { icon: "🎁", title: "Reward System", desc: "Earn credits for responsible recycling." },
  { icon: "📊", title: "Facility Dashboard", desc: "Advanced tools for recycling partners." },
  { icon: "🌱", title: "Green Future", desc: "Together towards sustainability." },
];

const Home = () => {
  return (
    <>
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-md-6 text-center text-md-start">
            <p className="hero-subtitle">
              Welcome to E-Waste — Powering a Greener Tomorrow
            </p>

            <h1 className="hero-title">
              Your Strategic Partner for Innovative <br />
              <span className="text-green">E-Waste Solutions</span>
            </h1>

            <p className="hero-description">
              Discover certified e-waste recycling facilities near you and
              contribute to a cleaner, safer, and more sustainable future.
            </p>

            <div className="hero-buttons">
              <Link to="#" className="btn btn-success me-3">
                Find Nearest Facility
              </Link>
              <Link to="#" className="btn btn-outline-success">
                Start Recycling
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center mt-4 mt-md-0">
            <img
              src="/image/E_Waste_Management.png"
              alt="Hero"
              className="img-fluid hero-image"
            />
          </div>

        </div>
      </div>
    </section>
     <section className="features-section pt-0">
        <div className="container text-center pt-0">
          <h2 className="fw-bold mb-2">Why Choose E-Waste ?</h2>
          <p className="text-muted mb-5">
            Smart solutions designed for responsible e-waste management
          </p>

          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="feature-card animate-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h5 className="fw-bold mt-3">{f.title}</h5>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
