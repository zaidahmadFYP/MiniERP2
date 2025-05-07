// import {
//   Box,
//   Typography,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   useTheme,
//   alpha,
// } from "@mui/material"

// // Add null checks to prevent undefined errors
// const MultiLineChart = ({ data = [], xKey, lines = [] }) => {
//   const theme = useTheme()
//   const colors = ["#4361ee", "#f72585", "#4cc9f0"]

//   // Ensure we have arrays even if props are undefined
//   const safeData = Array.isArray(data) ? data : []
//   const safeLines = Array.isArray(lines) ? lines : []

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ height: 200, position: "relative", mb: 4 }}>
//         {/* Simplified chart visual representation */}
//         <Box
//           sx={{
//             width: "100%",
//             height: "100%",
//             position: "relative",
//             border: "1px solid",
//             borderColor: "divider",
//             borderRadius: 1,
//             p: 2,
//             display: "flex",
//             alignItems: "flex-end",
//           }}
//         >
//           {safeLines.map((line, i) => {
//             // Find the max value safely
//             const maxValue = Math.max(...safeData.map((d) => d[line.key] || 0))
//             // Get the last value safely
//             const lastValue = safeData.length > 0 ? safeData[safeData.length - 1][line.key] || 0 : 0
//             // Calculate height percentage safely
//             const heightPercentage = maxValue > 0 ? (lastValue / maxValue) * 100 : 0

//             return (
//               <Box
//                 key={i}
//                 sx={{
//                   flex: 1,
//                   height: `${heightPercentage}%`,
//                   backgroundColor: colors[i % colors.length],
//                   mx: 0.5,
//                   borderTopLeftRadius: 4,
//                   borderTopRightRadius: 4,
//                   position: "relative",
//                   "&:after": {
//                     content: '""',
//                     position: "absolute",
//                     top: -25,
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     padding: "4px 8px",
//                     backgroundColor: colors[i % colors.length],
//                     color: "white",
//                     borderRadius: 1,
//                     fontSize: 12,
//                     whiteSpace: "nowrap",
//                   },
//                 }}
//               />
//             )
//           })}
//         </Box>

//         {/* Legend */}
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 3 }}>
//           {safeLines.map((line, i) => (
//             <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
//               <Box
//                 sx={{
//                   width: 12,
//                   height: 12,
//                   backgroundColor: colors[i % colors.length],
//                   borderRadius: 0.5,
//                   mr: 1,
//                 }}
//               />
//               <Typography variant="caption">{line.label}</Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
//         <Table size="small">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: alpha("#f15a22", theme.palette.mode === "dark" ? 0.15 : 0.05) }}>
//               <TableCell sx={{ fontWeight: "bold" }}>{xKey}</TableCell>
//               {safeLines.map((line) => (
//                 <TableCell key={line.key} align="right" sx={{ fontWeight: "bold" }}>
//                   {line.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {safeData.map((item, index) => (
//               <TableRow key={index} hover>
//                 <TableCell>{item[xKey]}</TableCell>
//                 {safeLines.map((line) => (
//                   <TableCell key={line.key} align="right">
//                     {typeof item[line.key] === "number" ? item[line.key].toLocaleString() : item[line.key] || "N/A"}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   )
// }

// export default MultiLineChart


import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  alpha,
} from "@mui/material"

// Sample mock data
const mockData = [
  { month: "Jan", sales: 1200, customers: 45, retention: 85 },
  { month: "Feb", sales: 1800, customers: 52, retention: 82 },
  { month: "Mar", sales: 1400, customers: 49, retention: 89 },
  { month: "Apr", sales: 2200, customers: 63, retention: 91 },
  { month: "May", sales: 2600, customers: 78, retention: 88 },
  { month: "Jun", sales: 3100, customers: 82, retention: 92 },
]

// Example line definitions
const mockLines = [
  { key: "sales", label: "Monthly Sales ($)" },
  { key: "customers", label: "New Customers" },
  { key: "retention", label: "Retention Rate (%)" },
]

// Add null checks to prevent undefined errors
const MultiLineChart = ({ data = mockData, xKey = "month", lines = mockLines }) => {
  const theme = useTheme()
  const colors = ["#4361ee", "#f72585", "#4cc9f0"]

  // Ensure we have arrays even if props are undefined
  const safeData = Array.isArray(data) ? data : []
  const safeLines = Array.isArray(lines) ? lines : []

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Performance Metrics
      </Typography>
      
      <Box sx={{ height: 200, position: "relative", mb: 4 }}>
        {/* Simplified chart visual representation */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {safeLines.map((line, i) => {
            // Find the max value safely
            const maxValue = Math.max(...safeData.map((d) => d[line.key] || 0))
            // Get the last value safely
            const lastValue = safeData.length > 0 ? safeData[safeData.length - 1][line.key] || 0 : 0
            // Calculate height percentage safely
            const heightPercentage = maxValue > 0 ? (lastValue / maxValue) * 100 : 0

            return (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${heightPercentage}%`,
                  backgroundColor: colors[i % colors.length],
                  mx: 0.5,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  position: "relative",
                  "&:after": {
                    content: `"${lastValue}"`,
                    position: "absolute",
                    top: -25,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "4px 8px",
                    backgroundColor: colors[i % colors.length],
                    color: "white",
                    borderRadius: 1,
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  },
                }}
              />
            )
          })}
        </Box>

        {/* Legend */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 3 }}>
          {safeLines.map((line, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors[i % colors.length],
                  borderRadius: 0.5,
                  mr: 1,
                }}
              />
              <Typography variant="caption">{line.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha("#f15a22", theme.palette.mode === "dark" ? 0.15 : 0.05) }}>
              <TableCell sx={{ fontWeight: "bold" }}>{xKey}</TableCell>
              {safeLines.map((line) => (
                <TableCell key={line.key} align="right" sx={{ fontWeight: "bold" }}>
                  {line.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>{item[xKey]}</TableCell>
                {safeLines.map((line) => (
                  <TableCell key={line.key} align="right">
                    {typeof item[line.key] === "number" ? item[line.key].toLocaleString() : item[line.key] || "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

// Example usage
const ChartDemo = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <MultiLineChart />
      </Paper>
    </Box>
  )
}

export default ChartDemo