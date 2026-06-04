/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { useNavigate, Link } from "react-router-dom";
import Category_Brand_Mapping_Form from "./Category_Brand_Mapping_Form";
// eslint-disable-next-line no-unused-vars
import { Category_Brand_Mapping_API } from "./api";
import { Recycling_info_API } from "../Category -- Recycling Info/api";
import { Brand_API } from "../Brands/api";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

export default function Add_Category_Brand_Mapping() {
// eslint-disable-next-line no-unused-vars


  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({

    category_id: "",
    brand_id: "",
    is_active: true,

  });


  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {

    // ✅ ALL categories
    axiosInstance.get("all-recycle-category/")
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.log("Category Error:", err));

    // ✅ ALL brands
    axiosInstance.get(`${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/all-brand-show/`)
      .then(res => {
        setBrands(res.data);   // 🔥 direct array (no pagination)
      })
      .catch(err => { console.log(err); });

  }, []);




  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm(prev => ({
        ...prev,
        is_active: value === "true"
      }));
    } else {

      setForm(prev => ({
        ...prev,
        [name]: value
      }));

    }
    setErrors(prev => ({ ...prev, [name]: "" }));
  };


  const validate = () => {
    let newErrors = {};

    if (!form.category_id) newErrors.category_id = "Required";
    if (!form.brand_id) newErrors.brand_id = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setErrors({});


    if (!validate()) return;

    try {
      await Category_Brand_Mapping_API.create(form)

      sessionStorage.setItem("success_message", "Category Wise Brand Value added successfully!");
      navigate("/admin/Category-Brand-Mapping");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add Brand-Name. Try again!");
      }
    }
  };

  return (
    <Category_Brand_Mapping_Form
      headingText="Add Category-Brand-Mapping"
      headingIcon="fa-plus"
      breadcrumbText="Add Category-Brand-Mapping"

      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Category-Brand-Mapping"
      submitButtonIcon="fa-save"

      categories={categories}
      brands={brands}

    />
  );
}
