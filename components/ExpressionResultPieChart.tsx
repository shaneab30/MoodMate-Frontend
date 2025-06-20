'use client';
import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
import { Box, CircularProgress, LinearProgress } from '@mui/material';


interface EmotionRecord {
    _id: string;
    username: string;
    date: string; // ISO date string
    emotion: string;
}

const EmotionPieChart = () => {
    const [user, setUser] = useState<any>(null);
    const [emotions, setEmotions] = useState<EmotionRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const countEmotions = (records: EmotionRecord[]) => {
        const counts: Record<string, number> = {};

        records.forEach((record) => {
            const emotion = record.emotion.toLowerCase();
            counts[emotion] = (counts[emotion] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    useEffect(() => {
        const fetchEmotions = async () => {
            setLoading(true);
            const localUser = JSON.parse(localStorage.getItem("user")!);
            setUser(localUser);

            try {
                const url = "http://127.0.0.1:5000/emotions";
                const response = await fetch(url, {
                    headers: {
                        'Accept': "application/json, text/plain, */*",
                        'Content-Type': "application/json;charset=utf-8"
                    },
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const userEmotions = data.data.filter((emotion: EmotionRecord) => emotion.username === localUser.username);

                const now = new Date();
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 6);

                const filtered = userEmotions.filter((record: EmotionRecord) => {
                    const recordDate = new Date(record.date);
                    return recordDate >= oneWeekAgo && recordDate <= now;
                });

                filtered.sort((a: EmotionRecord, b: EmotionRecord) => new Date(a.date).getTime() - new Date(b.date).getTime());
                console.log("Filtered Emotions:", filtered);
                setEmotions(filtered);

            } catch (error) {
                console.error("Error fetching emotions:", error);
            }
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };

        fetchEmotions();
    }, []);

    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Emotions',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10,
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: countEmotions(emotions)
            }
        ]
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%' , display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default EmotionPieChart;
