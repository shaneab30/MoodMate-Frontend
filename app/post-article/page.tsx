'use client';
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";
import styles from './page.module.css'
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

interface AddArticleProps {

}

const AddArticle: FunctionComponent<AddArticleProps> = () => {

    const currentUser = useAppSelector(state => state.user.currentUser);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const [formdata, setformdata] = useState({
        title: '',
        content: '',
        username: currentUser?.username || '',
    });

    const [images, setimages] = useState<File[]>([]);

    const handleFileSelector = async (files: FileList | null) => {
        if (files && files.length > 0 && files.length < 6) {
            const resizedFiles = await Promise.all(
                Array.from(files).map(file => resizeImage(file, 500))
            );
            setimages(resizedFiles);
        } else {
            alert('Max 5 images');
        }
    };

    function resizeImage(file: File, maxSize = 500): Promise<File> {
        return new Promise((resolve) => {
            const img = new window.Image();
            const reader = new FileReader();
            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = maxSize;
                    canvas.height = maxSize;
                    const ctx = canvas.getContext('2d');
                    // Fill with white background (for jpg)
                    ctx!.fillStyle = "#fff";
                    ctx!.fillRect(0, 0, maxSize, maxSize);
                    // Center crop
                    let sx = 0, sy = 0, sw = img.width, sh = img.height;
                    if (img.width > img.height) {
                        sx = (img.width - img.height) / 2;
                        sw = sh = img.height;
                    } else if (img.height > img.width) {
                        sy = (img.height - img.width) / 2;
                        sw = sh = img.width;
                    }
                    ctx!.drawImage(img, sx, sy, sw, sh, 0, 0, maxSize, maxSize);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob!], file.name, { type: file.type }));
                    }, file.type);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    const removeImage = (name: string) => {
        setimages(images.filter(img => img.name !== name));
    };


    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formdata.title);
            formData.append('content', formdata.content);
            formData.append('username', formdata.username);
            formData.append('date', new Date().toISOString());
            images.forEach((image) => {
                formData.append('image', image); // backend expects 'image' as the key
            });

            const url = baseUrl + '/articles';
            const uploadResponse = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                method: 'POST',
                body: formData,
            });
            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                console.error('Upload failed:', errorData);
                throw new Error('Failed to upload article');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (<>
        <div className={styles.formCard}>
            <div className={styles.title}>Post an Article</div>
            <form onSubmit={submit}>
                <div className={styles.container}>
                    <TextField
                        fullWidth
                        name="title"
                        label="Title"
                        variant="outlined"
                        value={formdata.title}
                        onChange={(e) => setformdata({ ...formdata, title: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Content"
                        value={formdata.content}
                        onChange={(e) => setformdata({ ...formdata, content: e.target.value })}
                        variant="outlined"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileSelector(e.target.files)}
                        style={{ marginTop: 8 }}
                    />
                    <div className={styles.imagePreviewGrid}>
                        {images && images.length > 0 && images.map((image) => (
                            <div className={styles.imagePreviewItem} key={image.name}>
                                <img
                                    src={URL.createObjectURL(image)}
                                    className={styles.imagePreviewImg}
                                    alt={image.name}
                                />
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => removeImage(image.name)}
                                    title="Remove"
                                >
                                    <CloseIcon style={{ fontSize: 12 }} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={styles.containerButtons}>
                        <Button variant="contained" type="submit" onClick={handleClick}>Submit</Button>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                Success!
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </form>
        </div>
    </>);
}

export default AddArticle;