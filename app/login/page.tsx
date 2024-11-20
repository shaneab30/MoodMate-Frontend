'use client';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Alert, Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
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

    const router = useRouter();
    const dispatch = useAppDispatch();
    // const [items, setItems] = useState([]);
    // const currentUser = useAppSelector((state) => state.user.currentUser)


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

    const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
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

            const user = data.data.find((user: any) => user.username === formData.username);
            if (user && user.password === formData.password) {
                dispatch(login(user));
                console.log(dispatch(login(user)));
                console.log("Login success")
                localStorage.setItem("user", JSON.stringify(user));
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
        <div className={styles.bgImage}>
            <div className={styles.outercontainer}>
                <form onSubmit={loginUser}>
                    <div className={styles.container}>
                        <h1>Sign in</h1>
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
                            <Button variant="contained" type="submit" style={{ backgroundColor: "black" }}>Login</Button>
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