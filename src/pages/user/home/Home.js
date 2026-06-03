import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHowItWorks, get_Home_Hero_Image } from "../../../services/user-api/API_Service";
import "./Home.css";

const Home = () => {

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState(null);


  useEffect(() => {

    // How_It_Work
    getHowItWorks()
      .then(res => {
        setSteps(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching how it works:", err);
        setLoading(false);
      });

    // Hero_Image
    get_Home_Hero_Image()
      .then(res => {
        if (res.data.length > 0) {
          setHeroImage(res.data[0].image);
        }
      })
      .catch(err => {
        console.error("Hero image error:", err);
      });

  }, []);

  return (
    <div className="elocate-home">

      {/* ================= HERO SECTION (UNCHANGED) ================= */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="hero-title">
                Drop Smart. <br />
                Recycle Right. <br />
                <span>Build a Greener Tomorrow.</span>
              </h1>

              <p className="hero-subtitle">
                Find certified e-waste drop points near you and recycle responsibly.
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

            <div className="col-lg-6 text-center">
              <img
                src={heroImage}
                alt="E-Waste Recycling Hero"
                className="img-fluid hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (DYNAMIC) ================= */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="badge-pill-modern">Our Process</span>
            <h2 className="section-title mt-3">How It Works</h2>
            <p className="section-subtitle">
              A simple, transparent process to handle your e-waste responsibly.
            </p>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="row g-4 mt-2">
              {steps.map((step, index) => (
                <div className="col-md-4" key={step.id}>
                  <div className="step-card-modern">
                    <div className="step-bg-number">{index + 1}</div>

                    <div className="step-icon-wrapper">
                      <i className={step.icon}></i>
                    </div>

                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-desc">{step.description}</p>
                    </div>

                    <div className="step-arrow-icon d-none d-lg-block">
                      {index < steps.length - 1 && (
                        <i className="bi bi-chevron-right"></i>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= IMPACT SECTION (UNCHANGED) ================= */}
      <section className="impact-section">
        <div className="container">
          <h2 className="impact-title">
            Driving Sustainable E-Waste Solutions
          </h2>

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

      {/* ================= CTA SECTION (UNCHANGED) ================= */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-desc">
            Join E-Waste Drop & Recycling today and take the first step towards a sustainable future.
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