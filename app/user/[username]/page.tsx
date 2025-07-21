'use client';
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import Avatar from "@mui/material/Avatar";
import React from "react";

interface userProps {
    params: {
        username: string;
    };
}

const user: FunctionComponent<userProps> = ({ params }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const { username } = params;

    const [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(undefined);
    const [profile, setProfile] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);
    const limit = 8;

    // Fetch user profile
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

    // Fetch articles with pagination
    const fetchArticles = useCallback(async (currentPage: number, reset: boolean = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        try {
            // Calculate skip based on currentPage and limit
            const skip = currentPage * limit;
            
            const response = await fetch(`${baseUrl}/articles?skip=${skip}&limit=${limit}`, {
                method: "GET"
            });

            if (!response.ok) throw new Error("Failed to fetch articles");
            const data = await response.json();

            // Filter articles by username
            const articlesByUser = data.data.filter((article: any) => article.username === username);

            if (reset) {
                setArticles(articlesByUser);
            } else {
                setArticles(prev => {
                    const existingIds = new Set(prev.map(a => a._id));
                    const newArticles = articlesByUser.filter((a: any) => a._id && !existingIds.has(a._id));
                    return [...prev, ...newArticles];
                });
            }

            // Check if we've reached the end
            if (articlesByUser.length < limit) {
                setHasMore(false);
            }

            console.log(`Loaded ${articlesByUser.length} articles for page ${currentPage}`);

        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
            if (reset) setInitialLoading(false);
        }
    }, [baseUrl, username, limit, loading, hasMore]);

    // Load more articles (increment page)
    const loadMoreArticles = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage);
        }
    }, [loading, hasMore, page, fetchArticles]);

    // Initial data fetch
    useEffect(() => {
        const initializeData = async () => {
            setInitialLoading(true);
            setArticles([]);
            setPage(0);
            setHasMore(true);
            
            // Fetch profile and initial articles
            await fetchProfile();
            await fetchArticles(0, true);
        };

        initializeData();
    }, [username]); // Only depend on username

    // Scroll event handler
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set new timeout for debouncing
            timeoutId = setTimeout(() => {
                // Check if we're near the bottom
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;

                const nearBottom = scrollTop + windowHeight >= documentHeight - 600;

                if (nearBottom && hasMore && !loading && !initialLoading) {
                    loadMoreArticles();
                }
            }, 100);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [loadMoreArticles, hasMore, loading, initialLoading]);

    // Fetch avatar when profile is available
    useEffect(() => {
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

        if (profile && profile.data && profile.data[0]) {
            getAvatar();
        }
    }, [profile, baseUrl]);

    // // Debug logging
    // useEffect(() => {
    //     console.log("Articles: ", articles);
    //     console.log("Profile: ", profile);
    //     console.log("Page: ", page);
    //     console.log("HasMore: ", hasMore);
    // }, [articles, profile, page, hasMore]);

    return (
        <>
            <div className={styles.headerProfile}>
                <div className={styles.title}>
                    <h1>Profile</h1>
                </div>
                <div className={styles.contentProfile}>
                    <div className={styles.avatar}>
                        <Avatar sx={{ width: 100, height: 100 }} alt={profile?.username} src={avatarSrc} />
                    </div>
                    <div className={styles.textProfile}>
                        <div style={{ fontWeight: "bold" }}>{username || "Guest"}</div>
                        <div>Age: {profile?.data[0]?.age}</div>
                    </div>
                </div>
            </div>
            
            <div className={styles.content}>
                {articles.length > 0 ? (
                    <Grid container spacing={2} style={{ padding: "50px 100px" }}>
                        {articles.map((article) => (
                            <Grid item xs={6} lg={3} key={article._id} className={styles.card}>
                                <Link href={`/user/${username}/${article._id}`} className={styles.cardLink}>
                                    <div className={styles.cardBorder}>
                                        <img
                                            src={
                                                Array.isArray(article.image)
                                                    ? `${baseUrl}/articles/images/${article.image[0]}`
                                                    : `${baseUrl}/articles/images/${article.image}`
                                            }
                                            alt={article.title}
                                            style={{
                                                borderRadius: "10px 10px 0 0",
                                                height: "200px",
                                                width: "100%",
                                                objectFit: "cover"
                                            }}
                                            loading="lazy"
                                        />
                                        <div className={styles.articlesTitle}>
                                            <p>{article.title}</p>
                                        </div>
                                        <div className={styles.articlesContent}>
                                            <p>
                                                {article.content.length > 100
                                                    ? article.content.substring(0, 100) + '...'
                                                    : article.content}
                                            </p>
                                        </div>
                                        <div className={styles.articlesAuthor}>
                                            <p>
                                                {article.username} -{" "}
                                                <span>{new Date(article.date).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    !initialLoading && <div className={styles.center}>No articles found</div>
                )}
                
                {(loading || initialLoading) && (
                    <div style={{
                        textAlign: "center",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        padding: "20px"
                    }}>
                        <CircularProgress size={50} />
                    </div>
                )}
            </div>
        </>
    );
};

export default user;