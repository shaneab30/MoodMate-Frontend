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

    // Single function to fetch articles
    const fetchArticles = useCallback(async (currentPage: number) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/articles?skip=${currentPage * limit}&limit=${limit}`, {
                method: "GET"
            });

            if (!response.ok) throw new Error("Failed to fetch articles");
            const data = await response.json();

            // console.log("Fetching page", currentPage);
            // console.log("Fetched data:", data);
            // console.log("Articles returned:", data.data?.length);

            if (data.data && Array.isArray(data.data)) {
                if (currentPage === 0) {
                    // Initial load - replace articles
                    setArticles(data.data);
                } else {
                    // Pagination - append articles
                    setArticles(prev => {
                        const existingIds = new Set(prev.map(a => a._id));
                        const newArticles = data.data.filter((a: any) => a._id && !existingIds.has(a._id));
                        return [...prev, ...newArticles];
                    });
                }

                // Check if we've reached the end
                if (!data.data || data.data.length < limit) {
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

    // Load more articles function
    const loadMoreArticles = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArticles(nextPage);
        }
    }, [page, loading, hasMore, fetchArticles]);

    // Initial fetch
    useEffect(() => {
        fetchArticles(0);
    }, []); // Remove fetchArticles from dependency to avoid re-fetching

    // Scroll handler with throttling
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;

                const nearBottom = scrollTop + windowHeight >= documentHeight - 800;

                if (nearBottom && hasMore && !loading) {
                    loadMoreArticles();
                }
            }, 200); // Increased debounce time to prevent too frequent calls
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
                                <Link href={`/user/${article.username}/${article._id}`}>
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