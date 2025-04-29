import { NextResponse } from "next/server"

// Sample vendor data for demonstration
const vendors = [
  {
    vendorId: "VEND1001",
    name: "techsupplies",
    searchName: "techsupplies",
    phone: "+1-555-123-4567",
    city: "San Francisco",
    address: "123 Tech Blvd, San Francisco, CA 94107",
    contactPerson: "John Smith",
    deliveryName: "Tech Supplies Inc.",
  },
  {
    vendorId: "VEND1002",
    name: "officeessentials",
    searchName: "officeessentials",
    phone: "+1-555-987-6543",
    city: "New York",
    address: "456 Office Ave, New York, NY 10001",
    contactPerson: "Sarah Johnson",
    deliveryName: "Office Essentials Co.",
  },
  {
    vendorId: "VEND1003",
    name: "hardwaresolutions",
    searchName: "hardwaresolutions",
    phone: "-",
    city: "Chicago",
    address: "789 Hardware St, Chicago, IL 60601",
    contactPerson: "Mike Brown",
    deliveryName: "Hardware Solutions LLC",
  },
]

export async function GET() {
  return NextResponse.json(vendors)
}
