import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002/api';

// Fetch all transactions
export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Fetch all POS configurations
export const fetchPosConfigs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posconfig`);
    return response.data;
  } catch (error) {
    console.error('Error fetching POS configurations:', error);
    throw error;
  }
};

// Fetch all banks
export const fetchBanks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/banks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
};

// Fetch all purchase orders
export const fetchPurchaseOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchase-orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};

// Fetch all vendors
export const fetchVendors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// Fetch all menu items
// export const fetchMenuItems = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/menu-items`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching menu items:', error);
//     throw error;
//   }
// };

// Fetch all finished goods
export const fetchFinishedGoods = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/finishedgoods`);
    return response.data;
  } catch (error) {
    console.error('Error fetching finished goods:', error);
    throw error;
  }
};

// Fetch all BOM data
export const fetchBomData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bom`);
    return response.data;
  } catch (error) {
    console.error('Error fetching BOM data:', error);
    throw error;
  }
};

// Fetch all menu categories
export const fetchMenuCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    throw error;
  }
}; 