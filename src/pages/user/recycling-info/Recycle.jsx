import React, { useEffect, useState } from "react";
import { fetchRecycle } from "./api";
import "./Recycle.css";

const WHY_FEATURES = [
  {
    icon: "fa-certificate",
    title: "Certified Process",
    desc: "All recycling follows strict environmental standards and compliance protocols.",
    color: "#2e7d32",
    lightBg: "#e8f5e9",
  },
  {
    icon: "fa-lock",
    title: "Data Security",
    desc: "Guaranteed destruction of personal data on all your electronic devices.",
    color: "#1565c0",
    lightBg: "#e3f2fd",
  },
  {
    icon: "fa-gem",
    title: "Resource Recovery",
    desc: "Maximum extraction of valuable materials from your electronic waste.",
    color: "#e65100",
    lightBg: "#fff3e0",
  },
  {
    icon: "fa-bolt",
    title: "Effortless Process",
    desc: "Simple booking makes recycling your electronics quick and convenient.",
    color: "#6a1b9a",
    lightBg: "#f3e5f5",
  },
];

export default function Recycle() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState({});

  useEffect(() => {
    fetchRecycle()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const toggleDesc = (id) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rp-page">
      {/* ═══ HERO ═══ */}
      <section className="rp-hero">
        <div className="container">
          <div className="rp-hero-inner text-center">
            <span className="rp-badge">
              <i className="fa-solid fa-recycle me-2" />
              E-Waste Recycling Solutions
            </span>
            <h1 className="rp-hero-title">
              Sustainable Electronics <br />
              <span className="rp-hero-highlight">Recycling Solutions</span>
            </h1>
            <p className="rp-hero-sub">
              Choose the right recycling option for your electronic devices and
              contribute to a cleaner, greener planet.
            </p>
            {/* Quick stats row */}
            <div className="rp-stats-row">
              {[
                { n: "50,000+", l: "Devices Recycled" },
                { n: "120 T", l: "CO₂ Saved" },
                { n: "99%", l: "Data Destroyed" },
                { n: "200+", l: "Partner Facilities" },
              ].map((s, i) => (
                <div className="rp-stat" key={i}>
                  <strong>{s.n}</strong>
                  <span>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* wave */}
        <div className="rp-wave">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path
              d="M0,60 C480,100 960,20 1440,60 L1440,90 L0,90 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ═══ CARDS ═══ */}
      <section className="rp-cards-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="rp-eyebrow">What We Recycle</span>
            <h2 className="rp-section-title">Recycling Options Available</h2>
            <p className="rp-section-sub">
              Find the perfect recycling method for each type of e-waste you
              have.
            </p>
          </div>

          <div className="row g-4">
            {loading
              ? [1, 2, 3].map((n) => (
                  <div className="col-md-6 col-lg-4" key={n}>
                    <div className="rp-skel" />
                  </div>
                ))
              : data.map((item, idx) => (
                  <div className="col-md-6 col-lg-4 d-flex" key={item.id}>
                    <div className="rp-card w-100">
                      {/* step number */}
                      <div className="rp-card-stepnum">0{idx + 1}</div>

                      {/* icon area */}
                      <div className="rp-card-top">
                        <div className="rp-icon-wrap">
                          <i className={`fa-solid ${item.icon}`} />
                        </div>
                      </div>

                      {/* content */}
                      <div className="rp-card-content">
                        <h5 className="rp-card-title">{item.title}</h5>

                        <div
                          className={`rp-card-desc ${
                            expandedDesc[item.id] ? "expanded" : ""
                          }`}
                        >
                          {expandedDesc[item.id]
                            ? item.description
                            : item.description?.length > 100
                            ? item.description.substring(0, 100) + "..."
                            : item.description}
                          {item.description?.length > 100 && (
                            <button
                              type="button"
                              className="rp-read-more-btn"
                              onClick={() => toggleDesc(item.id)}
                            >
                              {expandedDesc[item.id] ? "Read Less" : "Read More"}
                            </button>
                          )}
                        </div>

                        <div className="rp-info-rows">
                          <div className="rp-info-row">
                            <span className="rp-info-chip">
                              <i className="fa-solid fa-gears" /> Recycling
                              Process
                            </span>
                            <p>{item.process}</p>
                          </div>

                          <div className="rp-info-row">
                            <span className="rp-info-chip">
                              <i className="fa-solid fa-triangle-exclamation" />{" "}
                              Instructions
                            </span>
                            <p>{item.instruction}</p>
                          </div>

                          <div className="rp-info-row">
                            <span className="rp-info-chip">
                              <i className="fa-solid fa-leaf" /> Benefits
                            </span>
                            <p>{item.benefits}</p>
                          </div>
                        </div>

                        <button className="rp-card-btn">
                          {item.button_text}
                          <i className="fa-solid fa-arrow-right ms-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY SECTION ═══ */}
      <section className="rp-why-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="rp-eyebrow rp-eyebrow-light">Why Choose Us</span>
            <h2 className="rp-why-title">
              Why Recycle With{" "}
              <span className="rp-why-brand">E-Waste Recycling?</span>
            </h2>
            <p className="rp-why-sub">
              Our comprehensive approach ensures responsible handling of your
              electronic waste.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {WHY_FEATURES.map((f, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="rp-why-card text-center h-100">
                  <div
                    className="rp-why-icon"
                    style={{ background: f.lightBg, color: f.color }}
                  >
                    <i className={`fa-solid ${f.icon}`} />
                  </div>
                  <h6 className="rp-why-card-title">{f.title}</h6>
                  <p className="rp-why-card-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="rp-cta-section text-center">
        <div className="container">
          <i className="fa-solid fa-recycle rp-cta-icon" />
          <h2 className="rp-cta-title">Ready to Make a Difference?</h2>
          <p className="rp-cta-desc">
            Drop off your e-waste today and earn reward points for every device
            you recycle.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="rp-btn-primary">
              <i className="fa-solid fa-location-dot me-2" /> Find Drop Points
            </button>
            <button className="rp-btn-outline">
              <i className="fa-solid fa-circle-info me-2" /> Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
