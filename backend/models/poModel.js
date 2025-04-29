/**
 * Purchase Order Model
 *
 * This model defines the schema for purchase orders and their line items.
 */

const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Line Item Schema
const LineItemSchema = new Schema(
  {
    itemNumber: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    prAccount: {
      type: String,
      default: "SERVICES RENOVATION",
    },
    procurementCategory: {
      type: String,
      default: "SERVICES RENOVATION",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "JOB",
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    lastPurchPrice: {
      type: Number,
      default: function () {
        return this.unitPrice
      },
    },
    percentage: {
      type: Number,
      default: 0,
    },
    lastPurchaseDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-US"),
    },
    adjustedUnitCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    lineAmount: {
      type: Number,
      default: function () {
        return this.quantity * this.unitPrice
      },
    },
  },
  { timestamps: true },
)

// Purchase Order Schema
const PurchaseOrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vendorId: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    vendorContact: {
      type: String,
      default: "Not specified",
    },
    deliveryName: {
      type: String,
      default: "",
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      required: true,
      default: "PKR",
    },
    currencyName: {
      type: String,
      default: "Pakistani Rupee",
    },
    invoiceAccount: {
      type: String,
      default: function () {
        return this.vendorId
      },
    },
    invoiceName: {
      type: String,
      default: function () {
        return this.vendorName
      },
    },
    requestedDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-US"),
    },
    status: {
      type: String,
      enum: ["Draft", "Open order", "Received", "Invoiced", "Closed"],
      default: "Open order",
    },
    confirmation: {
      type: String,
      enum: ["Draft", "In review", "Confirmed", "Approved", "Rejected"],
      default: "Confirmed",
    },
    lineItems: [LineItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalReceipt: {
      type: Number,
      default: 0,
    },
    modeOfDelivery: {
      type: String,
      default: "",
    },
    deliveryTerms: {
      type: String,
      default: "",
    },
    purchaseStatus: {
      type: String,
      default: "",
    },
    qualityOrderStatus: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

// Update the pre-save hook to calculate total amount correctly
PurchaseOrderSchema.pre("save", function (next) {
  if (this.lineItems && this.lineItems.length > 0) {
    // Calculate total amount from line items
    this.totalAmount = this.lineItems.reduce((total, item) => {
      return total + item.quantity * item.unitPrice
    }, 0)

    // Calculate total receipt (for now, we'll set it to a percentage of the total amount)
    // In a real system, this would be updated when items are received
    if (!this.totalReceipt || this.totalReceipt === 0) {
      // Default to 0 for new orders
      this.totalReceipt = 0
    }
  } else {
    this.totalAmount = 0
    this.totalReceipt = 0
  }
  next()
})

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema)
