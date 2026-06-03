import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Brand_API } from "./api";
import Brand_Form from "./Brand_Form";


export default function Add_Brand() {
  

  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({});



  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // remove error when typing
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };


  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setErrors({});


    // if (!validate()) return;

    try {
      await Brand_API.create(form)

      sessionStorage.setItem("success_message", "Brand-Name added successfully!");
      navigate("/admin/Brand");

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
    <Brand_Form
      headingText="Add Brand-Name"
      headingIcon="fa-plus"
      breadcrumbText="Add Brand-Name"
     
      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Brand-Name"
      submitButtonIcon="fa-save"
    
    />
  );
}
