import {
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Typography,
  Box,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"
import { formatCurrency } from "../../utils/formatUtils"

export default function ItemsSection({ transaction, isOpen, onToggle }) {
  const theme = useTheme()

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        bgcolor: theme.palette.mode === "dark" ? "#262626" : "#ffffff",
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}
            >
              Items
            </Typography>
            <IconButton size="small" onClick={onToggle} aria-expanded={isOpen} aria-label="show more">
              {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Box>
        }
        sx={{ p: 1.5, bgcolor: theme.palette.mode === "dark" ? "#333333" : "#f9f9f9" }}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 2 }}>
          {transaction.items && transaction.items.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                      }}
                    >
                      Item ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                      }}
                    >
                      Item Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                      }}
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                        borderBottomColor:
                          theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                      }}
                    >
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaction.items.map((item, index) => {
                    const itemTotal = item.price * item.itemQuantity

                    return (
                      <TableRow key={item._id || index}>
                        <TableCell
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                            borderBottomColor:
                              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.itemId}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                            borderBottomColor:
                              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.itemName}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                            borderBottomColor:
                              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.itemQuantity}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                            borderBottomColor:
                              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                          }}
                        >
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                            borderBottomColor:
                              theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(224, 224, 224, 1)",
                          }}
                        >
                          {formatCurrency(itemTotal)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography align="center" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "inherit" }}>
              No items found
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
