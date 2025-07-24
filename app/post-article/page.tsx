'use client';
import { Alert, Box, Button, Fade, Snackbar, TextField } from "@mui/material";
import { FunctionComponent, useState } from "react";
import styles from './page.module.css'
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import { useRouter } from "next/navigation";
import { CheckCircle } from "@mui/icons-material";

interface AddArticleProps {

}

const AddArticle: FunctionComponent<AddArticleProps> = () => {

    const currentUser = useAppSelector(state => state.user.currentUser);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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


    const handleClick = () => {
        setOpen(true);
    };

    // Then modify the submit function and return section like this:
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        // Validate form data
        if (!formdata.title || !formdata.content) {
            setError("Please fill in all required fields");
            setOpen(true);
            setLoading(false);
            return;
        }


        try {
            const formData = new FormData();
            formData.append('title', formdata.title);
            formData.append('content', formdata.content);
            formData.append('username', formdata.username);
            formData.append('date', new Date().toISOString());
            images.forEach((image) => {
                formData.append('image', image);
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
                throw new Error(errorData.message || 'Failed to upload article');
            }
            setTimeout(() => {
                setLoading(false);
                setShowSuccess(true);
            }, 1000);

            setTimeout(() => {
                router.push("/articles");
            }, 2000);
        } catch (error: any) {
            console.error('Error submitting form:', error);
            setError(error.message || 'Failed to upload article');

            setTimeout(() => {
                setOpen(true);
                setLoading(false);
            }, 1000);

            setTimeout(() => {
                router.push("/articles");
            }, 2000);
        }

    }


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (<>
        {(loading || showSuccess) && (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 9999
            }}>
                {loading && (
                    <Fade in={loading} timeout={300}>
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            sx={{
                                color: '#1a90ff',
                                animationDuration: '550ms',
                                [`& .${circularProgressClasses.circle}`]: {
                                    strokeLinecap: 'round',
                                },
                            }}
                            size={40}
                            thickness={4}
                        />
                    </Fade>
                )}

                {showSuccess && (
                    <Fade in={showSuccess} timeout={500}>
                        <CheckCircle
                            sx={{
                                color: '#4caf50',
                                fontSize: 48,
                                '@keyframes scaleIn': {
                                    '0%': { transform: 'scale(0)' },
                                    '50%': { transform: 'scale(1.2)' },
                                    '100%': { transform: 'scale(1)' }
                                },
                                animation: 'scaleIn 0.3s ease-out'
                            }}
                        />
                    </Fade>
                )}
            </Box>
        )}
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
                        <Snackbar open={open} autoHideDuration={100000} onClose={handleClose}
                            sx={{
                                zIndex: 1000,
                                position: "fixed"
                            }}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '500px' }}>
                                {error}
                            </Alert>
                        </Snackbar>

                        <Snackbar open={open1} autoHideDuration={100000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '500px' }}>
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