/**
 * API Route for recalculating totals for all purchase orders
 */

export async function POST(request) {
    try {
      // Connect to MongoDB
      const { default: mongoose } = await import("mongoose")
      const { default: PurchaseOrder } = await import("../../models/poModel")
  
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI)
      }
  
      // Get all purchase orders
      const purchaseOrders = await PurchaseOrder.find({})
  
      // Update each purchase order
      let updatedCount = 0
  
      for (const order of purchaseOrders) {
        if (order.lineItems && order.lineItems.length > 0) {
          // Calculate total amount
          order.totalAmount = order.lineItems.reduce((total, item) => {
            return total + item.quantity * item.unitPrice
          }, 0)
  
          // Save the updated order
          await order.save()
          updatedCount++
        }
      }
  
      return Response.json({
        success: true,
        message: `Successfully recalculated totals for ${updatedCount} purchase orders`,
      })
    } catch (err) {
      console.error("Error recalculating purchase order totals:", err)
      return Response.json({ error: "Server error", message: err.message }, { status: 500 })
    }
  }
  