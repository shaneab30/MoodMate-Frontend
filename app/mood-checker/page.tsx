'use client';
import { Button, styled } from "@mui/material";
import { Component, FunctionComponent, use, useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

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

const MoodChecker: FunctionComponent<MoodCheckerProps> = () => {

    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (image) {
            console.log(image);
        }
    }, []);


    return (<div>
        <h1 style={{ textAlign: "center", color: "black" }}>Mood Checker</h1>

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
                onChange={async (event) => {
                    setImage(event.target.files![0]);
                    console.log(event.target.files)
                    const url = "http://127.0.0.1:5000/predict"
                    const formData = new FormData();
                    formData.append('file', event.target.files![0]);
                    const response = await fetch(url, {
                        headers: {
                            'Accept': "application/json, text/plain, */*",
                            'Content-Type': "application/json;charset=utf-8"
                        },
                        method: "POST",
                        body: formData
                    });
                    const data = await response.json();
                    console.log(data);
                }}
                // multiple
                accept="image/*"
            />
        </Button>

        {/* {image && <img src={URL.createObjectURL(image)} alt="uploaded image" style={{ width: "100%", height: "auto" }}></img>} */}
        {image && <Image src={URL.createObjectURL(image)} width={500} height={500} alt="uploaded image"></Image>}
       
    </div>);
}

export default MoodChecker;