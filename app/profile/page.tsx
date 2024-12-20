'use client';
import { Avatar } from "@mui/material";
import styles from "./page.module.css";
import { FunctionComponent, useEffect, useState } from "react";

interface ProfileProps {

}

const Profile: FunctionComponent<ProfileProps> = () => {

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Retrieve user from localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (<>
        <div className={styles.container}>
            <div className={styles.headerProfile}>
                <div className={styles.title}>
                    <h1 >Profile</h1>
                </div>
                <div className={styles.contentProfile}>
                    <div className={styles.avatar}>
                        <div ><Avatar sx={{ width: 100, height: 100 }} alt={"test"} src="/static/images/avatar/1.jpg" /></div>
                    </div>
                    <div className={styles.textProfile}>
                        <div style={{ fontWeight: "bold" }}>{user?.username || "Guest"} </div>
                        <div>Email: {user?.email}</div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default Profile;