// Create a mock API route for currencies
export async function GET(request) {
    // Return mock currencies
    return Response.json([
      { code: "PKR", name: "Pakistani Rupee" },
      { code: "USD", name: "US Dollar" },
      { code: "EUR", name: "Euro" },
      { code: "GBP", name: "British Pound" },
    ])
  }

  