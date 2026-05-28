import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Product_Name_API } from "./api";
import Product_Name_Form from "./Product_Name_Form";
import { Recycling_info_API } from "../Category -- Recycling Info/api";
import { Category_Brand_Mapping_API } from "../Category - Brand - Mapping/api";
import axiosInstance from "../JWT Auto Check/Axios_Instance";
import axios from "axios";


export default function Add_Product_Name() {


  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_id: "",          // 🔥 ADD THIS
    brand_id: "",
    // category_brand_mapping_id: "",
    model_name: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});


  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mappingList, setMappingList] = useState([]);



  useEffect(() => {

    axiosInstance.get("all-recycle-category/")
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.log("Category Error:", err));




  }, []);


  // ================= INPUT CHANGE =================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // ================= CATEGORY CHANGE =================
    if (name === "category_id") {

      setForm(prev => ({
        ...prev,
        category_id: value,
        brand_id: "",
        // category_brand_mapping_id: ""
      }));

      try {
        const res = await axiosInstance.get(
          `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Filter/?category_id=${value}`
        );


        const data = res.data.results || res.data; // depends on pagination

        // 🔥 mapping store
        setMappingList(data);

        // 🔥 only brands
        const uniqueBrands = [];
        const brandIds = new Set();

        data.forEach(item => {
          if (!brandIds.has(item.brand.id)) {
            brandIds.add(item.brand.id);
            uniqueBrands.push(item.brand);
          }
        });

        setBrands(uniqueBrands);

      } catch (err) {
        console.log("Brand fetch error", err);
      }
    }

    // ================= BRAND CHANGE =================
    else if (name === "brand_id") {

      const selectedMapping = mappingList.find(
        m => String(m.brand.id) === String(value)
      );

      setForm(prev => ({
        ...prev,
        brand_id: value,
        // category_brand_mapping_id: selectedMapping?.id
      }));
    }

    // ================= STATUS =================
    else if (name === "is_active") {
      setForm(prev => ({
        ...prev,
        is_active: value === "true"
      }));
    }

    // ================= OTHER =================
    else {
      setForm(prev => ({
        ...prev,
        [name]: value === "" ? null : value
      }));
    }

    setErrors(prev => ({ ...prev, [name]: "" }));
  };







  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setErrors({});



    try {
      await Product_Name_API.create({
        category_id: form.category_id,
        brand_id: form.brand_id,
        // category_brand_mapping_id: form.category_brand_mapping_id,
        model_name: form.model_name,
        is_active: form.is_active
      })

      sessionStorage.setItem("success_message", "Product Name added successfully!");
      navigate("/admin/Product-Name");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add Reward Rules. Try again!");
      }
    }
  };

  return (
    <Product_Name_Form
      headingText="Add Product Name"
      headingIcon="fa-plus-circle"
      breadcrumbText="Add Product Name"

      isEdit={false}   // optional

      categories={categories}
      brands={brands}

      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Product Name"
      submitButtonIcon="fa-save"

    />
  );
}
