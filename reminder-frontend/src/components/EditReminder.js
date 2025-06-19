import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import PrioritySelector from "./PrioritySelector"; // Import the new component

const EditReminder = ({ open, handleClose, handleSave, reminder }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [error, setError] = useState("");

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || "");
      setPriority(reminder.priority || "MEDIUM");
      const formattedDate = format(
        new Date(reminder.dueDate),
        "yyyy-MM-dd'T'HH:mm"
      );
      setDueDate(formattedDate);
    }
  }, [reminder]);

  const onSave = () => {
    if (!title || !dueDate) {
      setError("Title and Due Date are required.");
      return;
    }

    const formattedDueDate = `${dueDate}:00`;

    handleSave(reminder.id, {
      title,
      description,
      dueDate: formattedDueDate,
      priority,
    });
    onClose();
  };

  const onClose = () => {
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Edit Reminder</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!error && !title}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="dueDate"
            label="Due Date"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            error={!!error && !dueDate}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* This is the new priority selector */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Priority
          </Typography>
          <PrioritySelector selectedValue={priority} onChange={setPriority} />

          {error && <p style={{ color: "red" }}>{error}</p>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReminder;
