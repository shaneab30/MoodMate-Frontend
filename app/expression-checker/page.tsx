'use client';
import { Button, styled } from "@mui/material";
import { Component, FunctionComponent, use, useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import styles from "./page.module.css";

interface MoodCheckerProps {

}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const ExpressionChecker: FunctionComponent<MoodCheckerProps> = () => {

    const [image, setImage] = useState<File | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (image) {
            console.log(image);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            console.log("No user data found");
        }
    }, []);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setImage(event.target.files![0]);
            console.log(event.target.files)
            const url = "http://127.0.0.1:5000/upload"
            const formData = new FormData();
            formData.append('file', event.target.files![0]);
            const response = await fetch(url, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log(data);
            setPrediction(data.label);
            postEmotion(data.label);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const postEmotion = async (emotion: string) => {
        try {
            // console.log(user.username);
            const url = "http://127.0.0.1:5000/emotions";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user.username,
                    date : new Date().toISOString(),
                    emotion: emotion
                })
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error posting emotion:", error);
        }
    };

    return (<>
        <div className={styles.container}>
            <div className={styles.headerProfile}>
                <h1 style={{ textAlign: "center", color: "black" }}>Mood Checker</h1>
            </div>

            <div className={styles.image}>
                {image && <Image src={URL.createObjectURL(image)} width={500} height={500} alt="uploaded image"></Image>}
            </div>

            <div className={styles.upload}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Image
                    <VisuallyHiddenInput
                        type="file"
                        onChange={uploadImage}
                        // multiple
                        accept="image/*"
                    />
                </Button>

                <h2 style={{ textAlign: "center", color: "black", paddingTop: "20px" }}>
                    {prediction ? `Prediction: ${prediction}` : "No prediction yet"}
                </h2>
            </div>
        </div>

    </>);
}

export default ExpressionChecker;