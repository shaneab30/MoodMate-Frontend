'use client';
import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import ExpressionResultPieChart from "@/components/ExpressionResultPieChart";
import HappinessGauge from "@/components/HappinessGauge";
import CalendarTracker from "@/components/CalendarTracker";
import styles from "./page.module.css";
import { Button, ButtonGroup, Grid, Box, Typography, Fade, Paper, Chip } from "@mui/material";
import { CalendarMonth, Psychology } from "@mui/icons-material";

const MoodTracker: FunctionComponent = () => {
    const [user, setUser] = useState<any>(null);
    const [submittedToday, setSubmittedToday] = useState(false);
    const [refreshGauge, setRefreshGauge] = useState(false);
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
            setUser(JSON.parse(storedUser));
        }

        const today = new Date().toISOString().slice(0, 10);
        const lastSubmit = localStorage.getItem('lastHappinessSubmit');
        if (lastSubmit === today) {
            setSubmittedToday(true);
        }
    }, []);

    const postHappiness = async (level: string) => {
        try {
            const url = baseUrl + "/happiness";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    username: user?.username,
                    date: new Date().toISOString(),
                    level: level
                })
            });
            const today = new Date().toISOString().slice(0, 10);
            await response.json();
            localStorage.setItem('lastHappinessSubmit', today);
            setSubmittedToday(true);
            setRefreshGauge(r => !r);
        } catch (error) {
            console.log(error);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Fade in timeout={600}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            color: 'black',
                            fontWeight: 700,
                            mb: 1,
                            fontSize: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        Mood Tracker
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(0, 0, 0, 0.9)',
                            fontWeight: 300
                        }}
                    >
                        Track your emotions and visualize your wellbeing journey
                    </Typography>
                </Box>
            </Fade>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Fade in timeout={1000}>
                        <Paper
                            elevation={8}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                height: '100%'
                            }}
                        >
                            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                <Psychology sx={{ mr: 1, color: '#667eea', fontSize: '3rem' }} />
                                <Typography variant="h5" fontWeight={600}>
                                    Daily Check-in
                                </Typography>
                                <p className={styles.description}>Last 7 days of your expression tracking results.</p>
                                <ExpressionResultPieChart />
                                <p className={styles.description}>This chart visualizes the emotions you've tracked over the past week.</p>
                                <HappinessGauge refresh={refreshGauge} />
                                <p className={styles.description}>How are you feeling today?</p>
                                <ButtonGroup
                                    variant="text"
                                    aria-label="Mood button group"
                                    sx={{
                                        gap: 2,
                                        '& .MuiButton-root': {
                                            fontSize: '2rem',
                                            minWidth: '40px',
                                            padding: '12px',
                                            borderRadius: '55%',
                                            lineHeight: 1,
                                            backgroundColor: 'lightgray',
                                            '&:hover': {
                                                backgroundColor: 'gray',
                                            },
                                            border: 'none',
                                        },
                                    }}
                                >
                                    <Button disabled={submittedToday} onClick={() => postHappiness("0")}>☹️</Button>
                                    <Button disabled={submittedToday} onClick={() => postHappiness("25")}>🙁</Button>
                                    <Button disabled={submittedToday} onClick={() => postHappiness("50")}>😐</Button>
                                    <Button disabled={submittedToday} onClick={() => postHappiness("75")}>🙂</Button>
                                    <Button disabled={submittedToday} onClick={() => postHappiness("100")}>😃</Button>
                                </ButtonGroup>
                                {submittedToday && (
                                    <Fade in>
                                        <Chip
                                            label="✓ Mood logged for today!"
                                            color="success"
                                            sx={{
                                                mt: 2,
                                                width: '100%',
                                                py: 2,
                                                fontSize: '0.95rem',
                                                fontWeight: 500
                                            }}
                                        />
                                    </Fade>
                                )}
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Fade in timeout={1000}>
                        <Paper
                            elevation={8}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                height: '100%'
                            }}
                        >
                            <CalendarMonth sx={{ mr: 1, color: '#667eea', fontSize: '3rem' }} />
                            <Typography variant="h5" fontWeight={600}>
                                Mood Calendar
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                View your mood patterns over time
                            </Typography>
                            <CalendarTracker />
                        </Paper>
                    </Fade>
                </Grid>
            </Grid>
        </div>
    );
};

export default MoodTracker;
