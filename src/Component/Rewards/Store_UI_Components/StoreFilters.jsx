import React, { useRef, useState, useEffect } from 'react';

const StoreFilters = ({ categories, currentFilter, onFilterChange }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Function to generate a unique color based on string
    const stringToColor = (str) => {
        if (str === 'All') return '#1cc88a';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash % 360);
        return `hsl(${h}, 70%, 50%)`;
    };

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [categories]);

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 220, behavior: 'smooth' });
    };

    return (
        <div className="sf-wrapper mb-5">
            {/* Left Fade + Arrow */}
            <div className={`sf-fade sf-fade-left ${canScrollLeft ? 'visible' : ''}`}>
                <button className="sf-arrow" onClick={() => scroll(-1)} aria-label="Scroll left">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
            </div>

            {/* Scrollable Track */}
            <div className="sf-track" ref={scrollRef}>
                {categories.map(cat => {
                    const accentColor = stringToColor(cat);
                    return (
                        <button
                            key={cat}
                            className={`sf-pill ${currentFilter === cat ? 'sf-pill--active' : ''}`}
                            onClick={() => onFilterChange(cat)}
                            style={{
                                '--accent-color': accentColor,
                                borderLeft: currentFilter === cat ? `4px solid ${accentColor}` : '2px solid #e3e8ef'
                            }}
                        >
                            <span className="sf-accent-dot" style={{ backgroundColor: accentColor }}></span>
                            <span className="sf-pill-label">{cat}</span>
                        </button>
                    );
                })}
            </div>

            {/* Right Fade + Arrow */}
            <div className={`sf-fade sf-fade-right ${canScrollRight ? 'visible' : ''}`}>
                <button className="sf-arrow" onClick={() => scroll(1)} aria-label="Scroll right">
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

export default StoreFilters;
