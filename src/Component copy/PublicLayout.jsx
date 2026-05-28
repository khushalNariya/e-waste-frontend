import React from 'react'
import { Routes, Route } from "react-router-dom";

import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Login from './Login';
import SignUp from './Sign-Up';
import FacilityMap from './E-Facility/FacilityMap';
import Recycle from './Recycling-info/Recycle';
import Education from './Education/Education';
import EducationDetail from './Education/EducationDetail';
import EducationDetails from './Education/EducationDetail copy';
import Contact_Us from './Contact-Us/Contact_Us';
import Rule from './Rules/Rule';
// import ScrollToTop from './Education/ScrollToTop';


const PublicLayout = () => {
    return (
        <>
            <Header />

            {/* <ScrollToTop/> */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About-Us" element={<About />} />

                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/FacilityMap" element={<FacilityMap />} />
                <Route path="/Recycle" element={<Recycle />} />

                <Route path="/education" element={<Education />} />

                {/* <Route path="/education/:id" element={<EducationDetail/>} /> */}
                <Route path="/education/:slug" element={<EducationDetails />} />

                <Route path="/contactus" element={<Contact_Us />} />
                <Route path="/rules" element={<Rule />} />


            </Routes>


            <Footer />

        </>
    )
}

export default PublicLayout
