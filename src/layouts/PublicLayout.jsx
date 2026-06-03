import React from 'react'
import { Routes, Route } from "react-router-dom";

import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/user/home/Home';
import About from '../pages/user/about/About';
import Login from '../pages/user/auth/Login';
import SignUp from '../pages/user/auth/Sign-Up';
import FacilityMap from '../pages/user/e-facility/FacilityMap';
import Recycle from '../pages/user/recycling-info/Recycle';
import Education from '../pages/user/education/Education';
import EducationDetail from '../pages/user/education/EducationDetail';
import EducationDetails from '../pages/user/education/EducationDetail copy';
import Contact_Us from '../pages/user/contact-us/Contact_Us';
import Rule from '../pages/user/rules/Rule';
import EWasteForm from '../pages/user/e-waste/EWasteForm';
import EWasteHistory from '../pages/user/e-waste/EWasteHistory';
import RewardRules from '../pages/user/rewards/RewardRules';
import RewardStore from '../pages/user/rewards/RewardStore';
import RewardProductDetail from '../pages/user/rewards/RewardProductDetail';
import Cart from '../pages/user/rewards/Cart';
import Checkout from '../pages/user/rewards-checkout/Checkout';
import OrderConfirmation from '../pages/user/rewards-checkout/OrderConfirmation';
import MyOrders from '../pages/user/rewards-checkout/MyOrders';
import MyReturns from '../pages/user/rewards-checkout/MyReturns';
import MyReplaces from '../pages/user/rewards-checkout/MyReplaces';
// import ScrollToTop from '../utils/scrollToTop';

import RewardRules_2 from '../pages/user/rewards-legacy/v1/RewardRules';
import RewardStore_2 from '../pages/user/rewards-legacy/v1/RewardStore';
import RewardProductDetail_2 from '../pages/user/rewards-legacy/v1/RewardProductDetail';
import Cart_2 from '../pages/user/rewards-legacy/v2/Cart';


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

                <Route path="/E-Waste-Form" element={<EWasteForm />} />
                <Route path="/submission-history" element={<EWasteHistory />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/my-returns" element={<MyReturns />} />
                <Route path="/my-replaces" element={<MyReplaces />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />

                

                <Route path="/reward-rules" element={<RewardRules />} />
                <Route path="/reward-store" element={<RewardStore />} />
                <Route path="/reward-item/:slug" element={<RewardProductDetail />} />
                
                
                
                
                <Route path="/reward-rules-2" element={<RewardRules_2 />} />
                <Route path="/reward-store-2" element={<RewardStore_2 />} />
                <Route path="/reward-item-2/:id" element={<RewardProductDetail_2 />} />
                
                <Route path="/cart_2" element={<Cart_2 />} />
                
                
            </Routes>



            <Footer />

        </>
    )
}

export default PublicLayout
