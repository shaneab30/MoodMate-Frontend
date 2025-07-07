'use client';
import { Alert, Avatar, Box, Button, ButtonBase, IconButton, InputAdornment, LinearProgress, Snackbar, TextField } from "@mui/material";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useState } from "react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/features/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface ProfileProps {

}

const Profile: FunctionComponent<ProfileProps> = () => {

    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);

    const [open, setOpen] = useState(false);

    const [open1, setOpen1] = useState(false);

    const [loading, setLoading] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [user, setUser] = useState<any>(null);

    const [usernameError, setUsernameError] = useState<string | null>(null);

    const [emailError, setEmailError] = useState<string | null>(null);

    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [snackbarError, setSnackbarError] = useState<string | null>(null);

    const [formData, setformData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        age: "",
    });

    const router = useRouter();
    
    const currentUser = useAppSelector((state) => state.user.currentUser);

    useEffect(() => {
        if (!currentUser) {
            router.push('/sign-in');
        }
    }, [currentUser]);

    if (!currentUser) {
        return null;
    }


    useEffect(() => {
        const fetchData = async () => {
            const savedUser = localStorage.getItem("user");
            let userExists = null;
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                const userId = parsedUser._id;

                try {
                    const urlCheck = "http://54.169.29.154:5000//users"
                    const responseCheck = await fetch(urlCheck, {
                        headers: {
                            'Accept': "application/json, text/plain, */*",
                            'Content-Type': "application/json;charset=utf-8"
                        },
                        method: "GET",
                    });
                    if (!responseCheck.ok) {
                        throw new Error("Failed to fetch user data.");
                    }
                    const data = await responseCheck.json();
                    userExists = data.data.find((user: any) => user._id === userId);
                    if (userExists) {
                        console.log("User exists:", userExists);

                        setUser(userExists);
                        setformData({
                            firstname: userExists.firstname || "",
                            lastname: userExists.lastname || "",
                            username: userExists.username || "",
                            email: userExists.email || "",
                            password: userExists.password || "",
                            age: userExists.age || "",
                        });
                    }

                } catch (error) {
                    console.error("Error parsing user data:", error);
                    setSnackbarError("Failed to load user data. Please try again later.");
                }
                console.log("User data loaded:", parsedUser);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData({ ...formData, password: event.target.value });
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        setSnackbarError(null);
        setUsernameError(null);
        setPasswordError(null);
        setEmailError(null);

        let hasError = false;
        let errorMessages = [];

        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            setSnackbarError("Password must be at least 6 characters long");
            errorMessages.push("Password must be at least 6 characters long");
            hasError = true;
        }



        try {
            // Check if username exists
            const urlCheck = "http://54.169.29.154:5000//users";
            const responseCheck = await fetch(urlCheck, {
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8"
                },
                method: "GET",
            });

            if (!responseCheck.ok) {
                throw new Error("Failed to fetch user data.");
            }

            const data = await responseCheck.json();
            // Fix: Compare username and make sure it's not the current user's ID
            const usernameExists = data.data.find((u: any) =>
                u.username === formData.username && u._id !== user._id
            );

            const emailExists = data.data.find((u: any) => 
                // console.log(u._id, user._id);
                u.email === formData.email && u._id !== user._id
            );
            
            if (usernameExists) {
                setUsernameError("Username already exists");
                errorMessages.push("Username already exists");
                hasError = true;
            }

            if (emailExists) {
                setEmailError("Email already exists");
                errorMessages.push("Email already exists");
                hasError = true;
            }

            if (hasError) {
                setLoading(false);
                setSnackbarError(errorMessages.join(", "));
                setOpen(true);
                setLoading(false);
                return;
            }

            // If username is unique, proceed with update
            const url = "http://54.169.29.154:5000//users/" + user._id;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8"
                },
                body: JSON.stringify({
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    username: formData.username,
                    age: formData.age,
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                setOpen(true);
                throw new Error("Failed to update user data.");
            }

            // Update local storage and state
            const updatedUser = {
                ...user,
                ...formData,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch(login(updatedUser)); // Update Redux state
            setRefreshTrigger(prev => prev + 1);
            setOpen1(true);

        } catch (error: any) {
            console.error("Error updating profile:", error);
            setSnackbarError(error.message || "Failed to update profile. Please try again later.");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(undefined);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                // setAvatarSrc(reader.result as string);
                const formData = new FormData();
                formData.append('profilePicture', file);
                formData.append('_id', user._id);
                setLoading(true);
                setSnackbarError(null);
                // Upload the profile picture
                const url ="http://54.169.29.154:5000//users/" + user._id + "/profile-picture";
                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });
                if (!response.ok) {
                    setOpen(true);
                    throw new Error("Failed to upload profile picture.");
                }
                const data = await response.json();
                console.log("Profile picture uploaded:", data);
                const newProfilePicture = data.filePath;

                if (data.status) {
                    setAvatarSrc(`http://54.169.29.154:5000//${data.filePath}`);
                    const updatedUser = {
                        ...user,
                        profilePicture: newProfilePicture,
                    };
                    setUser(updatedUser);
                    localStorage.removeItem("user");
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    dispatch(login(updatedUser));
                }

                setOpen1(true);
                setTimeout(() => {
                    setLoading(false);
                    setOpen1(false);
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (user?.profilePicture) {
            setAvatarSrc(`http://54.169.29.154:5000//${user.profilePicture}`);
        } else if (user?.username) {
            // Fallback to generated avatar if no profile picture
            setAvatarSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`);
        } else {
            setAvatarSrc(undefined);
        }
    }, [user]);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpen1(false);
    }

    return (<>
        {loading && (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        )}
        <div className={styles.container}>
            <div className={styles.headerProfile}>
                <div className={styles.title}>
                    <h1 >Profile</h1>
                </div>
                <div className={styles.description}>
                    <p>
                        Welcome to your profile page! Here you can view and manage your account details.
                        If you need to update your information, please contact support.
                    </p>
                </div>
                <div className={styles.contentProfile}>
                    <div className={styles.avatar}>
                        <ButtonBase
                            component="label"
                            role={undefined}
                            tabIndex={-1} // prevent label from tab focus
                            aria-label="Avatar image"
                            sx={{
                                borderRadius: '40px',
                                '&:has(:focus-visible)': {
                                    outline: '2px solid',
                                    outlineOffset: '2px',
                                },
                            }}
                        >
                            <Avatar sx={{ width: 100, height: 100 }} alt={user?.username} src={avatarSrc} />
                            <input
                                type="file"
                                accept="image/*"
                                style={{
                                    border: 0,
                                    clip: 'rect(0 0 0 0)',
                                    height: '1px',
                                    margin: '-1px',
                                    overflow: 'hidden',
                                    padding: 0,
                                    position: 'absolute',
                                    whiteSpace: 'nowrap',
                                    width: '1px',
                                }}
                                onChange={handleAvatarChange}
                            />
                        </ButtonBase>
                    </div>

                    <div className={styles.textProfile}>
                        <div style={{ fontWeight: "bold" }}>{user?.username || "Guest"} </div>
                        <div>Email: {user?.email}</div>
                    </div>
                </div>
                <div className={styles.update}>
                    <form onSubmit={updateProfile} >
                        <TextField
                            id="firstname"
                            label="Firstname"
                            variant="standard"
                            fullWidth
                            value={formData.firstname}
                            onChange={(e) => setformData({ ...formData, firstname: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            id="lastname"
                            label="Lastname"
                            variant="standard"
                            fullWidth
                            value={formData.lastname}
                            onChange={(e) => setformData({ ...formData, lastname: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            id="age"
                            label="Age"
                            variant="standard"
                            fullWidth
                            value={formData.age}
                            onChange={(e) => setformData({ ...formData, age: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            id="username"
                            label="Username"
                            variant="standard"
                            fullWidth
                            value={formData.username}
                            onChange={(e) => setformData({ ...formData, username: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            required
                            error={!!usernameError}
                            helperText={usernameError}
                        />
                        <TextField
                            id="email"
                            label="Email"
                            variant="standard"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setformData({ ...formData, email: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            required
                            type="email"
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="standard"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => { setformData({ ...formData, password: e.target.value }); handlePasswordChange(e as React.ChangeEvent<HTMLInputElement>); }}
                            InputLabelProps={{ shrink: true }}
                            required
                            type={showPassword ? 'text' : 'password'}
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
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                        >
                            Update Profile
                        </Button>
                        {/* {error && (
                            <div style={{ color: 'red', marginTop: '10px' }}>
                                {error}
                            </div>
                        )} */}
                    </form>
                </div>
                <Snackbar open={open} autoHideDuration={100000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '500px' }}>
                        {snackbarError}
                    </Alert>
                </Snackbar>

                <Snackbar open={open1} autoHideDuration={100000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '500px' }}>
                        Success!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    </>);
}

export default Profile;