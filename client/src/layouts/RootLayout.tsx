import { Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import NavBar from "../components/NavBar";

const RootLayout = () => {
  const { setUser } = useContext(UserContext)!;

  useEffect(() => {
    fetch("https://server-space.onrender.com/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.username))
      .catch(() => setUser(null));
  }, [setUser]);

  return (
    <Paper
      elevation={0}
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <Container
        maxWidth="xl"
        sx={{
          paddingY: "10px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Container>
    </Paper>
  );
};

export default RootLayout;
