import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { motion, AnimatePresence } from "framer-motion";
import { isToday, isFuture, isPast } from "date-fns";

import * as reminderApi from "../api/reminderApi";
import AddReminder from "./AddReminder";
import EditReminder from "./EditReminder";
import ReminderCard from "./ReminderCard";

const groupReminders = (reminders) => {
  const groups = {
    today: [],
    upcoming: [],
    completed: [],
  };

  reminders.forEach((r) => {
    const dueDate = new Date(r.dueDate);
    if (r.completed) {
      groups.completed.push(r);
    } else if (isToday(dueDate) || isPast(dueDate)) {
      groups.today.push(r); // Overdue items go into 'today'
    } else if (isFuture(dueDate)) {
      groups.upcoming.push(r);
    }
  });

  for (const key in groups) {
    groups[key].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
  groups["completed"].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return groups;
};

const SkeletonLoader = () => (
  <Grid container spacing={2}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
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
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    try {
      setLoading(true);
      const response = await reminderApi.getAllReminders();
      setReminders(response.data.content || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch reminders. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleCreate = async (newReminder) => {
    try {
      const response = await reminderApi.createReminder(newReminder);
      setReminders([...reminders, response.data]);
      setNotification({
        open: true,
        message: "Reminder created successfully!",
        severity: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to create reminder.",
        severity: "error",
      });
    }
  };

  const handleUpdate = async (id, updatedReminder) => {
    try {
      const response = await reminderApi.updateReminder(id, updatedReminder);
      setReminders(reminders.map((r) => (r.id === id ? response.data : r)));
      setNotification({
        open: true,
        message: "Reminder updated successfully!",
        severity: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to update reminder.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentReminder) return;
    try {
      await reminderApi.deleteReminder(currentReminder.id);
      setReminders(reminders.filter((r) => r.id !== currentReminder.id));
      setNotification({
        open: true,
        message: "Reminder deleted.",
        severity: "warning",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to delete reminder.",
        severity: "error",
      });
    } finally {
      handleDeleteConfirmClose();
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const response = await reminderApi.markAsCompleted(id);
      setReminders(reminders.map((r) => (r.id === id ? response.data : r)));
      setNotification({
        open: true,
        message: "Reminder marked as complete!",
        severity: "info",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to update status.",
        severity: "error",
      });
    }
  };

  const handleEditModalOpen = (reminder) => {
    setCurrentReminder(reminder);
    setEditModalOpen(true);
  };

  const handleDeleteConfirmOpen = (reminder) => {
    setCurrentReminder(reminder);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setCurrentReminder(null);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const groupedReminders = groupReminders(reminders);
  const totalReminders = reminders.length;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
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

      <AnimatePresence>
        {totalReminders === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                textAlign: "center",
                p: 5,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h5" gutterBottom>
                No Reminders Yet!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Click "Add Reminder" to get started.
              </Typography>
              <Button variant="contained" onClick={() => setAddModalOpen(true)}>
                Create your first reminder
              </Button>
            </Paper>
          </motion.div>
        ) : (
          Object.keys(groupedReminders).map(
            (groupKey) =>
              groupedReminders[groupKey].length > 0 && (
                <Box
                  key={groupKey}
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  sx={{ mb: 4 }}
                >
                  <Chip
                    label={groupKey.toUpperCase()}
                    color="primary"
                    sx={{ mb: 2, fontWeight: "bold" }}
                  />
                  <Grid
                    container
                    spacing={2}
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {groupedReminders[groupKey].map((reminder) => (
                      <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                        <ReminderCard
                          reminder={reminder}
                          onMarkComplete={() =>
                            handleMarkAsCompleted(reminder.id)
                          }
                          onEdit={() => handleEditModalOpen(reminder)}
                          onDelete={() => handleDeleteConfirmOpen(reminder)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )
          )
        )}
      </AnimatePresence>

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
