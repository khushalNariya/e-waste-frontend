// import React from "react";

// export default function Home_Nav_Bar({ tabs, activeTab, setActiveTab }) {
//   return (
//     <div className="sub-nav-tabs">
//       {tabs.map((tab) => (
//         <div
//           key={tab}
//           className={`nav-tab-item ${activeTab === tab ? "active" : ""}`}
//           onClick={() => setActiveTab(tab)}
//         >
//           {tab}
//         </div>
//       ))}
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

export default function Home_Nav_Bar({ tabs, activeTab, setActiveTab }) {

  const navigate = useNavigate();

  const handleClick = (tab) => {
    setActiveTab(tab);

    if (tab === "Home List") {
      navigate("/admin/Home");
    }

    if (tab === "Hero Image") {
      navigate("/admin/Home-Hero-Image");
    }
  };

  return (
    <div className="sub-nav-tabs">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`nav-tab-item ${activeTab === tab ? "active" : ""}`}
          onClick={() => handleClick(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}