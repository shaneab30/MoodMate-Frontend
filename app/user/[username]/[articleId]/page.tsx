'use client'
import { Avatar, Box, Button, CircularProgress, Grid } from "@mui/material";
import Link from "next/link";
import { FunctionComponent, use, useCallback, useEffect, useState } from "react";
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import styles from "./page.module.css";
import React from "react";
import "react-image-gallery/styles/css/image-gallery.css";

interface ArticleIdPageProps {
    params: Promise<{
        username: string;
        articleId: string;
    }>;
}

const ArticleIdPage: FunctionComponent<ArticleIdPageProps> = ({ params }) => {
    // Unwrap the params Promise
    const { username, articleId } = use(params);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(undefined);
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [images, setImages] = useState<ReactImageGalleryItem[]>([]);

    const fetchProfile = useCallback(async () => {
        try {
            const profileRes = await fetch(`${baseUrl}/users/username/${username}`, {
                method: "GET"
            });

            if (!profileRes.ok) throw new Error("Failed to fetch user profile");
            const profileData = await profileRes.json();
            setProfile(profileData);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, [baseUrl, username]);

    const fetchArticlesData = async () => {
        try {
            const res = await fetch(`${baseUrl}/articles/${articleId}`);
            if (!res.ok) throw new Error("Failed to fetch article");
            const data = await res.json();
            const articleData = data.data;
            setArticle(articleData);

            // Fetch images immediately after article is ready
            const imageGalleryItems = await Promise.all(
                (articleData.image || []).map(async (image: string) => {
                    const response = await fetch(`${baseUrl}/articles/images/${image}`);
                    if (!response.ok) throw new Error("Failed to fetch image");
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    return {
                        original: imageUrl,
                        thumbnail: imageUrl,
                    };
                })
            );

            setImages(imageGalleryItems);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching article or images:", error);
        }
    };

    const getAvatar = async () => {
        if (!profile || !profile.data || !profile.data[0] || !profile.data[0].profilePicture) {
            console.log('No profile or profile picture available');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/uploads/profile_pictures?filename=${profile.data[0].profilePicture}`, {
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

    useEffect(() => {
        fetchArticlesData();
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile && profile.data && profile.data[0]) {
            getAvatar();
        }
    }, [profile, baseUrl]);

    return (<>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        ) : (
            <div className={styles.content}>
                <div className={styles.title}>
                    <h1 style={{ color: 'black' }}>{article.title}</h1>
                </div>

                <div className={styles.images}>
                    <ImageGallery
                        items={images}
                        showPlayButton={false}
                        showFullscreenButton={true}
                        showNav={true}
                        thumbnailPosition="bottom"
                        useBrowserFullscreen={true}
                    />
                </div>

                <div className={styles.contentProfile}>
                    <div className={styles.textProfile}>
                        <p>{article.content}</p>
                        <div className={styles.author}>
                            <Avatar
                                alt={article.author?.username || "Author"}
                                src={avatarSrc}
                                sx={{ width: 56, height: 56 }}
                            />
                            <div className={styles.authorInfo}>
                                <Link href={`/user/${article?.username}`}>
                                    <h3>{article?.username}</h3>
                                </Link>
                                <p>Posted on: {new Date(article.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>);
}

export default ArticleIdPage;