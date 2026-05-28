import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Newly created and isolated CSS for Home

const howItWorksSteps = [
  {
    icon: "🗑️",
    title: "Drop Your E-Waste",
    desc: "Bring your old electronics to our certified drop points spread across your city.",
  },
  {
    icon: "🔄",
    title: "We Connect You",
    desc: "We route your items safely to verified recyclers, ensuring zero landfill impact.",
  },
  {
    icon: "💰",
    title: "Earn Rewards",
    desc: "Get reward points for every contribution. Redeem them for discounts and perks!",
  },
];

const Home = () => {
  return (
    <div className="elocate-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="hero-title">
                Drop Smart. <br />
                Recycle Right. <br />
                <span>Build a Greener Tomorrow.</span>
              </h1>

              <p className="hero-subtitle">
                Find certified e-waste drop points near you and recycle responsibly. Welcome to E-Waste Drop & Recycling — your partner in sustainability.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                <Link to="/facilities" className="btn-primary-custom">
                  Find Nearest Facility
                </Link>
                <Link to="/learn-more" className="btn-outline-custom">
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="col-lg-6 text-center">
              <img
                src="/image/E_Waste_Management.png"
                alt="E-Waste Recycling Hero"
                className="img-fluid hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">A simple, transparent process to handle your e-waste responsibly.</p>

          <div className="row g-5 mt-3">
            {howItWorksSteps.map((step, index) => (
              <div className="col-md-4" key={index}>
                <div className="step-card">
                  <div className="step-icon">{step.icon}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      {/* Impact Stats Section */}
      <section className="impact-section">
        <div className="container">
          <h2 className="impact-title">
            Driving Sustainable E-Waste Solutions
          </h2>
          <p className="mb-5" style={{ maxWidth: "700px", margin: "0 auto", opacity: "0.9" }}>
            Together, we are reducing electronic waste and building a cleaner,
            more responsible future through certified recycling practices.
          </p>

          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="stat-number">12,000+</div>
              <div className="stat-label">KG E-Waste Recycled</div>
            </div>

            <div className="col-md-4 mb-4 mb-md-0">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Active Contributors</div>
            </div>

            <div className="col-md-4">
              <div className="stat-number">50+</div>
              <div className="stat-label">Certified Drop Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-desc">
            Join E-Waste Drop & Recycling today and take the first step towards a sustainable future. Don't let your old electronics end up in a landfill.
          </p>
          <Link to="/signup" className="btn-primary-custom">
            Join E-Waste Drop & Recycling
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
