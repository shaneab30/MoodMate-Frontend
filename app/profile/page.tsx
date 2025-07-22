'use client';
import { Alert, Avatar, Box, Button, ButtonBase, FormControlLabel, IconButton, InputAdornment, LinearProgress, Snackbar, TextField } from "@mui/material";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useState } from "react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/features/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { get } from "http";
// import { Checkbox } from "@/components/ui/checkbox"
import { Checkbox } from "@mui/material";

interface ProfileProps {

}

const Profile: FunctionComponent<ProfileProps> = () => {

    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPassword2, setShowNewPassword2] = useState(false);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [snackbarError, setSnackbarError] = useState<string | null>(null);
    const [formData, setformData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        newPassword: "",
        newPassword2: "",
        age: "",
    });

    const router = useRouter();
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
            // let userData = null;
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                const userId = parsedUser._id;

                try {
                    const urlCheck = baseUrl + "/users/me"
                    const responseCheck = await fetch(urlCheck, {
                        headers: {
                            'Accept': "application/json, text/plain, */*",
                            'Content-Type': "application/json;charset=utf-8",
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                        method: "GET",
                    });
                    if (!responseCheck.ok) {
                        throw new Error("Failed to fetch user data.");
                    }
                    const userData = await responseCheck.json();
                    if (userData) {
                        // console.log("User exists:", userExists);

                        setUser(userData);
                        setformData({
                            firstname: userData.firstname || "",
                            lastname: userData.lastname || "",
                            username: userData.username || "",
                            email: userData.email || "",
                            password: "",
                            age: userData.age || "",
                            newPassword: "",
                            newPassword2: "",
                        });
                    }

                } catch (error) {
                    console.error("Error parsing user data:", error);
                    setSnackbarError("Failed to load user data. Please try again later.");
                }
                // console.log("User data loaded:", parsedUser);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData({ ...formData, password: event.target.value });
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
    const handleClickShowNewPassword2 = () => setShowNewPassword2((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleMouseDownNewPassword2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [changePassword, setChangePassword] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChangePassword(event.target.checked);
    };

    const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setSnackbarError(null);
        setUsernameError(null);
        setPasswordError(null);
        setNewPasswordError(null);
        setEmailError(null);

        if (changePassword && (formData.newPassword.length < 6 || formData.newPassword2.length < 6)) {
            setNewPasswordError("Password must be at least 6 characters long");
            setSnackbarError("Password must be at least 6 characters long");
            setOpen(true);
            setLoading(false);
            return;
        }

        if (formData.newPassword && formData.newPassword !== formData.newPassword2) {
            setNewPasswordError("New passwords do not match");
            setSnackbarError("New passwords do not match");
            setOpen(true);
            setLoading(false);
            return;
        }

        try {
            const url = baseUrl + "/users/" + user._id;
            const requestBody = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                age: formData.age,
                email: formData.email,
                password: formData.password,
                newPassword: changePassword ? formData.newPassword : undefined, // Only send new_password if checkbox is checked
            };

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Accept': "application/json, text/plain, */*",
                    'Content-Type': "application/json;charset=utf-8",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData?.message?.includes("Username")) {
                    setUsernameError("Username already exists");
                }
                if (errorData?.message?.includes("Email")) {
                    setEmailError("Email already exists");
                }
                setPasswordError(errorData?.message || "Failed to update user");
                setSnackbarError(errorData?.message || "Failed to update user");
                setOpen(true);
                return;
            }

            const updatedUser = { ...user, ...formData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch(login(updatedUser));
            setRefreshTrigger(prev => prev + 1);
            setOpen1(true);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setSnackbarError(error.message || "Failed to update profile");
            setOpen(true);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setOpen1(false);
            }, 1000);
            // setLoading(false);
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
                const url = baseUrl + "/users/" + user._id + "/profile-picture";
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    method: "POST",
                    body: formData
                });
                if (!response.ok) {
                    setOpen(true);
                    throw new Error("Failed to upload profile picture.");
                }
                const data = await response.json();
                // console.log("Profile picture uploaded:", data);
                const newProfilePicture = data.filePath;

                if (data.status) {
                    // setAvatarSrc(`${baseUrl}/uploads/profile_pictures?filename=${data.filePath}`);
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
        const getAvatar = async () => {
            try {
                const response = await fetch(`${baseUrl}/uploads/profile_pictures?filename=${user?.profilePicture}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch image");
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setAvatarSrc(imageUrl);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        if (user?.profilePicture) {
            getAvatar();
            // setAvatarSrc(`${baseUrl}/uploads/profile_pictures?filename=${user.profilePicture}`);
        } else if (user?.username) {
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
                        <div>{user?.firstname} {user?.lastname}</div>
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
                            label="Retype Password to Confirm Changes"
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
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={changePassword}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="I want to change my password"
                        />


                        <TextField
                            id="newPassword"
                            label="New Password"
                            variant="standard"
                            fullWidth
                            value={formData.newPassword}
                            onChange={(e) => { setformData({ ...formData, newPassword: e.target.value }) }}
                            InputLabelProps={{ shrink: true }}
                            disabled={!changePassword}
                            required={changePassword}
                            type={showNewPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            disabled={!changePassword}
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            onMouseDown={handleMouseDownNewPassword}
                                            edge="end"
                                            style={{ paddingRight: "20px" }}
                                        >
                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!newPasswordError}
                            helperText={newPasswordError}
                        />

                        <TextField
                            id="retypeNewPassword"
                            label="Retype New Password"
                            variant="standard"
                            fullWidth
                            value={formData.newPassword2}
                            onChange={(e) => { setformData({ ...formData, newPassword2: e.target.value }) }}
                            InputLabelProps={{ shrink: true }}
                            disabled={!changePassword}
                            required={changePassword}
                            type={showNewPassword2 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            disabled={!changePassword}
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword2}
                                            onMouseDown={handleMouseDownNewPassword2}
                                            edge="end"
                                            style={{ paddingRight: "20px" }}
                                        >
                                            {showNewPassword2 ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!newPasswordError}
                            helperText={newPasswordError}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                        >
                            Update Profile
                        </Button>
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