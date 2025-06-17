import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" }}
    >
      <Toolbar>
        <NotificationsActiveIcon sx={{ mr: 2, fontSize: "2rem" }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          ReminderApp
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
