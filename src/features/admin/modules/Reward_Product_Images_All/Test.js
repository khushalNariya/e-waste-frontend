// // import { API_Service } from "../API/API_Service";
// // 
// // export const Reward_Product_Image_API = API_Service("9___3___API__app__9__Reward_Product_Image");
// // export const Reward_Product_API = API_Service("9___2___API__app__9__Reward_Product");
// 
// 
// 
// 
// // # ===================================================================================
// // # ===================================================================================
// // # ===================================================================================
// 
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Reward_Product_Image_API, Reward_Product_API } from "./api";
// import Reward_Product_Image_Form from "./Reward_Product_Image_Form";
// 
// export default function Edit_Reward_Product_Image() {
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [form, setForm] = useState({
//         id: "",
//         product_id: "",
//         image: null,
//         is_primary: false,
//         display_order: 1,
//         is_active: true,
//     });
//     const [errors, setErrors] = useState({});
// 
//     useEffect(() => {
//         const id = sessionStorage.getItem("edit_Reward_Product_Image_id");
//         if (!id) {
//             navigate("/admin/Reward-Product-Image");
//             return;
//         }
// 
//         const fetchData = async () => {
//             try {
//                 // Fetch products for dropdown
//                 const prodRes = await Reward_Product_API.fetchAll(1, 1000);
//                 setProducts(prodRes.data.results || []);
// 
//                 // Fetch current image data
//                 const res = await Reward_Product_Image_API.getById(id);
//                 const data = res.data;
//                 setForm({
//                     id: data.id,
//                     product_id: data.product ? data.product.id : "",
//                     image: data.image, // URL for display
//                     is_primary: data.is_primary,
//                     display_order: data.display_order,
//                     is_active: data.is_active,
//                 });
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//             }
//         };
//         fetchData();
//     }, [navigate]);
// 
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };
// 
//     const handleFileChange = (e) => {
//         setForm((prev) => ({ ...prev, new_image: e.target.files[0] }));
//     };
// 
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
// 
//         const formData = new FormData();
//         formData.append("product_id", form.product_id);
//         if (form.new_image) formData.append("image", form.new_image);
//         formData.append("is_primary", form.is_primary);
//         formData.append("display_order", form.display_order);
//         formData.append("is_active", form.is_active);
// 
//         try {
//             await Reward_Product_Image_API.update_1(form.id, formData);
//             sessionStorage.setItem("success_message", "Product image updated successfully!");
//             navigate("/admin/Reward-Product-Image");
//         } catch (err) {
//             if (err.response && err.response.data) {
//                 setErrors(err.response.data);
//             } else {
//                 console.error("Update error:", err);
//             }
//         }
//     };
// 
//     return (
//         <Reward_Product_Image_Form
//             headingText="Edit Product Image"
//             headingIcon="fa-edit"
//             breadcrumbText="Edit Image"
//             isEdit={true}
//             form={form}
//             errors={errors}
//             products={products}
//             handleChange={handleChange}
//             handleFileChange={handleFileChange}
//             handleSubmit={handleSubmit}
//             submitButtonText="Update Image Data"
//             submitButtonIcon="fa-save"
//         />
//     );
// }
// 
// 
// // ===================================================================================
// // ===================================================================================
// // ===================================================================================
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Reward_Product_Image_API, Reward_Product_API } from "./api";
// import Reward_Product_Image_Form from "./Reward_Product_Image_Form";
// 
// export default function Add_Reward_Product_Image() {
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [form, setForm] = useState({
//         product_id: "",
//         image: null,
//         is_primary: false,
//         display_order: 1,
//         is_active: true,
//     });
//     const [errors, setErrors] = useState({});
// 
//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const res = await Reward_Product_API.fetchAll(1, 1000); // Get all products
//                 setProducts(res.data.results || []);
//             } catch (err) {
//                 console.error("Error fetching products:", err);
//             }
//         };
//         fetchProducts();
//     }, []);
// 
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };
// 
//     const handleFileChange = (e) => {
//         setForm((prev) => ({ ...prev, image: e.target.files[0] }));
//     };
// 
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
// 
//         const formData = new FormData();
//         formData.append("product_id", form.product_id);
//         if (form.image) formData.append("image", form.image);
//         formData.append("is_primary", form.is_primary);
//         formData.append("display_order", form.display_order);
//         formData.append("is_active", form.is_active);
// 
//         try {
//             await Reward_Product_Image_API.create(formData);
//             sessionStorage.setItem("success_message", "Product image added successfully!");
//             navigate("/admin/Reward-Product-Image");
//         } catch (err) {
//             if (err.response && err.response.data) {
//                 setErrors(err.response.data);
//             } else {
//                 console.error("Submit error:", err);
//             }
//         }
//     };
// 
//     return (
//         <Reward_Product_Image_Form
//             headingText="Add New Product Image"
//             headingIcon="fa-plus-circle"
//             breadcrumbText="Add Image"
//             isEdit={false}
//             form={form}
//             errors={errors}
//             products={products}
//             handleChange={handleChange}
//             handleFileChange={handleFileChange}
//             handleSubmit={handleSubmit}
//             submitButtonText="Upload Image"
//             submitButtonIcon="fa-upload"
//         />
//     );
// }
// 
// 
// // ===================================================================================
// // ===================================================================================
// // ===================================================================================
// import React from "react";
// import Page_Header_Edit_or_Add from "../Common Files/Page_Header_Edit__or__Add";
// 
// export default function Reward_Product_Image_Form({
//     headingText,
//     headingIcon,
//     breadcrumbText,
//     isEdit,
//     form,
//     errors,
//     products,
//     handleChange,
//     handleFileChange,
//     handleSubmit,
//     submitButtonText,
//     submitButtonIcon,
// }) {
//     return (
//         <div className="admin-content mt-4">
//             <Page_Header_Edit_or_Add
//                 headingText={headingText}
//                 headingIcon={headingIcon}
//                 breadcrumbText={breadcrumbText}
//                 breadIcon="fa-images"
//                 listLink="/admin/Reward-Product-Image"
//                 listName="Image List"
//             />
// 
//             <div className="row justify-content-center">
//                 <div className="col-lg-8">
//                     <div className="card shadow-sm border-0">
//                         <div className="card-body">
//                             <form onSubmit={handleSubmit}>
//                                 {errors.non_field_errors && (
//                                     <div className="alert alert-danger">
//                                         {errors.non_field_errors[0]}
//                                     </div>
//                                 )}
// 
//                                 {isEdit && (
//                                     <div className="mb-3">
//                                         <label className="form-label text-muted small">IMAGE ID</label>
//                                         <input
//                                             type="text"
//                                             value={form.id}
//                                             className="form-control bg-light"
//                                             readOnly
//                                         />
//                                     </div>
//                                 )}
// 
//                                 <div className="row">
//                                     {/* Product Selection */}
//                                     <div className="col-md-8 mb-3">
//                                         <label className="form-label">Reward Product</label>
//                                         <select
//                                             name="product_id"
//                                             className={`form-select ${errors.product_id ? "is-invalid" : ""}`}
//                                             value={form.product_id}
//                                             onChange={handleChange}
//                                         >
//                                             <option value="">Select Product</option>
//                                             {products.map((p) => (
//                                                 <option key={p.id} value={p.id}>
//                                                     {p.name} (ID: {p.id})
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.product_id && <div className="invalid-feedback">{errors.product_id}</div>}
//                                     </div>
// 
//                                     {/* Display Order */}
//                                     <div className="col-md-4 mb-3">
//                                         <label className="form-label">Display Order</label>
//                                         <input
//                                             type="number"
//                                             name="display_order"
//                                             className={`form-control ${errors.display_order ? "is-invalid" : ""}`}
//                                             value={form.display_order}
//                                             onChange={handleChange}
//                                         />
//                                         {errors.display_order && <div className="invalid-feedback">{errors.display_order}</div>}
//                                     </div>
//                                 </div>
// 
//                                 <div className="row align-items-end">
//                                     {/* Image Upload */}
//                                     <div className="col-md-12 mb-3">
//                                         <label className="form-label">Product Image</label>
//                                         <div className="input-group">
//                                             <span className="input-group-text bg-white border-end-0">
//                                                 <i className="fa fa-image text-muted"></i>
//                                             </span>
//                                             <input
//                                                 type="file"
//                                                 name="image"
//                                                 className={`form-control border-start-0 ${errors.image ? "is-invalid" : ""}`}
//                                                 onChange={handleFileChange}
//                                                 accept="image/*"
//                                             />
//                                             {errors.image && <div className="invalid-feedback">{errors.image}</div>}
//                                         </div>
//                                         {isEdit && form.image && typeof form.image === 'string' && (
//                                             <div className="mt-2 text-center p-2 border rounded bg-light">
//                                                 <small className="d-block text-muted mb-1">Current Image:</small>
//                                                 <img src={form.image} alt="Current" width="120" className="rounded shadow-sm" />
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
// 
//                                 <div className="row mt-3">
//                                     {/* Is Primary */}
//                                     <div className="col-md-6 mb-3">
//                                         <div className="form-check form-switch p-2 border rounded bg-light-subtle">
//                                             <label className="form-check-label ms-2" htmlFor="primarySwitch">
//                                                 <strong>Is Primary Image?</strong>
//                                                 <br />
//                                                 <small className="text-muted">Primary image will be shown as main thumbnail</small>
//                                             </label>
//                                             <input
//                                                 className="form-check-input float-end me-2"
//                                                 type="checkbox"
//                                                 id="primarySwitch"
//                                                 checked={form.is_primary}
//                                                 onChange={(e) => handleChange({
//                                                     target: { name: 'is_primary', value: e.target.checked }
//                                                 })}
//                                             />
//                                         </div>
//                                     </div>
// 
//                                     {/* Is Active */}
//                                     <div className="col-md-6 mb-3">
//                                         <div className="form-check form-switch p-2 border rounded bg-light-subtle text-end">
//                                             <input
//                                                 className="form-check-input float-start ms-2"
//                                                 type="checkbox"
//                                                 id="activeSwitch"
//                                                 checked={form.is_active}
//                                                 onChange={(e) => handleChange({
//                                                     target: { name: 'is_active', value: e.target.checked }
//                                                 })}
//                                             />
//                                             <label className="form-check-label me-2" htmlFor="activeSwitch">
//                                                 <strong>Status: {form.is_active ? "Active" : "Inactive"}</strong>
//                                                 <br />
//                                                 <small className="text-muted">Visibility of this image</small>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
// 
//                                 <button type="submit" className="add-btn w-100 py-3 mt-4">
//                                     <i className={`fa ${submitButtonIcon} me-2`}></i>
//                                     {submitButtonText}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// 
// 
// // ===================================================================================
// // ===================================================================================
// // ===================================================================================
// import React, { useEffect, useState, useRef } from "react";
// import { Reward_Product_Image_API } from "./api";
// import { Fatch_Reward_Product_Image_Table } from "./Table";
// import { calculatePagination } from "../Pagination/Pagination";
// import { useNavigate } from "react-router-dom";
// import Admin_List_Header from "../Common Files/Admin_List_Header";
// import Admin_Pagination_Buttons from "../Common Files/Admin_Pagination_Buttons";
// import Admin_Table from "../Common Files/Admin_Table";
// 
// export default function Reward_Product_Image_admin() {
//     const navigate = useNavigate();
// 
//     const [rows, setRows] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [currentLimit, setCurrentLimit] = useState(5);
//     const [searchText, setSearchText] = useState("");
// 
//     const [paginationStats, setPaginationStats] = useState({
//         totalRecords: 0,
//         startEntry: 0,
//         endEntry: 0,
//         totalPages: 1,
//     });
// 
//     const [successMsg, setSuccessMsg] = useState("");
//     const [fadeOut, setFadeOut] = useState(false);
//     const [deletingId, setDeletingId] = useState(null);
//     const successRef = useRef(null);
// 
//     // LOAD DATA
//     const loadTable = async (page = 1, limit = 5, searchTerm = "") => {
//         try {
//             const res = await Reward_Product_Image_API.fetchAll(page, limit, searchTerm);
//             const data = res.data.results || [];
//             setRows(data);
// 
//             const stats = calculatePagination(
//                 res.data,
//                 page,
//                 limit,
//                 data.length
//             );
//             setPaginationStats(stats);
//         } catch (err) {
//             console.error("API ERROR", err);
//         }
//     };
// 
//     useEffect(() => {
//         loadTable(currentPage, currentLimit, searchText);
//     }, [currentPage, currentLimit, searchText]);
// 
//     // EDIT
//     const edit_Image = (id) => {
//         sessionStorage.setItem("edit_Reward_Product_Image_id", id);
//         navigate("/admin/Edit-Reward-Product-Image");
//     };
// 
//     // TOGGLE STATUS
//     const toggleStatus = async (id) => {
//         try {
//             const image = rows.find(r => r.id === id);
//             const newStatus = !image.is_active;
// 
//             setRows(prev => prev.map(r => r.id === id ? { ...r, is_active: newStatus } : r));
// 
//             await Reward_Product_Image_API.update_1(id, { is_active: newStatus });
//         } catch (error) {
//             console.error("Toggle Status Error:", error);
//             loadTable(currentPage, currentLimit, searchText);
//         }
//     };
// 
//     // DELETE
//     const deleteImage = async (id) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this product image?");
//         if (!confirmDelete) return;
// 
//         try {
//             await Reward_Product_Image_API.Delete(id);
//             setDeletingId(id);
//             setTimeout(() => {
//                 setRows(prev => prev.filter(r => r.id !== id));
//                 setDeletingId(null);
//             }, 500);
//             setSuccessMsg("Product image deleted successfully.");
//         } catch (err) {
//             console.error("Delete Error:", err);
//         }
//     };
// 
//     // Messages
//     useEffect(() => {
//         const msg = sessionStorage.getItem("success_message");
//         if (msg) {
//             setSuccessMsg(msg);
//             sessionStorage.removeItem("success_message");
//         }
//     }, []);
// 
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (successRef.current && !successRef.current.contains(event.target)) {
//                 setFadeOut(true);
//                 setTimeout(() => {
//                     setSuccessMsg("");
//                     setFadeOut(false);
//                 }, 500);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [successRef]);
// 
//     return (
//         <div className="admin-content p-3">
//             <Admin_List_Header
//                 title="Reward Product Images"
//                 addButtonText="Add Product Image"
//                 addButtonLink="/admin/Add-Reward-Product-Image"
//                 searchText={searchText}
//                 setSearchText={setSearchText}
//                 currentLimit={currentLimit}
//                 setCurrentLimit={setCurrentLimit}
//                 setCurrentPage={setCurrentPage}
//                 successMsg={successMsg}
//                 fadeOut={fadeOut}
//                 successRef={successRef}
//             />
// 
//             <div className="table-responsive mt-3">
//                 <form id="load-data" onSubmit={(e) => e.preventDefault()}>
//                     <Admin_Table
//                         columns={["ID", "Preview", "Product Info", "Type", "Order", "Status", "Created At", "Updated At", "Action"]}
//                     >
//                         {Fatch_Reward_Product_Image_Table(rows, edit_Image, deleteImage, toggleStatus, deletingId)}
//                     </Admin_Table>
// 
//                     <Admin_Pagination_Buttons
//                         paginationStats={paginationStats}
//                         currentPage={currentPage}
//                         setCurrentPage={setCurrentPage}
//                     />
//                 </form>
//             </div>
//         </div>
//     );
// }
// 
// 
// // ===================================================================================
// // ===================================================================================
// // ===================================================================================
// import React from "react";
// 
// export function Fatch_Reward_Product_Image_Table(rows, edit_Users, deleteImage, toggleStatus, deletingId) {
// 
//     if (!rows || rows.length === 0) {
//         return (
//             <tr>
//                 <td colSpan="9" className="text-center text-muted">
//                     No Data Found
//                 </td>
//             </tr>
//         );
//     }
// 
//     return rows.map((u) => (
//         <tr key={u.id} className={deletingId === u.id ? "fade-row" : ""}>
//             <td>{u.id}</td>
//             <td>
//                 {u.image && (
//                     <div className="p-1 border rounded bg-light d-inline-block shadow-sm">
//                         <img
//                             src={u.image}
//                             width="60"
//                             height="60"
//                             alt="Product"
//                             style={{ objectFit: "cover", borderRadius: "4px" }}
//                         />
//                     </div>
//                 )}
//             </td>
//             <td>
//                 <span className="fw-bold text-dark">{u.product ? u.product.name : "N/A"}</span>
//                 <br />
//                 <small className="text-muted">ID: {u.product ? u.product.id : "N/A"}</small>
//             </td>
//             <td>
//                 {u.is_primary ? (
//                     <span className="badge bg-primary rounded-pill">
//                         <i className="fa fa-star me-1 text-warning"></i> Primary
//                     </span>
//                 ) : (
//                     <span className="badge bg-light text-dark border">Regular</span>
//                 )}
//             </td>
//             <td>
//                 <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-1 rounded-pill">
//                     {u.display_order}
//                 </span>
//             </td>
// 
//             {/* Status with Premium Toggle Button (Similar to Reward Product) */}
//             <td className="text-center">
//                 <button
//                     onClick={() => toggleStatus(u.id)}
//                     className="btn btn-sm rounded-pill border-0 shadow-sm d-inline-flex align-items-center justify-content-center"
//                     style={{
//                         background: u.is_active
//                             ? "linear-gradient(135deg, #6366f1, #a855f7)"
//                             : "#f8f9fa",
//                         color: u.is_active ? "white" : "#6c757d",
//                         padding: "4px 12px",
//                         minWidth: "85px",
//                         fontSize: "11px",
//                         fontWeight: "700",
//                         transition: "all 0.3s ease",
//                         cursor: "pointer",
//                         border: u.is_active ? "none" : "1px solid #dee2e6",
//                         margin: "4px 0"
//                     }}
//                     title={u.is_active ? "Active" : "Inactive"}
//                 >
//                     <div
//                         style={{
//                             width: "6px",
//                             height: "6px",
//                             borderRadius: "50%",
//                             background: "white",
//                             marginRight: "6px",
//                             display: u.is_active ? "block" : "none"
//                         }}
//                     />
//                     {u.is_active ? "ACTIVE" : "INACTIVE"}
//                 </button>
//             </td>
// 
//             <td className="Home_Date-col">{u.created_at}</td>
//             <td className="Home_Date-col">{u.updated_at}</td>
// 
//             <td className="text-center">
//                 <div className="action-btn-group">
//                     <button
//                         type="button"
//                         className="btn btn-primary btn-sm action-btn"
//                         onClick={() => edit_Users(u.id)}
//                         title="Edit Image"
//                     >
//                         <i className="fa fa-edit"></i>
//                     </button>
//                     <button
//                         type="button"
//                         className="btn btn-danger btn-sm action-btn"
//                         onClick={() => deleteImage(u.id)}
//                         disabled={deletingId === u.id}
//                         title="Delete Image"
//                     >
//                         {deletingId === u.id ? (
//                             <i className="fa fa-spinner fa-spin"></i>
//                         ) : (
//                             <i className="fa fa-trash"></i>
//                         )}
//                     </button>
//                 </div>
//             </td>
//         </tr>
//     ));
// }
