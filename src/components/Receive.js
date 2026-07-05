"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Copy, CheckCircle2, AlertCircle } from "lucide-react";

export default function Receive({ address }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!address) {
        return (
            <div className="receive-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '500', marginBottom: '24px', color: '#fff' }}>Receive Funds</h2>
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <AlertCircle size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '16px', display: 'inline-block' }} />
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>No wallet connected</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Connect your wallet to see your receive address and QR code.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="receive-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '500', marginBottom: '24px', color: '#fff' }}>Receive Funds</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                {/* Card 1: QR Code */}
                <div className="receive-card" style={{
                    padding: '32px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '16px',
                        marginBottom: '24px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }}>
                        <QRCode
                            value={address}
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
                        Scan this QR code to receive payments.
                    </p>
                </div>

                {/* Card 2: Address Details */}
                <div className="receive-card" style={{
                    padding: '32px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', fontWeight: '500' }}>Your Stellar Address</h3>
                    
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        marginBottom: '24px',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                    }}>
                        {address}
                    </div>

                    <button 
                        onClick={handleCopy}
                        className={`btn ${copied ? 'btn-glass-primary' : 'btn-primary'}`}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            background: copied ? 'rgba(34, 197, 94, 0.2)' : 'var(--primary)',
                            color: copied ? '#22c55e' : '#000',
                            border: copied ? '1px solid rgba(34, 197, 94, 0.5)' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 size={18} /> Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={18} /> Copy Address
                            </>
                        )}
                    </button>

                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        background: 'rgba(234, 179, 8, 0.1)',
                        border: '1px solid rgba(234, 179, 8, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                    }}>
                        <AlertCircle size={20} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                            <strong style={{ color: '#eab308' }}>Important:</strong> Send only Stellar (XLM) or supported Stellar network assets to this address. Sending other assets may result in permanent loss.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
