// API service for making requests to the backend

/**
 * Fetch all transactions from the API
 * @returns {Promise<Array>} Array of transaction objects
 */
export const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/transactions")
  
      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchTransactions:", error)
      throw error
    }
  }
  
  /**
   * Fetch all banks from the API
   * @returns {Promise<Array>} Array of bank objects
   */
  export const fetchBanks = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/banks")
  
      if (!response.ok) {
        throw new Error(`Error fetching banks: ${response.statusText}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchBanks:", error)
      throw error
    }
  }
  
  /**
   * Fetch active banks from the API
   * @returns {Promise<Array>} Array of active bank objects
   */
  export const fetchActiveBanks = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/banks/status/active")
  
      if (!response.ok) {
        throw new Error(`Error fetching active banks: ${response.statusText}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchActiveBanks:", error)
      throw error
    }
  }
  
  /**
   * Fetch all purchase orders from the API
   * @returns {Promise<Array>} Array of purchase order objects
   */
  export const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/purchase-orders")
  
      if (!response.ok) {
        throw new Error(`Error fetching purchase orders: ${response.statusText}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchPurchaseOrders:", error)
      throw error
    }
  }
  
  /**
   * Fetch all vendors from the API
   * @returns {Promise<Array>} Array of vendor objects
   */
  export const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/vendors")
  
      if (!response.ok) {
        throw new Error(`Error fetching vendors: ${response.statusText}`)
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchVendors:", error)
      throw error
    }
  }
  
  /**
   * Fetch financial data (this would be a real API endpoint in production)
   * For now, we'll return mock data that matches the screenshot
   */
  export const fetchFinancialData = async () => {
    // This would be a real API call in production
    // For now, we'll return mock data that matches the screenshot
    return {
      monthlyData: [
        { month: "Jan", revenue: 145000, expenses: 98500, profit: 46500 },
        { month: "Feb", revenue: 152000, expenses: 101000, profit: 51000 },
        { month: "Mar", revenue: 159500, expenses: 105500, profit: 54000 },
        { month: "Apr", revenue: 182000, expenses: 110000, profit: 72000 },
        { month: "May", revenue: 196000, expenses: 114500, profit: 81500 },
        { month: "Jun", revenue: 215000, expenses: 122000, profit: 93000 },
      ],
      quarterlyForecast: [
        { quarter: "Q1", projected: 495000, actual: 456500 },
        { quarter: "Q2", projected: 593000, actual: 593000 },
        { quarter: "Q3", projected: 645000, actual: null },
        { quarter: "Q4", projected: 720000, actual: null },
      ],
    }
  }
  