'use client';
import { FunctionComponent } from "react";
import ExpressionResultPieChart from "@/components/ExpressionResultPieChart";

interface MoodTrackerProps {
    
}
 
const MoodTracker: FunctionComponent<MoodTrackerProps> = () => {
    return ( <>
    <h1 style={{ textAlign: 'center', color: 'black', fontSize: '50px', padding: '20px'}}>Mood Tracker</h1>
    <p style={{ textAlign: 'center', color: 'black', fontSize: '20px', padding: '20px'}}>
        Last 7 days of your expression tracking results.
    </p>
    <ExpressionResultPieChart />
    <p style={{ textAlign: 'center', color: 'black', fontSize: '20px', padding: '20px'}}>
        This chart visualizes the emotions you've tracked over the past week.
    </p>
    
    </> );
}
 
export default MoodTracker;