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
//   Tooltip,
//   Fade,
//   Chip
// } from "@mui/material"
// import { BarChart, TrendingUp, Visibility } from "@mui/icons-material"
// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"

// const MultiBarChart = ({ data = [], xKey, bars = [], title }) => {
//   const theme = useTheme()
//   const isDark = theme.palette.mode === "dark"
  
//   // Enhanced color palette with gradients
//   const barColors = [
//     {
//       main: "#4cc9f0",
//       gradient: `linear-gradient(180deg, ${alpha("#4cc9f0", 0.9)}, ${alpha("#4cc9f0", 0.7)})`,
//       shadow: alpha("#4cc9f0", 0.4)
//     },
//     {
//       main: "#f72585",
//       gradient: `linear-gradient(180deg, ${alpha("#f72585", 0.9)}, ${alpha("#f72585", 0.7)})`,
//       shadow: alpha("#f72585", 0.4)
//     },
//     {
//       main: "#4361ee",
//       gradient: `linear-gradient(180deg, ${alpha("#4361ee", 0.9)}, ${alpha("#4361ee", 0.7)})`,
//       shadow: alpha("#4361ee", 0.4)
//     }
//   ]
  
//   // Animation states
//   const [isVisible, setIsVisible] = useState(false)
//   const [hoveredBar, setHoveredBar] = useState(null)
  
//   // Ensure we have arrays even if props are undefined
//   const safeData = Array.isArray(data) ? data : []
//   const safeBars = Array.isArray(bars) ? bars : []
  
//   // Animation on mount
//   useEffect(() => {
//     setIsVisible(true)
//   }, [])
  
//   // Find the max value safely across all bars
//   const maxValue = Math.max(...safeData.map((d) => Math.max(...safeBars.map((b) => d[b.key] || 0))))
  
//   // Format value according to type
//   const formatValue = (value, format) => {
//     if (typeof value !== 'number') return value || "N/A"
    
//     if (format === "currency") {
//       return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//     } else if (format === "percent") {
//       return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
//     } else {
//       return value.toLocaleString()
//     }
//   }

//   return (
//     <Box 
//       sx={{ 
//         p: 3, 
//         backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 1),
//         borderRadius: 3,
//         boxShadow: theme.shadows[isDark ? 4 : 1],
//         overflow: "hidden",
//         transition: "all 0.3s ease",
//         "&:hover": {
//           boxShadow: theme.shadows[isDark ? 8 : 3],
//         }
//       }}
//     >
//       {/* Enhanced header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <BarChart sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
//           <Typography variant="h6" fontWeight="600" color="primary">
//             {title || "Comparison"}
//           </Typography>
//         </Box>
//         <Chip 
//           icon={<TrendingUp fontSize="small" />} 
//           label={`Max: ${formatValue(maxValue, safeBars[0]?.format)}`} 
//           size="small"
//           color="primary"
//           variant="outlined"
//           sx={{ borderRadius: 2 }}
//         />
//       </Box>
      
//       {/* Chart */}
//       <Box 
//         sx={{ 
//           height: 280, 
//           position: "relative", 
//           mb: 4,
//           borderRadius: 2,
//           overflow: "hidden",
//           background: isDark 
//             ? `linear-gradient(to top, ${alpha(theme.palette.background.default, 0.3)}, ${alpha(theme.palette.background.paper, 0.1)})`
//             : `linear-gradient(to top, ${alpha(theme.palette.grey[100], 0.6)}, ${alpha(theme.palette.common.white, 0.8)})`,
//           boxShadow: `inset 0 0 10px ${alpha(theme.palette.divider, 0.1)}`,
//         }}
//       >
//         {/* Grid lines */}
//         {[0.25, 0.5, 0.75].map((line, i) => (
//           <Box 
//             key={`grid-${i}`}
//             sx={{
//               position: "absolute",
//               left: 0,
//               right: 0,
//               top: `${(1-line) * 100}%`,
//               height: 1,
//               backgroundColor: alpha(theme.palette.divider, 0.3),
//               zIndex: 1,
//               pointerEvents: "none",
//               borderStyle: "dashed",
//               borderWidth: 0,
//               borderTopWidth: 1,
//               borderColor: isDark ? alpha(theme.palette.grey[600], 0.2) : alpha(theme.palette.grey[300], 0.7)
//             }}
//           />
//         ))}
        
//         {/* Y-axis labels */}
//         {[0.25, 0.5, 0.75, 1].map((mark, i) => (
//           <Typography
//             key={`y-label-${i}`}
//             variant="caption"
//             component="div"
//             sx={{
//               position: "absolute",
//               left: 10,
//               top: `${(1-mark) * 100}%`,
//               transform: "translateY(-50%)",
//               color: theme.palette.text.secondary,
//               fontSize: "0.7rem",
//               zIndex: 2,
//               opacity: 0.7
//             }}
//           >
//             {formatValue(maxValue * mark, safeBars[0]?.format)}
//           </Typography>
//         ))}
        
//         {/* Bars container */}
//         <Box
//           sx={{
//             width: "100%",
//             height: "100%",
//             position: "relative",
//             p: 3,
//             pt: 1,
//             pb: 2,
//             display: "flex",
//             justifyContent: "space-around",
//             alignItems: "flex-end",
//             zIndex: 3
//           }}
//         >
//           {safeData.map((item, i) => (
//             <Box
//               key={i}
//               sx={{ 
//                 display: "flex", 
//                 height: "100%", 
//                 alignItems: "flex-end", 
//                 flexBasis: `${80 / safeData.length}%`,
//                 position: "relative"
//               }}
//             >
//               {/* X-axis label */}
//               <Typography
//                 variant="caption"
//                 sx={{
//                   position: "absolute",
//                   bottom: -24,
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   maxWidth: "100%",
//                   color: theme.palette.text.secondary,
//                   fontWeight: "medium"
//                 }}
//               >
//                 {item[xKey]}
//               </Typography>
              
//               {/* Bars */}
//               {safeBars.map((bar, j) => {
//                 // Calculate height percentage safely
//                 const value = item[bar.key] || 0
//                 const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0
//                 const barId = `${i}-${j}`;
//                 const isHovered = hoveredBar === barId;

//                 return (
//                   <Tooltip
//                     key={j}
//                     title={
//                       <Box sx={{ p: 0.5 }}>
//                         <Typography variant="caption" fontWeight="bold" sx={{ display: "block" }}>
//                           {bar.label}: {formatValue(value, bar.format)}
//                         </Typography>
//                         <Typography variant="caption" sx={{ opacity: 0.8 }}>
//                           {item[xKey]}
//                         </Typography>
//                       </Box>
//                     }
//                     arrow
//                     placement="top"
//                     TransitionComponent={Fade}
//                     TransitionProps={{ timeout: 400 }}
//                   >
//                     <Box
//                       component={motion.div}
//                       initial={{ height: 0 }}
//                       animate={{ 
//                         height: isVisible ? `${heightPercentage}%` : 0,
//                         scale: isHovered ? 1.05 : 1
//                       }}
//                       transition={{ 
//                         duration: 0.7,
//                         delay: j * 0.1 + i * 0.05,
//                         ease: "easeOut"
//                       }}
//                       onMouseEnter={() => setHoveredBar(barId)}
//                       onMouseLeave={() => setHoveredBar(null)}
//                       sx={{
//                         width: `${90 / safeBars.length}%`,
//                         mx: 0.5,
//                         minWidth: 12,
//                         background: barColors[j % barColors.length].gradient,
//                         borderTopLeftRadius: 4,
//                         borderTopRightRadius: 4,
//                         position: "relative",
//                         transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                         boxShadow: isHovered 
//                           ? `0 0 15px ${barColors[j % barColors.length].shadow}`
//                           : `0 0 5px ${alpha(barColors[j % barColors.length].shadow, 0.5)}`,
//                         cursor: "pointer",
//                         "&::after": {
//                           content: '""',
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           right: 0,
//                           height: "30%",
//                           background: `linear-gradient(180deg, ${alpha("#ffffff", 0.3)}, transparent)`,
//                           borderTopLeftRadius: 4,
//                           borderTopRightRadius: 4,
//                         }
//                       }}
//                     />
//                   </Tooltip>
//                 )
//               })}
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Enhanced Legend */}
//       <Box sx={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         mb: 3, 
//         gap: 2,
//         flexWrap: "wrap"
//       }}>
//         {safeBars.map((bar, i) => (
//           <Box 
//             key={i} 
//             sx={{ 
//               display: "flex", 
//               alignItems: "center", 
//               bgcolor: isDark 
//                 ? alpha(barColors[i % barColors.length].main, 0.1) 
//                 : alpha(barColors[i % barColors.length].main, 0.05),
//               px: 1.5,
//               py: 0.5, 
//               borderRadius: 2,
//               border: `1px solid ${alpha(barColors[i % barColors.length].main, 0.2)}`,
//             }}>
//             <Box
//               sx={{
//                 width: 10,
//                 height: 10,
//                 background: barColors[i % barColors.length].gradient,
//                 borderRadius: 1,
//                 mr: 1,
//                 boxShadow: `0 0 4px ${barColors[i % barColors.length].shadow}`
//               }}
//             />
//             <Typography variant="body2" fontWeight="medium" color={alpha(barColors[i % barColors.length].main, 0.9)}>
//               {bar.label}
//             </Typography>
//           </Box>
//         ))}
//       </Box>

//       {/* Enhanced Data Table */}
//       <Box
//         component={motion.div}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
//         transition={{ duration: 0.5, delay: 0.3 }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, ml: 1 }}>
//           <Visibility fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1, opacity: 0.7 }} />
//           <Typography variant="body2" color="textSecondary" fontWeight="medium">
//             Detailed Data
//           </Typography>
//         </Box>
        
//         <TableContainer 
//           component={Paper} 
//           variant="outlined" 
//           sx={{ 
//             borderRadius: 2,
//             boxShadow: theme.shadows[isDark ? 2 : 1],
//             "& .MuiTableCell-root": {
//               borderColor: alpha(theme.palette.divider, 0.5)
//             }
//           }}
//         >
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 background: isDark 
//                   ? `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.15)}, ${alpha(theme.palette.primary.dark, 0.05)})`
//                   : `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.15)}, ${alpha(theme.palette.primary.light, 0.05)})`,
//               }}>
//                 <TableCell sx={{ 
//                   fontWeight: "bold",
//                   fontSize: "0.875rem",
//                   color: theme.palette.primary.main
//                 }}>
//                   {xKey}
//                 </TableCell>
//                 {safeBars.map((bar) => (
//                   <TableCell 
//                     key={bar.key} 
//                     align="right" 
//                     sx={{ 
//                       fontWeight: "bold",
//                       fontSize: "0.875rem",
//                       color: theme.palette.primary.main
//                     }}
//                   >
//                     {bar.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {safeData.map((item, index) => (
//                 <TableRow 
//                   key={index} 
//                   hover
//                   sx={{
//                     "&:nth-of-type(odd)": {
//                       backgroundColor: isDark 
//                         ? alpha(theme.palette.background.paper, 0.05) 
//                         : alpha(theme.palette.background.paper, 0.2)
//                     },
//                     "&:hover": {
//                       backgroundColor: isDark 
//                         ? alpha(theme.palette.action.hover, 0.1) 
//                         : alpha(theme.palette.action.hover, 0.05)
//                     },
//                     transition: "background-color 0.2s"
//                   }}
//                 >
//                   <TableCell 
//                     sx={{ 
//                       fontWeight: "medium",
//                       borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.4)}`
//                     }}
//                   >
//                     {item[xKey]}
//                   </TableCell>
//                   {safeBars.map((bar, idx) => (
//                     <TableCell 
//                       key={bar.key} 
//                       align="right"
//                       sx={{
//                         color: barColors[idx % barColors.length].main,
//                         fontWeight: "500",
//                         fontFamily: "monospace"
//                       }}
//                     >
//                       {formatValue(item[bar.key], bar.format)}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   )
// }

// export default MultiBarChart

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
  Tooltip,
  Fade,
  Chip
} from "@mui/material"
import { BarChart, TrendingUp, Visibility } from "@mui/icons-material"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Mock data for the chart
const mockSalesData = [
  {
    month: "Jan",
    revenue: 45000,
    profit: 12500,
    growth: 15.2
  },
  {
    month: "Feb",
    revenue: 52000,
    profit: 15800,
    growth: 8.7
  },
  {
    month: "Mar",
    revenue: 48000,
    profit: 13200,
    growth: 5.3
  },
  {
    month: "Apr",
    revenue: 61000,
    profit: 18400,
    growth: 12.1
  },
  {
    month: "May",
    revenue: 67000,
    profit: 22500,
    growth: 18.9
  },
  {
    month: "Jun",
    revenue: 58000,
    profit: 16700,
    growth: -2.4
  }
]

// Configuration for the bar chart
const salesChartConfig = {
  xKey: "month",
  bars: [
    { key: "revenue", label: "Revenue", format: "currency" },
    { key: "profit", label: "Profit", format: "currency" },
    { key: "growth", label: "Growth", format: "percent" }
  ],
  title: "Monthly Sales Performance"
}

const MultiBarChart = ({ data = [], xKey, bars = [], title }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  
  // Enhanced color palette with gradients
  const barColors = [
    {
      main: "#4cc9f0",
      gradient: `linear-gradient(180deg, ${alpha("#4cc9f0", 0.9)}, ${alpha("#4cc9f0", 0.7)})`,
      shadow: alpha("#4cc9f0", 0.4)
    },
    {
      main: "#f72585",
      gradient: `linear-gradient(180deg, ${alpha("#f72585", 0.9)}, ${alpha("#f72585", 0.7)})`,
      shadow: alpha("#f72585", 0.4)
    },
    {
      main: "#4361ee",
      gradient: `linear-gradient(180deg, ${alpha("#4361ee", 0.9)}, ${alpha("#4361ee", 0.7)})`,
      shadow: alpha("#4361ee", 0.4)
    }
  ]
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  
  // Ensure we have arrays even if props are undefined
  const safeData = Array.isArray(data) ? data : []
  const safeBars = Array.isArray(bars) ? bars : []
  
  // Animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  // Find the max value safely across all bars
  const maxValue = Math.max(...safeData.map((d) => Math.max(...safeBars.map((b) => d[b.key] || 0))))
  
  // Format value according to type
  const formatValue = (value, format) => {
    if (typeof value !== 'number') return value || "N/A"
    
    if (format === "currency") {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (format === "percent") {
      return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
    } else {
      return value.toLocaleString()
    }
  }

  return (
    <Box 
      sx={{ 
        p: 3, 
        backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 1),
        borderRadius: 3,
        boxShadow: theme.shadows[isDark ? 4 : 1],
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[isDark ? 8 : 3],
        }
      }}
    >
      {/* Enhanced header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BarChart sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
          <Typography variant="h6" fontWeight="600" color="primary">
            {title || "Comparison"}
          </Typography>
        </Box>
        <Chip 
          icon={<TrendingUp fontSize="small" />} 
          label={`Max: ${formatValue(maxValue, safeBars[0]?.format)}`} 
          size="small"
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        />
      </Box>
      
      {/* Chart */}
      <Box 
        sx={{ 
          height: 280, 
          position: "relative", 
          mb: 4,
          borderRadius: 2,
          overflow: "hidden",
          background: isDark 
            ? `linear-gradient(to top, ${alpha(theme.palette.background.default, 0.3)}, ${alpha(theme.palette.background.paper, 0.1)})`
            : `linear-gradient(to top, ${alpha(theme.palette.grey[100], 0.6)}, ${alpha(theme.palette.common.white, 0.8)})`,
          boxShadow: `inset 0 0 10px ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((line, i) => (
          <Box 
            key={`grid-${i}`}
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(1-line) * 100}%`,
              height: 1,
              backgroundColor: alpha(theme.palette.divider, 0.3),
              zIndex: 1,
              pointerEvents: "none",
              borderStyle: "dashed",
              borderWidth: 0,
              borderTopWidth: 1,
              borderColor: isDark ? alpha(theme.palette.grey[600], 0.2) : alpha(theme.palette.grey[300], 0.7)
            }}
          />
        ))}
        
        {/* Y-axis labels */}
        {[0.25, 0.5, 0.75, 1].map((mark, i) => (
          <Typography
            key={`y-label-${i}`}
            variant="caption"
            component="div"
            sx={{
              position: "absolute",
              left: 10,
              top: `${(1-mark) * 100}%`,
              transform: "translateY(-50%)",
              color: theme.palette.text.secondary,
              fontSize: "0.7rem",
              zIndex: 2,
              opacity: 0.7
            }}
          >
            {formatValue(maxValue * mark, safeBars[0]?.format)}
          </Typography>
        ))}
        
        {/* Bars container */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            p: 3,
            pt: 1,
            pb: 2,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
            zIndex: 3
          }}
        >
          {safeData.map((item, i) => (
            <Box
              key={i}
              sx={{ 
                display: "flex", 
                height: "100%", 
                alignItems: "flex-end", 
                flexBasis: `${80 / safeData.length}%`,
                position: "relative"
              }}
            >
              {/* X-axis label */}
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: -24,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  color: theme.palette.text.secondary,
                  fontWeight: "medium"
                }}
              >
                {item[xKey]}
              </Typography>
              
              {/* Bars */}
              {safeBars.map((bar, j) => {
                // Calculate height percentage safely
                const value = item[bar.key] || 0
                const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0
                const barId = `${i}-${j}`;
                const isHovered = hoveredBar === barId;

                return (
                  <Tooltip
                    key={j}
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ display: "block" }}>
                          {bar.label}: {formatValue(value, bar.format)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {item[xKey]}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 400 }}
                  >
                    <Box
                      component={motion.div}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: isVisible ? `${heightPercentage}%` : 0,
                        scale: isHovered ? 1.05 : 1
                      }}
                      transition={{ 
                        duration: 0.7,
                        delay: j * 0.1 + i * 0.05,
                        ease: "easeOut"
                      }}
                      onMouseEnter={() => setHoveredBar(barId)}
                      onMouseLeave={() => setHoveredBar(null)}
                      sx={{
                        width: `${90 / safeBars.length}%`,
                        mx: 0.5,
                        minWidth: 12,
                        background: barColors[j % barColors.length].gradient,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isHovered 
                          ? `0 0 15px ${barColors[j % barColors.length].shadow}`
                          : `0 0 5px ${alpha(barColors[j % barColors.length].shadow, 0.5)}`,
                        cursor: "pointer",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "30%",
                          background: `linear-gradient(180deg, ${alpha("#ffffff", 0.3)}, transparent)`,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        }
                      }}
                    />
                  </Tooltip>
                )
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Enhanced Legend */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        mb: 3, 
        gap: 2,
        flexWrap: "wrap"
      }}>
        {safeBars.map((bar, i) => (
          <Box 
            key={i} 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              bgcolor: isDark 
                ? alpha(barColors[i % barColors.length].main, 0.1) 
                : alpha(barColors[i % barColors.length].main, 0.05),
              px: 1.5,
              py: 0.5, 
              borderRadius: 2,
              border: `1px solid ${alpha(barColors[i % barColors.length].main, 0.2)}`,
            }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                background: barColors[i % barColors.length].gradient,
                borderRadius: 1,
                mr: 1,
                boxShadow: `0 0 4px ${barColors[i % barColors.length].shadow}`
              }}
            />
            <Typography variant="body2" fontWeight="medium" color={alpha(barColors[i % barColors.length].main, 0.9)}>
              {bar.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Enhanced Data Table */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, ml: 1 }}>
          <Visibility fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1, opacity: 0.7 }} />
          <Typography variant="body2" color="textSecondary" fontWeight="medium">
            Detailed Data
          </Typography>
        </Box>
        
        <TableContainer 
          component={Paper} 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[isDark ? 2 : 1],
            "& .MuiTableCell-root": {
              borderColor: alpha(theme.palette.divider, 0.5)
            }
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                background: isDark 
                  ? `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.15)}, ${alpha(theme.palette.primary.dark, 0.05)})`
                  : `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.15)}, ${alpha(theme.palette.primary.light, 0.05)})`,
              }}>
                <TableCell sx={{ 
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  color: theme.palette.primary.main
                }}>
                  {xKey}
                </TableCell>
                {safeBars.map((bar) => (
                  <TableCell 
                    key={bar.key} 
                    align="right" 
                    sx={{ 
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      color: theme.palette.primary.main
                    }}
                  >
                    {bar.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {safeData.map((item, index) => (
                <TableRow 
                  key={index} 
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: isDark 
                        ? alpha(theme.palette.background.paper, 0.05) 
                        : alpha(theme.palette.background.paper, 0.2)
                    },
                    "&:hover": {
                      backgroundColor: isDark 
                        ? alpha(theme.palette.action.hover, 0.1) 
                        : alpha(theme.palette.action.hover, 0.05)
                    },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell 
                    sx={{ 
                      fontWeight: "medium",
                      borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.4)}`
                    }}
                  >
                    {item[xKey]}
                  </TableCell>
                  {safeBars.map((bar, idx) => (
                    <TableCell 
                      key={bar.key} 
                      align="right"
                      sx={{
                        color: barColors[idx % barColors.length].main,
                        fontWeight: "500",
                        fontFamily: "monospace"
                      }}
                    >
                      {formatValue(item[bar.key], bar.format)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

// Example usage demo component
const ChartDemo = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <MultiBarChart 
        data={mockSalesData}
        xKey={salesChartConfig.xKey}
        bars={salesChartConfig.bars}
        title={salesChartConfig.title}
      />
    </Box>
  )
}

export default ChartDemo