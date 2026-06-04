import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Admin_Header = () => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dropdown State (side-Bar)
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [isRewardStoreOpen, setIsRewardStoreOpen] = useState(false);
  const [isEWasteOpen, setIsEWasteOpen] = useState(false);
  const [isUserRewardsOpen, setIsUserRewardsOpen] = useState(false);
  const [isRewardCartOpen, setIsRewardCartOpen] = useState(false);
  const [isRewardOrderOpen, setIsRewardOrderOpen] = useState(false);
  const [isRewardReturnOpen, setIsRewardReturnOpen] = useState(false);
  const [isRewardReplaceOpen, setIsRewardReplaceOpen] = useState(false);

  const location = useLocation();

  // Highlight parent dropdown if child is active
  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/Brand") ||
      location.pathname.startsWith("/admin/Recycling-info") ||
      location.pathname.startsWith("/admin/Category-Brand-Mapping") ||
      location.pathname.startsWith("/admin/Product-Name")
    ) {
      setIsFeaturesOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/Reward-Rules")) {
      setIsRewardOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/Reward-Category") || location.pathname.startsWith("/admin/Reward-Product")) {
      setIsRewardStoreOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/E-Waste-Submission") ||
      location.pathname.startsWith("/admin/E-Waste-Status-History")
    ) {
      setIsEWasteOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/User-Wallet") ||
      location.pathname.startsWith("/admin/Reward-Transactions")
    ) {
      setIsUserRewardsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/Reward-Cart-List") ||
      location.pathname.startsWith("/admin/Reward-Cart-Items")
    ) {
      setIsRewardCartOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/Reward-Orders") ||
      location.pathname.startsWith("/admin/Reward-Order-Items") ||
      location.pathname.startsWith("/admin/Reward-Order-Address") ||
      location.pathname.startsWith("/admin/Reward-Order-Payment") ||
      location.pathname.startsWith("/admin/Reward-Order-Status-History")
    ) {
      setIsRewardOrderOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/Reward-Return-Requests") ||
      location.pathname.startsWith("/admin/Reward-Return-Items") ||
      location.pathname.startsWith("/admin/Reward-Return-Pickups") ||
      location.pathname.startsWith("/admin/Reward-Return-Status-History")
    ) {
      setIsRewardReturnOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/Reward-Replace-Requests") ||
      location.pathname.startsWith("/admin/Reward-Replace-Items") ||
      location.pathname.startsWith("/admin/Reward-Replace-Pickups") ||
      location.pathname.startsWith("/admin/Reward-Replace-Status-History")
    ) {
      setIsRewardReplaceOpen(true);
    }
  }, [location.pathname]);


  const isOpen = isPinned || isHover;

  const firstName = localStorage.getItem("admin_first_name") || "Admin";

  const token = localStorage.getItem("admin_access_token")


  const handleLogout = () => {
    // localStorage.clear();

    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_first_name");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("is_superuser");

    window.location.href = "/admin/";
  };



  // const dropdownRef = useRef();
  const featuresRef = useRef();
  const rewardRef = useRef();
  const reward_Store_Ref = useRef();
  const eWasteRef = useRef();
  const userRewardsRef = useRef();
  const rewardCartRef = useRef();
  const rewardOrderRef = useRef();
  const rewardReturnRef = useRef();
  const rewardReplaceRef = useRef();

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsFeaturesOpen(false);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);

  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (!featuresRef.current || !featuresRef.current.contains(event.target)) &&
        (!rewardRef.current || !rewardRef.current.contains(event.target)) &&
        (!reward_Store_Ref.current || !reward_Store_Ref.current.contains(event.target)) &&
        (!eWasteRef.current || !eWasteRef.current.contains(event.target)) &&
        (!userRewardsRef.current || !userRewardsRef.current.contains(event.target)) &&
        (!rewardCartRef.current || !rewardCartRef.current.contains(event.target)) &&
        (!rewardOrderRef.current || !rewardOrderRef.current.contains(event.target)) &&
        (!rewardReturnRef.current || !rewardReturnRef.current.contains(event.target)) &&
        (!rewardReplaceRef.current || !rewardReplaceRef.current.contains(event.target))
      ) {
        setIsFeaturesOpen(false);
        setIsRewardOpen(false);
        setIsRewardStoreOpen(false);
        setIsEWasteOpen(false);
        setIsUserRewardsOpen(false);
        setIsRewardCartOpen(false);
        setIsRewardOrderOpen(false);
        setIsRewardReturnOpen(false);
        setIsRewardReplaceOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);



  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [isOpen]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar main-header px-3 d-flex justify-content-between align-items-center">

        {/* Left: Sidebar Toggle + Title */}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-light me-3"
            onClick={() => setIsPinned(!isPinned)}
          >
            ☰
          </button>
          <span className="fw-bold text-white">E-Waste Admin Panel</span>
        </div>

        {/* Right: User Dropdown */}
        {/* <div className="admin-user-box position-relative">
          <button
            className="admin-user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              ♻
            </div>
            <span className="user-name">{firstName}</span>
          </button>

          {dropdownOpen && (
            <div className="admin-dropdown">
              <div className="dropdown-user-info">
                <div className="user-avatar big">♻</div>
                <div>
                  <div className="fw-bold">{firstName}</div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>Admin</div>
                </div>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div> */}

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
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>Admin</div>
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
            <Link to="/login" className="btn btn-outline-light sign-in-btn">
              Sign In
            </Link>
          </div>

        )}

      </nav>

      {/* LEFT EDGE HOVER */}
      <div
        className="sidebar-hover-area"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`main-sidebar ${isOpen ? "open" : ""}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="sidebar-scroll">

          <NavLink to="/admin/Users_2" className="sidebar-link">
            <i className="fa fa-users"></i>
            <span>Users</span>
          </NavLink>

          {/* <NavLink to="/admin/Home" className="sidebar-link">
            <i className="fa fa-home"></i>
            <span>Home</span>
          </NavLink> */}

          <NavLink
            to="/admin/Home"
            className={({ isActive }) =>
              window.location.pathname.startsWith("/admin/Home")
                ? "sidebar-link active"
                : "sidebar-link"
            }
          > <i className="fa fa-home"></i>
            <span>Home</span>
          </NavLink>

          <NavLink to="/admin/Education" className="sidebar-link">
            <i className="fa fa-graduation-cap"></i>
            <span>Education</span>
          </NavLink>




          {/* Features Dropdown ==== 1*/}

          {/* <div className={`sidebar-dropdown ${isFeaturesOpen ? "open" : ""}`}> */}
          <div ref={featuresRef} className={`sidebar-dropdown ${isFeaturesOpen ? "open" : ""}`}>

            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Brand") || location.pathname.includes("/admin/Recycling-info") || location.pathname.includes("/admin/Category-Brand-Mapping") || location.pathname.includes("/admin/Product-Name") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsFeaturesOpen(!isFeaturesOpen);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-cogs"></i>
              <span>Features</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isFeaturesOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">

              <NavLink
                to="/admin/Recycling-info"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Recycling-info")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list"></i>
                <span>Category</span>
              </NavLink>
              <NavLink
                to="/admin/Brand"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Brand")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-tags"></i>
                <span>Brand</span>
              </NavLink>
              <NavLink
                to="/admin/Category-Brand-Mapping"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Category_Brand_Mapping")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-link"></i>
                <span>Category Brand Mapping</span>
              </NavLink>
              <NavLink
                to="/admin/Product-Name"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Product_Name")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-solid fa-box"></i>
                <span>Product Name</span>
              </NavLink>
            </div>
          </div>




          {/* Features Dropdown ==== 2 */}

          {/* <div className={`sidebar-dropdown ${isFeaturesOpen ? "open" : ""}`}> */}
          <div ref={rewardRef} className={`sidebar-dropdown ${isRewardOpen ? "open" : ""}`}>

            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Reward-Condition") || location.pathname.includes("/admin/Reward-Rules") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRewardOpen(!isRewardOpen);
                setIsFeaturesOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-gift"></i>
              <span>Reward</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isRewardOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">

              <NavLink
                to="/admin/Reward-Condition"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Condition")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list-check"></i>
                <span>Reward Conditions</span>
              </NavLink>
              <NavLink
                to="/admin/Reward-Rules"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Rules")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-solid fa-layer-group"></i>
                <span>Reward Rules</span>
              </NavLink>
              {/* <NavLink
                to="/admin/Category-Brand-Mapping"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Category_Brand_Mapping")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-tags"></i>
                <span>Category Brand Mapping</span>
              </NavLink> */}
            </div>
          </div>

          {/* Features Dropdown ==== 3 */}

          {/* <div className={`sidebar-dropdown ${isFeaturesOpen ? "open" : ""}`}> */}
          <div ref={reward_Store_Ref} className={`sidebar-dropdown ${isRewardStoreOpen ? "open" : ""}`}>

            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Reward-Category") || location.pathname.includes("/admin/Reward-Product") || location.pathname.includes("/admin/Reward-Product-Images") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRewardStoreOpen(!isRewardStoreOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-store"></i>
              <span>Reward Store</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isRewardStoreOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">

              <NavLink
                to="/admin/Reward-Category"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Category")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-tags"></i>
                <span>Reward Category</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Product"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Product")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-box"></i>
                <span>Reward Product</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Product-Image"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Product-Image")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-image"></i>
                <span>Reward Product Images</span>
              </NavLink>

            </div>
          </div>

          <div ref={eWasteRef} className={`sidebar-dropdown ${isEWasteOpen ? "open" : ""}`}>
            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/E-Waste-Submission") || location.pathname.includes("/admin/E-Waste-Status-History") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsEWasteOpen(!isEWasteOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-recycle"></i>
              <span>E-Waste</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isEWasteOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">
              <NavLink
                to="/admin/E-Waste-Submission"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/E-Waste-Submission")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list"></i>
                <span>Submissions</span>
              </NavLink>

              <NavLink
                to="/admin/E-Waste-Status-History"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/E-Waste-Status-History")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-history"></i>
                <span>Status History</span>
              </NavLink>
            </div>
          </div>

          <div ref={userRewardsRef} className={`sidebar-dropdown ${isUserRewardsOpen ? "open" : ""}`}>
            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/User-Wallet") || location.pathname.includes("/admin/Reward-Transactions") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsUserRewardsOpen(!isUserRewardsOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-wallet"></i>
              <span>User Rewards</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isUserRewardsOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">
              <NavLink
                to="/admin/User-Wallet"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/User-Wallet")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-credit-card"></i>
                <span>User Wallets</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Transactions"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Transactions")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-exchange-alt"></i>
                <span>Transactions</span>
              </NavLink>
            </div>
          </div>

          <div ref={rewardCartRef} className={`sidebar-dropdown ${isRewardCartOpen ? "open" : ""}`}>
            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Reward-Cart-List") || location.pathname.includes("/admin/Reward-Cart-Items") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRewardCartOpen(!isRewardCartOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-shopping-cart"></i>
              <span>Reward Cart</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isRewardCartOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">
              <NavLink
                to="/admin/Reward-Cart-List"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Cart-List")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list"></i>
                <span>Carts</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Cart-Items"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Cart-Items")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-layer-group"></i>
                <span>Cart Items</span>
              </NavLink>
            </div>
          </div>

          <div ref={rewardOrderRef} className={`sidebar-dropdown ${isRewardOrderOpen ? "open" : ""}`}>
            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Reward-Orders") || location.pathname.includes("/admin/Reward-Order-Items") || location.pathname.includes("/admin/Reward-Order-Address") || location.pathname.includes("/admin/Reward-Order-Payment") || location.pathname.includes("/admin/Reward-Order-Status-History") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRewardOrderOpen(!isRewardOrderOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-receipt"></i>
              <span>Reward Orders</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isRewardOrderOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">
              <NavLink
                to="/admin/Reward-Orders"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Orders")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list-ul"></i>
                <span>Orders</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Order-Items"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Order-Items")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-boxes"></i>
                <span>Order Items</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Order-Address"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Order-Address")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-map-marker-alt"></i>
                <span>Order Address</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Order-Payment"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Order-Payment")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-credit-card"></i>
                <span>Order Payment</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Order-Status-History"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Order-Status-History")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-history"></i>
                <span>Status History</span>
              </NavLink>
            </div>
          </div>

          <div ref={rewardReturnRef} className={`sidebar-dropdown ${isRewardReturnOpen ? "open" : ""}`}>
            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Reward-Return-Requests") || location.pathname.includes("/admin/Reward-Return-Items") || location.pathname.includes("/admin/Reward-Return-Pickups") || location.pathname.includes("/admin/Reward-Return-Status-History") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRewardReturnOpen(!isRewardReturnOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
              }}
            >
              <i className="fa fa-undo"></i>
              <span>Reward Returns</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isRewardReturnOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">
              <NavLink
                to="/admin/Reward-Return-Requests"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Return-Requests")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list-alt"></i>
                <span>Return Requests</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Return-Items"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Return-Items")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-box-open"></i>
                <span>Return Items</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Return-Pickups"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Return-Pickups")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-truck"></i>
                <span>Return Pickups</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Return-Status-History"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Return-Status-History")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-history"></i>
                <span>Status History</span>
              </NavLink>
            </div>
          </div>

          {/* Reward Replaces Dropdown (app-15) */}
          <div ref={rewardReplaceRef} className={`sidebar-dropdown ${isRewardReplaceOpen ? "open" : ""}`}>
            <div
              className={`sidebar-link dropdown-toggle-btn ${location.pathname.includes("/admin/Reward-Replace-Requests") || location.pathname.includes("/admin/Reward-Replace-Items") || location.pathname.includes("/admin/Reward-Replace-Pickups") || location.pathname.includes("/admin/Reward-Replace-Status-History") ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRewardReplaceOpen(!isRewardReplaceOpen);
                setIsFeaturesOpen(false);
                setIsRewardOpen(false);
                setIsRewardStoreOpen(false);
                setIsEWasteOpen(false);
                setIsUserRewardsOpen(false);
                setIsRewardCartOpen(false);
                setIsRewardOrderOpen(false);
                setIsRewardReturnOpen(false);
              }}
            >
              <i className="fa fa-exchange-alt"></i>
              <span>Reward Replaces</span>
              <i className={`fa fa-chevron-down ms-auto arrow-icon ${isRewardReplaceOpen ? "rotate" : ""}`}></i>
            </div>

            <div className="sidebar-dropdown-content">
              <NavLink
                to="/admin/Reward-Replace-Requests"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Replace-Requests")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-list-alt"></i>
                <span>Replace Requests</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Replace-Items"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Replace-Items")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-box-open"></i>
                <span>Replace Items</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Replace-Pickups"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Replace-Pickups")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-truck"></i>
                <span>Replace Pickups</span>
              </NavLink>

              <NavLink
                to="/admin/Reward-Replace-Status-History"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/admin/Reward-Replace-Status-History")
                    ? "sidebar-link sub-link active"
                    : "sidebar-link sub-link"
                }
              >
                <i className="fa fa-history"></i>
                <span>Status History</span>
              </NavLink>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Admin_Header;
