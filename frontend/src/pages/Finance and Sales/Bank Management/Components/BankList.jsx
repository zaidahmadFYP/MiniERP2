import React from "react"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material"

const BankList = ({
  loading,
  banks,
  filteredBanks,
  paginatedData,
  searchTerm,
  filterStatus,
  page,
  rowsPerPage,
  expandedBank,
  isDarkMode,
  selectedBanks,
  selectAll,
  handleChangePage,
  handleChangeRowsPerPage,
  toggleExpandBank,
  toggleBankSelection,
  toggleSelectAll,
  handleEdit,
  confirmDelete,
  openBankDetails,
  setBankDetailsTab,
  setSearchTerm,
  setFilterStatus,
  toggleActiveStatus,
}) => {
  return (
    <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" component="h2" fontWeight="600" sx={{ color: "#f15a22" }}>
            Banks List
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              label={`Total: ${filteredBanks.length} of ${banks.length} ${banks.length === 1 ? "Bank" : "Banks"}`}
              sx={{
                backgroundColor: isDarkMode ? "rgba(241, 90, 34, 0.15)" : "#fff8f6",
                color: isDarkMode ? "#ffab91" : "#f15a22",
                fontWeight: 600,
                border: `1px solid ${isDarkMode ? "#ff7043" : "#f15a22"}`,
              }}
            />
            {searchTerm || filterStatus !== "all" ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                }}
                startIcon={<ClearIcon />}
                sx={{
                  color: "#f15a22",
                  borderColor: "#f15a22",
                  "&:hover": {
                    borderColor: "#d14a12",
                    backgroundColor: "rgba(241, 90, 34, 0.04)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Clear Filters
              </Button>
            ) : null}
          </Box>
        </Box>

        {loading && !banks.length ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress sx={{ color: "#f15a22" }} />
          </Box>
        ) : banks.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No banks found. Add a new bank to get started.
          </Alert>
        ) : filteredBanks.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No banks match your search criteria. Try different filters.
          </Alert>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "none",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: isDarkMode ? "rgba(241, 90, 34, 0.15)" : "#fff8f6" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        sx={{
                          "&.Mui-checked": {
                            color: "#f15a22",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Bank Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((bank) => (
                    <React.Fragment key={bank._id}>
                      <TableRow
                        hover
                        onClick={() => toggleExpandBank(bank._id)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: isDarkMode ? "rgba(241, 90, 34, 0.05)" : "#fff8f6",
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedBanks.includes(bank._id)}
                            onChange={() => toggleBankSelection(bank._id)}
                            sx={{
                              "&.Mui-checked": {
                                color: "#f15a22",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                          {bank.name}
                        </TableCell>
                        <TableCell>{bank.code}</TableCell>
                        <TableCell>
                          {bank.address
                            ? bank.address.length > 50
                              ? `${bank.address.substring(0, 50)}...`
                              : bank.address
                            : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={bank.isActive ? "Active" : "Inactive"}
                            color={bank.isActive ? "success" : "error"}
                            size="small"
                            sx={{
                              backgroundColor: bank.isActive
                                ? isDarkMode
                                  ? "rgba(46, 125, 50, 0.2)"
                                  : "#e8f5e9"
                                : isDarkMode
                                  ? "rgba(211, 47, 47, 0.2)"
                                  : "#ffebee",
                              color: bank.isActive
                                ? isDarkMode
                                  ? "#81c784"
                                  : "#2e7d32"
                                : isDarkMode
                                  ? "#ef9a9a"
                                  : "#d32f2f",
                              fontWeight: 600,
                              "&:hover": {
                                backgroundColor: bank.isActive
                                  ? isDarkMode
                                    ? "rgba(46, 125, 50, 0.3)"
                                    : "#c8e6c9"
                                  : isDarkMode
                                    ? "rgba(211, 47, 47, 0.3)"
                                    : "#ffcdd2",
                              },
                              transition: "background-color 0.3s ease",
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleActiveStatus(bank)
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <Tooltip title="View Details" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openBankDetails(bank)
                                }}
                                sx={{
                                  color: "#f15a22",
                                  "&:hover": {
                                    backgroundColor: "rgba(241, 90, 34, 0.1)",
                                  },
                                  transition: "background-color 0.3s ease",
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Bank" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEdit(bank)
                                }}
                                sx={{
                                  color: "#f15a22",
                                  "&:hover": {
                                    backgroundColor: "rgba(241, 90, 34, 0.1)",
                                  },
                                  transition: "background-color 0.3s ease",
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Bank" arrow>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  confirmDelete(bank)
                                }}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "rgba(211, 47, 47, 0.1)",
                                  },
                                  transition: "background-color 0.3s ease",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                      {expandedBank === bank._id && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            sx={{
                              py: 2,
                              backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#fafafa",
                              borderLeft: `4px solid #f15a22`,
                            }}
                          >
                            <Box sx={{ pl: 2 }}>
                              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#f15a22" }}>
                                Full Details:
                              </Typography>
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={4}>
                                  <Typography variant="body2" fontWeight="bold">
                                    Bank Name:
                                  </Typography>
                                  <Typography variant="body2">{bank.name}</Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Typography variant="body2" fontWeight="bold">
                                    Bank Code:
                                  </Typography>
                                  <Typography variant="body2">{bank.code}</Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Typography variant="body2" fontWeight="bold">
                                    Status:
                                  </Typography>
                                  <Typography variant="body2">{bank.isActive ? "Active" : "Inactive"}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2" fontWeight="bold">
                                    Full Address:
                                  </Typography>
                                  <Typography variant="body2">{bank.address || "No address provided"}</Typography>
                                </Grid>
                                {bank.createdAt && (
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="body2" fontWeight="bold">
                                      Created:
                                    </Typography>
                                    <Typography variant="body2">{new Date(bank.createdAt).toLocaleString()}</Typography>
                                  </Grid>
                                )}
                                {bank.updatedAt && (
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="body2" fontWeight="bold">
                                      Last Updated:
                                    </Typography>
                                    <Typography variant="body2">{new Date(bank.updatedAt).toLocaleString()}</Typography>
                                  </Grid>
                                )}
                                <Grid item xs={12}>
                                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<AccountBalanceWalletIcon />}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openBankDetails(bank)
                                        setBankDetailsTab(1)
                                      }}
                                      sx={{
                                        color: "#f15a22",
                                        borderColor: "#f15a22",
                                        "&:hover": {
                                          borderColor: "#d14a12",
                                          backgroundColor: "rgba(241, 90, 34, 0.04)",
                                        },
                                        transition: "all 0.3s ease",
                                      }}
                                    >
                                      View Accounts
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<LocationOnIcon />}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openBankDetails(bank)
                                        setBankDetailsTab(2)
                                      }}
                                      sx={{
                                        color: "#f15a22",
                                        borderColor: "#f15a22",
                                        "&:hover": {
                                          borderColor: "#d14a12",
                                          backgroundColor: "rgba(241, 90, 34, 0.04)",
                                        },
                                        transition: "all 0.3s ease",
                                      }}
                                    >
                                      View Branches
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredBanks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                ".MuiTablePagination-selectIcon": {
                  color: "#f15a22",
                },
                "& .MuiButtonBase-root": {
                  color: "#f15a22",
                },
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default BankList
