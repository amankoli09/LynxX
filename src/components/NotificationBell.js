import { Bell } from "lucide-react";

export default function NotificationBell({ 
    notifications, 
    setNotifications, 
    showNotifications, 
    setShowNotifications 
}) {
    return (
        <div style={{ position: 'relative' }}>
            <button 
                className="bento-icon-btn" 
                style={{ 
                    background: 'none', border: 'none', color: '#fff', cursor: 'pointer', 
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }} 
                onClick={() => { 
                    setShowNotifications(!showNotifications); 
                    setNotifications(notifications.map(n => ({...n, read: true})));
                }}
            >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                    <span style={{ 
                        position: 'absolute', top: '6px', right: '6px', width: '8px', 
                        height: '8px', background: '#ef4444', borderRadius: '50%' 
                    }}></span>
                )}
            </button>
            
            {showNotifications && (
                <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '12px',
                    width: '320px', background: 'var(--card-bg, #1c1c1e)', border: '1px solid var(--border, #333)',
                    borderRadius: '16px', padding: '16px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h4 style={{ 
                        margin: '0 0 12px 0', fontSize: '1.05rem', color: '#fff', 
                        paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' 
                    }}>Notifications</h4>
                    
                    {notifications.length === 0 ? (
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center', padding: '16px 0' }}>
                            No new notifications
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                            {notifications.map(n => (
                                <div key={n.id} style={{ 
                                    padding: '12px', background: 'rgba(255,255,255,0.03)', 
                                    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' 
                                }}>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#fff' }}>{n.text}</p>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{n.date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
