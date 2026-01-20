'use client';
import { VisibilityOff, Visibility, CheckCircle } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, circularProgressClasses, Fade, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Snackbar, TextField } from "@mui/material";
import { FunctionComponent, use, useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegisterPageProps {

}

const RegisterPage: FunctionComponent<RegisterPageProps> = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [alertInfo, setalertInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorSignUp, setErrorSignUp] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const [formData, setformData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        age: "",
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

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.username || !formData.email || !formData.age || !formData.password || !formData.firstname || !formData.lastname) {
            setErrorSignUp("All fields are required");
            return;
        }

        if (formData.password.length < 6) {
            setErrorSignUp("Password must be at least 6 characters long");
            return;
        }

        setalertInfo("");
        setErrorSignUp(null);
        setOpen(false);

        try {
            setLoading(true);

            const url = `${baseUrl}/users/register`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8"
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    age: formData.age,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                }),
            });

            const result = await response.json();

            if (!response.ok || result?.status === false) {
                const msg = result?.message || "An error occurred during registration.";
                throw new Error(msg);
            }

            setTimeout(() => {
                setLoading(false);
                setShowSuccess(true);
            }, 1000);

            setTimeout(() => {
                router.push("/sign-in");
            }, 2000);

        } catch (error: any) {
            console.error("Error during registration:", error);
            setErrorSignUp(error.message || "An error occurred during registration.");

            setTimeout(() => {
                setOpen(true);
                setLoading(false);
            }, 1000);
        }
    };

    const whiteTextFieldSx = {
        input: { color: 'white' },
        label: { color: 'white' },
        '& label.Mui-focused': { color: 'white' },

        '& .MuiInput-underline:before': {
            borderBottomColor: 'rgba(255,255,255,0.7)',
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

        '& .MuiFormHelperText-root': {
            color: 'white',
        },

        '& .MuiFormHelperText-root.Mui-error': {
            color: '#ffb4b4',
        },
    };



    return (
        <>
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
            <div className={styles.outercontainer}>

                <form onSubmit={submit}>
                    <div className={styles.card}>
                        <div className={styles.text}>
                            <h1>Sign Up</h1>
                            <p>Already have an account?&nbsp;
                                <Link href="/sign-in" style={{ textDecoration: "underline" }}>Sign In</Link>
                            </p>
                            <TextField
                                id="firstname"
                                label="Firstname"
                                variant="standard"
                                required
                                value={formData.firstname}
                                onChange={(e) => setformData({ ...formData, firstname: e.target.value })}
                                sx={whiteTextFieldSx}
                            />

                            <TextField
                                id="lastname"
                                label="Lastname"
                                variant="standard"
                                required
                                value={formData.lastname}
                                onChange={(e) => setformData({ ...formData, lastname: e.target.value })}
                                sx={whiteTextFieldSx}
                            />

                            <TextField
                                id="username"
                                label="Username"
                                variant="standard"
                                required
                                value={formData.username}
                                onChange={(e) => setformData({ ...formData, username: e.target.value })}
                                sx={whiteTextFieldSx}
                            />

                            <TextField
                                id="email"
                                label="Email"
                                variant="standard"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setformData({ ...formData, email: e.target.value })}
                                sx={whiteTextFieldSx}
                            />

                            <TextField
                                id="password"
                                label="Password"
                                variant="standard"
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handlePasswordChange}
                                sx={whiteTextFieldSx}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!error}
                                helperText={error || alertInfo}
                            />

                            <TextField
                                id="age"
                                label="Age"
                                variant="standard"
                                required
                                value={formData.age}
                                onChange={(e) => setformData({ ...formData, age: e.target.value })}
                                sx={whiteTextFieldSx}
                            />
                            <div className={styles.button}>
                                <Button variant="contained" type="submit" style={{ width: "100%", borderRadius: "18px", height: "45px", backgroundColor: "#7F8CAA", fontWeight: "bold" }}>Sign Up</Button>
                                <Snackbar open={open} autoHideDuration={100000} onClose={handleClose}>
                                    <Alert onClose={handleClose} severity="error" sx={{ width: '500px' }}>
                                        {errorSignUp}
                                    </Alert>
                                </Snackbar>

                                <Snackbar open={open1} autoHideDuration={100000} onClose={handleClose}>
                                    <Alert onClose={handleClose} severity="success" sx={{ width: '500px' }}>
                                        Success!
                                    </Alert>
                                </Snackbar>
                            </div>
                            <p><Link href="/" style={{ fontSize: "12px" }}>By signing up, you agree to our Terms of Service and Privacy Policy</Link>.</p>
                        </div>
                        <div className={styles.image}>
                            <img
                                src="https://imgur.com/Aisv6mt.png"
                                alt="image1"
                                width={450}
                                height={320}
                                style={{ borderRadius: "15px 15px 0px 0px" }} />
                            <div>
                                <p>Sign up and start your journey to better mental health with us today</p>
                            </div>
                        </div>
                    </div>
                </form >

            </div >
        </>);
}

export default RegisterPage;