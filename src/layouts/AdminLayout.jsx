import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Layout Components
import AdminHeader from "../features/admin/components/AdminHeader";

// Auth Components
import AdminLogin from "../features/admin/modules/Register Users/Login";
import AdminSignup from "../features/admin/modules/Register Users/Sign-Up";

// Feature Components
import Users2 from "../features/admin/modules/E-waste users/Users_2";
import HomeAdmin from "../features/admin/modules/Home/Home_admin";
import EducationAdmin from "../features/admin/modules/Education-Admin/Education_admin";
import RecyclingInfoAdmin from "../features/admin/modules/Category -- Recycling Info/Recycling_info_admin";
import BrandAdmin from "../features/admin/modules/Brands/Brand_admin";
import CategoryBrandMapping from "../features/admin/modules/Category - Brand - Mapping/Category_Brand_Mapping";
import ProductName from "../features/admin/modules/Category_Brand_Wise_Model_Name/Product_Name";
import RewardCondition from "../features/admin/modules/Reward Condition/Reward_Condition";
import RewardRulesAdmin from "../features/admin/modules/Reward Rules/Reward_Rules";
import EWasteSubmissionAdmin from "../features/admin/modules/E_Waste_Submission/E_Waste_Submission_List";

// Add/Edit Forms
import AddBrand from "../features/admin/modules/Brands/Add_Brand";
import EditBrand from "../features/admin/modules/Brands/Edit_Brand";
import AddRecyclingInfo from "../features/admin/modules/Category -- Recycling Info/Add_Recycling_info";
import EditRecyclingInfo from "../features/admin/modules/Category -- Recycling Info/Edit_Recycling_info";
import AddCategoryBrandMapping from "../features/admin/modules/Category - Brand - Mapping/Add_Category_Brand_mapping";
import EditCategoryBrand from "../features/admin/modules/Category - Brand - Mapping/Edit_Category_Brand";
import AddProductName from "../features/admin/modules/Category_Brand_Wise_Model_Name/Add_Product_Name";
import EditProductName from "../features/admin/modules/Category_Brand_Wise_Model_Name/Edit_Product_Name";
import AddEducation from "../features/admin/modules/Education-Admin/Add_Education";
import EditEducation from "../features/admin/modules/Education-Admin/Edit_Education";
import AddRewardRules from "../features/admin/modules/Reward Rules/Add_Reward_Rules";
import EditRewardRules from "../features/admin/modules/Reward Rules/Edit_Reward_Rules";
import AddRewardCondition from "../features/admin/modules/Reward Condition/Add_Reward_Condition";
import EditRewardCondition from "../features/admin/modules/Reward Condition/Edit_Reward_Condition";
import AddUser from "../features/admin/modules/E-waste users/Add_User";
import EditUser from "../features/admin/modules/E-waste users/Edit_User";
import EditHome from "../features/admin/modules/Home/Edit_Home";
import HomeHeroImage from "../features/admin/modules/Home/Home_Hero_Image";
import EditHomeHeroImage from "../features/admin/modules/Home/Edit_Home_Hero_Image";
import AddEWasteSubmission from "../features/admin/modules/E_Waste_Submission/Add_E_Waste_Submission";
import EditEWasteSubmission from "../features/admin/modules/E_Waste_Submission/Edit_E_Waste_Submission";

import EWasteStatusHistoryAdmin from "../features/admin/modules/E_Waste_Status_History/E_Waste_Status_History_List";
import EditEWasteStatusHistory from "../features/admin/modules/E_Waste_Status_History/Edit_E_Waste_Status_History";

import RewardCategory from "../features/admin/modules/Reward_Category/Reward_Category";
import AddRewardCategory from "../features/admin/modules/Reward_Category/Add_Reward_Category";
import EditRewardCategory from "../features/admin/modules/Reward_Category/Edit_Reward_Category";

import RewardProductAdmin from "../features/admin/modules/Reward_Product/Reward_Product";
import AddRewardProduct from "../features/admin/modules/Reward_Product/Add_Reward_Product";
import EditRewardProduct from "../features/admin/modules/Reward_Product/Edit_Reward_Product";

import RewardProductImageAll from "../features/admin/modules/Reward_Product_Images_All/Reward_Product_Image";
import AddRewardProductImage from "../features/admin/modules/Reward_Product_Images_All/Add_Reward_Product_Image";
import EditRewardProductImage from "../features/admin/modules/Reward_Product_Images_All/Edit_Reward_Product_Image";

import UserWalletAdmin from "../features/admin/modules/User_Wallet/User_Wallet";
import RewardTransactionsAdmin from "../features/admin/modules/Reward_Transactions/Reward_Transactions";

import RewardCartAdmin from "../features/admin/modules/Reward_Cart/Reward_Cart";
import RewardCartItemsAdmin from "../features/admin/modules/Reward_Cart_Items/Reward_Cart_Items";

import RewardOrdersAdmin from "../features/admin/modules/Reward_Orders/Reward_Orders";
import RewardOrderItemsAdmin from "../features/admin/modules/Reward_Order_Items/Reward_Order_Items";
import RewardOrderAddressAdmin from "../features/admin/modules/Reward_Order_Address/Reward_Order_Address";
import RewardOrderPaymentAdmin from "../features/admin/modules/Reward_Order_Payment/Reward_Order_Payment";

import RewardOrderStatusHistoryAdmin from "../features/admin/modules/Reward_Order_Status_History/Reward_Order_Status_History_List";

// Reward Return Components (app-14)
import RewardReturnRequestsAdmin from "../features/admin/modules/Reward_Return_Request/Reward_Return_Request";
import RewardReturnItemsAdmin from "../features/admin/modules/Reward_Return_Items/Reward_Return_Items";
import RewardReturnPickupsAdmin from "../features/admin/modules/Reward_Return_Pickups/Reward_Return_Pickups";
import RewardReturnStatusHistoryAdmin from "../features/admin/modules/Reward_Return_Status_History/Reward_Return_Status_History";

// Reward Replace Components (app-15)
import RewardReplaceRequestsAdmin from "../features/admin/modules/Reward_Replace_Request/Reward_Replace_Request";
import RewardReplaceItemsAdmin from "../features/admin/modules/Reward_Replace_Items/Reward_Replace_Items";
import RewardReplacePickupsAdmin from "../features/admin/modules/Reward_Replace_Pickups/Reward_Replace_Pickups";
import RewardReplaceStatusHistoryAdmin from "../features/admin/modules/Reward_Replace_Status_History/Reward_Replace_Status_History";

// CSS
import "../features/admin/assets/admin.css";

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
      <AdminHeader />
      <div className="admin-content">
        <Routes>
          <Route path="Users_2" element={<Users2 />} />
          <Route path="Add-User" element={<AddUser />} />
          <Route path="Edit-Users" element={<EditUser />} />

          <Route path="Home" element={<HomeAdmin />} />
          <Route path="Edit-Home" element={<EditHome />} />

          <Route path="Home-Hero-Image" element={<HomeHeroImage />} />
          <Route path="Edit-Home-Hero-Image" element={<EditHomeHeroImage />} />


          <Route path="Education" element={<EducationAdmin />} />
          <Route path="Add-Education" element={<AddEducation />} />
          <Route path="Edit-Education" element={<EditEducation />} />

          <Route path="Recycling-info" element={<RecyclingInfoAdmin />} />
          <Route path="Add-Category-Recycling-Info" element={<AddRecyclingInfo />} />
          <Route path="Edit-Category-Recycling-Info" element={<EditRecyclingInfo />} />

          <Route path="Brand" element={<BrandAdmin />} />
          <Route path="Add-Brand" element={<AddBrand />} />
          <Route path="Edit-Brand" element={<EditBrand />} />

          <Route path="Category-Brand-Mapping" element={<CategoryBrandMapping />} />
          <Route path="Add-Category-Brand-mapping" element={<AddCategoryBrandMapping />} />
          <Route path="Edit-Category-Brand" element={<EditCategoryBrand />} />

          <Route path="Product-Name" element={<ProductName />} />
          <Route path="Add-Product-Name" element={<AddProductName />} />
          <Route path="Edit-Product-Name" element={<EditProductName />} />

          <Route path="E-Waste-Submission" element={<EWasteSubmissionAdmin />} />
          <Route path="Add-E-Waste-Submission" element={<AddEWasteSubmission />} />
          <Route path="Edit-E-Waste-Submission" element={<EditEWasteSubmission />} />

          <Route path="E-Waste-Status-History" element={<EWasteStatusHistoryAdmin />} />
          <Route path="Edit-E-Waste-Status-History" element={<EditEWasteStatusHistory />} />


          <Route path="Reward-Condition" element={<RewardCondition />} />
          <Route path="Add-Reward-Condition" element={<AddRewardCondition />} />
          <Route path="Edit-Reward-Condition" element={<EditRewardCondition />} />

          <Route path="Reward-Rules" element={<RewardRulesAdmin />} />
          <Route path="Add-Reward-Rules" element={<AddRewardRules />} />
          <Route path="Edit-Reward-Rules" element={<EditRewardRules />} />

          <Route path="Reward-Category" element={<RewardCategory />} />
          <Route path="Add-Reward-Category" element={<AddRewardCategory />} />
          <Route path="Edit-Reward-Category" element={<EditRewardCategory />} />

          <Route path="Reward-Product" element={<RewardProductAdmin />} />
          <Route path="Add-Reward-Product" element={<AddRewardProduct />} />
          <Route path="Edit-Reward-Product" element={<EditRewardProduct />} />

          <Route path="Reward-Product-Image" element={<RewardProductImageAll />} />
          <Route path="Add-Reward-Product-Image" element={<AddRewardProductImage />} />
          <Route path="Edit-Reward-Product-Image" element={<EditRewardProductImage />} />

          <Route path="User-Wallet" element={<UserWalletAdmin />} />
          <Route path="Reward-Transactions" element={<RewardTransactionsAdmin />} />

          <Route path="Reward-Cart-List" element={<RewardCartAdmin />} />
          <Route path="Reward-Cart-Items" element={<RewardCartItemsAdmin />} />

          <Route path="Reward-Orders" element={<RewardOrdersAdmin />} />
          <Route path="Reward-Order-Items" element={<RewardOrderItemsAdmin />} />
          <Route path="Reward-Order-Address" element={<RewardOrderAddressAdmin />} />
          <Route path="Reward-Order-Payment" element={<RewardOrderPaymentAdmin />} />
          <Route path="Reward-Order-Status-History" element={<RewardOrderStatusHistoryAdmin />} />

          {/* Reward Returns (app-14) Routes */}
          <Route path="Reward-Return-Requests" element={<RewardReturnRequestsAdmin />} />
          <Route path="Reward-Return-Items" element={<RewardReturnItemsAdmin />} />
          <Route path="Reward-Return-Pickups" element={<RewardReturnPickupsAdmin />} />
          <Route path="Reward-Return-Status-History" element={<RewardReturnStatusHistoryAdmin />} />

          {/* Reward Replaces (app-15) Routes */}
          <Route path="Reward-Replace-Requests" element={<RewardReplaceRequestsAdmin />} />
          <Route path="Reward-Replace-Items" element={<RewardReplaceItemsAdmin />} />
          <Route path="Reward-Replace-Pickups" element={<RewardReplacePickupsAdmin />} />
          <Route path="Reward-Replace-Status-History" element={<RewardReplaceStatusHistoryAdmin />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
