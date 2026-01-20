'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from 'react';


interface HappinessRecord {
    _id: string;
    username: string;
    date: string;
    level: string;
}

interface EmotionRecord {
    _id: string;
    username: string;
    date: string;
    emotion: string;
}

const CalendarTracker = () => {
    const [events, setEvents] = useState<any[]>([]);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;

            const user = JSON.parse(storedUser);
            const happinessResponse = await fetch(baseUrl + "/happiness",{
                headers: {
                    Authorization : `Bearer ${localStorage.getItem("token")}`
                },
                method: "GET",
            }
            );
            const happinessData = await happinessResponse.json();

            const emotionResponse = await fetch(baseUrl + "/emotions", {
                headers: {
                    Authorization : `Bearer ${localStorage.getItem("token")}`
                },
                method: "GET",
            });
            const emotionData = await emotionResponse.json();

            const happinessFiltered = happinessData.data.filter(
                (record: HappinessRecord) => record.username === user.username
            );

            const emotionFiltered = emotionData.data.filter(
                (record: EmotionRecord) => record.username === user.username
            );

            const happinessMapped = happinessFiltered.map((record: HappinessRecord) => ({
                title: `${getEmoji(record.level)} (${record.level})`,
                date: record.date.slice(0, 10),
                allDay: true,
            }));

            const emotionsMapped = emotionFiltered.map((record: EmotionRecord) => ({
                title: `${record.emotion}`,
                date: record.date.slice(0, 10),
                allDay: true,
            }));

            const combined = [...happinessMapped, ...emotionsMapped];
            setEvents(combined);
        };

        fetchData();
    }, []);

    const getEmoji = (level: string) => {
        const n = Number(level);
        if (n <= 20) return '😞';
        if (n <= 40) return '🙁';
        if (n <= 60) return '😐';
        if (n <= 80) return '🙂';
        return '😃';
    };

    return (
        <div style={{ width: '100%', padding: '1rem', color: 'black' }}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
            />
        </div>
    );
};

export default CalendarTracker;
