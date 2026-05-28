import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Education.css";
import { getEducation_Blogs } from "../User-Interface-API/API_Service";

const Education = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All Topics");

    const categories = [
        "All Topics",
        ...new Set(blogs.map(b => b.category))
    ];

    useEffect(() => {
        document.title = "Education Hub | ELocate";

        getEducation_Blogs()
            .then(res => {
                setBlogs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = selectedCategory === "All Topics"
        ? blogs
        : blogs.filter(b => b.category === selectedCategory);

    const featuredPost = blogs.find(b => b.isFeatured);

    return (
        <div className="edu-container pb-5 ">
            {/* HERO SECTION */}
            <div className="edu-hero text-white py-5 mb-5 shadow-sm text-center">
                <div className="container">
                    <h1 className="display-4 fw-bold">E-Waste Education Hub</h1>
                    <p className="lead opacity-75">Insights into sustainable electronics management.</p>
                </div>
            </div>

            <div className="container">


                {/* FEATURED POST */}
                {!loading && featuredPost && selectedCategory === "All Topics" && (
                    // <div className="featured-card row g-0 mb-5 shadow-sm rounded-4 overflow-hidden bg-white border">
                    <div className="featured-card row g-0 mb-5 shadow-sm overflow-hidden border">
                        <div className="col-lg-7">
                            <img src={featuredPost.image} alt="Featured" className="w-100 h-100 object-fit-cover" style={{ minHeight: '350px' }} />
                        </div>
                        <div className="col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-center">
                            <div className="mb-2">
                                <span className="badge bg-success-soft text-success me-2">{featuredPost.category}</span>
                                <small className="text-muted"><i className="bi bi-clock me-1"></i>{featuredPost.readTime}</small>
                            </div>
                            <h2 className="fw-bold mb-3">{featuredPost.title}</h2>
                            <p className="text-muted mb-4">{featuredPost.description}</p>

                            <div className="d-flex justify-content-between align-items-center mt-auto pt-4 border-top">
                                <div className="d-flex align-items-center">
                                    {/* AUTOMATIC AVATAR */}
                                    <img src={`https://ui-avatars.com/api/?name=${featuredPost.author}&background=198754&color=fff`}
                                        alt="author" className="rounded-circle me-3 border" width="48" height="48" />
                                    <div>
                                        <h6 className="mb-0 fw-bold">{featuredPost.author}</h6>
                                        <small className="text-muted">{featuredPost.date}</small>
                                    </div>
                                </div>
                                <Link to={`/education/${featuredPost.id}`} className="read-more-link fw-bold text-decoration-none">
                                    Full Article →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* CATEGORY BAR
                <h3 className="fw-bold mb-4">Educational Resources</h3>

                <div className="category-bar mb-5 d-flex flex-wrap justify-content-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div> */}

                {/* 3. CATEGORY FILTERS */}
                <div className="mb-4">
                    <h3 className="fw-bold mb-3">Educational Resources</h3>
                    <div className="category-bar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>


                {/* GRID SECTION */}
                <div className="row g-4">
                    {filteredBlogs.map(blog => (
                        <div className="col-md-6 col-lg-4" key={blog.id}>
                            {/* <div className="edu-card h-100 shadow-sm border-0 rounded-4 bg-white overflow-hidden"> */}
                            <div className="edu-card h-100 shadow-sm border-0 overflow-hidden">
                                <div className="position-relative">
                                    <img src={blog.image} alt={blog.title}
                                        className="edu-card-img"
                                    // style={{ height: '200px', objectFit: 'cover' }} 
                                    />
                                    {/* <span className="badge bg-white text-dark position-absolute top-0 start-0 m-3 shadow-sm">{blog.category}</span> */}
                                    <span className="badge bg-success text-white position-absolute top-0 start-0 m-3 shadow-sm">{blog.category}</span>

                                </div>

                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="mb-2">
                                        <small className="text-muted"><i className="bi bi-clock me-1"></i>{blog.readTime}</small>
                                    </div>
                                    <h5 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>{blog.title}</h5>
                                    <p className="text-muted small mb-4">
                                        {blog.description.substring(0, 100)}...
                                    </p>

                                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            {/* AUTOMATIC AVATAR FOR EACH CARD */}
                                            <img src={`https://ui-avatars.com/api/?name=${blog.author}&background=random&color=fff`}
                                                alt="author" className="rounded-circle me-2 border" width="35" height="35" />
                                            <div>
                                                <p className="mb-0 fw-bold small" style={{ lineHeight: '1' }}>{blog.author}</p>
                                                <small className="text-muted" style={{ fontSize: '11px' }}>{blog.date}</small>
                                            </div>
                                        </div>
                                        <Link to={`/education/${blog.id}`} className="text-success fw-bold text-decoration-none small">
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Education;

.auth-section {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    min-height: 100vh;
    display: flex;
    align-items: center;
    /* 🔥 change */
    /* vertical center */
    justify-content: center;
    /* horizontal center */

    padding: 40px;
    /* SAME space everywhere */
    /* full screen cover */

}

.auth-card {
    background: #ffffff;
    padding: 35px;
    border-radius: 18px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    animation: fadeUp 0.6s ease;
}

.auth-link {
    color: #2e7d32;
    text-decoration: none;
}

.auth-link:hover {
    text-decoration: underline;
}

.form-control {
    border-radius: 10px;
    padding: 10px 14px;
}

.btn-success {
    border-radius: 12px;
    padding: 10px;
    font-weight: 600;
}

/* Animation */
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(25px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}


/* Make checkbox visible on light background */
.form-check-input {
    border: 1px solid #070a07;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #2e7d32;
    border-color: #2e7d32;
}

.form-check-label {
    color: #020302;
}