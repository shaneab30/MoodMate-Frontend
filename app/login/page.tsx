'use client';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Alert, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { error } from "console";
import styles from "./page.module.css";
import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LoginPageProps {

}

const LoginPage: FunctionComponent<LoginPageProps> = () => {

    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const [formData, setformData] = useState({
        username: "",
        password: "",
    });

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData({ ...formData, password: event.target.value });
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Login success")

        try {
            const url = "http://127.0.0.1:5000/users"
            const loginUsers = await fetch(url, {
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8"
                },
                method: "GET",
            });

            const data = await loginUsers.json();
            console.log(data)

            const user = data.data.find((user:any) => user.username === formData.username);
            if (user && user.password === formData.password) {
                console.log("Login success")
                router.push("/articles");
            } else {
                console.log("Login failed")
            }

        }
        
        catch (error) {
            console.log(error);
        }
    }

    return (<>
        <div className={styles.outercontainer}>
            <form onSubmit={login}>
                <div className={styles.container}>
                    <h1>Login Page</h1>
                    <TextField id="username" label="Username" variant="outlined" required value={formData.username} onChange={(e) => setformData({ ...formData, username: e.target.value })} />
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
                    </FormControl>
                    <div className={styles.button}>
                        <Button variant="contained" type="submit">Login</Button>
                    </div>
                    <div className={styles.register}>
                        <p>Don't have an account?
                            <Link href="/register" style={{ color: "blue" }}> Register</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    </>);
}

export default LoginPage;