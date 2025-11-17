'use client';
import {
    Alert, Avatar, Box, Button, ButtonBase, Card, CardContent,
    FormControlLabel, IconButton, InputAdornment, LinearProgress,
    Snackbar, TextField, Grid, Typography, Divider, Container,
    Paper, Fade
} from "@mui/material";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useState } from "react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/features/userSlice";
import {
    Visibility, VisibilityOff, CameraAlt, Person,
    Email, Lock, Badge, Cake
} from "@mui/icons-material";
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
                    <Typography variant="h3" component="h1" fontWeight="700" gutterBottom sx={{ color: '#1a1a1a' }}>
                        Profile
                    </Typography>
                </div>
                <div className={styles.description}>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: '1.05rem' }}>
                        Welcome to your profile page! Here you can view and manage your account details.
                    </Typography>
                </div>
                <div className={styles.contentProfile}>
                    <Fade in timeout={500}>
                        <CardContent sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                {/* Avatar with Upload */}
                                <Box sx={{ position: 'relative' }}>
                                    <ButtonBase
                                        component="label"
                                        sx={{
                                            borderRadius: '50%',
                                            position: 'relative',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                            '&:hover .avatar-overlay': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                border: '4px solid white',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            }}
                                            alt={user?.username}
                                            src={avatarSrc}
                                        />
                                        <Box
                                            className="avatar-overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <CameraAlt sx={{ color: 'white', fontSize: 36 }} />
                                        </Box>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleAvatarChange}
                                        />
                                    </ButtonBase>
                                </Box>

                                {/* User Info */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: '#1a1a1a' }}>
                                        {user?.username || "Guest"}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#444', mb: 1, fontWeight: 400 }}>
                                        {user?.firstname} {user?.lastname}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Email sx={{ fontSize: 20, color: '#666' }} />
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                {user?.email}
                                            </Typography>
                                        </Box>
                                        {user?.age && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Cake sx={{ fontSize: 20, color: '#666' }} />
                                                <Typography variant="body2" sx={{ color: '#666' }}>
                                                    {user.age} years old
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Fade>
                </div>
                <div className={styles.update}>
                    <Fade in timeout={800}>
                        {/* <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid rgba(0,0,0,0.08)',
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(10px)'
                            }}
                        > */}
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3, color: '#1a1a1a' }}>
                                Edit Profile Information
                            </Typography>

                            <form onSubmit={updateProfile}>
                                <Grid container spacing={3}>
                                    {/* Name Fields */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="First Name"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.firstname}
                                            onChange={(e) => setformData({ ...formData, firstname: e.target.value })}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Badge sx={{ color: '#666' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Last Name"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.lastname}
                                            onChange={(e) => setformData({ ...formData, lastname: e.target.value })}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Badge sx={{ color: '#666' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Username and Age */}
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            label="Username"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.username}
                                            onChange={(e) => setformData({ ...formData, username: e.target.value })}
                                            required
                                            error={!!usernameError}
                                            helperText={usernameError}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person sx={{ color: '#666' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="Age"
                                            variant="outlined"
                                            fullWidth
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setformData({ ...formData, age: e.target.value })}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Cake sx={{ color: '#666' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Email */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email Address"
                                            variant="outlined"
                                            fullWidth
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setformData({ ...formData, email: e.target.value })}
                                            required
                                            error={!!emailError}
                                            helperText={emailError}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email sx={{ color: '#666' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Security Section */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Lock sx={{ color: '#666' }} />
                                            <Typography variant="h6" fontWeight="600" sx={{ color: '#1a1a1a' }}>
                                                Security
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Current Password */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Current Password (Required to Save Changes)"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.password}
                                            onChange={(e) => {
                                                setformData({ ...formData, password: e.target.value });
                                                handlePasswordChange(e as React.ChangeEvent<HTMLInputElement>);
                                            }}
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                            error={!!passwordError}
                                            helperText={passwordError}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock sx={{ color: '#666' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    {/* Change Password Checkbox */}
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={changePassword}
                                                    onChange={handleCheckboxChange}
                                                    color="primary"
                                                />
                                            }
                                            label="Change my password"
                                        />
                                    </Grid>

                                    {/* New Password Fields */}
                                    {changePassword && (
                                        <>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="New Password"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={formData.newPassword}
                                                    onChange={(e) => setformData({ ...formData, newPassword: e.target.value })}
                                                    required={changePassword}
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    error={!!newPasswordError}
                                                    helperText={newPasswordError || "Minimum 6 characters"}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Lock sx={{ color: '#666' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={handleClickShowNewPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                >
                                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Confirm New Password"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={formData.newPassword2}
                                                    onChange={(e) => setformData({ ...formData, newPassword2: e.target.value })}
                                                    required={changePassword}
                                                    type={showNewPassword2 ? 'text' : 'password'}
                                                    error={!!newPasswordError}
                                                    helperText={newPasswordError}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Lock sx={{ color: '#666' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={handleClickShowNewPassword2}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                >
                                                                    {showNewPassword2 ? <Visibility /> : <VisibilityOff />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    {/* Submit Button */}
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            disabled={loading}
                                            sx={{
                                                mt: 2,
                                                py: 1.5,
                                                fontSize: '1.05rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                '&:hover': {
                                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                                }
                                            }}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                        {/* </Card> */}
                    </Fade>
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