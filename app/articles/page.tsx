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
            <div className={styles.pageWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Discover Articles</h1>
                    <p className={styles.pageSubtitle}>
                        Explore insights and stories from our community
                    </p>
                </div>

                <div className={styles.content}>
                    {articles.length > 0 ? (
                        <Grid container spacing={3} className={styles.articlesGrid}>
                            {articles.map((article) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={article._id} className={styles.card}>
                                    <Link href={`/user/${article.username}/${article._id}`} className={styles.cardLink}>
                                        <div className={styles.cardBorder}>
                                            <div className={styles.imageWrapper}>
                                                <img
                                                    src={
                                                        Array.isArray(article.image)
                                                            ? `${baseUrl}/articles/images/${article.image[0]}`
                                                            : `${baseUrl}/articles/images/${article.image}`
                                                    }
                                                    alt={article.title}
                                                    className={styles.articleImage}
                                                    loading="lazy"
                                                />
                                                <div className={styles.imageOverlay}></div>
                                            </div>
                                            <div className={styles.cardContent}>
                                                <h3 className={styles.articlesTitle}>{article.title}</h3>
                                                <p className={styles.articlesContent}>
                                                    {article.content.length > 100
                                                        ? article.content.substring(0, 100) + '...'
                                                        : article.content}
                                                </p>
                                                <div className={styles.articlesFooter}>
                                                    <div className={styles.articlesAuthor}>
                                                        <span className={styles.authorName}>{article.username}</span>
                                                        <span className={styles.articleDate}>
                                                            {new Date(article.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        !loading && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyStateIcon}>📚</div>
                                <h2 className={styles.emptyStateTitle}>No Articles Yet</h2>
                                <p className={styles.emptyStateText}>
                                    Check back soon for new content from our community
                                </p>
                            </div>
                        )
                    )}
                    {loading && (
                        <div className={styles.loadingWrapper}>
                            <CircularProgress size={50} thickness={4} />
                            <p className={styles.loadingText}>Loading articles...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ArticlesPage;