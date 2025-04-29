/**
 * API Route for fetching a purchase order by order number
 */

export async function GET(request, { params }) {
  try {
    const { orderNumber } = params

    // Connect to MongoDB
    const { default: mongoose } = await import("mongoose")
    const { default: PurchaseOrder } = await import("../../../models/poModel")

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI)
    }

    // Find the purchase order by order number
    const purchaseOrder = await PurchaseOrder.findOne({ orderNumber })

    if (!purchaseOrder) {
      return Response.json({ error: "Purchase order not found" }, { status: 404 })
    }

    return Response.json(purchaseOrder)
  } catch (err) {
    console.error("Error fetching purchase order by number:", err)
    return Response.json({ error: "Server error", message: err.message }, { status: 500 })
  }
}
