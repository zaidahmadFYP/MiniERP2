import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material"
import { AccountBalance, PointOfSale } from "@mui/icons-material"
import SimplePieChart from "../charts/SimplePieChart"
import ErrorBoundary from "../ErrorBoundary"
import { format } from "date-fns"

const POSConfigurationTab = ({ authorityData, posStatusData, filteredPosConfigs, posConfigs }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            POS by Authority Type
          </Typography>
          <ErrorBoundary>
            <Box
              sx={{
                height: 300,
                p: 2,
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.1)
                  : alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
              }}
            >
              {authorityData.length > 0 ? (
                <SimplePieChart data={authorityData} valueKey="value" labelKey="name" />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                    borderRadius: 2,
                    p: 4,
                  }}
                >
                  <AccountBalance sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
                  <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                    No authority data available.
                  </Typography>
                </Box>
              )}
            </Box>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mb: 3 }}>
            POS Status Distribution
          </Typography>
          <ErrorBoundary>
            <Box
              sx={{
                height: 300,
                p: 2,
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.1)
                  : alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
                boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.05)",
              }}
            >
              {posStatusData.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 6,
                      mb: 4,
                    }}
                  >
                    {posStatusData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            backgroundColor: item.name === "Online" ? "#00C49F" : primaryColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            boxShadow: isDarkMode
                              ? "0 8px 20px rgba(0,0,0,0.4)"
                              : "0 8px 20px rgba(0,0,0,0.15)",
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: 5,
                              left: 5,
                              right: 5,
                              bottom: 5,
                              borderRadius: "50%",
                              border: "2px solid rgba(255,255,255,0.3)",
                            },
                          }}
                        >
                          <Typography variant="h4" color="white" fontWeight="bold">
                            {item.value}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ width: "100%", mb: 2 }} />
                  <Typography variant="body1" fontWeight="medium" sx={{ color: primaryColor }}>
                    Total POS: {posConfigs.length}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                    borderRadius: 2,
                    p: 4,
                  }}
                >
                  <PointOfSale sx={{ fontSize: 48, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3), mb: 2 }} />
                  <Typography variant="body1" align="center" sx={{ color: "text.secondary" }}>
                    No status data available.
                  </Typography>
                </Box>
              )}
            </Box>
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: primaryColor, mt: 2, mb: 3 }}>
            POS Configuration Details
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
              border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.2 : 0.1)}`,
              backgroundColor: isDarkMode ? "rgba(30,30,30,0.4)" : undefined,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha("#f15a22", isDarkMode ? 0.15 : 0.05) }}>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>POS ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Registration Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Authority Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Time Bound</TableCell>
                  <TableCell sx={{ fontWeight: "bold", py: 2 }}>Username</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosConfigs.length > 0 ? (
                  filteredPosConfigs.map((pos) => (
                    <TableRow
                      key={pos.PosID}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#f15a22", isDarkMode ? 0.08 : 0.03),
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>{pos.PosID}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{pos.RegistrationNumber}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{pos.AuthorityType}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={pos.POSStatus}
                          color={pos.POSStatus === "Online" ? "success" : "error"}
                          size="small"
                          sx={{
                            fontWeight: "medium",
                            borderRadius: "12px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {format(new Date(pos.TimeBound.Start), "MM/dd/yyyy")} -{" "}
                        {format(new Date(pos.TimeBound.End), "MM/dd/yyyy")}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{pos.Username || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <PointOfSale sx={{ fontSize: 32, color: alpha("#f15a22", isDarkMode ? 0.4 : 0.3) }} />
                        <Typography variant="body2" color="text.secondary">
                          No POS configurations available.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default POSConfigurationTab

