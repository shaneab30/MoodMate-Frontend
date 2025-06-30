'use client';
import { FunctionComponent } from "react";
import ExpressionResultPieChart from "@/components/ExpressionResultPieChart";
import { Button, ButtonGroup } from "@mui/material";
import styles from "./page.module.css";

interface MoodTrackerProps {

}

const MoodTracker: FunctionComponent<MoodTrackerProps> = () => {

    const submitMood = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/mood-tracker', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data);
    };

    return (<>
        <div className={styles.container}>
            <h1 className={styles.title}>Mood Tracker</h1>
            <div className={styles.row}>
                <div className={styles.column}>
                    <p className={styles.description}>
                        Last 7 days of your expression tracking results.
                    </p>
                    <ExpressionResultPieChart />
                    <p className={styles.description}>
                        This chart visualizes the emotions you've tracked over the past week.
                    </p>
                </div>
                <div className={styles.column}>
                    <p className={styles.description}>
                        How are you feeling today?
                    </p>
                    <ButtonGroup
                        variant="text"
                        aria-label="Mood button group"
                        sx={{
                            gap: 2, // spacing between buttons (theme spacing units)
                            '& .MuiButton-root': {
                                fontSize: '3rem', // make emojis big
                                minWidth: '64px', // optional: make buttons rounder
                                padding: '12px',
                                borderRadius: '50%',
                                lineHeight: 1,
                                backgroundColor: 'lightgray',
                                '&:hover': {
                                    backgroundColor: 'gray',
                                },
                                border: 'none',
                            },
                        }}
                    >
                        <Button>☹️</Button>
                        <Button>🙁</Button>
                        <Button>😐</Button>
                        <Button>🙂</Button>
                        <Button>😃</Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>

    </>);
}

export default MoodTracker;