/**
 * API Route for fetching, updating, or deleting a purchase order by ID
 */

export async function GET(request, { params }) {
    try {
      const { id } = params
  
      // Connect to MongoDB
      const { default: mongoose } = await import("mongoose")
      const { default: PurchaseOrder } = await import("../../models/poModel")
  
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI)
      }
  
      // Find the purchase order by ID
      const purchaseOrder = await PurchaseOrder.findById(id)
  
      if (!purchaseOrder) {
        return Response.json({ error: "Purchase order not found" }, { status: 404 })
      }
  
      return Response.json(purchaseOrder)
    } catch (err) {
      console.error("Error fetching purchase order:", err)
      return Response.json({ error: "Server error", message: err.message }, { status: 500 })
    }
  }
  
  export async function PUT(request, { params }) {
    try {
      const { id } = params
      const data = await request.json()
  
      // Connect to MongoDB
      const { default: mongoose } = await import("mongoose")
      const { default: PurchaseOrder } = await import("../../models/poModel")
  
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI)
      }
  
      // Calculate total amount from line items if not provided
      if (data.lineItems && data.lineItems.length > 0 && !data.totalAmount) {
        data.totalAmount = data.lineItems.reduce((total, item) => {
          return total + item.quantity * item.unitPrice
        }, 0)
      }
  
      // Update the purchase order
      const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  
      if (!updatedPurchaseOrder) {
        return Response.json({ error: "Purchase order not found" }, { status: 404 })
      }
  
      return Response.json(updatedPurchaseOrder)
    } catch (err) {
      console.error("Error updating purchase order:", err)
      return Response.json({ error: "Server error", message: err.message }, { status: 500 })
    }
  }
  
  export async function DELETE(request, { params }) {
    try {
      const { id } = params
  
      // Connect to MongoDB
      const { default: mongoose } = await import("mongoose")
      const { default: PurchaseOrder } = await import("../../models/poModel")
  
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI)
      }
  
      // Delete the purchase order
      const deletedPurchaseOrder = await PurchaseOrder.findByIdAndDelete(id)
  
      if (!deletedPurchaseOrder) {
        return Response.json({ error: "Purchase order not found" }, { status: 404 })
      }
  
      return Response.json({ message: "Purchase order deleted successfully" })
    } catch (err) {
      console.error("Error deleting purchase order:", err)
      return Response.json({ error: "Server error", message: err.message }, { status: 500 })
    }
  }
  