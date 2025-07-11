'use client';
import * as React from 'react';
import { FunctionComponent, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

interface ArticlesPageProps { }

const ArticlesPage: FunctionComponent<ArticlesPageProps> = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [articles, setArticles] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const limit = 8;

    const fetchArticles = useCallback(async (currentPage: number) => {
        if (loading || !hasMore) return; // Prevent multiple simultaneous requests

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/articles?skip=${currentPage * limit}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                },
                method: "GET"
            });

            if (!response.ok) throw new Error("Failed to fetch articles");
            const data = await response.json();

            if (data.data && Array.isArray(data.data)) {
                setArticles(prev => {
                    const existingIds = new Set(prev.map(a => a._id));
                    const newArticles = data.data.filter((a: any) => a._id && !existingIds.has(a._id));
                    return [...prev, ...newArticles];
                });

                // Check if we've reached the end
                if (data.data.length < limit) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    }, [baseUrl, limit, loading, hasMore]);

    // Load more articles by incrementing page
    const loadMoreArticles = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    // Initial fetch
    useEffect(() => {
        fetchArticles(0);
    }, []);

    // Fetch articles when page changes (except initial load)
    useEffect(() => {
        if (page > 0) {
            fetchArticles(page);
        }
    }, [page, fetchArticles]);

    // Improved scroll handler with better throttling
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set new timeout
            timeoutId = setTimeout(() => {
                // Check if we're near the bottom
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;

                const nearBottom = scrollTop + windowHeight >= documentHeight - 600;

                if (nearBottom && hasMore && !loading) {
                    loadMoreArticles();
                }
            }, 100); // Reduced debounce time for better responsiveness
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [loadMoreArticles, hasMore, loading]);

    return (
        <>


            <div className={styles.content}>
                {articles.length > 0 ? (
                    <Grid container spacing={2} style={{ padding: "50px 100px" }}>
                        {articles.map((article) => (
                            <Grid item xs={6} lg={3} key={article._id} className={styles.card}>
                                <Link href={`/articles/${article.title.replace(/\s+/g, '-').toLowerCase()}?id=${article._id}`}>
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
                                            loading="lazy" // Add lazy loading for better performance
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
                    !loading && <div className={styles.center}>No articles found</div>
                )}
                {loading && (
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

export default ArticlesPage;