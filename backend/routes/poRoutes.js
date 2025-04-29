/**
 * Purchase Order Routes
 *
 * This file defines the API routes for purchase order operations.
 */

const express = require("express")
const router = express.Router()
const PurchaseOrder = require("../models/poModel")

/**
 * @route   GET /api/purchase-orders
 * @desc    Get all purchase orders
 * @access  Private
 */
router.get("/", async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 })
    res.json(purchaseOrders)
  } catch (err) {
    console.error("Error fetching purchase orders:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   GET /api/purchase-orders/:id
 * @desc    Get purchase order by ID
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" })
    }

    res.json(purchaseOrder)
  } catch (err) {
    console.error("Error fetching purchase order:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   POST /api/purchase-orders
 * @desc    Create a new purchase order
 * @access  Private
 */
router.post("/", async (req, res) => {
  try {
    // Generate a unique order number if not provided
    if (!req.body.orderNumber) {
      const count = await PurchaseOrder.countDocuments()
      req.body.orderNumber = `PO-${(100000 + count).toString().substring(1)}`
    }

    const newPurchaseOrder = new PurchaseOrder(req.body)
    const savedPurchaseOrder = await newPurchaseOrder.save()

    res.status(201).json(savedPurchaseOrder)
  } catch (err) {
    console.error("Error creating purchase order:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   PUT /api/purchase-orders/:id
 * @desc    Update a purchase order
 * @access  Private
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!updatedPurchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" })
    }

    res.json(updatedPurchaseOrder)
  } catch (err) {
    console.error("Error updating purchase order:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   DELETE /api/purchase-orders/:id
 * @desc    Delete a purchase order
 * @access  Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedPurchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id)

    if (!deletedPurchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" })
    }

    res.json({ message: "Purchase order deleted successfully" })
  } catch (err) {
    console.error("Error deleting purchase order:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   POST /api/purchase-orders/:id/line-items
 * @desc    Add a line item to a purchase order
 * @access  Private
 */
router.post("/:id/line-items", async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" })
    }

    purchaseOrder.lineItems.push(req.body)
    const updatedPurchaseOrder = await purchaseOrder.save()

    res.status(201).json(updatedPurchaseOrder)
  } catch (err) {
    console.error("Error adding line item:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   PUT /api/purchase-orders/:id/line-items/:lineItemId
 * @desc    Update a line item in a purchase order
 * @access  Private
 */
router.put("/:id/line-items/:lineItemId", async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" })
    }

    const lineItem = purchaseOrder.lineItems.id(req.params.lineItemId)

    if (!lineItem) {
      return res.status(404).json({ error: "Line item not found" })
    }

    // Update line item fields
    Object.keys(req.body).forEach((key) => {
      lineItem[key] = req.body[key]
    })

    const updatedPurchaseOrder = await purchaseOrder.save()

    res.json(updatedPurchaseOrder)
  } catch (err) {
    console.error("Error updating line item:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

/**
 * @route   DELETE /api/purchase-orders/:id/line-items/:lineItemId
 * @desc    Delete a line item from a purchase order
 * @access  Private
 */
router.delete("/:id/line-items/:lineItemId", async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id)

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" })
    }

    const lineItem = purchaseOrder.lineItems.id(req.params.lineItemId)

    if (!lineItem) {
      return res.status(404).json({ error: "Line item not found" })
    }

    lineItem.remove()
    const updatedPurchaseOrder = await purchaseOrder.save()

    res.json(updatedPurchaseOrder)
  } catch (err) {
    console.error("Error deleting line item:", err)
    res.status(500).json({ error: "Server error", message: err.message })
  }
})

module.exports = router
