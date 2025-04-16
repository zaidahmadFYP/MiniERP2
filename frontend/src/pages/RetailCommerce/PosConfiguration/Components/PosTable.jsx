"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Refresh } from "@mui/icons-material"
import PosTableRow from "./PosTableRow"

const PosTable = ({
  filteredData,
  loading,
  error,
  selected,
  handleSelectAll,
  handleSelectRow,
  visiblePasswords,
  togglePasswordVisibility,
  copyPasswordToClipboard,
  fetchPosConfigurations,
}) => {
  const theme = useTheme()

  return (
    <TableContainer
      sx={{
        flexGrow: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        maxHeight: "calc(100vh - 250px)",
        height: "670px",
        position: "relative",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
          "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            color: theme.palette.error.main,
          }}
        >
          <Typography variant="body1">{error}</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchPosConfigurations}
            sx={{ mt: 2 }}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        </Box>
      )}

      <Table size="small" aria-label="POS configuration table" stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                fontWeight: 600,
                fontSize: "13px",
                color: theme.palette.text.primary,
                bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 1.5,
                position: "sticky",
                top: 0,
                zIndex: 2,
              },
            }}
          >
            <TableCell padding="checkbox" sx={{ pl: 2, boxShadow: `0 1px 0 ${theme.palette.divider}` }}>
              <Checkbox
                color="primary"
                indeterminate={selected.length > 0 && selected.length < filteredData.length}
                checked={filteredData.length > 0 && selected.length === filteredData.length}
                onChange={handleSelectAll}
                inputProps={{
                  "aria-label": "select all POS",
                }}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  "&.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                  "&.MuiCheckbox-indeterminate": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>Register number</TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>POS ID</TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>Authority Type</TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>Username</TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>Password</TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>Time bound</TableCell>
            <TableCell sx={{ boxShadow: `0 1px 0 ${theme.palette.divider}` }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length === 0 && !loading && !error ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  No POS configurations found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((row) => (
              <PosTableRow
                key={row.id}
                row={row}
                isSelected={selected.includes(row.id)}
                isPasswordVisible={visiblePasswords[row.id] || false}
                handleSelectRow={handleSelectRow}
                togglePasswordVisibility={togglePasswordVisibility}
                copyPasswordToClipboard={copyPasswordToClipboard}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PosTable
