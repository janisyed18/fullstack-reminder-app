import React from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";

// New, more vibrant color theme for priorities
const priorityOptions = [
  {
    value: "HIGH",
    label: "High",
    Icon: SignalCellularAltIcon,
    color: "#f44336",
    hoverColor: "#ffcdd2",
  }, // Red
  {
    value: "MEDIUM",
    label: "Medium",
    Icon: SignalCellularAlt2BarIcon,
    color: "#ff9800",
    hoverColor: "#ffecb3",
  }, // Orange
  {
    value: "LOW",
    label: "Low",
    Icon: SignalCellularAlt1BarIcon,
    color: "#4caf50",
    hoverColor: "#c8e6c9",
  }, // Green
];

const PrioritySelector = ({ selectedValue, onChange }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 2 }}
    >
      {priorityOptions.map(({ value, label, Icon, color, hoverColor }) => (
        <Paper
          key={value}
          elevation={selectedValue === value ? 8 : 2}
          onClick={() => onChange(value)}
          sx={{
            flex: 1,
            p: 2,
            textAlign: "center",
            cursor: "pointer",
            border: "2px solid",
            borderColor: selectedValue === value ? color : "transparent",
            backgroundColor: selectedValue === value ? hoverColor : "inherit",
            transform: selectedValue === value ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              borderColor: color,
              backgroundColor: hoverColor,
            },
          }}
        >
          <Icon sx={{ color, fontSize: "2rem" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            {label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default PrioritySelector;
