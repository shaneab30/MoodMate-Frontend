'use client';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Snackbar, TextField } from "@mui/material";
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

            // Success!
            setOpen1(true);
            setTimeout(() => {
                setLoading(false);
                router.push("/sign-in");
            }, 1000);

        } catch (error: any) {
            console.error("Error during registration:", error);

            setTimeout(() => {
                setLoading(false);
                setErrorSignUp(error.message || "An error occurred during registration.");
                setOpen(true);
            }, 1000);
        }
    };


    return (
        <>
            {loading && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
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
                            <TextField id="firstname" label="Firstname" variant="standard" required value={formData.firstname} onChange={(e) => setformData({ ...formData, firstname: e.target.value })} />
                            <TextField id="lastname" label="Lastname" variant="standard" required value={formData.lastname} onChange={(e) => setformData({ ...formData, lastname: e.target.value })} />
                            <TextField id="username" label="Username" variant="standard" required value={formData.username} onChange={(e) => setformData({ ...formData, username: e.target.value })} />
                            <TextField id="email" label="Email" variant="standard" type="email" required value={formData.email} onChange={(e) => setformData({ ...formData, email: e.target.value })} />
                            <TextField id="password" label="Password" variant="standard" required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handlePasswordChange} InputProps={{
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
                                error={!!error}
                                helperText={error || alertInfo} />
                            <TextField id="age" label="Age" variant="standard" required value={formData.age} onChange={(e) => setformData({ ...formData, age: e.target.value })} />
                            <div className={styles.button}>
                                <Button variant="contained" type="submit" style={{ width: "100%", borderRadius: "18px", height: "45px", backgroundColor: "black" }}>Sign Up</Button>
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