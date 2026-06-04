import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  
  // Check if current path belongs to E-Waste Services or Rewards
  const isEwasteActive = ["/E-Waste-Form", "/submission-history"].includes(location.pathname);
  const isRewardsActive = ["/reward-rules", "/reward-store", "/my-orders", "/cart", "/checkout", "/order-confirmation", "/my-returns", "/my-replaces"].includes(location.pathname);


  const [dropdownOpen, setDropdownOpen] = useState(false);


  const firstName = localStorage.getItem("user_first_name") || "Login";

  const token = localStorage.getItem("user_access_token");

  const handleLogout = () => {
    // localStorage.clear();
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("user_refresh_token");
    localStorage.removeItem("user_first_name");

    window.location.href = "/login";
  };

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = async () => {
      const token = localStorage.getItem("user_access_token");
      if (!token) {
        setCartCount(0);
        return;
      }
      
      try {
        const { getMyCart } = await import("../../../services/API_Service");
        const response = await getMyCart();
        const count = response.data.cart_items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error("Error updating cart count:", error);
      }
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark elocate-header sticky-top px-2 px-lg-3 px-xl-4">
      <div className="container-fluid d-flex align-items-center">

        {/* Left: Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <img
            src='/image/images.jpg'
            alt="Logo"
            width="60"
            height="60"
            className="logo shadow-sm"
          />
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon custom-toggler-icon"></span>
        </button>

        {/* Center: Menu */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-1 gap-xl-2">
            <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/About-Us">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/FacilityMap">E-Facilities</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/Recycle">Recycle</NavLink></li>
            <li className="nav-item dropdown">
              <NavLink className={({ isActive }) => `nav-link dropdown-toggle ${isEwasteActive ? "active" : ""}`} to="#" id="ewasteDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                E-Waste Services
              </NavLink>
              <ul className="dropdown-menu shadow border-0" aria-labelledby="ewasteDropdown" style={{ borderRadius: '10px', marginTop: '10px' }}>
                <li><NavLink className="dropdown-item py-2" to="/E-Waste-Form"><i className="fa-solid fa-recycle text-success me-2"></i>Submit Item</NavLink></li>
                <li><NavLink className="dropdown-item py-2" to="/submission-history"><i className="fa-solid fa-clock-rotate-left text-muted me-2"></i>My Submissions</NavLink></li>
              </ul>
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/Education">Education</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contactus">Contact Us</NavLink></li>
            <li className="nav-item dropdown">
              <NavLink className={({ isActive }) => `nav-link dropdown-toggle ${isRewardsActive ? "active" : ""}`} to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Rewards
              </NavLink>
              <ul className="dropdown-menu shadow border-0" aria-labelledby="navbarDropdown" style={{ borderRadius: '10px', marginTop: '10px' }}>
                <li><NavLink className="dropdown-item py-2" to="/reward-rules"><i className="fa-solid fa-circle-info text-primary me-2"></i>How it Works</NavLink></li>
                <li><NavLink className="dropdown-item py-2" to="/reward-store"><i className="fa-solid fa-store text-success me-2"></i>Reward Store</NavLink></li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li><NavLink className="dropdown-item py-2" to="/my-orders"><i className="fa-solid fa-list-check text-warning me-2"></i>My Orders</NavLink></li>
                <li><NavLink className="dropdown-item py-2" to="/my-returns"><i className="fa-solid fa-rotate-left text-info me-2"></i>My Returns</NavLink></li>
                <li><NavLink className="dropdown-item py-2" to="/my-replaces"><i className="fa-solid fa-arrows-rotate text-success me-2"></i>My Replaces</NavLink></li>
                <li><NavLink className="dropdown-item py-2 d-flex align-items-center justify-content-between" to="/cart"><span><i className="fa-solid fa-cart-shopping text-danger me-2"></i>My Cart</span>{cartCount > 0 && <span className="badge rounded-pill bg-danger" style={{fontSize:'11px'}}>{cartCount}</span>}</NavLink></li>
              </ul>
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/rules">Govt. Rules</NavLink></li>

            {/* Mobile Sign In */}
            <li className="nav-item d-lg-none mt-2">
              <Link to="/login" className="sign-in-btn w-100">
                <i className="fa-solid fa-right-to-bracket me-2"></i>
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Sign In */}
        {/* <div className="d-none d-lg-block">
          <Link to="/login" className="btn btn-outline-light sign-in-btn">
            Sign In
          </Link>
        </div> */}


        {/* Right: User Dropdown */}
        {token ? (

          /* ✅ LOGIN HONE KE BAD → Dropdown */
          <div className="admin-user-box position-relative">

            <button
              className="admin-user-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar">♻</div>
              <span className="user-name">{firstName}</span>
            </button>

            {dropdownOpen && (
              <div className="admin-dropdown">

                <div className="dropdown-user-info">
                  <div className="user-avatar big">♻</div>
                  <div>
                    <div className="fw-bold">{firstName}</div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>User</div>
                  </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>

              </div>
            )}

          </div>

        ) : (

          /* ❌ LOGIN NAHI HUA → Sign In */
          <div className="d-none d-lg-block">
            <Link to="/login" className="sign-in-btn">
              <i className="fa-solid fa-right-to-bracket me-2"></i>
              Sign In
            </Link>
          </div>

        )}
      </div>
    </nav>

  )
}

export default Header;



