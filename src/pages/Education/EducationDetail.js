import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Education.css";

const EducationDetail = () => {

    const { id } = useParams();

    const blogs = [
        {
            id: 1,
            title: "Understanding E-Waste: A Comprehensive Guide",
            description: "Electronic waste or e-waste is discarded electronic devices...",
            image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200",
            category: "Education",
            author: "ELocate Research Team",
            date: "June 15, 2025",
            readTime: "8 min read"
        },
        {
            id: 2,
            title: "Lifecycle of Electronic Devices",
            description: "Journey through lifecycle of electronics...",
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200",
            category: "Sustainability",
            author: "Dr. Sarah Chen",
            date: "July 05, 2025",
            readTime: "10 min read"
        }
    ];

    const blog = blogs.find(b => b.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    if(!blog){
        return <h3 className="text-center py-5">Article Not Found</h3>
    }

    return (
        <div className="edu-detail">

            {/* HERO SECTION */}
            <div className="detail-hero">
                <img src={blog.image} alt={blog.title} />
                <div className="hero-overlay">
                    <span className="badge bg-success">{blog.category}</span>
                    <h1>{blog.title}</h1>
                    <p>{blog.author} • {blog.date} • {blog.readTime}</p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="container py-5">
                <p className="lead">{blog.description}</p>

                <h3>The Scale of the Problem</h3>
                <p>
                    Globally, we generate millions of tons of e-waste annually.
                    Improper disposal leads to environmental hazards.
                </p>

                <h3>Environmental Impact</h3>
                <p>
                    Toxic materials like mercury & lead contaminate water and soil.
                    Responsible recycling is essential.
                </p>

                {/* ACTION BOX */}
                <div className="action-box mt-5">
                    <h5>Ready to Take Action?</h5>
                    <p>Find certified recycling facilities near you.</p>
                    <button className="btn btn-success">Find Nearby Recycling Centers</button>
                </div>

                {/* BACK BUTTON */}
                <Link to="/Education" className="btn btn-outline-success mt-4">
                    ← Back
                </Link>
            </div>

        </div>
    );
};

export default EducationDetail;
