'use client';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { FunctionComponent, use, useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegisterPageProps {

}

const RegisterPage: FunctionComponent<RegisterPageProps> = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [alertInfo, setalertInfo] = useState("");

    const router = useRouter();


    const [formData, setformData] = useState({
        username: "",
        email: "",
        password: "",
        age: "",
    });

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData({ ...formData, password: event.target.value });
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
        } else {
            console.log("Register success")
            console.log(formData)
            setError("")
            setalertInfo("Register success")

            const url = "http://127.0.0.1:5000/users/register"
            const postUsers = await fetch(url, {
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8"
                },
                method: "POST",
                body: JSON.stringify({ "username": formData.username, "email": formData.email, "password": formData.password, "age": formData.age }),
            })

            const postUsersJson = await postUsers.json()
            console.log(postUsersJson)


            setTimeout(() => {
                router.push("/login")
            }, 500);
        }
    }

    return (
        <div className={styles.outercontainer}>
            <form onSubmit={submit}>
                <div className={styles.container}>
                    <div className={styles.text}>
                        <h1>Sign Up</h1>
                        <p>Already have an account?&nbsp;
                            <Link href="/login" style={{ textDecoration: "underline" }}>Login</Link>
                        </p>
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
                            <Button variant="contained" type="submit" style={{ width: "100%", borderRadius: "18px", height: "45px" , backgroundColor: "black"}}>Sign Up</Button>
                        </div>
                        <p><Link href="/" style={{ fontSize: "12px" }}>By signing up, you agree to our Terms of Service and Privacy Policy</Link>.</p>
                    </div>
                    <div className={styles.image}>
                        <img
                            src="https://imgur.com/1OpAhUn.png"
                            alt="image1"
                            width={450}
                            height={320}
                            style={{ borderRadius: "15px 15px 0px 0px" }} />
                            <div className={styles.desc}>
                                <h2>Test</h2>
                            </div>
                    </div>
                </div>
            </form >

        </div >);
}

export default RegisterPage;