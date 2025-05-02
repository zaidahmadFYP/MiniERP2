import React, { useState } from "react";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

const ActionsMenu = ({
  anchorEl,
  open,
  handleClose,
  handleExport,
  handleImport,
  handleBulkAction,
  setHelpDialogOpen,
  selectedBanks = [],
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  
  // Handle export functionality with proper file generation
  const handleExportAction = (format) => {
    setActionInProgress(true);
    
    // Simulate processing delay
    setTimeout(() => {
      try {
        // In a real implementation, this would generate the actual file
        // For this demo, we'll simulate file download
        simulateFileDownload(format);
        handleClose();
      } catch (error) {
        console.error(`Error exporting to ${format}:`, error);
      } finally {
        setActionInProgress(false);
      }
    }, 1000);
  };
  
  // Simulate file download by creating a temporary anchor element
  const simulateFileDownload = (format) => {
    // In a real implementation, this would be a blob URL with actual data
    const dummyContent = "data:text/plain;charset=utf-8,This is a simulated bank data export";
    const link = document.createElement("a");
    link.href = dummyContent;
    link.download = `bank_data_export.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Open confirmation dialog for bulk actions
  const confirmBulkAction = (actionType) => {
    if (selectedBanks.length === 0) {
      alert("Please select at least one bank to perform this action");
      handleClose();
      return;
    }
    
    setCurrentAction(actionType);
    setConfirmDialogOpen(true);
  };
  
  // Execute the confirmed bulk action
  const executeBulkAction = () => {
    setActionInProgress(true);
    
    // Close the confirmation dialog
    setConfirmDialogOpen(false);
    
    // Call the handler function with the current action type
    handleBulkAction(currentAction);
    
    // Close the actions menu after a short delay
    setTimeout(() => {
      handleClose();
      setActionInProgress(false);
    }, 500);
  };
  
  // Get appropriate action text for confirmation dialog
  const getActionText = () => {
    switch (currentAction) {
      case "activate":
        return "activate";
      case "deactivate":
        return "deactivate";
      case "delete":
        return "delete";
      default:
        return "process";
    }
  };
  
  return (
    <>
      <Menu 
        anchorEl={anchorEl} 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(241, 90, 34, 0.1)",
            minWidth: "200px",
          },
        }}
      >
        {/* Export options */}
        <MenuItem 
          onClick={() => handleExportAction("csv")}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            {actionInProgress ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              <DownloadIcon fontSize="small" sx={{ color: "#f15a22" }} />
            )}
          </ListItemIcon>
          <ListItemText>Export to CSV</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleExportAction("xlsx")}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" sx={{ color: "#f15a22" }} />
          </ListItemIcon>
          <ListItemText>Export to Excel</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleExportAction("pdf")}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" sx={{ color: "#f15a22" }} />
          </ListItemIcon>
          <ListItemText>Export to PDF</ListItemText>
        </MenuItem>
        
        <Divider />
        
        {/* Import option */}
        <MenuItem 
          onClick={handleImport}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <UploadIcon fontSize="small" sx={{ color: "#f15a22" }} />
          </ListItemIcon>
          <ListItemText>Import Banks</ListItemText>
        </MenuItem>
        
        <Divider />
        
        {/* Bulk actions */}
        <MenuItem 
          onClick={() => confirmBulkAction("activate")}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <CheckIcon fontSize="small" sx={{ color: "#4caf50" }} />
          </ListItemIcon>
          <ListItemText>
            Activate Selected
            {selectedBanks.length > 0 && ` (${selectedBanks.length})`}
          </ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => confirmBulkAction("deactivate")}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <CancelIcon fontSize="small" sx={{ color: "#f44336" }} />
          </ListItemIcon>
          <ListItemText>
            Deactivate Selected
            {selectedBanks.length > 0 && ` (${selectedBanks.length})`}
          </ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => confirmBulkAction("delete")}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "#f44336" }} />
          </ListItemIcon>
          <ListItemText>
            Delete Selected
            {selectedBanks.length > 0 && ` (${selectedBanks.length})`}
          </ListItemText>
        </MenuItem>
        
        <Divider />
        
        {/* Help option */}
        <MenuItem 
          onClick={() => {
            setHelpDialogOpen(true);
            handleClose();
          }}
          disabled={actionInProgress}
        >
          <ListItemIcon>
            <HelpIcon fontSize="small" sx={{ color: "#f15a22" }} />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Confirmation Dialog for Bulk Actions */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirm ${currentAction === "delete" ? "Deletion" : "Action"}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to ${getActionText()} ${selectedBanks.length} selected bank${selectedBanks.length !== 1 ? 's' : ''}? ${
              currentAction === "delete" ? "This action cannot be undone." : ""
            }`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={executeBulkAction} 
            color="primary" 
            autoFocus
            variant={currentAction === "delete" ? "contained" : "text"}
            sx={currentAction === "delete" ? { bgcolor: "#f44336", "&:hover": { bgcolor: "#d32f2f" } } : {}}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionsMenu;