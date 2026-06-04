import React from "react";
import "./About.css"; // Ensure new CSS is imported

const About = () => {

  const mvvData = [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To revolutionize e-waste management by providing accessible, verified, and rewarding recycling channels for every individual and business."
    },
    {
      icon: "🌍",
      title: "Our Vision",
      description: "A world where zero electronic waste ends up in landfills, and sustainability is seamlessly integrated into human consumption."
    },
    {
      icon: "⭐",
      title: "Our Values",
      description: "Transparency, Environmental Responsibility, Community Empowerment, and Relentless Innovation."
    }
  ];

  const whyChooseUsData = [
    {
      icon: "✅",
      title: "Certified Partners",
      desc: "We route your electronics exclusively to government-verified and thoroughly vetted recycling facilities."
    },
    {
      icon: "🎁",
      title: "Incentive Rewards",
      desc: "Get tangible rewards, discounts, and green credits every time you recycle your e-waste responsibly."
    },
    {
      icon: "📍",
      title: "Convenient Drop Points",
      desc: "Our smart locater helps you find the nearest safe drop point within seconds, saving you time and effort."
    },
    {
      icon: "شف", // fallback transparent icon idea or proper emoji
      title: "Complete Transparency",
      desc: "Track the journey of your recycled items and measure the direct environmental impact you are making."
    }
  ];
  // fixing the fallback emoji:
  whyChooseUsData[3].icon = "🔍";

  return (
    <div className="ewaste-about">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-7 text-start">
              <div className="hero-content-box">
                <span className="hero-tagline">Sustainable Future</span>
                <h1 className="hero-title text-start">
                  Pioneering a <span className="text-gradient">Circular Economy</span> for Electronics
                </h1>
                <p className="hero-subtitle text-start">
                  We are transforming the way society handles old technology, bridging the gap between consumers and certified recycling facilities to protect our planet.
                </p>
                <div className="hero-buttons">
                  <a href="#who-we-are" className="btn-hero-primary">Our Story</a>
                  <a href="#mvv-section" className="btn-hero-outline">Mission & Vision</a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-visual">
                <div className="image-blob-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2070&auto=format&fit=crop"
                    alt="Current E-Waste Recycling"
                    className="hero-img"
                  />
                </div>
                {/* Floating Info Card */}
                <div className="floating-info-card shadow-lg">
                  <div className="icon-circle">🛡️</div>
                  <div className="info-text">
                    <strong>100% Certified</strong>
                    <span>Safe Disposal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Wave Divider */}
        <div className="about-hero-wave">
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="who-we-are" id="who-we-are">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h2 className="section-heading">Who We Are</h2>
              <p className="lead-text">
                <strong>E-Waste Drop & Recycling</strong> is a forward-thinking environmental platform designed to solve the growing crisis of electronic waste. We bridge the gap between conscientious consumers and certified recycling plants.
              </p>
              <p className="lead-text">
                By leveraging technology, we make finding e-waste drop points effortless and recovering valuable materials highly rewarding. We are not just a locator tool; we are a community-driven movement aiming to protect our planet from toxic tech pollution.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop"
                alt="Electronic Waste Collection"
                className="img-fluid who-we-are-img shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION, VISION, VALUES */}
      <section className="mvv-section">
        <div className="container">
          <div className="row g-5">
            {mvvData.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="mvv-card">
                  <div className="mvv-icon">{item.icon}</div>
                  <h3 className="mvv-title">{item.title}</h3>
                  <p className="text-muted" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-heading text-center mb-5">Why Choose Us?</h2>
          <div className="row g-4 mt-2">
            <div className="col-lg-10 mx-auto">
              <div className="row">
                {whyChooseUsData.map((feature, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="feature-box">
                      <div className="feature-icon-wrapper">
                        {feature.icon}
                      </div>
                      <div className="feature-text">
                        <h4>{feature.title}</h4>
                        <p>{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY COMMITMENT (CTA) */}
      <section className="sustainability-section">
        <div className="container">
          <h2 className="sustainability-title">Our Sustainability Commitment</h2>
          <p className="sustainability-text mb-5">
            Every device you drop off with us is guaranteed to be handled via eco-friendly protocols. We ensure secure data destruction, maximum material recovery, and absolute compliance with environmental regulations. Let's pledge to keep our soil and air safe.
          </p>
          <a href="/facilities" className="btn-success-custom">
            Find Dedicated Drop Points
          </a>
        </div>
      </section>

    </div>
  );
};

export default About;

