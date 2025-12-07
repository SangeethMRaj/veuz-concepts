import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import { type TimeSegment } from './TimelineGraph';

interface ActivityData {
    timeDisplay: string;
    minutesFromStart: number;
    productive: number;
    unproductive: number;
    neutral: number;
    apps: {
        productive: string[];
        unproductive: string[];
        neutral: string[];
    };
}

interface CustomTooltipProps {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any[];
    hoveredStack?: string | null;
}

const CustomTooltip = ({ active, payload, hoveredStack }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as ActivityData;

        let entries = payload;
        if (hoveredStack) {
            entries = payload.filter((entry: any) => entry.name === hoveredStack);
        }

        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                fontSize: '12px',
                minWidth: '150px',
                zIndex: 1000
            }}>
                {entries.map((entry: any, index: number) => {
                    const type = entry.name as keyof typeof data.apps;
                    const value = entry.value as number;
                    if (value <= 0) return null;

                    const percentage = Math.round((value / 5) * 100);
                    const apps = data.apps[type] || [];
                    const color = entry.color;

                    const title = type.charAt(0).toUpperCase() + type.slice(1);

                    return (
                        <div key={index} style={{ marginBottom: index === entries.length - 1 ? 0 : '12px' }}>
                            <div style={{
                                fontWeight: 'bold',
                                marginBottom: '8px',
                                fontSize: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: `2px solid ${color}`,
                                paddingBottom: '4px'
                            }}>
                                <span>{title}</span>
                                <span>{percentage}%</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {apps.length > 0 ? apps.map((app, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                                        <span>{app}</span>
                                        
                                        <span style={{ fontWeight: '500' }}>
                                            {i === 0 ? Math.round(value * 60) + 's' : ''}
                                        </span>
                                    </div>
                                )) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                                        <span>Activity</span>
                                        <span style={{ fontWeight: '500' }}>{Math.round(value * 60)}s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                <div style={{
                    marginTop: '12px',
                    paddingTop: '8px',
                    borderTop: '1px solid #eee',
                    color: '#888',
                    fontSize: '10px',
                    fontWeight: 500
                }}>
                    {data.timeDisplay}
                </div>
            </div>
        );
    }

    return null;
};

const generateData = (segments: Record<string, TimeSegment>) => {
    const totalMinutes = 540;
    const interval = 5;
    const slots = totalMinutes / interval;

    const formatTime = (mins: number) => {
        const hour = Math.floor(mins / 60) + 9;
        const m = mins % 60;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour > 12 ? hour - 12 : hour;
        return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m} ${ampm}`;
    };

    let currentTime = 0;
    const timeline: { start: number; end: number; status: string }[] = [];
    Object.keys(segments).forEach(key => {
        const duration = segments[key].duration || 0;
        timeline.push({
            start: currentTime,
            end: currentTime + duration,
            status: segments[key].status
        });
        currentTime += duration;
    });

    const data: ActivityData[] = [];

    for (let i = 0; i < slots; i++) {
        const currentMin = i * interval;
        const segment = timeline.find(seg => currentMin >= seg.start && currentMin < seg.end);
        const status = segment ? segment.status : 'idle';

        let productive = 0;
        let unproductive = 0;
        let neutral = 0;
        const apps: ActivityData['apps'] = { productive: [], unproductive: [], neutral: [] };

        const pseudoRandom = (seed: number) => Math.abs(Math.sin(i * seed));

        if (status === 'work' || status === 'productive') {
            productive = 3.5 + pseudoRandom(1.1);
            if (pseudoRandom(2) > 0.8) {
                neutral = 0.5 + pseudoRandom(0.5);
                apps.neutral = ['Slack', 'Email'];
            }
            if (pseudoRandom(3) > 0.9) {
                unproductive = 0.5 + pseudoRandom(0.5);
                apps.unproductive = ['Social Media'];
            }
            apps.productive = ['VS Code', 'Figma'];
        } else if (status === 'neutral') {
            neutral = 3 + pseudoRandom(1.5);
            if (pseudoRandom(4) > 0.7) {
                productive = 0.5 + pseudoRandom(0.5);
                apps.productive = ['Slack'];
            }
            apps.neutral = ['Meeting'];
        } else if (status === 'unproductive') {
            unproductive = 4 + pseudoRandom(1.0);
            if (pseudoRandom(5) > 0.8) {
                neutral = 0.5;
                apps.neutral = ['Chat'];
            }
            apps.unproductive = ['Social Media', 'YouTube'];
        } else if (status === 'idle') {
            productive = 0;
            neutral = 0;
            unproductive = 0;
        }

        const total = productive + unproductive + neutral;
        if (total > 5) {
            const scale = 5 / total;
            productive *= scale;
            unproductive *= scale;
            neutral *= scale;
        }

        data.push({
            timeDisplay: formatTime(currentMin),
            minutesFromStart: currentMin,
            productive,
            unproductive,
            neutral,
            apps
        });
    }
    return data;
};

const ActivityGraph = ({ segments }: { segments: Record<string, TimeSegment> }) => {
    const activityData = generateData(segments);
    const [hoveredStack, setHoveredStack] = useState<string | null>(null);

    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={activityData}
                    
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                    barCategoryGap={1}
                >
                    <XAxis
                        dataKey="minutesFromStart"
                        type="number"
                        domain={[0, 540]}
                        hide
                    />
                    <YAxis
                        stroke="#999"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => {
                            const num = parseFloat(val);
                            const safe = Math.min(Math.max(num, 0), 5);
                            return `${Math.round((safe / 5) * 100)}%`;
                        }}
                        ticks={[0, 1.25, 2.5, 3.75, 5]}
                        domain={[0, 5]}
                        width={35} 
                    />
                    <Tooltip
                        content={<CustomTooltip hoveredStack={hoveredStack} />}
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    />

                    <Bar
                        dataKey="productive"
                        stackId="a"
                        fill="#4caf50"
                        radius={[0, 0, 0, 0]}
                        isAnimationActive={true}
                        onMouseEnter={() => setHoveredStack('productive')}
                        onMouseLeave={() => setHoveredStack(null)}
                    />
                    <Bar
                        dataKey="neutral"
                        stackId="a"
                        fill="#cfd8dc"
                        radius={[0, 0, 0, 0]}
                        isAnimationActive={true}
                        onMouseEnter={() => setHoveredStack('neutral')}
                        onMouseLeave={() => setHoveredStack(null)}
                    />
                    <Bar
                        dataKey="unproductive"
                        stackId="a"
                        fill="#ff9800"
                        radius={[2, 2, 0, 0]}
                        isAnimationActive={true}
                        onMouseEnter={() => setHoveredStack('unproductive')}
                        onMouseLeave={() => setHoveredStack(null)}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityGraph;
