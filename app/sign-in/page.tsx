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
    // const [items, setItems] = useState([]);
    // const currentUser = useAppSelector((state) => state.user.currentUser)


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
            const url = "http://54.169.29.154:5000//users"
            const response = await fetch(url, {
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8"
                },
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }
            const data = await response.json();
            // console.log(data.data);
            const user = data.data.find((user: any) => user.username === formData.username);

            if (user && user.password === formData.password) {
                dispatch(login(user));
                // console.log(dispatch(login(user)));
                console.log("Login success")
                localStorage.setItem("user", JSON.stringify(user));
                
                setOpen1(true);
                setTimeout(() => {
                    setLoading(false);
                    router.push("/articles");
                }, 1000);
                
            } else {
                console.log("Login failed");
                
                setTimeout(() => {
                    setOpen(true);
                    setLoading(false);
                    setError("Invalid username or password.");
                }, 1000);
                setError(null);
            }
        } catch (error) {
            console.log(error);
            setError("An error occurred while logging in. Please try again.");
            setTimeout(() => {
                setOpen(true);
                setLoading(false);
            }, 1000);
        }
    }

    return (<>
        {loading && (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        )}
        <div className={styles.bgImage}>
            <div className={styles.outercontainer}>
                <form onSubmit={loginUser}>
                    <div className={styles.container}>
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
                            <Snackbar open={open} autoHideDuration={100000} onClose={handleClose}>
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