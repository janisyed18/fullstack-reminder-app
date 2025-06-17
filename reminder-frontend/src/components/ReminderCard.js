import React from "react";
import { Box, Paper, Typography, IconButton, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { motion } from "framer-motion";

const priorityColors = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "info",
};

const ReminderCard = ({ reminder, onMarkComplete, onEdit, onDelete }) => {
  const dueDate = new Date(reminder.dueDate);
  const isOverdue = isPast(dueDate) && !reminder.completed;

  const getRelativeTime = () => {
    if (reminder.completed)
      return `Completed on ${format(new Date(reminder.updatedAt), "MMM d")}`;
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants}>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: "16px",
          borderLeft: `5px solid`,
          borderColor: priorityColors[reminder.priority] + ".main",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          opacity: reminder.completed ? 0.7 : 1,
          transition: "opacity 0.3s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            textDecoration: reminder.completed ? "line-through" : "none",
            color: reminder.completed ? "text.secondary" : "text.primary",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={onMarkComplete}
                sx={{ mr: 1 }}
                disabled={reminder.completed}
              >
                {reminder.completed ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </IconButton>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "500" }}
                >
                  {reminder.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reminder.description}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <IconButton size="small" onClick={onEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Chip
              label={getRelativeTime()}
              color={isOverdue ? "error" : "default"}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ReminderCard;
