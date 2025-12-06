import { useState } from 'react';
import { X, Clock } from 'lucide-react';

interface OfflineRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    startTime: string; // e.g., "04:19:18 PM"
    endTime: string;   // e.g., "04:37:35 PM"
    defaultProductivity?: 'productive' | 'unproductive' | 'neutral';
    onSave: (productivity: string, description: string) => void;
}

const OfflineRequestModal = ({ isOpen, onClose, startTime, endTime, defaultProductivity = 'productive', onSave }: OfflineRequestModalProps) => {
    const [description, setDescription] = useState('');
    const [productivity, setProductivity] = useState(defaultProductivity);
    // In a real app, this range might be dynamic based on a slider value
    const [rangeValue, setRangeValue] = useState(50);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSave(productivity, description);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '600px',
                maxWidth: '90%',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ color: '#f44336', border: '1px solid #fbdcdb', padding: '8px', borderRadius: '8px', background: '#fdf3f2' }}>
                            <Clock size={20} />
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Offline Time</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#666" /></button>
                </div>

                {/* Time Display */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', fontWeight: '500', color: '#333' }}>
                    <span style={{ border: '1px solid #eee', padding: '8px 16px', borderRadius: '6px' }}>{startTime}</span>
                    <span style={{ display: 'flex', alignItems: 'center' }}>—</span>
                    <span style={{ border: '1px solid #eee', padding: '8px 16px', borderRadius: '6px' }}>{endTime}</span>
                </div>

                {/* Slider (Visual only for mock) */}
                <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '20px', height: '20px', background: '#ff9800', borderRadius: '4px' }}></div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={rangeValue}
                        onChange={(e) => setRangeValue(Number(e.target.value))}
                        style={{ flex: 1, accentColor: '#ff9800', height: '4px' }}
                    />
                    <div style={{ width: '20px', height: '20px', background: '#ff9800', borderRadius: '4px' }}></div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* Productivity Type */}
                <div style={{ marginBottom: '30px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Productivity</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <label style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: productivity === 'productive' ? '1px solid #4caf50' : '1px solid #ddd',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            backgroundColor: productivity === 'productive' ? '#f1f8f1' : 'white',
                            cursor: 'pointer'
                        }}>
                            <input type="radio" name="prod" checked={productivity === 'productive'} onChange={() => setProductivity('productive')} />
                            <span style={{ fontSize: '14px' }}>Productive</span>
                        </label>

                        <label style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: productivity === 'unproductive' ? '1px solid #ddd' : '1px solid #ddd',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#666'
                        }}>
                            <input type="radio" name="prod" checked={productivity === 'unproductive'} onChange={() => setProductivity('unproductive')} />
                            <span style={{ fontSize: '14px' }}>Unproductive</span>
                        </label>

                        <label style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: productivity === 'neutral' ? '1px solid #ddd' : '1px solid #ddd',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#666'
                        }}>
                            <input type="radio" name="prod" checked={productivity === 'neutral'} onChange={() => setProductivity('neutral')} />
                            <span style={{ fontSize: '14px' }}>Neutral</span>
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            background: 'white',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#ffab40',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OfflineRequestModal;
