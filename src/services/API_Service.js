import axiosInstance from "./axiosInstance";


export const getEducation_Blogs = () => {
  return axiosInstance.get("User-api/education/");
};

export const getEducationDetails = (slug) => {
  return axiosInstance.get(`User-api/education/${slug}/`)
}

export const getHowItWorks = () => {
  return axiosInstance.get("User-api/how-it-works/");
}

export const get_Home_Hero_Image = () => {
  return axiosInstance.get("User-api/Hero/");
}

export const getRewardRules = () => {
  return axiosInstance.get("User-api/reward-rule/");
}

export const getRecycleCategories = () => {
  return axiosInstance.get("User-api/recycle/");
}

export const getFacilities = () => {
  return axiosInstance.get("User-api/facilities/");
}

export const getCategoryBrands = (categoryId) => {
  return axiosInstance.get(`User-api/Category_Wise_Brand_Filter/?category_id=${categoryId}`);
}

export const getCategoryBrandMappings = () => {
  return axiosInstance.get("User-api/Category_Brand/");
}

export const getModelsByCategoryBrand = (categoryBrandMappingId) => {
  return axiosInstance.get(
    `User-api/Category_Wise_Brand_Wise_Model_Filter/?category_brand_mapping_id=${categoryBrandMappingId}`
  );
}

export const createEWasteSubmission = (formData) => {
  return axiosInstance.post("User-api/E-wast-submission/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export const getMyEWasteSubmissions = () => {
  return axiosInstance.get("User-api/E-wast-submission/");
}

export const getMyRewards = () => {
  return axiosInstance.get("User-api/transactions/");
}

export const getMyStatusHistory = () => {
  return axiosInstance.get("User-api/E-wast-status-history/");
}

export const getUserWallet = () => {
  return axiosInstance.get("User-api/wallet/");
}

// Reward Store APIs
export const getRewardCategories = () => {
  return axiosInstance.get("User-api/reward-category/");
};

export const getRewardProducts = (categoryId = null) => {
  let url = "User-api/reward-product/";
  if (categoryId) {
    url += `?category=${categoryId}`;
  }
  return axiosInstance.get(url);
};

export const getRewardProductDetails = (slug) => {
  return axiosInstance.get(`User-api/reward-product/${slug}/`);
};

// Cart APIs (App-12)
export const getMyCart = () => {
  return axiosInstance.get("User-api/cart/");
};

export const addToCartAPI = (productId, quantity = 1) => {
  return axiosInstance.post("User-api/cart-items/", {
    product: productId,
    quantity: quantity
  });
};

export const updateCartItemAPI = (itemId, quantity) => {
  return axiosInstance.patch(`User-api/cart-items/${itemId}/`, {
    quantity: quantity
  });
};

export const removeCartItemAPI = (itemId) => {
  return axiosInstance.delete(`User-api/cart-items/${itemId}/`);
};

// Order APIs (App-13)
export const checkoutAPI = (orderData) => {
  return axiosInstance.post("User-api/checkout/", orderData);
};

export const validateAddressAPI = (addressData) => {
  return axiosInstance.post("User-api/reward-order-address/", {
    ...addressData,
    validate_only: true
  });
};

export const getMyOrdersAPI = () => {
  return axiosInstance.get("User-api/reward-orders/");
};

export const cancelOrderAPI = (orderNumber, reason) => {
  return axiosInstance.post("User-api/cancel-order/", {
    order_number: orderNumber,
    reason: reason
  });
};

// Order Address APIs (App-13)
export const getMyOrderAddressesAPI = () => {
  return axiosInstance.get("User-api/reward-order-address/");
};

export const updateOrderAddressAPI = (addressId, addressData) => {
  return axiosInstance.patch(`User-api/reward-order-address/${addressId}/`, addressData);
};

// Reward Returns APIs (App-14)
export const getMyReturnsAPI = () => {
  return axiosInstance.get("User-api/reward-returns/");
};

export const getReturnHistoryAPI = () => {
  return axiosInstance.get("User-api/reward-returns-history/");
};

export const submitReturnRequestAPI = (formData) => {
  return axiosInstance.post("User-api/reward-returns/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// Reward Replaces APIs (App-15)
export const getMyReplacesAPI = () => {
  return axiosInstance.get("User-api/reward-replaces/");
};

export const getReplaceHistoryAPI = () => {
  return axiosInstance.get("User-api/reward-replaces-history/");
};

export const submitReplaceRequestAPI = (formData) => {
  return axiosInstance.post("User-api/reward-replaces/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const cancelReturnRequestAPI = (returnId, reason) => {
  return axiosInstance.post(`User-api/reward-returns/${returnId}/cancel/`, { reason });
};

export const cancelReplaceRequestAPI = (replaceId, reason) => {
  return axiosInstance.post(`User-api/reward-replaces/${replaceId}/cancel/`, { reason });
};




