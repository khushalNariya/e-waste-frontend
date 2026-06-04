import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EducationForm from "./Education_Form";
import { Education_API } from "./api";

export default function Add_Education_2() {

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    category: "",
    author: "",
    date: "",
    readTime: "",
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);   // 👈 ADD THIS

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });

      if (file) {
        setPreview(URL.createObjectURL(file));  // 👈 IMAGE PREVIEW
      }

    } else if (e.target.type === "checkbox") {
      setForm({ ...form, [e.target.name]: e.target.checked });

    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setSuccessMsg("");
    setErrorMsg("");
    setErrors({});


    try {
      await Education_API.create(form)
      // first_name: firstName,
      // last_name: lastName,
      // email,
      // password,
      // mobile_number: mobile,
      // address_line_1: address1,
      // address_line_2: address2,
      // city,
      // state,
      // pincode,
      // });

      sessionStorage.setItem("success_message", "Education added successfully!");
      navigate("/admin/Education");

    } catch (err) {
      if (err.response?.data) {
        console.log(err.response.data); // <- check yaha

        setErrors(err.response.data); // DRF errors show
      } else {
        setErrorMsg("Failed to add user. Try again!");
      }
    }
  };

  return (
    <EducationForm
      headingText="Add Education"
      headingIcon="fa-plus"
      breadcrumbText="Add Education"
      form={form}
      errors={errors}
      preview={preview}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitButtonText="Add Education"
      submitButtonIcon="fa-save"
    />
  );
}
