import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Business as BusinessIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material"

const Dashboard = ({ isDarkMode, banks }) => {
  // Calculate active and inactive banks
  const activeBanks = banks.filter((bank) => bank.isActive).length
  const inactiveBanks = banks.length - activeBanks

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(241, 90, 34, 0.15)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Total Banks
              </Typography>
              <BusinessIcon sx={{ color: "#f15a22", fontSize: 32 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#f15a22" }}>
              {banks.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {activeBanks} active, {inactiveBanks} inactive
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(241, 90, 34, 0.15)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Total Accounts
              </Typography>
              <AccountBalanceWalletIcon sx={{ color: "#f15a22", fontSize: 32 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#f15a22" }}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Across {banks.length} banks
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 25px rgba(241, 90, 34, 0.15)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Account Types
              </Typography>
              <PieChartIcon sx={{ color: "#f15a22", fontSize: 32 }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Checking</Typography>
                <Typography variant="body1" fontWeight="bold">
                  0
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Savings</Typography>
                <Typography variant="body1" fontWeight="bold">
                  0
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Investment</Typography>
                <Typography variant="body1" fontWeight="bold">
                  0
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: "#f15a22" }}>
              Recent Activity
            </Typography>
            {banks.length > 0 ? (
              <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                {banks
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .slice(0, 5)
                  .map((bank) => (
                    <Box
                      key={bank._id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: "8px",
                        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#f9f9f9",
                        borderLeft: `4px solid ${bank.isActive ? "#4caf50" : "#f44336"}`,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {bank.name} ({bank.code})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {bank.isActive ? "Active" : "Inactive"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date(bank.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent activity to display
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard
