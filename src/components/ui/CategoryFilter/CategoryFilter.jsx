import React, { useState, useRef, useEffect } from "react";
import "./Category_Filter.css";

const Category_Filter = ({ categories = [], selectedCategory = "", onSelect }) => {
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

    const filteredCategories = categories.filter(cat => {
        const label = (cat.name || cat.title || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return label.includes(search);
    });

    const currentCategory = categories.find(cat => cat.id == selectedCategory);

    return (
        <div className="category-filter-container ms-2" ref={dropdownRef}>
            <div className={`category-filter-wrapper ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="category-filter-select shadow-sm">
                    <span className="text-truncate">
                        {currentCategory ? (currentCategory.name || currentCategory.title) : "All Categories"}
                    </span>
                </div>
                <i className={`fa fa-folder-open category-filter-icon-left ${selectedCategory ? 'text-success' : 'text-muted'}`}></i>
                <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'} category-filter-icon-right`}></i>
            </div>

            {isOpen && (
                <div className="category-filter-dropdown shadow-lg">
                    <div className="position-relative mb-3">
                        <input
                            type="text"
                            className="category-filter-search-input"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                        <i className="fa fa-search position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px" }}></i>
                    </div>

                    <div style={{ maxHeight: "280px", overflowY: "auto" }} className="custom-scroll">
                        <div
                            className={`category-filter-item ${!selectedCategory ? 'selected' : ''}`}
                            onClick={() => handleSelect("")}
                        >
                            <div className={`category-avatar ${!selectedCategory ? 'bg-white text-success' : 'bg-light text-muted'}`}>
                                <i className="fa fa-th-large"></i>
                            </div>
                            All Categories
                        </div>

                        <div className="text-uppercase text-muted mx-2 my-2" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>Filter by Category</div>

                        {filteredCategories.map((cat) => {
                            const isSelected = selectedCategory == cat.id;
                            const label = cat.name || cat.title;
                            return (
                                <div
                                    key={cat.id}
                                    className={`category-filter-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(cat.id)}
                                >
                                    <div className={`category-avatar ${isSelected ? 'bg-white text-success' : 'bg-success text-white'}`}
                                         style={{ background: isSelected ? "#fff" : "linear-gradient(135deg, #10b981, #059669)" }}>
                                        📁
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

export default Category_Filter;
