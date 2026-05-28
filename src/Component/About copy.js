import React from "react";
// import "./About.css";

const About = () => {

  const missions = [
    { title: "Our Mission", description: "Promote responsible e-waste recycling by making certified facilities accessible to everyone." },
  ];

  const visions = [
    { title: "Our Vision", description: "A cleaner, greener planet where electronic waste is managed safely and sustainably." },
  ];

  const values = [
    { title: "Our Values", description: "Sustainability, transparency, innovation, and environmental responsibility." },
  ];

  const features = [
    { icon: "♻️", title: "Certified Facilities", description: "Verified & government-approved e-waste facilities." },
    { icon: "📍", title: "Smart Finder", description: "Locate the nearest recycling center instantly." },
    { icon: "📚", title: "Awareness Hub", description: "Learn sustainable e-waste disposal practices." },
    { icon: "🎁", title: "Reward System", description: "Earn credits for responsible recycling." },
    { icon: "📊", title: "Facility Dashboard", description: "Advanced tools for recycling partners." },
    { icon: "🌱", title: "Green Future", description: "Together towards sustainability." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="about-hero text-white text-center">
        <div className="container">
          <h1 className="fw-bold">About ELocate</h1>
          <p className="mt-3">
            Driving responsible e-waste recycling for a sustainable future
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mv-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {missions.map((item, i) => (
              <div className="col-md-4 offset-md-4" key={i}>
                <div className="mv-card">
                  <h4 className="fw-bold">{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="mv-section py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            {visions.map((item, i) => (
              <div className="col-md-4 offset-md-4" key={i}>
                <div className="mv-card">
                  <h4 className="fw-bold">{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mv-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {values.map((item, i) => (
              <div className="col-md-4 offset-md-4" key={i}>
                <div className="mv-card">
                  <h4 className="fw-bold">{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Choose ELocate?</h2>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4 col-lg-4" key={i}>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h5 className="fw-bold mt-3">{f.title}</h5>
                  <p>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta text-white text-center py-5">
        <h2 className="fw-bold">Join Us in Building a Sustainable Future</h2>
        <p className="mt-2">
          Take responsibility for your e-waste and make a positive impact today.
        </p>
      </section>
    </>
  );
};

export default About;

