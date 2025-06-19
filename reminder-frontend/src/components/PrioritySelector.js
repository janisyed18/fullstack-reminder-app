import React from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";

const priorityOptions = [
  {
    value: "HIGH",
    label: "High",
    Icon: SignalCellularAltIcon,
    color: "error.main",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    Icon: SignalCellularAlt2BarIcon,
    color: "warning.main",
  },
  {
    value: "LOW",
    label: "Low",
    Icon: SignalCellularAlt1BarIcon,
    color: "info.main",
  },
];

const PrioritySelector = ({ selectedValue, onChange }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 2 }}
    >
      {priorityOptions.map(({ value, label, Icon, color }) => (
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
            transform: selectedValue === value ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              borderColor: color,
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
