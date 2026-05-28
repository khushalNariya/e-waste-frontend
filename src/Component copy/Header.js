import React from 'react'
import { Link } from "react-router-dom";

const Header = () => {



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top px-4">
      <div className="container-fluid d-flex align-items-center">

        {/* Left: Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <img
            src='/image/images.jpg'
            alt=""
            width="50"
            height="50"
            className="logo"
          />
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Center: Menu */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-4">
            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/About-Us">About</a></li>
            <li className="nav-item"><a className="nav-link" href="/FacilityMap">E-Facilities</a></li>
            <li className="nav-item"><a className="nav-link" href="/Recycle">Recycle</a></li>
            <li className="nav-item"><a className="nav-link" href="/Education">Education</a></li>
            <li className="nav-item"><Link className="nav-link" to="/contactus">Contact Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/rules">Rules</Link></li>
          </ul>
        </div>

        {/* Right: Sign In */}
        <div className="d-none d-lg-block">
          <Link to="/login" className="btn btn-outline-light">
            Sign In
          </Link>
        </div>

      </div>
    </nav>

  )
}

export default Header;

