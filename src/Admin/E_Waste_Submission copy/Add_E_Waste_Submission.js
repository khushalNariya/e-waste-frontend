import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { E_Waste_Submission_API } from "./E_Waste_Submission_api";
import E_Waste_Submission_Form from "./E_Waste_Submission_Form";
import axiosInstance from "../JWT Auto Check/Axios_Instance";
import { Reward_Condition_API } from "../Reward Condition/api";
import { Recycling_info_API } from "../Category -- Recycling Info/api";

export default function Add_E_Waste_Submission() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    category_id: "",
    category_brand_mapping_id: "",
    model_id: "",
    user_condition_id: "",
    facility_id: "",
    pickup_type: "pickup",
    address: "",
    pickup_date: "",
    pickup_time: "",
    phone: "",
    notes: "",
    status: "Requested",
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    // 1. Fetch Categories
    Recycling_info_API.fetchAll(1, 100).then(res => {
      setCategories(res.data.results || res.data);
    }).catch(err => console.log("Category Error:", err));

    // 2. Fetch Conditions
    Reward_Condition_API.fetchAll()
      .then(res => setConditions(res.data.results || res.data))
      .catch(err => console.log("Condition Error:", err));

    // 3. Fetch Facilities
    axiosInstance.get("facilities/")
      .then(res => setFacilities(res.data.results || res.data))
      .catch(err => console.log("Facility Error:", err));
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // 1. CATEGORY CHANGE -> Fetch Brands
    if (name === "category_id") {
      setForm(prev => ({
        ...prev,
        category_id: value,
        category_brand_mapping_id: "",
        model_id: ""
      }));
      setBrands([]);
      setModels([]);

      if (value) {
        try {
          const res = await axiosInstance.get(
            `http://127.0.0.1:1000/User-api/Category_Wise_Brand_Filter/?category_id=${value}`
          );
          setBrands(res.data.results || res.data);
        } catch (err) {
          console.log("Brand fetch error", err);
        }
      }
    }

    // 2. BRAND CHANGE -> Fetch Models
    else if (name === "category_brand_mapping_id") {
        setForm(prev => ({
            ...prev,
            category_brand_mapping_id: value,
            model_id: ""
        }));
        setModels([]);

        if (value) {
            try {
                const res = await axiosInstance.get(
                    `http://127.0.0.1:1000/User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${value}`
                );
                setModels(res.data.results || res.data);
            } catch (err) {
                console.log("Model fetch error", err);
            }
        }
    }

    // OTHER FIELDS
    else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setErrors({});

    try {
      await E_Waste_Submission_API.create(form);
      sessionStorage.setItem("success_message", "E-Waste Submission added successfully!");
      navigate("/admin/E-Waste-Submission");
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrorMsg("Failed to add Submission. Try again!");
      }
    }
  };

  return (
    <E_Waste_Submission_Form
      headingText="Add E-Waste Submission"
      headingIcon="fa-plus-circle"
      breadcrumbText="Add E-Waste Submission"
      isEdit={false}
      categories={categories}
      brands={brands}
      models={models}
      conditions={conditions}
      facilities={facilities}
      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Submission"
      submitButtonIcon="fa-save"
    />
  );
}
