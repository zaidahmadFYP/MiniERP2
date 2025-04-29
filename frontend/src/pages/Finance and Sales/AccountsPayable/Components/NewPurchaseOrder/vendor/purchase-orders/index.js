/**
 * API Route for fetching all purchase orders or creating a new one
 */

export async function GET(request) {
    try {
      // Connect to MongoDB
      const { default: mongoose } = await import("mongoose")
      const { default: PurchaseOrder } = await import("../../models/poModel")
  
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI)
      }
  
      // Get all purchase orders
      const purchaseOrders = await PurchaseOrder.find({}).sort({ createdAt: -1 })
  
      return Response.json(purchaseOrders)
    } catch (err) {
      console.error("Error fetching purchase orders:", err)
      return Response.json({ error: "Server error", message: err.message }, { status: 500 })
    }
  }
  
  export async function POST(request) {
    try {
      const data = await request.json()
  
      // Connect to MongoDB
      const { default: mongoose } = await import("mongoose")
      const { default: PurchaseOrder } = await import("../../models/poModel")
  
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI)
      }
  
      // Generate a unique order number if not provided
      if (!data.orderNumber) {
        const count = await PurchaseOrder.countDocuments()
        data.orderNumber = `PO-${(100000 + count).toString().substring(1)}`
      }
  
      // Calculate total amount from line items if not provided
      if (data.lineItems && data.lineItems.length > 0 && !data.totalAmount) {
        data.totalAmount = data.lineItems.reduce((total, item) => {
          return total + item.quantity * item.unitPrice
        }, 0)
      }
  
      // Create a new purchase order
      const newPurchaseOrder = new PurchaseOrder(data)
      const savedPurchaseOrder = await newPurchaseOrder.save()
  
      return Response.json(savedPurchaseOrder, { status: 201 })
    } catch (err) {
      console.error("Error creating purchase order:", err)
      return Response.json({ error: "Server error", message: err.message }, { status: 500 })
    }
  }
  