// Format date for display
export const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }
  
  // Format currency for display
  export const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    } catch (e) {
      return `${amount}`
    }
  }
  
  // Get color for transaction status
  export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processed":
        return "#4caf50" // Green
      case "pending":
        return "#ff9800" // Orange
      case "failed":
        return "#f44336" // Red
      case "cancelled":
        return "#9e9e9e" // Grey
      case "refunded":
        return "#2196f3" // Blue
      default:
        return "#9e9e9e" // Grey for unknown status
    }
  }
  
  // Get color for paid status
  export const getPaidStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "#4caf50" // Green
      case "not paid":
        return "#f44336" // Red
      case "partially paid":
        return "#ff9800" // Orange
      case "refunded":
        return "#2196f3" // Blue
      default:
        return "#9e9e9e" // Grey for unknown status
    }
  }
  
  // Print transaction
  export const printTransaction = (transaction, showSnackbar) => {
    try {
      // Create a printable version of the transaction
      const printWindow = window.open("", "_blank")
  
      if (!printWindow) {
        showSnackbar("Pop-up blocked. Please allow pop-ups for printing.")
        return
      }
  
      const itemsList = transaction.items
        .map(
          (item) =>
            `<tr>
          <td>${item.itemId}</td>
          <td>${item.itemName}</td>
          <td>${item.itemQuantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(item.price * item.itemQuantity)}</td>
        </tr>`,
        )
        .join("")
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Transaction ${transaction.transactionID}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { display: flex; justify-content: space-between; align-items: center; }
              .section { margin-bottom: 20px; }
              .status { display: inline-block; padding: 5px 10px; border-radius: 4px; color: white; }
              .status-processed { background-color: #4caf50; }
              .status-not-paid { background-color: #f44336; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Transaction Details</h1>
              <p>Date: ${formatDate(transaction.date)}</p>
            </div>
            
            <div class="section">
              <h2>General Information</h2>
              <table>
                <tr>
                  <th>Transaction ID</th>
                  <td>${transaction.transactionID}</td>
                </tr>
                <tr>
                  <th>Transaction Number</th>
                  <td>${transaction.transactionNumber}</td>
                </tr>
                <tr>
                  <th>MongoDB ID</th>
                  <td>${transaction._id}</td>
                </tr>
                <tr>
                  <th>Payment Method</th>
                  <td>${transaction.paymentMethod}</td>
                </tr>
                <tr>
                  <th>Transaction Status</th>
                  <td><span class="status status-${transaction.transactionStatus?.toLowerCase()}">${transaction.transactionStatus || "N/A"}</span></td>
                </tr>
                <tr>
                  <th>Payment Status</th>
                  <td><span class="status status-${transaction.paidStatus?.toLowerCase().replace(" ", "-")}">${transaction.paidStatus || "N/A"}</span></td>
                </tr>
                <tr>
                  <th>Order Punched</th>
                  <td>${transaction.orderPunched || "N/A"}</td>
                </tr>
                <tr>
                  <th>Total Amount</th>
                  <td>${formatCurrency(transaction.total)}</td>
                </tr>
              </table>
            </div>
            
            <div class="section">
              <h2>Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <p><strong>Total Items:</strong> ${transaction.items.reduce((sum, item) => sum + item.itemQuantity, 0)}</p>
              <p><strong>Total Amount:</strong> ${formatCurrency(transaction.total)}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `)
  
      printWindow.document.close()
      showSnackbar("Print job sent")
    } catch (error) {
      console.error("Print error:", error)
      showSnackbar("Print failed")
    }
  }
  