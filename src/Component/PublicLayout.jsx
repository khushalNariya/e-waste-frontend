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
import EWasteForm from './E-Waste/EWasteForm';
import EWasteHistory from './E-Waste/EWasteHistory';
import RewardRules from './Rewards/RewardRules';
import RewardStore from './Rewards/RewardStore';
import RewardProductDetail from './Rewards/RewardProductDetail';
import Cart from './Rewards/Cart';
import Checkout from './RewardCheckout/Checkout';
import OrderConfirmation from './RewardCheckout/OrderConfirmation';
import MyOrders from './RewardCheckout/MyOrders';
import MyReturns from './RewardCheckout/MyReturns';
import MyReplaces from './RewardCheckout/MyReplaces';
// import ScrollToTop from './Education/ScrollToTop';

import RewardRules_2 from './Rewards--copy/RewardRules';
import RewardStore_2 from './Rewards--copy/RewardStore';
import RewardProductDetail_2 from './Rewards--copy/RewardProductDetail';
import Cart_2 from './Rewards copy/Cart';


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
