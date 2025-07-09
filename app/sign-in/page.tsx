'use client';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Alert, Box, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Snackbar, TextField } from "@mui/material";
import { error } from "console";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from '@/redux/features/userSlice';

interface LoginPageProps {

}

const LoginPage: FunctionComponent<LoginPageProps> = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;


    const [formData, setformData] = useState({
        username: "",
        password: "",
    });

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData({ ...formData, password: event.target.value });
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.username || !formData.password) {
            setError("Username and password are required.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // 1. Send credentials to /login
            const loginResponse = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (!loginResponse.ok) {
                throw new Error("Login failed. Check your credentials.");
            }

            const loginData = await loginResponse.json();
            const token = loginData.access_token;

            // 2. Store token
            localStorage.setItem("token", token);

            // 3. Use token to fetch user data from /users/me
            const userResponse = await fetch(`${baseUrl}/users/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!userResponse.ok) {
                throw new Error("Failed to retrieve user data.");
            }

            const userData = await userResponse.json();

            localStorage.setItem("user", JSON.stringify(userData));
            dispatch(login(userData));

            console.log("Login success", userData);

            setOpen1(true);
            setTimeout(() => {
                setLoading(false);
                router.push("/articles");
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred during login.");
            setTimeout(() => {
                setOpen(true);
                setLoading(false);
            }, 1000);
        }
    };
    return (<>
        {loading && (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        )}
        <div className={styles.bgImage}>
            <div className={styles.outercontainer}>
                <form onSubmit={loginUser}>
                    <div className={styles.card}>
                        <h1>Sign In</h1>
                        <div className={styles.text}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="standard"
                                required
                                value={formData.username}
                                onChange={(e) => setformData({ ...formData, username: e.target.value })}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                variant="standard"
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handlePasswordChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                style={{ paddingRight: "20px" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.button}>
                            <Button variant="contained" type="submit" style={{ backgroundColor: "black", width: "24%" }}>Sign In</Button>
                            <Snackbar open={open} autoHideDuration={100000} onClose={handleClose}
                                sx={{
                                    zIndex: 1000,
                                    position: "fixed"
                                }}>
                                <Alert onClose={handleClose} severity="error" sx={{ width: '500px' }}>
                                    {error}
                                </Alert>
                            </Snackbar>

                            <Snackbar open={open1} autoHideDuration={100000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity="success" sx={{ width: '500px' }}>
                                    Success!
                                </Alert>
                            </Snackbar>
                        </div>
                        <div className={styles.register}>
                            <p>Don't have an account?&nbsp;
                                <Link href="/sign-up" style={{ textDecoration: "underline" }}>Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    </>);
}

export default LoginPage;