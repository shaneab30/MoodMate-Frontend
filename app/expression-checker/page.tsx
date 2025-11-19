'use client';
import { Button, styled, Box, Paper, Typography, CircularProgress, Fade, Chip } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

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

const EmotionEmojis: { [key: string]: string } = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    neutral: '😐',
    fear: '😨',
    disgust: '🤢'
};

const ExpressionChecker: FunctionComponent = () => {
    const [image, setImage] = useState<File | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!currentUser) {
            router.push('/sign-in');
        }
    }, [currentUser]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    if (!currentUser) {
        return null;
    }

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files![0];
            if (!file) return;

            setImage(file);
            setLoading(true);
            setPrediction(null);
            setSuccess(false);

            const url = baseUrl + "/upload";
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                method: "POST",
                body: formData
            });

            const data = await response.json();
            setPrediction(data.label);
            await postEmotion(data.label);
            setSuccess(true);
            setLoading(false);
        } catch (error) {
            console.error("Error uploading image:", error);
            setLoading(false);
        }
    };

    const postEmotion = async (emotion: string) => {
        try {
            const url = baseUrl + "/emotions";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    username: user.username,
                    date: new Date().toISOString(),
                    emotion: emotion
                })
            });
            await response.json();
        } catch (error) {
            console.error("Error posting emotion:", error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #eedbf0ff 0%, #ff8999ff 100%)',
                py: 4,
                px: { xs: 2, md: 4 }
            }}
        >
            <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <Fade in timeout={600}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <EmojiEmotionsIcon sx={{ fontSize: 60, color: 'white' }} />
                        </Box>
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 1,
                                fontSize: { xs: '2rem', md: '3rem' }
                            }}
                        >
                            Expression Checker
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 300
                            }}
                        >
                            Upload a photo and let AI detect your emotion
                        </Typography>
                    </Box>
                </Fade>

                {/* Main Content */}
                <Fade in timeout={800}>
                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* Image Display Area */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '400px',
                                mb: 4,
                                borderRadius: 3,
                                background: image 
                                    ? 'transparent' 
                                    : 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
                                border: '2px dashed',
                                borderColor: image ? 'transparent' : 'rgba(240, 147, 251, 0.3)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {loading && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <CircularProgress size={60} sx={{ color: '#f5576c' }} />
                                    <Typography color="text.secondary">Analyzing expression...</Typography>
                                </Box>
                            )}

                            {!loading && !image && (
                                <Box sx={{ textAlign: 'center', p: 4 }}>
                                    <CameraAltIcon sx={{ fontSize: 80, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        No image uploaded yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Click the button below to get started
                                    </Typography>
                                </Box>
                            )}

                            {!loading && image && (
                                <Fade in timeout={500}>
                                    <Box sx={{ position: 'relative', maxWidth: '100%', maxHeight: '400px' }}>
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            width={500}
                                            height={500}
                                            alt="uploaded image"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                borderRadius: '12px',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </Box>
                                </Fade>
                            )}
                        </Box>

                        {/* Prediction Result */}
                        {prediction && !loading && (
                            <Fade in timeout={600}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        mb: 3,
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%)'
                                    }}
                                >
                                    <Typography variant="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <span style={{ fontSize: '3rem' }}>
                                            {EmotionEmojis[prediction.toLowerCase()] || '🎭'}
                                        </span>
                                    </Typography>
                                    <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                                        Detected Emotion: {prediction}
                                    </Typography>
                                    {success && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label="Successfully saved to your mood history"
                                            color="success"
                                            sx={{ mt: 2, fontWeight: 500 }}
                                        />
                                    )}
                                </Box>
                            </Fade>
                        )}

                        {/* Upload Button */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                component="label"
                                variant="contained"
                                size="large"
                                startIcon={<CloudUploadIcon />}
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    px: 5,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 20px rgba(245, 87, 108, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                                        boxShadow: '0 6px 25px rgba(245, 87, 108, 0.5)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {image ? 'Upload Another Image' : 'Upload Image'}
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={uploadImage}
                                    accept="image/*"
                                />
                            </Button>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 2 }}
                            >
                                Supported formats: JPG, PNG, GIF
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </Box>
    );
}

export default ExpressionChecker;