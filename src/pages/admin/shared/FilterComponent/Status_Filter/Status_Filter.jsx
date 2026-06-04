import React, { useState, useRef, useEffect } from "react";
import "./Status_Filter.css";

const Status_Filter = ({ selectedStatus = "", onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
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
    };

    const statusOptions = [
        { id: "", label: "All Status", icon: "fa-th-large", color: "#64748b" },
        { id: "1", label: "Active", icon: "fa-check-circle", color: "#10b981" },
        { id: "0", label: "Inactive", icon: "fa-times-circle", color: "#ef4444" },
    ];

    const currentStatus = statusOptions.find(opt => opt.id === selectedStatus);

    return (
        <div className="status-filter-container ms-2" ref={dropdownRef}>
            <div className={`status-filter-wrapper ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="status-filter-select shadow-sm">
                    <span className="text-truncate">
                        {currentStatus ? currentStatus.label : "All Status"}
                    </span>
                </div>
                <i className={`fa ${currentStatus?.icon || 'fa-filter'} status-filter-icon-left`} 
                   style={{ color: currentStatus?.color || '#94a3b8' }}></i>
                <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'} status-filter-icon-right`}></i>
            </div>

            {isOpen && (
                <div className="status-filter-dropdown shadow-lg">
                    <div className="text-uppercase text-muted mx-2 mb-2" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>Filter by Status</div>
                    
                    {statusOptions.map((opt) => {
                        const isSelected = selectedStatus === opt.id;
                        return (
                            <div
                                key={opt.id}
                                className={`status-filter-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelect(opt.id)}
                            >
                                <div className={`status-avatar ${isSelected ? 'bg-white' : ''}`}
                                     style={{ 
                                         background: isSelected ? "#fff" : opt.color,
                                         color: isSelected ? opt.color : "#fff"
                                     }}>
                                    <i className={`fa ${opt.icon}`}></i>
                                </div>
                                <div className="text-truncate">
                                    {opt.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Status_Filter;
