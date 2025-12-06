import { useState } from 'react';
import ActivityGraph from '../components/ActivityGraph';
import TimelineGraph, { type TimeSegment } from '../components/TimelineGraph';
import OfflineRequestModal from '../components/OfflineRequestModal';
import './MachineTest.css';

const MachineTest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSegmentKey, setSelectedSegmentKey] = useState<string | null>(null);
    const [selectedIdleSegment, setSelectedIdleSegment] = useState<TimeSegment | null>(null);

    // Initial Segments Data (Lifted from TimelineGraph)
    // Note: We've added explicit durations for data generation logic.
    const [segments, setSegments] = useState<Record<string, TimeSegment>>({
        seg1: { color: '#2196f3', label: 'Work', status: 'work', from: '09:00 AM', to: '10:00 AM', duration: 60 },
        seg2: { color: '#e0e0e0', label: 'Idle', status: 'idle', from: '10:00 AM', to: '10:30 AM', duration: 30 },
        seg3: { color: '#2196f3', label: 'Work', status: 'work', from: '10:30 AM', to: '11:00 AM', duration: 30 },
        seg4: { color: '#2196f3', label: 'Work', status: 'work', from: '11:00 AM', to: '01:00 PM', duration: 120 },
        seg5: { color: '#cfd8dc', label: 'Idle', status: 'idle', from: '01:00 PM', to: '02:00 PM', duration: 60 },
        seg6: { color: '#2196f3', label: 'Work', status: 'work', from: '02:00 PM', to: '02:30 PM', duration: 30 },
        seg7: { color: '#cfd8dc', label: 'Idle', status: 'idle', from: '02:30 PM', to: '03:00 PM', duration: 30 },
        seg8: { color: '#2196f3', label: 'Work', status: 'work', from: '03:00 PM', to: '06:00 PM', duration: 180 },
    });

    const handleIdleClick = (key: string, segment: TimeSegment) => {
        setSelectedSegmentKey(key);
        setSelectedIdleSegment(segment);
        setIsModalOpen(true);
    };

    const handleSaveRequest = (productivity: string) => {
        if (!selectedSegmentKey) return;

        // Update the specific segment
        setSegments(prev => {
            const updated = { ...prev };
            const segment = updated[selectedSegmentKey];

            // Map productivity to status and color
            let newStatus: TimeSegment['status'] = 'neutral';
            let newColor = '#cfd8dc'; // default neutral grey

            if (productivity === 'productive') {
                newStatus = 'work'; // or 'productive' if we want to distinguish requested vs actual work
                newColor = '#4caf50'; // Green
            } else if (productivity === 'unproductive') {
                newStatus = 'unproductive';
                newColor = '#ff9800'; // Orange
            } else if (productivity === 'neutral') {
                newStatus = 'neutral';
                newColor = '#cfd8dc'; // Grey
            }

            updated[selectedSegmentKey] = {
                ...segment,
                status: newStatus,
                color: newColor,
                label: productivity.charAt(0).toUpperCase() + productivity.slice(1) // Capitalize
            };

            return updated;
        });
    };

    return (
        <div className="machine-test-container">
            <header className="page-header">
                <h1>Dashboard</h1>
            </header>

            {/* Combined Graph Container */}
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                padding: '20px',
                // maxWidth: '1000px', // Optional max-width
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0' // Critical for alignment
            }}>
                {/* Header Legend */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Tracked Hours</h3>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }} /> Productive</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#cfd8dc' }} /> Neutral</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff9800' }} /> Unproductive</div>
                    </div>
                </div>

                {/* Top Graph: Activity */}
                <div style={{ height: '300px', width: '100%' }}>
                    <ActivityGraph segments={segments} />
                </div>

                <div style={{ height: '60px', width: '100%', marginTop: '-5px' }}>
                    <TimelineGraph segments={segments} onIdleClick={handleIdleClick} />
                </div>
            </div>

            <OfflineRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                startTime={selectedIdleSegment?.from || ''}
                endTime={selectedIdleSegment?.to || ''}
                onSave={handleSaveRequest}
            />
        </div>
    );
};

export default MachineTest;
