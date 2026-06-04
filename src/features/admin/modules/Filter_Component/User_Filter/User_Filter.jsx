import React, { useState, useRef, useEffect } from "react";
import "./User_Filter.css";

const User_Filter = ({ users = [], selectedUser = "", onSelect }) => {
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

    const filteredUsers = users.filter(u => {
        const name = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
        const email = (u.email || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || email.includes(search);
    });

    const currentUser = users.find(u => u.id === selectedUser);

    return (
        <div className="user-filter-container ms-2" ref={dropdownRef}>
            <div className={`user-filter-wrapper ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="user-filter-select shadow-sm">
                    <span className="text-truncate">
                        {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "All Users"}
                    </span>
                </div>
                <i className={`fa fa-user user-filter-icon-left ${selectedUser ? 'text-primary' : 'text-muted'}`}></i>
                <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'} user-filter-icon-right`}></i>
            </div>

            {isOpen && (
                <div className="user-filter-dropdown shadow-lg">
                    <div className="position-relative mb-3">
                        <input
                            type="text"
                            className="user-filter-search-input"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                        <i className="fa fa-search position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px" }}></i>
                    </div>

                    <div style={{ maxHeight: "280px", overflowY: "auto" }} className="custom-scroll">
                        <div
                            className={`user-filter-item ${!selectedUser ? 'selected' : ''}`}
                            onClick={() => handleSelect("")}
                        >
                            <div className={`user-avatar ${!selectedUser ? 'bg-white text-primary' : 'bg-light text-muted'}`} style={{ width: "24px", height: "24px" }}>
                                <i className="fa fa-users" style={{ fontSize: "10px" }}></i>
                            </div>
                            All Registered Users
                        </div>

                        <div className="text-uppercase text-muted mx-2 my-2" style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>Filter by User</div>

                        {filteredUsers.map((u) => {
                            const isSelected = selectedUser === u.id;
                            return (
                                <div
                                    key={u.id}
                                    className={`user-filter-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(u.id)}
                                >
                                    <div className={`user-avatar ${isSelected ? 'bg-white text-primary' : 'bg-info text-white'}`} 
                                         style={{ background: isSelected ? "#fff" : "linear-gradient(135deg, #0ea5e9, #3b82f6)" }}>
                                        {u.first_name?.[0].toUpperCase()}
                                    </div>
                                    <div className="text-truncate">
                                        {u.first_name} {u.last_name}
                                        <div className={`small ${isSelected ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: "11px" }}>{u.email}</div>
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

export default User_Filter;
