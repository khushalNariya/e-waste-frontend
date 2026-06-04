import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "./Education copy.css";
// import axios from "axios";
import { getEducationDetails, getEducation_Blogs } from "../../services/API_Service";

const EducationDetails = () => {

    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        getEducationDetails(slug)
            .then(res => {
                setArticle(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [slug]);

    useEffect(() => {
        getEducation_Blogs()
            .then(res => {

                const others = res.data.filter(b => b.slug !== slug);

                // Shuffle array
                const shuffled = others.sort(() => 0.5 - Math.random());

                // Pick 3 random
                setRelated(shuffled.slice(0, 3));
            });

    }, [slug]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"   // ya "smooth" agar animation chahiye
        });
    }, [slug]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!article) return <div className="text-center mt-5">Article Not Found</div>;



    return (
        <div className="edu-detail-container">

            {/* HERO IMAGE */}
            {/* HERO SECTION */}
            <div className="detail-hero">
                {/* 1. Background Image */}
                <img
                    src={article.image}
                    alt={article.title}
                    className="hero-bg"
                />

                {/* 2. Dark Overlay */}
                <div className="hero-overlay"></div>

                {/* 3. Content */}
                <div className="hero-content">
                    {/* Category Badge */}
                    <span className="category-badge mb-3">
                        {article.category}
                    </span>

                    {/* Title */}
                    <h1 className="fw-bold mb-3" style={{ fontSize: "2.8rem", lineHeight: "1.2" }}>
                        {article.title}
                    </h1>

                    {/* Author Info */}
                    <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                        <img
                            src={`https://ui-avatars.com/api/?name=${article.author}&background=198754&color=fff`}
                            alt="author"
                            className="author-avatar"
                        />
                        <div className="text-start">
                            <div className="fw-semibold" style={{ fontSize: "1rem" }}>
                                {article.author}
                            </div>
                            <small style={{ opacity: "0.9" }}>
                                {article.date}  {article.readTime}
                            </small>
                        </div>
                    </div>
                </div>
            </div>




            {/* CONTENT */}
            {/* MAIN CONTENT SECTION */}
            <div className="container py-5">

                {/* Article Body */}
                <div className="detail-content">

                    {/* Agar description normal text hai: */}

                    {/* <div className="detail-content">
                        <p>{article.description}</p>
                    </div> */}

                    {/* Agar description me multiple paragraphs ya HTML hai: */}
                    <div
                        className="detail-content"
                        dangerouslySetInnerHTML={{ __html: article.description }}
                    ></div>

                    <h3>Understanding E-Waste</h3>
                    <p>E-waste consists of discarded electronic products such as computers, televisions, smartphones, and household appliances. These devices contain valuable materials like gold, silver, copper, and platinum, but also contain hazardous substances including lead, mercury, cadmium, and brominated flame retardants.</p>

                    <h3>Environmental Impact</h3>
                    <p>Improper disposal of e-waste leads to serious environmental consequences. When electronics are dumped in landfills, toxic materials can leach into soil and groundwater, contaminating ecosystems and posing health risks to living organisms.</p>

                    <h3>Responsible Recycling</h3>
                    <p>Proper e-waste recycling involves specialized processes to safely extract valuable materials while containing hazardous components. Certified e-waste recycling facilities employ advanced technologies to dismantle electronics, separate materials, and prepare them for reuse.</p>

                    <blockquote className="border-start border-4 border-success ps-4 my-4 text-muted">
                        "The average smartphone contains about 60 different elementsâ€”including precious metals and rare earth elementsâ€”that could be recovered and reused if the device is properly recycled."
                    </blockquote>

                    <h3>Consumer Responsibility</h3>
                    <p>Consumers play a crucial role in addressing the e-waste challenge. By extending the lifespan of electronics through proper maintenance, choosing products with eco-friendly designs, and ensuring responsible disposal through certified recycling centers, individuals can significantly reduce their environmental footprint.</p>
                </div>

                {/* Tags Section */}
                {/* <div className="article-tags mt-4 d-flex gap-2 justify-content-center justify-content-md-start mx-auto" style={{ maxWidth: "900px" }}>
                    <span className="badge bg-light text-dark border">E-Waste</span>
                    <span className="badge bg-light text-dark border">Regulations</span>
                    <span className="badge bg-light text-dark border">Sustainability</span>
                    <span className="badge bg-light text-dark border">Environment</span>
                </div> */}

                {/* CTA BOX */}
                <div className="cta-box">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h5>Ready to Take Action?</h5>
                            <p className="">Properly disposing of your electronic waste is easier than you think. Find certified e-waste recycling facilities near you and ensure your devices are handled responsibly.</p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <Link to="/recycling" className="btn btn-success px-4 py-2">
                                Find Nearby Recycling Centers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RELATED ARTICLES SECTION */}
                <div className="related-section">
                    <h4 className="fw-bold mb-4">Related Articles</h4>
                    {/* <div className="row g-4"> */}
                    {/* Card 1 */}
                    {/* <div className="col-md-4">
                            <div className="card related-card h-100">
                                <img src="https://via.placeholder.com/300x160" className="card-img-top related-img" alt="article" />
                                <div className="card-body">
                                    <span className="text-success fw-bold small d-block mb-1">TIPS</span>
                                    <h6 className="related-title">Smart Consumption of Electronics</h6>
                                    <Link to="#" className="read-more-link">Read More </Link>
                                </div>
                            </div>
                        </div> */}

                    {/* Card 2 */}
                    {/* <div className="col-md-4">
                        <div className="card related-card h-100">
                            <img src="https://via.placeholder.com/300x160" className="card-img-top related-img" alt="article" />
                            <div className="card-body">
                                <span className="text-success fw-bold small d-block mb-1">GUIDE</span>
                                <h6 className="related-title">Responsible E-Waste Disposal Methods</h6>
                                <Link to="#" className="read-more-link">Read More </Link>
                            </div>
                        </div>
                    </div> */}
                    {/* Card 3 */}
                    {/* <div className="col-md-4">
                        <div className="card related-card h-100">
                            <img src="https://via.placeholder.com/300x160" className="card-img-top related-img" alt="article" />
                            <div className="card-body">
                                <span className="text-success fw-bold small d-block mb-1">FACTS</span>
                                <h6 className="related-title">The Hidden Dangers of E-Waste</h6>
                                <Link to="#" className="read-more-link">Read More </Link>
                            </div>
                        </div>
                    </div> */}
                    <div className="row g-4">
                        {related.map(post => (
                            <div className="col-md-4" key={post.id}>
                                <div className="related-card h-100 shadow-sm border-0 overflow-hidden">
                                    <div className="position-relative">
                                        <img src={post.image} className="related-img" alt="article" />
                                        {/* <div className="card-body">
                                        </div> */}
                                        <span className="badge bg-success text-white position-absolute top-0 start-0 m-3 shadow-sm">{post.category}</span>
                                    </div>

                                    <div className="card-body p-4 d-flex flex-column">
                                        {/* <span className="text-success fw-bold small d-block mb-1">
                                            {post.category}
                                        </span> */}

                                        <h5 className="related-title">{post.title}</h5>
                                        <Link to={`/education/${post.slug}`} className="read-more-link">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* </div> */}
                </div>
            </div>
        </div >
    );
};

export default EducationDetails;

