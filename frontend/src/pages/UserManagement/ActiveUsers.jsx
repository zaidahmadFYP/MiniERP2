import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Typography,
  Toolbar,
  TextField,
  Divider,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddUserDrawer from "./AddUserDrawer";
import MainContentWrapper from "./MainContentWrapper";
import EditUserDrawer from "./EditUserDrawer";
import EditAssignedModulesDrawer from "./EditAssignedModulesDrawer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FilterButton from "./FilterButton";


const ActiveUsers = () => {
 
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [resetSnackbarOpen, setResetSnackbarOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState("");

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editModulesDrawerOpen, setEditModulesDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const [passwordCopiedSnackbarOpen, setPasswordCopiedSnackbarOpen] =
    useState(false);
  const [passwordResetSnackbarOpen, setPasswordResetSnackbarOpen] =
    useState(false); // For reset password

  //filtering for search from roles
  const [selectedRoles, setSelectedRoles] = useState([]);

  const handleFilterChange = (roles) => {
    setSelectedRoles(roles);
  };

  const roles = [...new Set(users.map((user) => user.role))].filter(
    (role) => role
  );

  const handleUserCreated = () => {
    setSnackbarOpen(true);
    fetchUsers();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/auth/users`
      );
      setUsers(response.data.reverse()); // Reverse the order to show new users at the top
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };


  const handleEditClick = (event, user) => {
    setSelectedUser(user);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditGeneralInfo = () => {
    setEditDrawerOpen(true);
    handleMenuClose();
  };

  const handleEditAssignedModules = () => {
    setEditModulesDrawerOpen(true);
    handleMenuClose();
  };

  const handleEditDrawerClose = () => {
    setEditDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleEditModulesDrawerClose = () => {
    setEditModulesDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleModulesUpdated = () => {
    fetchUsers();
    handleEditModulesDrawerClose();
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const generateRandomPassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 5; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      for (let userId of selectedUsers) {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/auth/${userId}`
        );
      }

      setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      setDeleteSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleResetPassword = async (userId) => {
    // Generate a new random password
    const newPassword = generateRandomPassword();
    try {
      // Send the reset request to the server
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/auth/${userId}/resetPassword`,
        {
          newPassword,
        }
      );

      const updatedUser = response.data.user;

      // Update the state with the new password for the specific user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, plainPassword: updatedUser.plainPassword }
            : user
        )
      );

      // Show the "Password Reset Successfully" snackbar
      setPasswordResetSnackbarOpen(true);
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(user.role);
    return matchesSearch && matchesRole;
  });

  return (
    <MainContentWrapper>
      <Box sx={{ maxWidth: "100%", paddingLeft: 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "flex-start",
            mb: 1,
            fontFamily: "TanseekModernW20",
          }}
        >
          ACTIVE USERS
        </Typography>

        <Divider sx={{ mb: 0.5, mt: 1 }} />

        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mt: 0,
          }}
        >
          <Button
            variant="text"
            startIcon={<AddIcon />}
            sx={{ marginRight: 2, textTransform: "none", color: "#f15a22" }}
            onClick={handleDrawerOpen}
          >
            Add a user
          </Button>
          <Button
            variant="text"
            startIcon={<RefreshIcon />}
            sx={{ marginRight: 2, textTransform: "none", color: "#f15a22" }}
            onClick={fetchUsers}
          >
            Refresh
          </Button>
          <Button
            variant="text"
            startIcon={<DeleteIcon />}
            sx={{ marginRight: 2, textTransform: "none", color: "#f15a22" }}
            disabled={selectedUsers.length === 0}
            onClick={handleDeleteUsers}
          >
            Delete user
          </Button>
          <Button
            variant="text"
            startIcon={<LockResetIcon />}
            sx={{ marginRight: 2, textTransform: "none", color: "#f15a22" }}
            disabled={selectedUsers.length !== 1}
            onClick={() => handleResetPassword(selectedUsers[0])}
          >
            Reset password
          </Button>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search active users list"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300, marginLeft: "auto" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FilterButton
            roles={roles}
            onFilterChange={handleFilterChange}
            sx={{ mr: 1 }}
          />
        </Toolbar>

        <TableContainer component={Paper} sx={{ mt: 2, maxWidth: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", padding: "12px" }}
                >
                  <Checkbox
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={handleSelectAllUsers}
                  />
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: "bold", padding: "12px" }}
                >
                  Display Name
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: "bold", padding: "12px" }}
                >
                  Email
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: "bold", padding: "12px" }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", padding: "12px" }}
                >
                  Generated Password
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", padding: "12px" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell align="center" sx={{ padding: "12px" }}>
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ padding: "12px" }}>
                    {user.name}
                  </TableCell>
                  <TableCell align="left" sx={{ padding: "12px" }}>
                    {user.email}
                  </TableCell>
                  <TableCell align="left" sx={{ padding: "12px" }}>
                    {user.role || "N/A"}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "12px" }}>
                    {user.plainPassword ? (
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(user.plainPassword); // Copy the password to clipboard
                          setPasswordCopiedSnackbarOpen(true); // Show the correct snackbar
                        }}
                      >
                        <ContentCopyIcon sx={{ color: "#f15a22" }} />
                      </IconButton>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "12px" }}>
                    <IconButton
                      onClick={(event) => handleEditClick(event, user)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              minWidth: 110,
              padding: 0.2,
            },
          }}
        >
          <MenuItem
            onClick={handleEditGeneralInfo}
            sx={{
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
              },
            }}
          >
            <ListItemIcon>
              <InfoIcon sx={{ color: "#f15a22" }} />
            </ListItemIcon>
            <ListItemText primary="Edit General Information" />
          </MenuItem>
          <MenuItem
            onClick={handleEditAssignedModules}
            sx={{
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#444" : "#f5f5f5",
              },
            }}
          >
            <ListItemIcon>
              <AssignmentIcon sx={{ color: "#f15a22" }} />
            </ListItemIcon>
            <ListItemText primary="Edit Assigned Modules" />
          </MenuItem>
        </Menu>

        <AddUserDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          onUserCreated={handleUserCreated}
        />

        <EditUserDrawer
          open={editDrawerOpen}
          onClose={handleEditDrawerClose}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />

        <EditAssignedModulesDrawer
          open={editModulesDrawerOpen}
          onClose={handleEditModulesDrawerClose}
          user={selectedUser}
          onModulesUpdated={handleModulesUpdated}
        />

        <Snackbar
          open={passwordResetSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setPasswordResetSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setPasswordResetSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Password reset successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={passwordCopiedSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setPasswordCopiedSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setPasswordCopiedSnackbarOpen(false)}
            severity="info"
            sx={{ width: "100%" }}
          >
            Password copied to clipboard!
          </Alert>
        </Snackbar>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ backgroundColor: "#ffdd00", color: "#7c402e" }}
          >
            User Has Been Created Successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={deleteSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setDeleteSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setDeleteSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            User(s) deleted successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={resetSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setResetSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setResetSnackbarOpen(false)}
            severity="info"
            sx={{ width: "100%", backgroundColor: "#ffdd00", color: "#7c402e" }}
          >
            Password reset successfully! New password: {resetPassword}
          </Alert>
        </Snackbar>
      </Box>
    </MainContentWrapper>
  );
};

export default ActiveUsers;
