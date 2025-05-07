import {
  Box,
  Typography,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  alpha,
  useTheme,
} from "@mui/material"
import { Business } from "@mui/icons-material"
import { format } from "date-fns"
import ErrorBoundary from "../ErrorBoundary"

const BanksTab = ({ banks, primaryColor, isDarkMode }) => {
  const theme = useTheme()

  // Count active and inactive banks
  const activeBanks = banks.filter((bank) => bank.status === "Active").length
  const inactiveBanks = banks.filter((bank) => bank.status !== "Active").length

  // Create data for pie chart
  const statusData = [
    { name: "Active", value: activeBanks },
    { name: "Inactive", value: inactiveBanks },
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            Banks Directory
          </Typography>
          <ErrorBoundary>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
                overflow: "auto",
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", py: 2 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {banks.length > 0 ? (
                    banks.map((bank) => (
                      <TableRow
                        key={bank.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{bank.name}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>{bank.code}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>{bank.address}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>{format(new Date(bank.createdAt), "MM/dd/yyyy")}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={bank.status}
                            color={bank.status === "Active" ? "success" : "default"}
                            size="small"
                            sx={{ fontWeight: "medium" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <Business sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                          <Typography variant="body2" color="text.secondary">
                            No banks available.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BanksTab
