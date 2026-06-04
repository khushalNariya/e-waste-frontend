import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reward_Rules_API } from "./api";
import Reward_Rules_Form from "./Reward_Rules_Form";
import { Recycling_info_API } from "../../e-waste/recycling-info/api";
import { Reward_Condition_API } from "../conditions/api";

export default function Add_Reward_Rules() {


  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_id: "",
    condition_id: "",
    points: "",
    unit: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});


  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);

  useEffect(() => {

    // ✅ ALL categories
    Recycling_info_API.fetchAll(1, 1000).then(res => {
      setCategories(res.data.results);
    });

    // ✅ ACTIVE conditions
    Reward_Condition_API.fetchAll(1, 1000).then(res => {
      setConditions((res.data.results || []).filter(cond => cond.is_active));
    });

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
        [name]: value === "" ? null : value   // 🔥 IMPORTANT FIX
      }));
    }

  // remove error when typing
   setErrors(prev => ({ ...prev, [name]: "" }));

};







// ---------------- SUBMIT FORM ----------------
const handleSubmit = async (e) => {
  e.preventDefault();

  setErrorMsg("");
  setErrors({});



  try {
    await Reward_Rules_API.create(form)

    sessionStorage.setItem("success_message", "Reward Rules added successfully!");
    navigate("/admin/Reward-Rules");

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
  <Reward_Rules_Form
    headingText="Add Reward Rules"
    headingIcon="fa-plus"
    breadcrumbText="Add Reward Rules"

    isEdit={false}   // optional

    categories={categories}
    conditions={conditions}

    form={form}
    errors={errors}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    submitButtonText="Add Reward Rules"
    submitButtonIcon="fa-save"

  />
);
}
