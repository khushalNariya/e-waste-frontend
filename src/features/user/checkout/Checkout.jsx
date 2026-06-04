import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Checkout.css';
import { getMyCart, checkoutAPI, validateAddressAPI } from '../../../services/API_Service';

// UI Components
import EmptyCart from './Checkout_UI_Components/EmptyCart';
import CheckoutHero from './Checkout_UI_Components/CheckoutHero';
import ProgressSteps from './Checkout_UI_Components/ProgressSteps';
import AddressForm from './Checkout_UI_Components/AddressForm';
import PaymentMethod from './Checkout_UI_Components/PaymentMethod';
import OrderSummary from './Checkout_UI_Components/OrderSummary';
import SavedAddresses from './Checkout_UI_Components/SavedAddresses';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [step, setStep] = useState(1); // 1=Address, 2=Payment
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        pincode: '',
        address: '',
        city: '',
        state: '',
        landmark: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('points');
    const [errors, setErrors] = useState({});
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        fetchCart();
        fetchLastAddress();
    }, []);

    const fetchLastAddress = async () => {
        try {
            const { getMyOrderAddressesAPI } = await import('../../../services/API_Service');
            const response = await getMyOrderAddressesAPI();
            if (response.data.length > 0) {
                // Filter for unique addresses
                const unique = [];
                const seen = new Set();
                response.data.forEach(addr => {
                    const key = `${addr.full_name}|${addr.address}|${addr.pincode}`.toLowerCase();
                    if (!seen.has(key)) {
                        unique.push(addr);
                        seen.add(key);
                    }
                });
                
                const limited = unique.slice(0, 3);
                setSavedAddresses(limited);
                setShowAddressForm(false);
                
                // Default to most recent
                const last = limited[0];
                setAddress({
                    fullName: last.full_name || '',
                    phone: last.phone || '',
                    pincode: last.pincode || '',
                    address: last.address || '',
                    city: last.city || '',
                    state: last.state || '',
                    landmark: last.landmark || ''
                });
            } else {
                setShowAddressForm(true);
            }
        } catch (error) {
            console.error("Error fetching last address:", error);
            setShowAddressForm(true);
        }
    };

    // ... existing ...

    const handleEditAddress = (addr) => {
        setAddress({
            fullName: addr.full_name,
            phone: addr.phone,
            pincode: addr.pincode,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            landmark: addr.landmark || ''
        });
        setErrors({});
        setShowAddressForm(true);
    };


    const fetchCart = async () => {
        try {
            const response = await getMyCart();
            const items = response.data.cart_items || [];
            // Map API fields to UI field names
            const formattedCart = items.map(item => ({
                id: item.id,
                name: item.product_name,
                image: item.product_image || 'https://img.icons8.com/plasticine/144/package.png',
                points: item.points,
                quantity: item.quantity
            }));
            setCart(formattedCart);
            setTotalPoints(response.data.total_points || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };



    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
        // Clear error for this field
        if (errors[e.target.name]) {
            const newErrors = { ...errors };
            delete newErrors[e.target.name];
            setErrors(newErrors);
        }
    };

    const handleSelectAddress = (saved) => {
        setAddress({
            fullName: saved.full_name,
            phone: saved.phone,
            pincode: saved.pincode,
            address: saved.address,
            city: saved.city,
            state: saved.state,
            landmark: saved.landmark || ''
        });
        setErrors({});
        setStep(2); // Go to payment directly
    };

    const handleAddNewAddress = () => {
        setAddress({
            fullName: '',
            phone: '',
            pincode: '',
            address: '',
            city: '',
            state: '',
            landmark: ''
        });
        setErrors({});
        setShowAddressForm(true);
    };

    const handleValidateAddress = async () => {
        setIsSubmitting(true);
        setErrors({});
        try {
            const addressData = {
                full_name: address.fullName,
                phone: address.phone,
                address: address.address,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                landmark: address.landmark
            };

            await validateAddressAPI(addressData);
            setStep(2); // Success, move to payment
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                alert("Validation failed. Please check your network.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setErrors({});
        try {
            const orderData = {
                full_name: address.fullName,
                phone: address.phone,
                address: address.address,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                landmark: address.landmark,
                payment_method: paymentMethod
            };

            const response = await checkoutAPI(orderData);
            
            if (response.data.message) {
                // Success
                const newOrder = {
                    orderId: response.data.order_number,
                    date: new Date().toISOString(),
                    items: cart,
                    totalPoints,
                    address,
                    paymentMethod,
                    status: 'Processing',
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                };
                
                window.dispatchEvent(new Event('cartUpdated'));
                navigate('/order-confirmation', { state: { order: newOrder } });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                // If there are address errors, go back to step 1 form
                setShowAddressForm(true);
                setStep(1);
            } else {
                console.error("Error placing order:", error);
                alert("Failed to place order. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    if (cart.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="checkout-page min-vh-100">
            <CheckoutHero />

            <div className="container py-5">
                <ProgressSteps step={step} />

                <div className="row g-5">
                    {/* Left Panel */}
                    <div className="col-lg-8">
                        {/* STEP 1: Address */}
                        {step === 1 && (
                            !showAddressForm && savedAddresses.length > 0 ? (
                                <SavedAddresses 
                                    savedAddresses={savedAddresses} 
                                    onSelect={handleSelectAddress} 
                                    onAddNew={handleAddNewAddress} 
                                    onEdit={handleEditAddress}
                                    canAddNew={savedAddresses.length < 3}
                                />
                            ) : (
                                <AddressForm 
                                    address={address} 
                                    handleAddressChange={handleAddressChange} 
                                    onValidate={handleValidateAddress} 
                                    isSubmitting={isSubmitting}
                                    errors={errors}
                                    onBack={() => setShowAddressForm(false)}
                                    showBackButton={savedAddresses.length > 0}
                                />
                            )
                        )}

                        {/* STEP 2: Payment Method */}
                        {step === 2 && (
                            <PaymentMethod 
                                paymentMethod={paymentMethod} 
                                setPaymentMethod={setPaymentMethod} 
                                address={address} 
                                setStep={setStep} 
                                handlePlaceOrder={handlePlaceOrder} 
                                isSubmitting={isSubmitting} 
                            />
                        )}
                    </div>

                    {/* Right Panel: Order Summary */}
                    <div className="col-lg-4">
                        <OrderSummary cart={cart} totalPoints={totalPoints} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;


