"use client"
import { Box, Button, Paper, Typography, alpha } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { PRIMARY_COLOR } from "../../ProductAddition"

const ProductHeader = ({ onAddProduct }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: alpha(PRIMARY_COLOR, 0.05),
        border: `1px solid ${alpha(PRIMARY_COLOR, 0.2)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: PRIMARY_COLOR,
            }}
          >
            Product Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your finished goods inventory and recipes
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
          sx={{
            px: 3,
            py: 1,
            fontWeight: 600,
            backgroundColor: PRIMARY_COLOR,
            "&:hover": {
              backgroundColor: alpha(PRIMARY_COLOR, 0.9),
            },
          }}
        >
          Add New Product
        </Button>
      </Box>
    </Paper>
  )
}

export default ProductHeader
