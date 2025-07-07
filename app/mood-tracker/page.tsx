'use client';
import { FunctionComponent, useEffect, useState } from "react";
import ExpressionResultPieChart from "@/components/ExpressionResultPieChart";
import { Button, ButtonGroup } from "@mui/material";
import styles from "./page.module.css";
import HappinessGauge from "@/components/HappinessGauge";
import { Grid, Box } from '@mui/material';
import { Calendar } from "@fullcalendar/core/index.js";
import CalendarTracker from "@/components/CalendarTracker";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

interface MoodTrackerProps {

}

const MoodTracker: FunctionComponent<MoodTrackerProps> = () => {

    const [user, setUser] = useState<any>(null);

    const [submittedToday, setSubmittedToday] = useState(false);

    const [refreshGauge, setRefreshGauge] = useState(false);

    const router = useRouter();
    
    const currentUser = useAppSelector((state) => state.user.currentUser);

    useEffect(() => {
        if (!currentUser) {
            router.push('/sign-in');
        }
    }, [currentUser]);

    if (!currentUser) {
        return null;
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            console.log("No user data found");
        }

        const today = new Date().toISOString().slice(0, 10);
        const lastSubmit = localStorage.getItem('lastHappinessSubmit');

        if (lastSubmit === today) {
            setSubmittedToday(true);
        }
    }, []);


    const postHappiness = async (level: string) => {
        try {
            const url = "http://54.169.29.154:5000//happiness";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user.username,
                    date: new Date().toISOString(),
                    level: level
                })
            })
            const today = new Date().toISOString().slice(0, 10);
            const data = await response.json();
            // console.log(data);
            localStorage.setItem('lastHappinessSubmit', today);
            setSubmittedToday(true);
            setRefreshGauge(r => !r); 
            
        } catch (error) {
            console.log(error);
        }
    };

    return (<>
        <div className={styles.container}>
            <h1 className={styles.title}>Mood Tracker</h1>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <p className={styles.description}>
                            Last 7 days of your expression tracking results.
                        </p>
                        <ExpressionResultPieChart />
                        <p className={styles.description}>
                            This chart visualizes the emotions you've tracked over the past week.
                        </p>
                        <HappinessGauge refresh={refreshGauge}/>
                        <p className={styles.description}>
                            How are you feeling today?
                        </p>
                        <ButtonGroup
                            variant="text"
                            aria-label="Mood button group"
                            sx={{
                                gap: 2, // spacing between buttons (theme spacing units)
                                '& .MuiButton-root': {
                                    fontSize: '2rem', // make emojis big
                                    minWidth: '40px', // optional: make buttons rounder
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
                            <p className={styles.description} style={{ color: "green" }}>
                                You have already submitted your mood for today!
                            </p>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <CalendarTracker />
                </Grid>
            </Grid>

        </div>

    </>);
}

export default MoodTracker;