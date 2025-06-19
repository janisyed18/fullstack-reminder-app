import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../../App";

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

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
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
