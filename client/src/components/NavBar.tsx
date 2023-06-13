import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext)!;
  const navigate = useNavigate();

  function logout() {
    fetch("http://localhost:4000/logout", { credentials: "include" }).finally(
      () => {
        setUser(null);
        navigate("login");
      }
    );
  }

  let NavButtons = [
    <Button color="inherit" component={RouterLink} to="login" key="login">
      Login
    </Button>,
    <Button color="inherit" component={RouterLink} to="signup" key="signup">
      Signup
    </Button>,
  ];

  if (user) {
    NavButtons = [
      <Button color="inherit" component={RouterLink} to="/" key="home">
        Search
      </Button>,
      <Button
        color="inherit"
        component={RouterLink}
        to="favourites"
        key="myfavs"
      >
        My Favs
      </Button>,
      <Button color="inherit" component={RouterLink} to="profile" key="profile">
        Profile
      </Button>,
      <Button color="inherit" onClick={logout} key="logout">
        Logout
      </Button>,
    ];
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Space App
          </Typography>
          {NavButtons}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
