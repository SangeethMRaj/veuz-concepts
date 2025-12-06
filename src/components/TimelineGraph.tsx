import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { useState } from 'react';

export interface TimeSegment {
    color: string;
    label: string;
    status: 'work' | 'idle' | 'neutral' | 'productive' | 'unproductive'; // Extended status types
    from: string;
    to: string;
    duration?: number;
}

interface TimelineGraphProps {
    segments: Record<string, TimeSegment>;
    onIdleClick: (key: string, segment: TimeSegment) => void;
}

// Filter payload to find the relevant segment if possible, or rely on hoveredKey
interface TooltipContentProps {
    active?: boolean;
    segments: Record<string, TimeSegment>;
    hoveredKey: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TooltipContent = ({ active, segments, hoveredKey }: TooltipContentProps) => {
    if (active && hoveredKey && segments[hoveredKey]) {
        const seg = segments[hoveredKey];
        const duration = seg.duration || 0;

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        const seconds = 0;

        const pad = (n: number) => n < 10 ? `0${n}` : n;
        const timeString = `${pad(hours)}h:${pad(minutes)}m:${pad(seconds)}s`;

        let label = 'Online';
        if (seg.status === 'idle') label = 'Idle';
        else if (seg.status === 'neutral') label = 'Neutral';
        else if (seg.status === 'unproductive') label = 'Unproductive';
        // 'work' and 'productive' are already 'Online' (default)

        return (
            <div style={{
                backgroundColor: 'rgba(33, 33, 33, 0.9)', // Dark grey/black
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap'
            }}>
                {timeString} - {label}
            </div>
        );
    }
    return null;
};

const TimelineGraph = ({ segments, onIdleClick }: TimelineGraphProps) => {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const dataObj: any = { name: 'Timeline' };
    Object.keys(segments).forEach(key => {
        if (segments[key].duration) {
            dataObj[key] = segments[key].duration;
        } else {
            dataObj[key] = 0;
        }
    });

    const data = [dataObj];

    const handleClick = (key: string) => {
        const seg = segments[key];
        if (seg.status === 'idle') {
            onIdleClick(key, seg);
        }
    };

    // To render ticks as hours (9AM, 10AM...), we need a domain of 0 to 540 (9 hours * 60)
    // Ticks every 60
    const ticks = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540];
    const formatTick = (tick: number) => {
        const hour = 9 + (tick / 60);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour > 12 ? hour - 12 : hour;
        return `${h < 10 ? '0' + h : h}${ampm}`;
    }

    return (
        <div style={{ width: '100%', height: 100, padding: 0, background: 'transparent' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
                    barSize={40}
                >
                    <XAxis
                        type="number"
                        domain={[0, 540]}
                        ticks={ticks}
                        tickFormatter={formatTick}
                        stroke="#999"
                        fontSize={10}
                        tickLine={true}
                        axisLine={true}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={30} // Match ActivityGraph YAxis width for alignment
                        tick={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={<TooltipContent segments={segments} hoveredKey={hoveredKey} />}
                    />

                    {Object.keys(segments).map((key) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            stackId="timeline"
                            fill={segments[key].color}
                            onClick={() => handleClick(key)}
                            onMouseEnter={() => setHoveredKey(key)}
                            onMouseLeave={() => setHoveredKey(null)}
                            style={{ cursor: segments[key].status === 'idle' ? 'pointer' : 'default' }}
                        >
                            <Cell fill={segments[key].color} />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimelineGraph;
