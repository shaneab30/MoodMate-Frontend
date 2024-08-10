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
                body: JSON.stringify({"username" : formData.username, "email" : formData.email, "password" : formData.password, "age" : formData.age}),
            }) 

            const postUsersJson = await postUsers.json()
            console.log(postUsersJson)


            setTimeout(() => {
                router.push("/login")
            },500);
        }
    }

    return (
        <div className={styles.outercontainer}>
            <form className={styles.form} onSubmit={submit}>
                <div className={styles.container}>
                    <h1>Register</h1>
                    <TextField id="username" label="Username" variant="outlined" required value={formData.username} onChange={(e) => setformData({ ...formData, username: e.target.value })} />
                    <TextField id="email" label="Email" variant="outlined" type="email" required value={formData.email} onChange={(e) => setformData({ ...formData, email: e.target.value })} />
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handlePasswordChange}
                            endAdornment={
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
                            }
                            label="Password"
                        />
                        {error && <div className={styles.error}>
                            <Alert severity="error">{error}</Alert></div>}
                        {alertInfo && <div className={styles.error}>
                            <Alert severity="success">{alertInfo}</Alert></div>}
                    </FormControl>
                    <TextField id="age" label="Age" variant="outlined" required value={formData.age} onChange={(e) => setformData({ ...formData, age: e.target.value })} />
                    <div className={styles.button}>
                        <Button variant="contained" type="submit">Register</Button>
                    </div>
                </div>
            </form>

        </div>);
}

export default RegisterPage;