import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reward_Condition_API } from "./api";
import Reward_Condition_Form from "./Reward_Condition_Form";


export default function Add_Reward_Condition() {
  

  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    display_name: "",
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
      await Reward_Condition_API.create(form)

      sessionStorage.setItem("success_message", "Reward Conditions added successfully!");
      navigate("/admin/Reward-Condition");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add Reward Conditions. Try again!");
      }
    }
  };

  return (
    <Reward_Condition_Form
      headingText="Add Reward Conditions"
      headingIcon="fa-list-check"
      breadcrumbText="Add Reward Conditions"
     
      isEdit={false}   // optional

      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Reward Conditions"
      submitButtonIcon="fa-save"
    
    />
  );
}
