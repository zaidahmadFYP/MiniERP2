"use client"
import { Grid, Card, CardContent, Box, Typography, Chip, useTheme, alpha } from "@mui/material"
import { ShoppingCart, Payment, PointOfSale } from "@mui/icons-material"
import { format } from "date-fns"

const SummaryCards = ({
  totalSales,
  totalTransactions,
  averageTransactionValue,
  startDate,
  endDate,
  posConfigs,
  posStatusCount,
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const primaryColor = "#f15a22"

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: 3,
            boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: isDarkMode ? "0 15px 35px rgba(0,0,0,0.4)" : "0 15px 35px rgba(0,0,0,0.15)",
              borderColor: alpha("#f15a22", isDarkMode ? 0.5 : 0.4),
            },
            overflow: "hidden",
            position: "relative",
            backgroundColor: isDarkMode ? "rgba(30,30,30,0.6)" : undefined,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: `linear-gradient(to right, ${primaryColor}, ${alpha("#f15a22", 0.7)})`,
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 4,
              pt: 5,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <ShoppingCart sx={{ fontSize: 32, color: primaryColor }} />
            </Box>
            <Typography color="textSecondary" gutterBottom variant="subtitle1" sx={{ fontWeight: 500 }}>
              Total Sales
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                color: primaryColor,
                my: 2,
                letterSpacing: "-0.5px",
              }}
            >
              ${totalSales.toFixed(2)}
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ textAlign: "center" }}>
              {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: 3,
            boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: isDarkMode ? "0 15px 35px rgba(0,0,0,0.4)" : "0 15px 35px rgba(0,0,0,0.15)",
              borderColor: alpha("#f15a22", isDarkMode ? 0.5 : 0.4),
            },
            overflow: "hidden",
            position: "relative",
            backgroundColor: isDarkMode ? "rgba(30,30,30,0.6)" : undefined,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: `linear-gradient(to right, ${primaryColor}, ${alpha("#f15a22", 0.7)})`,
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 4,
              pt: 5,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Payment sx={{ fontSize: 32, color: primaryColor }} />
            </Box>
            <Typography color="textSecondary" gutterBottom variant="subtitle1" sx={{ fontWeight: 500 }}>
              Total Transactions
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                color: primaryColor,
                my: 2,
                letterSpacing: "-0.5px",
              }}
            >
              {totalTransactions}
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ textAlign: "center" }}>
              Avg. ${averageTransactionValue.toFixed(2)} per transaction
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: 3,
            boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.1)",
            border: `1px solid ${alpha("#f15a22", isDarkMode ? 0.3 : 0.2)}`,
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: isDarkMode ? "0 15px 35px rgba(0,0,0,0.4)" : "0 15px 35px rgba(0,0,0,0.15)",
              borderColor: alpha("#f15a22", isDarkMode ? 0.5 : 0.4),
            },
            overflow: "hidden",
            position: "relative",
            backgroundColor: isDarkMode ? "rgba(30,30,30,0.6)" : undefined,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: `linear-gradient(to right, ${primaryColor}, ${alpha("#f15a22", 0.7)})`,
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 4,
              pt: 5,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: alpha("#f15a22", isDarkMode ? 0.2 : 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <PointOfSale sx={{ fontSize: 32, color: primaryColor }} />
            </Box>
            <Typography color="textSecondary" gutterBottom variant="subtitle1" sx={{ fontWeight: 500 }}>
              POS Status
            </Typography>
            <Box sx={{ display: "flex", gap: 2, my: 2 }}>
              <Chip
                icon={<PointOfSale />}
                label={`${posStatusCount.Online || 0} Online`}
                color="success"
                variant="outlined"
                sx={{
                  px: 1,
                  fontWeight: "medium",
                  borderWidth: 2,
                  borderRadius: "16px",
                }}
              />
              <Chip
                icon={<PointOfSale />}
                label={`${posStatusCount.Offline || 0} Offline`}
                color="error"
                variant="outlined"
                sx={{
                  px: 1,
                  fontWeight: "medium",
                  borderWidth: 2,
                  borderRadius: "16px",
                }}
              />
            </Box>
            <Typography color="textSecondary" variant="body2" sx={{ textAlign: "center" }}>
              Total: {posConfigs.length} POS Configured
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SummaryCards
