import React from "react";
import { Box, Paper, Typography, IconButton, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { motion } from "framer-motion";

// Import icons for priority
import PriorityHighIcon from "@mui/icons-material/PriorityHigh"; // For HIGH
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // For MEDIUM
import LowPriorityIcon from "@mui/icons-material/LowPriority"; // For LOW

const priorityConfig = {
  HIGH: { label: "High", Icon: PriorityHighIcon, color: "error" },
  MEDIUM: { label: "Medium", Icon: WarningAmberIcon, color: "warning" },
  LOW: { label: "Low", Icon: LowPriorityIcon, color: "info" },
};

const ReminderCard = ({ reminder, onMarkComplete, onEdit, onDelete }) => {
  const dueDate = new Date(reminder.dueDate);
  const isOverdue = isPast(dueDate) && !reminder.completed;
  const priority = priorityConfig[reminder.priority] || priorityConfig.MEDIUM;

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
          position: "relative",
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          opacity: reminder.completed ? 0.6 : 1,
          borderTop: `4px solid`,
          borderColor: `${priority.color}.main`,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                onClick={onMarkComplete}
                sx={{ p: 0.5 }}
                disabled={reminder.completed}
              >
                {reminder.completed ? (
                  <CheckCircleIcon color="success" sx={{ fontSize: "2rem" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: "2rem" }} />
                )}
              </IconButton>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "500", lineHeight: 1.2 }}
                >
                  {reminder.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
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
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            {/* NEW PRIORITY VISUALIZATION */}
            <Chip
              icon={<priority.Icon />}
              label={priority.label}
              color={priority.color}
              size="small"
              variant="outlined"
            />
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
