"use client";

import { useState, useEffect, useMemo } from "react";
import { Horizon } from "@stellar/stellar-sdk";
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Clock, Search, ShieldCheck, Inbox } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

const short = (a) => (a ? `${a.slice(0, 4)}…${a.slice(-4)}` : "");
const fmt = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });

const FILTER_TABS = [
    { id: "all", label: "All" },
    { id: "sent", label: "Sent" },
    { id: "received", label: "Received" },
    { id: "escrow", label: "Escrow" },
];

export default function Activity({ address }) {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        if (!address) {
            setIsLoading(false);
            return;
        }

        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch recent payments (which includes sends, receives, and operations)
                const payments = await server.payments()
                    .forAccount(address)
                    .order("desc")
                    .limit(50)
                    .call();
                
                setTransactions(payments.records);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Could not load transaction history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [address]);

    // Combined search and tab filter
    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const isSent = tx.source_account === address || tx.from === address;
            const isEscrow = tx.type?.toLowerCase().includes("claimable") || 
                             tx.type?.toLowerCase().includes("escrow") ||
                             tx.memo?.toLowerCase()?.includes("escrow");

            // Determine transaction category type
            let txType = isSent ? "sent" : "received";
            if (isEscrow) txType = "escrow";

            // 1. Tab Filter
            if (activeFilter !== "all") {
                if (activeFilter === "escrow" && !isEscrow) return false;
                if (activeFilter === "sent" && (isEscrow || !isSent)) return false;
                if (activeFilter === "received" && (isEscrow || isSent)) return false;
            }

            // 2. Search Query (Address or Amount)
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase().trim();
                const counterparty = (isSent ? (tx.to || tx.funder) : (tx.from || tx.source_account)) || "";
                const amount = String(tx.amount || "");
                const sourceAcc = String(tx.source_account || "");
                const txHash = String(tx.transaction_hash || "");

                const matchesAddress = counterparty.toLowerCase().includes(query) || sourceAcc.toLowerCase().includes(query) || txHash.toLowerCase().includes(query);
                const matchesAmount = amount.includes(query);

                if (!matchesAddress && !matchesAmount) {
                    return false;
                }
            }

            return true;
        });
    }, [transactions, activeFilter, searchQuery, address]);

    return (
        <div className="activity-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '500', marginBottom: '24px', color: '#fff' }}>Activity History</h2>
            
            {/* Search Bar & Filter Tabs */}
            {address && !isLoading && !error && transactions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                        <input
                            type="text"
                            placeholder="Search by address, hash, or amount (e.g. 0.5)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 46px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, background 0.2s',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                            }}
                        />
                    </div>

                    {/* Filter Chips */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {FILTER_TABS.map((tab) => {
                            const isActive = activeFilter === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveFilter(tab.id)}
                                    style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                                        background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                                        color: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.6)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {!address ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Clock size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '16px', display: 'inline-block' }} />
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>No wallet connected</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Connect your wallet to view your transaction history.</p>
                </div>
            ) : isLoading ? (
                <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : error ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <p style={{ color: '#ff4d4d' }}>{error}</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Clock size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '16px', display: 'inline-block' }} />
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>No activity yet</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Your recent transactions will appear here.</p>
                </div>
            ) : filteredTransactions.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <Inbox size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '16px', display: 'inline-block' }} />
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>No matching transactions</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                        No results found for &ldquo;{searchQuery}&rdquo; in {activeFilter} transactions.
                    </p>
                </div>
            ) : (
                <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredTransactions.map((tx) => {
                        const isSent = tx.source_account === address || tx.from === address;
                        const isEscrow = tx.type?.toLowerCase().includes("claimable") || 
                                         tx.type?.toLowerCase().includes("escrow") ||
                                         tx.memo?.toLowerCase()?.includes("escrow");
                        const isPayment = tx.type === 'payment' || tx.type === 'path_payment_strict_receive' || tx.type === 'path_payment_strict_send';
                        
                        let amount = tx.amount || "0";
                        let assetCode = tx.asset_code || (tx.asset_type === "native" ? "XLM" : "Asset");
                        let counterparty = isSent ? (tx.to || tx.funder) : (tx.from || tx.source_account);
                        
                        const date = new Date(tx.created_at).toLocaleString(undefined, { 
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });

                        return (
                            <div key={tx.id} className="activity-card" style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                transition: 'transform 0.2s, background 0.2s',
                                cursor: 'default',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: isEscrow ? 'rgba(56, 189, 248, 0.1)' : isSent ? 'rgba(255,255,255,0.05)' : 'rgba(34, 197, 94, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isEscrow ? '#38bdf8' : isSent ? 'rgba(255,255,255,0.8)' : '#22c55e',
                                        flexShrink: 0
                                    }}>
                                        {isEscrow ? <ShieldCheck size={24} /> : isSent ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '500', color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>
                                            {isEscrow ? "Escrow" : isSent ? "Sent" : "Received"} {isPayment ? assetCode : 'Asset'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                            {date} • {isSent ? 'To' : 'From'}: {short(counterparty)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ 
                                        fontWeight: '600', 
                                        fontSize: '1.15rem', 
                                        color: isEscrow ? '#38bdf8' : isSent ? '#fff' : '#22c55e',
                                        marginBottom: '6px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {isEscrow ? '' : isSent ? '-' : '+'}{fmt(amount)} {assetCode}
                                    </div>
                                    <a 
                                        href={`https://stellar.expert/explorer/testnet/tx/${tx.transaction_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
                                            textDecoration: 'none', transition: 'color 0.2s',
                                            padding: '4px 8px', borderRadius: '4px',
                                            background: 'rgba(255,255,255,0.05)'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                                        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                                    >
                                        View on Explorer <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}