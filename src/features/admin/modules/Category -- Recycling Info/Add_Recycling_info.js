/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { useNavigate, Link } from "react-router-dom";
import { Recycling_info_API } from "./api";
import Recycling_info_Form from "./Recycling_info_Form";


export default function Add_Recycling_info() {

// eslint-disable-next-line no-unused-vars

  const [errorMsg, setErrorMsg] = useState("");


  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    process: "",
    instruction: "",
    benefits: "",
    button_text: "",
    icon: ""

  });

  const [errors, setErrors] = useState({});



  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // remove error when typing
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };
  
  
  
  // ================= Process (Field) INPUT CHANGE =================

  const [steps, setSteps] = useState(["", "", ""]);

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);

    // ✅ process error remove karo
  setErrors(prev => ({ ...prev, process: "" }));
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };


  // ================= SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setErrors({});

    // ✅ steps ko convert karo
    const formattedProcess = steps
      .map(s => s.trim())
      .filter(s => s)
      .join("\n");   // backend ke liye newline

    const finalData = {
      ...form,
      process: formattedProcess
    };


    try {
      await Recycling_info_API.create(finalData)

      sessionStorage.setItem("success_message", "Recycling Info added successfully!");
      navigate("/admin/Recycling-info");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add Recycling Info. Try again!");
      }
    }
  };


  

  return (
    <Recycling_info_Form
      headingText="Add Recycling Info"
      headingIcon="fa-recycle"
      breadcrumbText="Add Recycling Info"

      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Recycling Info"
      submitButtonIcon="fa-save"


      steps={steps}
      handleStepChange={handleStepChange}
      addStep={addStep}

    />
  );
}
