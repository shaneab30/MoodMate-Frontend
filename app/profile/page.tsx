'use client';
import { Avatar, Button, TextField } from "@mui/material";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useState } from "react";

interface ProfileProps {

}

const Profile: FunctionComponent<ProfileProps> = () => {

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [user, setUser] = useState<any>(null);

    const [error, setError] = useState<string | null>(null);

    const [formData, setformData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        age: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const savedUser = localStorage.getItem("user");
            let userExists = null;
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                const userId = parsedUser._id;

                try {
                    const urlCheck = "http://127.0.0.1:5000/users"
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
                    setError("Failed to load user data. Please try again later.");
                }
                console.log("User data loaded:", parsedUser);
            }
        };
        fetchData();
    }, [refreshTrigger]);

    const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!formData.firstname || !formData.lastname || !formData.age || !formData.username) {
            setError("All fields are required");
            return;
        }

        try {
            const url = "http://127.0.0.1:5000/users/" + user._id;
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
                throw new Error("Failed to update user data.");
            }

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,
                    ...formData,
                })
            );

            // Trigger refresh
            setRefreshTrigger(prev => prev + 1);

            alert("Profile updated successfully!");

        } catch (error: any) {
            console.error("Error updating profile:", error);
            setError(error.message || "Failed to update profile. Please try again later.");
        }
    };

    return (<>
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
                        <div ><Avatar sx={{ width: 100, height: 100 }} alt={user?.username} src="/static/images/avatar/1.jpg" /></div>
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
                            id="username"
                            label="Username"
                            variant="standard"
                            fullWidth
                            value={formData.username}
                            onChange={(e) => setformData({ ...formData, username: e.target.value })}
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
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                        >
                            Update Profile
                        </Button>
                        {error && (
                            <div style={{ color: 'red', marginTop: '10px' }}>
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    </>);
}

export default Profile;