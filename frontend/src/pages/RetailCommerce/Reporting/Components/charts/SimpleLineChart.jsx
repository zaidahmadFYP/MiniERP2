"use client"
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
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"

const SimpleLineChart = ({ data, xKey, yKey, label }) => {
  const theme = useTheme()

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
        {label || "Trend"}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha("#f15a22", theme.palette.mode === "dark" ? 0.15 : 0.05) }}>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Value
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Change
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              const prevValue = index > 0 ? data[index - 1][yKey] : null
              const change = prevValue !== null ? item[yKey] - prevValue : 0
              const changePercent = prevValue !== null && prevValue !== 0 ? (change / prevValue) * 100 : 0

              return (
                <TableRow key={index} hover>
                  <TableCell>{item[xKey]}</TableCell>
                  <TableCell align="right">{item[yKey].toFixed(2)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: change > 0 ? "success.main" : change < 0 ? "error.main" : "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {change !== 0 &&
                      (change > 0 ? (
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                      ) : (
                        <ArrowDownward fontSize="small" sx={{ mr: 0.5 }} />
                      ))}
                    {change !== 0 ? `${Math.abs(changePercent).toFixed(1)}%` : "-"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default SimpleLineChart
