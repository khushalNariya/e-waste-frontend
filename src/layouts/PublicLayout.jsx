import React from 'react'
import { Routes, Route } from "react-router-dom";

import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Login from '../features/auth/components/Login';
import SignUp from '../features/auth/components/Sign-Up';
import FacilityMap from '../pages/FacilityMap/FacilityMap';
import Recycle from '../pages/RecyclingInfo/Recycle';
import Education from '../pages/Education/Education';
import EducationDetails from '../pages/Education/EducationDetail copy';
import ContactUs from '../pages/ContactUs/Contact_Us';
import Rule from '../pages/Rules/Rule';
import EWasteForm from '../features/ewaste/EWasteForm';
import EWasteHistory from '../features/ewaste/EWasteHistory';
import RewardRules from '../features/rewards/RewardRules';
import RewardStore from '../features/rewards/RewardStore';
import RewardProductDetail from '../features/rewards/RewardProductDetail';
import Cart from '../features/rewards/Cart';
import Checkout from '../features/user/checkout/Checkout';
import OrderConfirmation from '../features/user/checkout/OrderConfirmation';
import MyOrders from '../features/user/checkout/MyOrders';
import MyReturns from '../features/user/checkout/MyReturns';
import MyReplaces from '../features/user/checkout/MyReplaces';
// import ScrollToTop from '../pages/Education/ScrollToTop';

import RewardRulesV2 from '../features/rewardsV2/RewardRules';
import RewardStoreV2 from '../features/rewardsV2/RewardStore';
import RewardProductDetailV2 from '../features/rewardsV2/RewardProductDetail';
import CartV1 from '../features/rewardsV2/CartV1';


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

                <Route path="/contactus" element={<ContactUs />} />
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
                
                
                
                
                <Route path="/reward-rules-2" element={<RewardRulesV2 />} />
                <Route path="/reward-store-2" element={<RewardStoreV2 />} />
                <Route path="/reward-item-2/:id" element={<RewardProductDetailV2 />} />
                
                <Route path="/cart_2" element={<CartV1 />} />
                
                
            </Routes>



            <Footer />

        </>
    )
}

export default PublicLayout
