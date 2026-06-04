import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Product_Name_Form from "./Product_Name_Form";
import { Product_Name_API } from "./api";
import axiosInstance from "../JWT Auto Check/Axios_Instance";

export default function Edit_Product_Name() {
    const navigate = useNavigate();
    const Product_Name_Id = sessionStorage.getItem("edit_Product_Name_id");

    const [form, setForm] = useState({
        id: "",
        category_id: "",
        brand_id: "",
        // category_brand_mapping_id: "",
        model_name: "",
        is_active: true,
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    //   const [mappingList, setMappingList] = useState([]);

    useEffect(() => {
        if (!Product_Name_Id) {
            navigate("/admin/Product-Name");
            return;
        }

        const loadData = async () => {
            try {
                // 1️⃣ Product details
                const productRes = await Product_Name_API.getById(Product_Name_Id);
                const product = productRes.data;

                const catRes = await axiosInstance.get(
                    "all-recycle-category/"
                );
                setCategories(catRes.data); // pure array

                // 3️⃣ Category-brand mapping
                const categoryId = product.category?.id;
                let mapData = [];
                if (categoryId) {
                    const mapRes = await axiosInstance.get(
                        `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Filter/?category_id=${categoryId}`
                    );
                    mapData = mapRes.data.results || mapRes.data;
                    // setMappingList(mapData);

                    // 4️⃣ Unique brands
                    const uniqueBrands = [];
                    const brandIds = new Set();
                    mapData.forEach((item) => {
                        if (!brandIds.has(item.brand.id)) {
                            brandIds.add(item.brand.id);
                            uniqueBrands.push(item.brand);
                        }
                    });
                    setBrands(uniqueBrands);

                    // 5️⃣ Pre-select brand & mapping
                    //   const selectedMapping = mapData.find(
                    //     (m) => String(m.brand.id) === String(product.brand?.id)
                    //   );
                }
                setForm({
                    id: product.id || "",
                    category_id: categoryId || "",
                    brand_id: product.brand?.id || "",   // ✅ direct

                    // brand_id: selectedMapping?.brand.id || "",
                    model_name: product.model_name || "",
                    is_active: product.is_active,
                });
            }
            catch (err) {
                console.log("Load Data Error:", err);
                alert("Failed to load data");
            }
        };

        loadData();
    }, [Product_Name_Id, navigate]);


    // ============= handle change =============
    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "category_id") {
            setForm((prev) => ({
                ...prev,
                category_id: value,
                brand_id: "",
            }));

            try {
                const res = await axiosInstance.get(
                    `${(process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/").replace(/\/$/, "")}/User-api/Category_Wise_Brand_Filter/?category_id=${value}`
                );
                const data = res.data.results || res.data;
                // setMappingList(data);

                // ============= Unique Brands =============
                const uniqueBrands = [];
                const brandIds = new Set();

                data.forEach((item) => {
                    if (!brandIds.has(item.brand.id)) {
                        brandIds.add(item.brand.id);
                        uniqueBrands.push(item.brand);
                    }
                });
                setBrands(uniqueBrands);
            } catch (err) {
                console.log("Brand fetch error", err);
            }
        } else if (name === "brand_id") {
            // const selectedMapping = mappingList.find(
            //     (m) => String(m.brand.id) === String(value)
            // );
            setForm((prev) => ({
                ...prev,
                brand_id: value,
                // category_brand_mapping_id: selectedMapping?.id,
            }));
        } else if (name === "is_active") {
            setForm((prev) => ({ ...prev, is_active: value === "true" }));
        } else {
            // setForm((prev) => ({ ...prev, [name]: value === "" ? null : value }));
            // setForm((prev) => ({ ...prev, [name]: value === "" ? "" : value }));
            setForm((prev) => ({ ...prev, [name]: value  }));
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Product_Name_API.update_1(Product_Name_Id, {
                // category_brand_mapping_id: form.category_brand_mapping_id,
                category_id: form.category_id,
                brand_id: form.brand_id,
                model_name: form.model_name,
                is_active: form.is_active,
            });
            sessionStorage.setItem(
                "success_message",
                "Product Name Updated Successfully!"
            );
            navigate("/admin/Product-Name");
        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    return (
        <Product_Name_Form
            headingText="Edit Product Name"
            headingIcon="fa-pen-to-square"
            breadcrumbText="Edit Product Name"
            isEdit={true}
            categories={categories}
            brands={brands}
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitButtonText="Update"
            submitButtonIcon="fa-pen"
        />
    );
}