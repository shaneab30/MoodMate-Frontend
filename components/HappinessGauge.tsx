'use client';
import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
import { Box, CircularProgress, LinearProgress } from '@mui/material';

interface HappinessRecord {
    _id: string;
    username: string;
    date: string; // ISO date string
    level: string;
}

const HappinessGauge = () => {
    const [user, setUser] = useState<any>(null);
    const [happiness, setHappiness] = useState<HappinessRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const countHappiness = (records: HappinessRecord[]) => {
        const counts: Record<string, number> = {};

        records.forEach((record) => {
            const level = record.level.toLowerCase();
            counts[level] = (counts[level] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    const fetchHappiness = async () => {
        setLoading(true);
        const localUser = JSON.parse(localStorage.getItem("user")!);
        setUser(localUser);

        try {
            const url = "http://127.0.0.1:5000/happiness";
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
            const userHappiness = data.data.filter((happiness: HappinessRecord) => happiness.username === localUser.username);

            const now = new Date();
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 6);

            const filtered = userHappiness.filter((record: HappinessRecord) => {
                const recordDate = new Date(record.date);
                return recordDate >= oneWeekAgo && recordDate <= now;
            });

            filtered.sort((a: HappinessRecord, b: HappinessRecord) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setHappiness(filtered);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const average =
        happiness.length > 0
            ? Math.round(
                happiness.reduce((sum, record) => sum + Number(record.level), 0) / happiness.length
            )
            : 0;

    useEffect(() => {
        fetchHappiness();
    }, []);

    const option = {
        series: [
            {
                type: 'gauge',
                progress: {
                    show: true,
                    width: 10
                },
                axisLine: {
                    lineStyle: {
                        width: 10
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 12,
                    color: '#999',
                    fontSize: 10
                },
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 15,
                    itemStyle: {
                        borderWidth: 10
                    }
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 40,
                    offsetCenter: [0, '70%']
                },
                data: [
                    {
                        value: average
                    }
                ]
            }
        ]
    };



    if (loading) {
        return (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={4}
        >
            <ReactECharts option={option} style={{ height: 300, width: 300 }} />
            <p style={{ fontWeight: 'bold', fontSize: '24px', marginTop: '0px', color: 'black' }}>
                Happiness Meter
            </p>
        </Box>

    );
};

export default HappinessGauge;
