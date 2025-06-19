import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  Dialog,
  Pagination,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Paper,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";

import * as reminderApi from "../api/reminderApi";
import AddReminder from "./AddReminder";
import EditReminder from "./EditReminder";
import ReminderCard from "./ReminderCard";

const SkeletonLoader = () => (
  <Grid container spacing={2} mt={2}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Skeleton
          variant="rectangular"
          height={130}
          sx={{ borderRadius: "16px" }}
        />
      </Grid>
    ))}
  </Grid>
);

const ReminderList = () => {
  // --- STATE MANAGEMENT ---
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'completed'

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        size: 6,
        title: searchTerm,
        priority: priorityFilter,
        isCompleted: activeTab === "completed",
      };
      const response = await reminderApi.getAllReminders(params);
      setReminders(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch reminders. Please ensure the backend is running and refresh the page."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, priorityFilter, activeTab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchReminders();
    }, 500); // Debounce search to prevent excessive API calls
    return () => clearTimeout(handler);
  }, [fetchReminders]);

  // --- GENERIC ACTION HANDLER ---
  const handleAction = async (action, successMessage, severity = "success") => {
    try {
      await action();
      setNotification({ open: true, message: successMessage, severity });
      // Always refetch data after any action to get the correct paginated list from the server
      fetchReminders();
    } catch (err) {
      setNotification({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCreate = (newReminder) => {
    handleAction(
      () => reminderApi.createReminder(newReminder),
      "Reminder created successfully!"
    );
    setAddModalOpen(false);
  };
  const handleUpdate = (id, updatedReminder) => {
    handleAction(
      () => reminderApi.updateReminder(id, updatedReminder),
      "Reminder updated successfully!"
    );
    setEditModalOpen(false);
  };
  const handleMarkAsCompleted = (id) => {
    handleAction(
      () => reminderApi.markAsCompleted(id),
      "Reminder marked as complete!",
      "info"
    );
  };
  const handleDelete = async () => {
    if (!currentReminder) return;
    await handleAction(
      () => reminderApi.deleteReminder(currentReminder.id),
      "Reminder deleted!",
      "warning"
    );
    handleDeleteConfirmClose();
  };

  // --- UI EVENT HANDLERS ---
  const handleEditModalOpen = (reminder) => {
    setCurrentReminder(reminder);
    setEditModalOpen(true);
  };
  const handleDeleteConfirmOpen = (reminder) => {
    setCurrentReminder(reminder);
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => {
    setCurrentReminder(null);
    setDeleteConfirmOpen(false);
  };
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handlePriorityFilterChange = (event, newPriority) => {
    setPage(1);
    setPriorityFilter(newPriority);
  };
  const handleTabChange = (event, newValue) => {
    setPage(1);
    setActiveTab(newValue);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Reminder
        </Button>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search Reminders"
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: "200px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          value={priorityFilter}
          exclusive
          onChange={handlePriorityFilterChange}
          aria-label="priority filter"
          size="small"
        >
          <ToggleButton value="HIGH" aria-label="high priority">
            High
          </ToggleButton>
          <ToggleButton value="MEDIUM" aria-label="medium priority">
            Medium
          </ToggleButton>
          <ToggleButton value="LOW" aria-label="low priority">
            Low
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab value="active" label="Active Reminders" />
          <Tab value="completed" label="Completed" />
        </Tabs>
      </Paper>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {reminders.length === 0 ? (
              <Paper sx={{ textAlign: "center", p: 5, mt: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  No reminders found for the current filters.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {reminders.map((reminder) => (
                  <Grid item xs={12} sm={6} lg={4} key={reminder.id}>
                    <ReminderCard
                      reminder={reminder}
                      onMarkComplete={() => handleMarkAsCompleted(reminder.id)}
                      onEdit={() => handleEditModalOpen(reminder)}
                      onDelete={() => handleDeleteConfirmOpen(reminder)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {totalPages > 1 && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            gap: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
          <Typography variant="body2" color="text.secondary">
            Page {page} of {totalPages}
          </Typography>
        </Box>
      )}

      <AddReminder
        open={isAddModalOpen}
        handleClose={() => setAddModalOpen(false)}
        handleSave={handleCreate}
      />
      {currentReminder && (
        <EditReminder
          open={isEditModalOpen}
          handleClose={() => setEditModalOpen(false)}
          handleSave={handleUpdate}
          reminder={currentReminder}
        />
      )}
      <Dialog open={isDeleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reminder?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReminderList;
