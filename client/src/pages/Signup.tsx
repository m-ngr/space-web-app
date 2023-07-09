import { useState, FormEvent, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const defaultTheme = createTheme();

export default function Signup() {
  const { user } = useContext(UserContext)!;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate, user]);

  const handleUsernameChange = (event) => {
    const { value } = event.target;
    setUsername(value);
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    if (usernameRegex.test(value)) {
      setUsernameError("");
    } else {
      setUsernameError(
        "Username must be between 3 and 20 characters and can only contain alphanumeric characters, dots, dashes, and underscores"
      );
    }
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,50}$/;

    if (passwordRegex.test(value)) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must be between 8 and 50 characters, contain one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim() === "") setUsernameError("Username is required");
    if (password.trim() === "") setPasswordError("Password is required");
    if (usernameError || passwordError) return;

    const response = await fetch("https://server-space.onrender.com/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const json = await response.json();
      json.errors.forEach((err) => {
        if (err.path === "username") setUsernameError(err.msg);
        if (err.path === "password") setPasswordError(err.msg);
      });
      return;
    }

    return navigate("/login");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
                  label="Password"
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
              Sign up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
