"\"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AccountsPayablePreview from "../accounts-payable-preview"
import PurchaseOrderDetails from "../purchase-order-details"

export default function Page() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountsPayablePreview />} />
        <Route path="/purchase-order/:id" element={<PurchaseOrderDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
