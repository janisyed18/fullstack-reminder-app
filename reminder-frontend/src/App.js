import React, { useState, useMemo, createContext } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
} from "@mui/material";
import Header from "./components/layout/Header";
import ReminderList from "./components/ReminderList";
import "./App.css";

// Create a context to pass the theme toggle function down
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState("light"); // 'light' or 'dark'

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // Use the state variable here
          primary: { main: "#FE6B8B" },
          secondary: { main: "#FF8E53" },
          ...(mode === "dark" && {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
        },
        typography: { fontFamily: "Roboto, sans-serif" },
        components: {
          MuiPaper: { styleOverrides: { root: { borderRadius: "16px" } } },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" component="main">
          <Box mt={4} mb={4}>
            <ReminderList />
          </Box>
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
