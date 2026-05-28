import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layout Components
import Admin_Header from "../Admin Panel Design/Header";

// Auth Components
import AdminLogin from "../Register Users/Login";
import AdminSignup from "../Register Users/Sign-Up";

// Feature Components
import Users_2 from "../E-waste users/Users_2";
import Home_admin from "../Home/Home_admin";
import Education_admin from "../Education-Admin/Education_admin";
import Recycling_info_admin from "../Category -- Recycling Info/Recycling_info_admin";
import Brand_admin from "../Brands/Brand_admin";
import Category_Brand_Mapping from "../Category - Brand - Mapping/Category_Brand_Mapping";
import Product_Name from "../Category_Brand_Wise_Model_Name/Product_Name";
import Reward_Condition from "../Reward Condition/Reward_Condition";
import Reward_Rules from "../Reward Rules/Reward_Rules";
import E_Waste_Submission_Admin from "../E_Waste_Submission/E_Waste_Submission_List";

// Add/Edit Forms
import Add_Brand from "../Brands/Add_Brand";
import Edit_Brand from "../Brands/Edit_Brand";
import Add_Recycling_info from "../Category -- Recycling Info/Add_Recycling_info";
import Edit_Recycling_info from "../Category -- Recycling Info/Edit_Recycling_info";
import Add_Category_Brand_mapping from "../Category - Brand - Mapping/Add_Category_Brand_mapping";
import Edit_Category_Brand from "../Category - Brand - Mapping/Edit_Category_Brand";
import Add_Product_Name from "../Category_Brand_Wise_Model_Name/Add_Product_Name";
import Edit_Product_Name from "../Category_Brand_Wise_Model_Name/Edit_Product_Name";
import Add_Education from "../Education-Admin/Add_Education";
import Edit_Education from "../Education-Admin/Edit_Education";
import Add_Reward_Rules from "../Reward Rules/Add_Reward_Rules";
import Edit_Reward_Rules from "../Reward Rules/Edit_Reward_Rules";
import Add_Reward_Condition from "../Reward Condition/Add_Reward_Condition";
import Edit_Reward_Condition from "../Reward Condition/Edit_Reward_Condition";
import Add_User from "../E-waste users/Add_User";
import Edit_User from "../E-waste users/Edit_User";
import Edit_Home from "../Home/Edit_Home";
import Home_Hero_Image from "../Home/Home_Hero_Image";
import Edit_Home_Hero_Image from "../Home/Edit_Home_Hero_Image";
import Add_E_Waste_Submission from "../E_Waste_Submission/Add_E_Waste_Submission";
import Edit_E_Waste_Submission from "../E_Waste_Submission/Edit_E_Waste_Submission";

import E_Waste_Status_History_Admin from "../E_Waste_Status_History/E_Waste_Status_History_List";
import Edit_E_Waste_Status_History from "../E_Waste_Status_History/Edit_E_Waste_Status_History";


import Reward_Category from "../Reward_Category/Reward_Category";
import Add_Reward_Category from "../Reward_Category/Add_Reward_Category";
import Edit_Reward_Category from "../Reward_Category/Edit_Reward_Category";

import Reward_Product from "../Reward_Product/Reward_Product";
import Add_Reward_Product from "../Reward_Product/Add_Reward_Product";
import Edit_Reward_Product from "../Reward_Product/Edit_Reward_Product";

import Reward_Product_Image_All from "../Reward_Product_Images_All/Reward_Product_Image";
import Add_Reward_Product_Image from "../Reward_Product_Images_All/Add_Reward_Product_Image";
import Edit_Reward_Product_Image from "../Reward_Product_Images_All/Edit_Reward_Product_Image";

import User_Wallet_Admin from "../User_Wallet/User_Wallet";
import Reward_Transactions_Admin from "../Reward_Transactions/Reward_Transactions";

import Reward_Cart_Admin from "../Reward_Cart/Reward_Cart";
import Reward_Cart_Items_Admin from "../Reward_Cart_Items/Reward_Cart_Items";

import Reward_Orders_Admin from "../Reward_Orders/Reward_Orders";
import Reward_Order_Items_Admin from "../Reward_Order_Items/Reward_Order_Items";
import Reward_Order_Address_Admin from "../Reward_Order_Address/Reward_Order_Address";
import Reward_Order_Payment_Admin from "../Reward_Order_Payment/Reward_Order_Payment";

import Reward_Order_Status_History_Admin from "../Reward_Order_Status_History/Reward_Order_Status_History_List";

// Reward Return Components (app-14)
import Reward_Return_Requests_Admin from "../Reward_Return_Request/Reward_Return_Request";
import Reward_Return_Items_Admin from "../Reward_Return_Items/Reward_Return_Items";
import Reward_Return_Pickups_Admin from "../Reward_Return_Pickups/Reward_Return_Pickups";
import Reward_Return_Status_History_Admin from "../Reward_Return_Status_History/Reward_Return_Status_History";

// Reward Replace Components (app-15)
import Reward_Replace_Requests_Admin from "../Reward_Replace_Request/Reward_Replace_Request";
import Reward_Replace_Items_Admin from "../Reward_Replace_Items/Reward_Replace_Items";
import Reward_Replace_Pickups_Admin from "../Reward_Replace_Pickups/Reward_Replace_Pickups";
import Reward_Replace_Status_History_Admin from "../Reward_Replace_Status_History/Reward_Replace_Status_History";

// CSS
import "../Styles/Admin.css";

const AdminLayout = () => {
  const location = useLocation();

  // Check if current page is Login or Signup
  const isAuthPage =
    location.pathname === "/admin" ||
    location.pathname === "/admin/" ||
    location.pathname === "/admin/Sign-up";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="Sign-up" element={<AdminSignup />} />
      </Routes>
    );
  }

  return (
    <div className="admin-layout-wrapper">
      <Admin_Header />
      <div className="admin-content">
        <Routes>
          <Route path="Users_2" element={<Users_2 />} />
          <Route path="Add-User" element={<Add_User />} />
          <Route path="Edit-Users" element={<Edit_User />} />

          <Route path="Home" element={<Home_admin />} />
          <Route path="Edit-Home" element={<Edit_Home />} />

          <Route path="Home-Hero-Image" element={<Home_Hero_Image />} />
          <Route path="Edit-Home-Hero-Image" element={<Edit_Home_Hero_Image />} />


          <Route path="Education" element={<Education_admin />} />
          <Route path="Add-Education" element={<Add_Education />} />
          <Route path="Edit-Education" element={<Edit_Education />} />

          <Route path="Recycling-info" element={<Recycling_info_admin />} />
          <Route path="Add-Category-Recycling-Info" element={<Add_Recycling_info />} />
          <Route path="Edit-Category-Recycling-Info" element={<Edit_Recycling_info />} />

          <Route path="Brand" element={<Brand_admin />} />
          <Route path="Add-Brand" element={<Add_Brand />} />
          <Route path="Edit-Brand" element={<Edit_Brand />} />

          <Route path="Category-Brand-Mapping" element={<Category_Brand_Mapping />} />
          <Route path="Add-Category-Brand-mapping" element={<Add_Category_Brand_mapping />} />
          <Route path="Edit-Category-Brand" element={<Edit_Category_Brand />} />

          <Route path="Product-Name" element={<Product_Name />} />
          <Route path="Add-Product-Name" element={<Add_Product_Name />} />
          <Route path="Edit-Product-Name" element={<Edit_Product_Name />} />

          <Route path="E-Waste-Submission" element={<E_Waste_Submission_Admin />} />
          <Route path="Add-E-Waste-Submission" element={<Add_E_Waste_Submission />} />
          <Route path="Edit-E-Waste-Submission" element={<Edit_E_Waste_Submission />} />

          <Route path="E-Waste-Status-History" element={<E_Waste_Status_History_Admin />} />
          <Route path="Edit-E-Waste-Status-History" element={<Edit_E_Waste_Status_History />} />


          <Route path="Reward-Condition" element={<Reward_Condition />} />
          <Route path="Add-Reward-Condition" element={<Add_Reward_Condition />} />
          <Route path="Edit-Reward-Condition" element={<Edit_Reward_Condition />} />

          <Route path="Reward-Rules" element={<Reward_Rules />} />
          <Route path="Add-Reward-Rules" element={<Add_Reward_Rules />} />
          <Route path="Edit-Reward-Rules" element={<Edit_Reward_Rules />} />

          <Route path="Reward-Category" element={<Reward_Category />} />
          <Route path="Add-Reward-Category" element={<Add_Reward_Category />} />
          <Route path="Edit-Reward-Category" element={<Edit_Reward_Category />} />

          <Route path="Reward-Product" element={<Reward_Product />} />
          <Route path="Add-Reward-Product" element={<Add_Reward_Product />} />
          <Route path="Edit-Reward-Product" element={<Edit_Reward_Product />} />

          <Route path="Reward-Product-Image" element={<Reward_Product_Image_All />} />
          <Route path="Add-Reward-Product-Image" element={<Add_Reward_Product_Image />} />
          <Route path="Edit-Reward-Product-Image" element={<Edit_Reward_Product_Image />} />

          <Route path="User-Wallet" element={<User_Wallet_Admin />} />
          <Route path="Reward-Transactions" element={<Reward_Transactions_Admin />} />

          <Route path="Reward-Cart-List" element={<Reward_Cart_Admin />} />
          <Route path="Reward-Cart-Items" element={<Reward_Cart_Items_Admin />} />

          <Route path="Reward-Orders" element={<Reward_Orders_Admin />} />
          <Route path="Reward-Order-Items" element={<Reward_Order_Items_Admin />} />
          <Route path="Reward-Order-Address" element={<Reward_Order_Address_Admin />} />
          <Route path="Reward-Order-Payment" element={<Reward_Order_Payment_Admin />} />
          <Route path="Reward-Order-Status-History" element={<Reward_Order_Status_History_Admin />} />

          {/* Reward Returns (app-14) Routes */}
          <Route path="Reward-Return-Requests" element={<Reward_Return_Requests_Admin />} />
          <Route path="Reward-Return-Items" element={<Reward_Return_Items_Admin />} />
          <Route path="Reward-Return-Pickups" element={<Reward_Return_Pickups_Admin />} />
          <Route path="Reward-Return-Status-History" element={<Reward_Return_Status_History_Admin />} />

          {/* Reward Replaces (app-15) Routes */}
          <Route path="Reward-Replace-Requests" element={<Reward_Replace_Requests_Admin />} />
          <Route path="Reward-Replace-Items" element={<Reward_Replace_Items_Admin />} />
          <Route path="Reward-Replace-Pickups" element={<Reward_Replace_Pickups_Admin />} />
          <Route path="Reward-Replace-Status-History" element={<Reward_Replace_Status_History_Admin />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
