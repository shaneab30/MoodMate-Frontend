'use client';
import { VisibilityOff, Visibility, CheckCircle } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, circularProgressClasses, Fade, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Snackbar, TextField } from "@mui/material";
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
    const [showSuccess, setShowSuccess] = useState(false);
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
        setOpen(false);

        if (!formData.username || !formData.password) {
            setError("Username and password are required.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
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

            localStorage.setItem("token", token);

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

            // console.log("Login success", userData);

            setTimeout(() => {
                setLoading(false);
                setShowSuccess(true);
            }, 1000);

            setTimeout(() => {
                router.push("/articles");
            }, 2000);
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
        {(loading || showSuccess) && (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 9999
            }}>
                {loading && (
                    <Fade in={loading} timeout={300}>
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            sx={{
                                color: '#1a90ff',
                                animationDuration: '550ms',
                                [`& .${circularProgressClasses.circle}`]: {
                                    strokeLinecap: 'round',
                                },
                            }}
                            size={40}
                            thickness={4}
                        />
                    </Fade>
                )}

                {showSuccess && (
                    <Fade in={showSuccess} timeout={500}>
                        <CheckCircle
                            sx={{
                                color: '#4caf50',
                                fontSize: 48,
                                '@keyframes scaleIn': {
                                    '0%': { transform: 'scale(0)' },
                                    '50%': { transform: 'scale(1.2)' },
                                    '100%': { transform: 'scale(1)' }
                                },
                                animation: 'scaleIn 0.3s ease-out'
                            }}
                        />
                    </Fade>
                )}
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
                                onChange={(e) =>
                                    setformData({ ...formData, username: e.target.value })
                                }
                                sx={{
                                    input: { color: 'white' }, // text
                                    label: { color: 'white' }, // label
                                    '& label.Mui-focused': { color: 'white' },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: 'white',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottomColor: 'white',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'white',
                                    },
                                }}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                variant="standard"
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handlePasswordChange}
                                sx={{
                                    input: { color: 'white' },
                                    label: { color: 'white' },
                                    '& label.Mui-focused': { color: 'white' },
                                    '& .MuiInput-underline:before': {
                                        borderBottomColor: 'white',
                                    },
                                    '& .MuiInput-underline:hover:before': {
                                        borderBottomColor: 'white',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'white',
                                    },
                                    '& .MuiIconButton-root': {
                                        color: 'white',
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className={styles.button}>
                            <Button variant="contained" type="submit" style={{ backgroundColor: "#7F8CAA", width: "24%", fontWeight: "bold", borderRadius: "14px" }}>Sign In</Button>
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