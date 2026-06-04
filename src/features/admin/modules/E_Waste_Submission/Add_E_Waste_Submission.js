import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { E_Waste_Submission_API } from "./E_Waste_Submission_api";
import E_Waste_Submission_Form from "./E_Waste_Submission_Form";
import axiosInstance from "../JWT Auto Check/Axios_Instance";
import { Reward_Condition_API } from "../Reward Condition/api";
import { Recycling_info_API } from "../Category -- Recycling Info/api";
import { Reward_Rules_API } from "../Reward Rules/api";

export default function Add_E_Waste_Submission() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [rewardRules, setRewardRules] = useState([]);  const [form, setForm] = useState({
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
    // status: "Requested",
    status: "requested",
    images: [],
    weight: "",
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

    // 4. Fetch Reward Rules (for determining unit by category)
    Reward_Rules_API.fetchAll(1, 1000)
      .then(res => setRewardRules(res.data.results || res.data))
      .catch(err => console.log("Reward Rules Error:", err));
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "images") {
      const newFiles = Array.from(value);
      setForm(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newFiles]
      }));
      setErrors(prev => ({ ...prev, images: "", error: "" }));
      return;
    }

    // 1. CATEGORY CHANGE -> Fetch Brands
    if (name === "category_id") {

      const matchingRule = rewardRules.find(rule => String(rule.category?.id) === String(value));
      if (matchingRule) {
        setSelectedUnit(matchingRule.unit?.toLowerCase() || "");
      } else {
        setSelectedUnit("");
      }

      setForm(prev => ({
        ...prev,
        category_id: value,
        category_brand_mapping_id: "",
        model_id: "",
        weight: ""
      }));
      setBrands([]);
      setModels([]);


      if (value) {
        try {
          const res = await axiosInstance.get(
            `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Filter/?category_id=${value}`
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
            `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${value}`
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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrorMsg("");
  //   setErrors({});

  //   try {
  //     await E_Waste_Submission_API.create(form);
  //     sessionStorage.setItem("success_message", "E-Waste Submission added successfully!");
  //     navigate("/admin/E-Waste-Submission");
  //   } catch (err) {
  //     if (err.response?.data) {
  //       setErrors(err.response.data);
  //     } else {
  //       setErrorMsg("Failed to add Submission. Try again!");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // 🔹 normal fields
      Object.keys(form).forEach(key => {
        if (key !== "images") {
          formData.append(key, form[key]);
        }
      });

      // 🔹 images append
      if (form.images) {
        for (let i = 0; i < form.images.length; i++) {
          formData.append("images", form.images[i]);
        }
      }

      await axiosInstance.post(
        "10___API__app__10__E_Waste_Submission/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      sessionStorage.setItem("success_message", "Submission added!");
      navigate("/admin/E-Waste-Submission");

    }
    catch (err) {
      console.log("ERROR RESPONSE:", err.response?.data); // 👈 ADD THIS

      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrorMsg("Failed!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
      errorMsg={errorMsg}
      handleChange={handleChange}
      handleRemoveImage={handleRemoveImage}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Add Submission"
      submitButtonIcon="fa-save"
      selectedUnit={selectedUnit}
    />
  );
}
