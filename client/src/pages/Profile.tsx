import { useState, FormEvent, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function Profile() {
  const { user, setUser } = useContext(UserContext)!;

  const [username, setUsername] = useState(user!);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  const handleUsernameChange = (event) => {
    const { value } = event.target;
    setUsername(value);
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    if (!value || usernameRegex.test(value)) {
      setUsernameError("");
    } else {
      setUsernameError(
        "Username must be between 3 and 20 characters and can only contain alphanumeric characters, dots, dashes, and underscores"
      );
    }
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
    setOldPasswordError("");
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,50}$/;

    if (!value || passwordRegex.test(value)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must be between 8 and 50 characters, contain one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let changed = false;
    if (username !== "" && username !== user) changed = true;
    if (password !== "" && oldPassword !== "") changed = true;
    if (!changed) return;
    if (usernameError || passwordError || oldPasswordError) return;

    const response = await fetch("https://server-space.onrender.com/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, oldPassword }),
      credentials: "include",
    });

    if (!response.ok) {
      const json = await response.json();
      json.errors.forEach((err) => {
        if (err.path === "username") setUsernameError(err.msg);
        if (err.path === "password") setPasswordError(err.msg);
        if (err.path === "oldPassword") setOldPasswordError(err.msg);
      });
      return;
    }

    if (username !== "" && username !== user) setUser(username);
    setOldPassword("");
    setPassword("");
    setSuccessMessage("User info updated successfully");
  };

  const handleDelete = async (event) => {
    await fetch("https://server-space.onrender.com/profile", {
      method: "DELETE",
      credentials: "include",
    });

    setUser(null);
    return navigate("/login");
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h2" variant="h5">
          Hi{" "}
          <Typography component="span" variant="h5" color="primary">
            {user}
          </Typography>
          , Edit your profile
        </Typography>

        <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {successMessage && (
                <Typography color="primary" align="center">
                  {successMessage}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                id="username"
                autoComplete="username"
                name="username"
                fullWidth
                required
                autoFocus
                value={username}
                onChange={handleUsernameChange}
                error={Boolean(usernameError)}
                helperText={usernameError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span role="img" aria-label="checkmark">
                        {usernameError ? "❌" : "✅"}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Old Password"
                type="password"
                id="oldPassword"
                autoComplete="oldPassword"
                name="oldPassword"
                required
                fullWidth
                value={oldPassword}
                onChange={handleOldPasswordChange}
                error={Boolean(oldPasswordError)}
                helperText={oldPasswordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span role="img" aria-label="checkmark">
                        {oldPasswordError ? "❌" : "✅"}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Password"
                type="password"
                id="password"
                autoComplete="password"
                name="password"
                required
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                error={Boolean(passwordError)}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span role="img" aria-label="checkmark">
                        {passwordError ? "❌" : "✅"}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Info
          </Button>
        </Box>
        <Button
          type="submit"
          color="error"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleDelete}
        >
          Delete Account
        </Button>
      </Box>
    </Container>
  );
}
