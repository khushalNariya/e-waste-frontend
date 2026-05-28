import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Reward_Category_API } from "./api";
import Reward_Category_Form from "./Reward_Category_Form";


export default function Add_Reward_Category() {


  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",          // 🔥 ADD THIS
    name: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});







  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm(prev => ({
        ...prev,
        is_active: value === "true"
      }));
    } else {

      setForm({ ...form, [e.target.name]: e.target.value });
    }
    // remove error when typing
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };





  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setErrors({});



    try {
      await Reward_Category_API.create(form)

      sessionStorage.setItem("success_message", "Reward Category added successfully!");
      navigate("/admin/Reward-Category");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add Reward Category. Try again!");
      }
    }
  };

  return (
    <Reward_Category_Form
      headingText="Add Reward Category"
      headingIcon="fa-plus-circle"
      breadcrumbText="Add Reward Category"

      isEdit={false}   // optional


      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Reward Category"
      submitButtonIcon="fa-save"

    />
  );
}
