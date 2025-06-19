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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format, isPast } from "date-fns"; // Import isPast
import PrioritySelector from "./PrioritySelector";

const EditReminder = ({ open, handleClose, handleSave, reminder }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("MEDIUM");
  const [error, setError] = useState("");

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || "");
      setPriority(reminder.priority || "MEDIUM");
      setDueDate(new Date(reminder.dueDate));
    }
  }, [reminder]);

  const onSave = () => {
    // --- NEW VALIDATION CHECK ---
    if (isPast(dueDate)) {
      setError(
        "Due date cannot be in the past. Please select a future date and time."
      );
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    // --- END OF NEW VALIDATION CHECK ---

    const formattedDueDate = format(dueDate, "yyyy-MM-dd'T'HH:mm:ss");

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
            placeholder="e.g., Team Meeting slides"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!error && !title.trim()}
            helperText={!!error && !title.trim() ? "Title is required." : ""}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            placeholder="Add more details here..."
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box mt={2}>
            <DateTimePicker
              label="Due Date & Time"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              disablePast
              sx={{ width: "100%" }}
            />
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Priority
          </Typography>
          <PrioritySelector selectedValue={priority} onChange={setPriority} />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
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
