import { TableRow, TableCell, Checkbox, Box, Typography, IconButton, Tooltip } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { CheckCircle, Cancel, Visibility, VisibilityOff, ContentCopy, AccessTime } from "@mui/icons-material"

const PosTableRow = ({
  row,
  isSelected,
  isPasswordVisible,
  handleSelectRow,
  togglePasswordVisibility,
  copyPasswordToClipboard,
}) => {
  const theme = useTheme()
  
  // Custom orange color
  const orangeColor = "#f15a22"

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Display time bound information
  const renderTimeBound = () => {
    if (!row.timeBoundEnabled) {
      return (
        <Typography variant="body2" color="textSecondary">
          Not enabled
        </Typography>
      )
    }

    const startDate = formatDate(row.timeBoundStart)
    const endDate = formatDate(row.timeBoundEnd)

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: "14px", color: orangeColor }} />
        <Typography variant="body2">
          {startDate} - {endDate || "No end date"}
        </Typography>
      </Box>
    )
  }

  return (
    <TableRow
      selected={isSelected}
      hover
      onClick={() => handleSelectRow(row.id)}
      sx={{
        "&.Mui-selected": {
          backgroundColor: theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.16)" : "rgba(241, 90, 34, 0.08)",
        },
        "&.Mui-selected:hover": {
          backgroundColor: theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.24)" : "rgba(241, 90, 34, 0.12)",
        },
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "& td": {
          fontSize: "13px",
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: "10px 16px",
        },
        cursor: "pointer",
      }}
    >
      <TableCell padding="checkbox" sx={{ pl: 2 }}>
        <Checkbox
          color="primary"
          checked={isSelected}
          size="small"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            event.stopPropagation()
            handleSelectRow(row.id)
          }}
          sx={{
            color: theme.palette.text.secondary,
            "&.Mui-checked": {
              color: orangeColor,
            },
          }}
        />
      </TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
      <TableCell>{row.posId}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            ...(row.authorityType === "PRA" && {
              bgcolor: theme.palette.mode === "dark" ? "rgba(25, 118, 210, 0.2)" : "rgba(25, 118, 210, 0.1)",
              color: theme.palette.primary.main,
            }),
            ...(row.authorityType === "KPRA" && {
              bgcolor: theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.2)" : "rgba(46, 125, 50, 0.1)",
              color: theme.palette.success.main,
            }),
            ...(row.authorityType === "FBR" && {
              bgcolor: theme.palette.mode === "dark" ? "rgba(241, 90, 34, 0.2)" : "rgba(241, 90, 34, 0.1)",
              color: orangeColor,
            }),
          }}
        >
          {row.authorityType}
        </Box>
      </TableCell>
      <TableCell>{row.userName || "-"}</TableCell>
      <TableCell>
        {row.password ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Click to copy password">
              <Typography
                onClick={(e) => {
                  e.stopPropagation()
                  copyPasswordToClipboard(row.password, row.id)
                }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                    color: orangeColor,
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isPasswordVisible ? row.password : "••••••"}
                <ContentCopy fontSize="small" sx={{ ml: 0.5, fontSize: "14px", color: theme.palette.text.secondary }} />
              </Typography>
            </Tooltip>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                togglePasswordVisibility(row.id)
              }}
              sx={{ ml: 1, p: 0.5 }}
            >
              {isPasswordVisible ? (
                <VisibilityOff fontSize="small" sx={{ fontSize: "16px", color: theme.palette.text.secondary }} />
              ) : (
                <Visibility fontSize="small" sx={{ fontSize: "16px", color: theme.palette.text.secondary }} />
              )}
            </IconButton>
          </Box>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>{renderTimeBound()}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ...(row.status === "ONLINE"
              ? {
                  color: theme.palette.success.main,
                  bgcolor: theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.2)" : "rgba(46, 125, 50, 0.1)",
                  borderRadius: "4px",
                  px: 1,
                  py: 0.5,
                  display: "inline-flex",
                }
              : {
                  color: theme.palette.error.main,
                  bgcolor: theme.palette.mode === "dark" ? "rgba(211, 47, 47, 0.2)" : "rgba(211, 47, 47, 0.1)",
                  borderRadius: "4px",
                  px: 1,
                  py: 0.5,
                  display: "inline-flex",
                }),
          }}
        >
          {row.status === "ONLINE" ? (
            <CheckCircle fontSize="small" sx={{ mr: 0.5, fontSize: "14px" }} />
          ) : (
            <Cancel fontSize="small" sx={{ mr: 0.5, fontSize: "14px" }} />
          )}
          <Typography sx={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}>{row.status}</Typography>
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default PosTableRow
