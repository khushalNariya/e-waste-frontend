import React, { useState, useRef, useEffect } from "react";
import "./Reward_Product_Filter.css";

const Reward_Product_Filter = ({ products = [], selectedProduct = "", onSelect, placeholder = "All Products" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onSelect(val);
        setIsOpen(false);
        setSearchTerm("");
    };

    const filteredProducts = products.filter(prod => {
        const label = (prod.name || prod.title || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return label.includes(search);
    });

    const currentProduct = products.find(prod => prod.id == selectedProduct);

    return (
        <div className="reward-product-filter-container ms-2" ref={dropdownRef}>
            <div className={`reward-product-filter-wrapper ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="reward-product-filter-select shadow-sm">
                    <span className="text-truncate">
                        {currentProduct ? (currentProduct.name || currentProduct.title) : placeholder}
                    </span>
                </div>
                <i className={`fa fa-box reward-product-filter-icon-left ${selectedProduct ? 'text-warning' : 'text-muted'}`}></i>
                <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'} reward-product-filter-icon-right`}></i>
            </div>

            {isOpen && (
                <div className="reward-product-filter-dropdown shadow-lg">
                    <div className="position-relative mb-3">
                        <input
                            type="text"
                            className="reward-product-filter-search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                        <i className="fa fa-search position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px" }}></i>
                    </div>

                    <div style={{ maxHeight: "280px", overflowY: "auto" }} className="custom-scroll">
                        <div
                            className={`reward-product-filter-item ${!selectedProduct ? 'selected' : ''}`}
                            onClick={() => handleSelect("")}
                        >
                            <div className={`product-avatar ${!selectedProduct ? 'bg-white text-warning' : 'bg-light text-muted'}`}>
                                <i className="fa fa-th-large"></i>
                            </div>
                            {placeholder}
                        </div>

                        <div className="text-uppercase text-muted mx-2 my-2" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>Filter by Product</div>

                        {filteredProducts.map((prod) => {
                            const isSelected = selectedProduct == prod.id;
                            const label = prod.name || prod.title;
                            return (
                                <div
                                    key={prod.id}
                                    className={`reward-product-filter-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(prod.id)}
                                >
                                    <div className={`product-avatar ${isSelected ? 'bg-white text-warning' : 'bg-warning text-white'}`}
                                         style={{ background: isSelected ? "#fff" : "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                                        📦
                                    </div>
                                    <div className="text-truncate">
                                        {label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reward_Product_Filter;
