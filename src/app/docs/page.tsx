"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home, Share2, Layers, Rocket, Terminal, HelpCircle, Book,
    FileText, Sparkles, Wallet, Zap, Shield, GitBranch, Code2,
    CheckCircle2, ArrowRight, Database, Globe, Lock, Activity,
    ChevronRight, Star, AlertCircle
} from 'lucide-react';
const GithubIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12.5C24 5.9 18.6.5 12 .5z"/></svg>
);
import maincatImg from '../../media/maincat.png';
import bronzeImg from '../../media/bronze.png';
import silverImg from '../../media/silver.png';
import goldImg from '../../media/gold.png';
import lockImg from '../../media/lock1.png';
import smallpieceImg from '../../media/smallpiece.png';

const SECTIONS = [
    { id: "getting-started", title: "Getting Started", icon: Home },
    { id: "architecture", title: "Architecture", icon: Share2 },
    { id: "smart-contracts", title: "Smart Contracts", icon: Layers },
    { id: "wallet-integration", title: "Wallet Integration", icon: Wallet },
    { id: "api-reference", title: "API Reference", icon: Terminal },
    { id: "tech-stack", title: "Tech Stack", icon: Code2 },
];

// Scroll-animate hook
function useScrollAnimation() {
    const [visible, setVisible] = useState<Set<string>>(new Set());
    const refs = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisible(prev => new Set([...Array.from(prev), entry.target.id]));
                    }
                });
            },
            { threshold: 0.08 }
        );
        refs.current.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const register = (id: string) => (el: HTMLElement | null) => {
        if (el) {
            el.id = id;
            refs.current.set(id, el);
        }
    };

    return { visible, register };
}

const fadeUp = (visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
});

const fadeIn = (visible: boolean, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transition: `opacity 0.5s ease ${delay}ms`,
});

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const { visible, register } = useScrollAnimation();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-10% 0px -75% 0px' }
        );
        sectionRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
        return () => { sectionRefs.current.forEach((ref) => { if (ref) observer.unobserve(ref); }); };
    }, []);

    const activeIndex = SECTIONS.findIndex(s => s.id === activeSection);
    const glowTop = Math.max(0, activeIndex) * 44;

    return (
        <div style={{ backgroundColor: '#080809', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {/* Back button */}
            <div style={{ position: 'fixed', top: '24px', right: '32px', zIndex: 100 }}>
                <Link href="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={14} /> Back to LynxX
                </Link>
            </div>

            {/* Sidebar */}
            <nav style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '32px 0 32px 24px', overflowY: 'auto', background: 'rgba(6,6,8,0.98)', backdropFilter: 'blur(20px)', zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
                    <Image src={maincatImg} alt="LynxX" width={38} height={38} style={{ objectFit: 'contain' }} />
                    <span style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.01em' }}>LynxX</span>
                </div>

                <p style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>DOCUMENTATION</p>

                <div style={{ position: 'relative', paddingRight: '28px' }}>
                    <div style={{ position: 'absolute', right: '12px', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', right: '11.5px', top: `${glowTop + 10}px`, width: '2px', height: '24px', background: 'linear-gradient(to bottom, #c084fc, #7c3aed)', boxShadow: '0 0 12px 3px rgba(168,85,247,0.5)', borderRadius: '4px', transition: 'top 0.35s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2 }} />

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative' }}>
                        {SECTIONS.map((section, idx) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <li key={section.id} style={{ height: '44px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ position: 'absolute', right: '10px', width: '6px', height: '6px', borderRadius: '50%', border: '1.5px solid', borderColor: isActive ? '#a855f7' : '#333', background: isActive ? '#a855f7' : '#080809', zIndex: 1, transition: 'all 0.3s' }} />
                                    <a href={`#${section.id}`} style={{ textDecoration: 'none', color: isActive ? '#fff' : '#666', transition: 'all 0.2s', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', width: 'calc(100% - 20px)', fontWeight: isActive ? '600' : '400', background: isActive ? 'rgba(168,85,247,0.08)' : 'transparent', padding: '8px 14px', borderRadius: '8px', marginLeft: '-14px' }}>
                                        <Icon size={16} color={isActive ? '#a855f7' : '#444'} />
                                        {section.title}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <p style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase', marginTop: '40px', marginBottom: '12px' }}>RESOURCES</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, paddingRight: '28px' }}>
                    {[{ icon: HelpCircle, label: 'FAQ' }, { icon: Book, label: 'Guides' }, { icon: FileText, label: 'Changelog' }].map(({ icon: Icon, label }) => (
                        <li key={label} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                            <a href="#" style={{ color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                <Icon size={16} color="#444" /> {label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div style={{ marginTop: '40px', marginRight: '28px', background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(124,58,237,0.04))', border: '1px solid rgba(168,85,247,0.2)', padding: '20px', borderRadius: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Rocket size={18} color="#a855f7" />
                        <span style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>Ready to build?</span>
                    </div>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>Start building trustless payment flows on Stellar.</p>
                    <a href="https://github.com/amankoli09" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', padding: '9px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                        View on GitHub <GithubIcon />
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', padding: '80px 80px 120px', flex: 1, maxWidth: '1100px', position: 'relative' }}>

                {/* Decorative Background Image */}
                <div style={{ position: 'absolute', top: '-60px', right: '-180px', opacity: 0.3, zIndex: 0, pointerEvents: 'none', transform: 'rotate(25deg) scale(1.3)' }}>
                    <Image src={smallpieceImg} alt="Decoration element" width={450} height={450} style={{ objectFit: 'contain' }} />
                </div>

                {/* ────── GETTING STARTED ────── */}
                <section id="getting-started" ref={(el) => { sectionRefs.current[0] = el; }} style={{ minHeight: '100vh', paddingBottom: '100px' }}>
                    <div ref={register('gs-badge')} style={{ display: 'inline-block', background: 'rgba(168,85,247,0.12)', color: '#c084fc', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.12em', marginBottom: '24px', ...fadeIn(visible.has('gs-badge')) }}>
                        WELCOME
                    </div>
                    <h1 ref={register('gs-h1')} style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.03em', lineHeight: 1.1, ...fadeUp(visible.has('gs-h1')) }}>
                        Getting Started
                    </h1>
                    <div ref={register('gs-line')} style={{ width: visible.has('gs-line') ? '80px' : '0px', height: '3px', background: 'linear-gradient(to right, #a855f7, #7c3aed)', marginBottom: '32px', borderRadius: '4px', transition: 'width 0.8s ease 0.2s' }} />

                    <p ref={register('gs-intro')} style={{ fontSize: '1.15rem', lineHeight: '1.75', color: '#aaa', maxWidth: '780px', marginBottom: '56px', ...fadeUp(visible.has('gs-intro')) }}>
                        LynxX is a fully on-chain crowdfunding dApp built on the <strong style={{ color: '#fff' }}>Stellar blockchain</strong> using <strong style={{ color: '#fff' }}>Soroban smart contracts</strong> written in Rust. It ships two co-operating contracts alongside a non-custodial React frontend that integrates the Freighter browser-extension wallet for a seamless, trustless experience.
                    </p>

                    {/* What can users do? */}
                    <div ref={register('gs-features')} style={{ marginBottom: '64px', ...fadeUp(visible.has('gs-features')) }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', color: '#fff' }}>What can you do with LynxX?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                            {[
                                { icon: Wallet, title: 'Connect Wallet', desc: 'Install Freighter, approve the dApp, and instantly see your public key and live XLM balance on the Stellar Testnet.' },
                                { icon: ArrowRight, title: 'Send XLM', desc: 'Submit real Stellar Testnet payments with built-in client-side address validation and stroop conversion.' },
                                { icon: Zap, title: 'Donate to Campaign', desc: 'Call fund.donate() on the Soroban contract. Your cumulative contribution is tracked permanently on-chain.' },
                                { icon: Star, title: 'Earn Badges', desc: 'Every donation triggers a cross-contract call to badge.award(), assigning you a Bronze, Silver, or Gold tier automatically.' },
                                { icon: Activity, title: 'View History', desc: 'A persistent activity panel powered by localStorage lets you review every transaction even after reconnecting.' },
                                { icon: Shield, title: 'Non-Custodial', desc: 'Private keys never leave the Freighter extension. All signatures happen inside your browser with zero server exposure.' },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', transition: 'border-color 0.2s, background 0.2s', cursor: 'default' }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'; e.currentTarget.style.background = 'rgba(168,85,247,0.04)'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{ background: 'rgba(168,85,247,0.15)', padding: '8px', borderRadius: '8px' }}>
                                            <Icon size={18} color="#a855f7" />
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>{title}</h3>
                                    </div>
                                    <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: '1.6' }}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Installation */}
                    <div ref={register('gs-install')} style={{ ...fadeUp(visible.has('gs-install')) }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', color: '#fff' }}>Installation</h2>
                        <div style={{ background: '#0d0d10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                            {[
                                { step: '01', title: 'Clone the Repository', code: 'git clone https://github.com/amankoli09/LynxX.git\ncd LynxX' },
                                { step: '02', title: 'Install Dependencies', code: 'npm install' },
                                { step: '03', title: 'Start Dev Server', code: 'npm run dev\n# App runs at http://localhost:3002' },
                                { step: '04', title: 'Fund Your Testnet Wallet', code: 'https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY' },
                            ].map(({ step, title, code }, i) => (
                                <div key={step} style={{ padding: '28px 32px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
                                    <div style={{ color: '#a855f7', fontSize: '0.75rem', fontWeight: '700', fontFamily: 'monospace', paddingTop: '3px' }}>{step}</div>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>{title}</h4>
                                        <pre style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px 18px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#c084fc', overflowX: 'auto', margin: 0 }}>{code}</pre>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '24px', background: 'rgba(251, 191, 36, 0.04)', border: '1px solid rgba(251, 191, 36, 0.15)', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <AlertCircle size={18} color="#fbbf24" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                                <strong style={{ color: '#fbbf24' }}>Prerequisites:</strong> Node.js v16+, npm v8+, Git, and the Freighter browser extension installed from <a href="https://freighter.app" target="_blank" rel="noreferrer" style={{ color: '#a855f7', textDecoration: 'none' }}>freighter.app</a>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ────── ARCHITECTURE ────── */}
                <section id="architecture" ref={(el) => { sectionRefs.current[1] = el; }} style={{ paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
                    <h2 ref={register('arch-h')} style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em', ...fadeUp(visible.has('arch-h')) }}>Architecture</h2>
                    <div ref={register('arch-line')} style={{ width: visible.has('arch-line') ? '60px' : '0px', height: '3px', background: 'linear-gradient(to right, #a855f7, #7c3aed)', marginBottom: '28px', borderRadius: '4px', transition: 'width 0.8s ease 0.2s' }} />
                    <p ref={register('arch-intro')} style={{ fontSize: '1.1rem', lineHeight: '1.75', color: '#aaa', maxWidth: '780px', marginBottom: '56px', ...fadeUp(visible.has('arch-intro')) }}>
                        LynxX is built on a robust three-layer architecture designed for maximum security, trustless execution, and real-time feedback on the Stellar network.
                    </p>

                    {/* 3 Layers */}
                    <div ref={register('arch-layers')} style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '64px', ...fadeUp(visible.has('arch-layers')) }}>
                        {[
                            { num: '01', color: '#a855f7', title: 'Soroban Smart Contracts (On-Chain)', subtitle: 'Rust · Soroban SDK v26 · WebAssembly', desc: 'The core trustless logic lives entirely on the Stellar blockchain. Two Rust contracts — fund and badge — handle campaign state, donations, cross-contract badge awarding, and XLM transfers via the SAC client. Once deployed, the rules are immutable and verifiable by anyone.' },
                            { num: '02', color: '#7c3aed', title: 'React Frontend (dApp)', subtitle: 'Next.js · JavaScript · Vanilla CSS', desc: "The StellarFlow React app provides the user interface. It uses @stellar/stellar-sdk to build and simulate Soroban transactions against the RPC, assembles authorisation entries, and hands off XDR blobs to Freighter for signing. Private keys are never held by the frontend." },
                            { num: '03', color: '#6d28d9', title: 'Freighter Wallet (Cryptographic Signer)', subtitle: '@stellar/freighter-api · Browser Extension', desc: "The official non-custodial wallet for Stellar. It acts as the sole cryptographic signer. The dApp sends an XDR transaction to Freighter, which shows the user a human-readable summary before they approve. Signed XDR is returned to the dApp and broadcast directly to Soroban RPC." },
                        ].map(({ num, color, title, subtitle, desc }) => (
                            <div key={num} style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '24px' }}>
                                <div style={{ color, fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700', paddingTop: '4px' }}>{num}</div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{title}</h3>
                                    <p style={{ color, fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '16px' }}>{subtitle}</p>
                                    <p style={{ color: '#888', lineHeight: '1.7', fontSize: '0.95rem' }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Data Flow */}
                    <div ref={register('arch-flow')} style={{ ...fadeUp(visible.has('arch-flow')) }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '24px', color: '#fff' }}>End-to-End Data Flow</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                { step: 1, label: 'User clicks Connect', detail: 'setAllowed() + requestAccess() via Freighter API — returns G... public key' },
                                { step: 2, label: 'Balance fetched', detail: 'Horizon REST API /accounts/{address} returns balances array. UI renders live XLM balance.' },
                                { step: 3, label: 'Transaction built', detail: 'Fund.js builds a Soroban InvokeContractOp with donate(), from, and amount in stroops.' },
                                { step: 4, label: 'Simulation', detail: 'Soroban RPC simulateTransaction() returns fee, auth entries, and footprint for the call.' },
                                { step: 5, label: 'User signs', detail: 'Assembled XDR sent to Freighter. User sees human-readable summary, approves → signed XDR returned.' },
                                { step: 6, label: 'Broadcast & confirm', detail: 'sendTransaction() submits to Soroban RPC. Polled until SUCCESS. UI updates campaign stats.' },
                            ].map(({ step, label, detail }, i) => (
                                <div key={step} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: '16px', alignItems: 'flex-start', paddingBottom: '4px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#a855f7', flexShrink: 0 }}>{step}</div>
                                        {i < 5 && <div style={{ width: '1px', height: '36px', background: 'rgba(168,85,247,0.2)', marginTop: '4px' }} />}
                                    </div>
                                    <div style={{ paddingBottom: '28px' }}>
                                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{label}</p>
                                        <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: '1.5' }}>{detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ────── SMART CONTRACTS ────── */}
                <section id="smart-contracts" ref={(el) => { sectionRefs.current[2] = el; }} style={{ paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
                    <h2 ref={register('sc-h')} style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em', ...fadeUp(visible.has('sc-h')) }}>Smart Contracts</h2>
                    <div ref={register('sc-line')} style={{ width: visible.has('sc-line') ? '60px' : '0px', height: '3px', background: 'linear-gradient(to right, #a855f7, #7c3aed)', marginBottom: '28px', borderRadius: '4px', transition: 'width 0.8s ease 0.2s' }} />
                    <p ref={register('sc-intro')} style={{ fontSize: '1.1rem', lineHeight: '1.75', color: '#aaa', maxWidth: '780px', marginBottom: '56px', ...fadeUp(visible.has('sc-intro')) }}>
                        Two Soroban smart contracts written in Rust co-operate via cross-contract calls to deliver atomic, trustless crowdfunding on the Stellar Testnet.
                    </p>

                    {/* Contract IDs */}
                    <div ref={register('sc-ids')} style={{ marginBottom: '48px', ...fadeUp(visible.has('sc-ids')) }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                { label: 'fund contract', id: 'CCIYIE3WDF5EEC4DL25JR2O4SAV2G3USARIBMCLWPIFQVUOIVDEN5FWI', color: '#a855f7' },
                                { label: 'badge contract', id: 'Deploy and paste your contract ID here', color: '#7c3aed' },
                            ].map(({ label, id, color }) => (
                                <div key={label} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${color}22`, borderRadius: '12px', padding: '20px 24px' }}>
                                    <p style={{ color: color, fontSize: '0.75rem', fontWeight: '600', fontFamily: 'monospace', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                                    <p style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.5' }}>{id}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fund Contract */}
                    <div ref={register('sc-fund')} style={{ marginBottom: '48px', ...fadeUp(visible.has('sc-fund')) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(168,85,247,0.15)', padding: '10px', borderRadius: '10px' }}><Layers color="#a855f7" size={20} /></div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#fff' }}>Fund Contract</h3>
                                <p style={{ color: '#555', fontSize: '0.8rem', fontFamily: 'monospace' }}>contract/contracts/fund/src/lib.rs</p>
                            </div>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '24px' }}>
                            The core crowdfunding contract. It accepts XLM donations via the Stellar Asset Contract (SAC), tracks the funding goal, per-donor contributions, and automatically closes when the goal is reached. When a badge contract is registered, it cross-calls badge.award() atomically within the same transaction.
                        </p>
                        <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                            {[
                                { method: 'donate(from, amount)', returns: 'i128', auth: 'from', desc: 'Transfers tokens, updates raised/donors, cross-calls badge.award(), emits Donated event. Closes campaign if goal reached.' },
                                { method: 'withdraw()', returns: '()', auth: 'owner', desc: 'Transfers full contract balance to the owner. Emits Withdrawn event. Fails with NothingRaised if balance is 0.' },
                                { method: 'set_badge(badge)', returns: '()', auth: 'owner', desc: 'Registers the DonorBadge contract address so donate() can cross-call it.' },
                                { method: 'goal()', returns: 'i128', auth: 'none', desc: 'Returns the campaign fundraising goal in stroops.' },
                                { method: 'raised()', returns: 'i128', auth: 'none', desc: 'Returns total amount raised so far in stroops.' },
                                { method: 'donors()', returns: 'u32', auth: 'none', desc: 'Returns the number of unique donors.' },
                                { method: 'is_closed()', returns: 'bool', auth: 'none', desc: 'Returns true once the fundraising goal has been met.' },
                                { method: 'contribution(who)', returns: 'i128', auth: 'none', desc: "Returns a specific address's cumulative donation total in stroops." },
                            ].map(({ method, returns, auth, desc }, i, arr) => (
                                <div key={method} style={{ display: 'grid', gridTemplateColumns: '220px 60px 80px 1fr', gap: '16px', padding: '18px 24px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                                    <code style={{ color: '#c084fc', fontSize: '0.85rem' }}>{method}</code>
                                    <span style={{ color: '#7c3aed', fontSize: '0.8rem', fontFamily: 'monospace' }}>{returns}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: auth === 'none' ? '#444' : '#22c55e', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {auth === 'none' ? 'read' : (
                                            <>
                                                <Image src={lockImg} alt="Auth" width={16} height={16} style={{ objectFit: 'contain' }} /> {auth}
                                            </>
                                        )}
                                    </span>
                                    <span style={{ color: '#666', fontSize: '0.88rem', lineHeight: '1.5' }}>{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badge Contract */}
                    <div ref={register('sc-badge')} style={{ ...fadeUp(visible.has('sc-badge')) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(168,85,247,0.15)', padding: '10px', borderRadius: '10px' }}><Sparkles color="#a855f7" size={20} /></div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#fff' }}>Badge Contract — Loyalty Tiers</h3>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '32px' }}>
                            An auxiliary contract that assigns and stores loyalty tiers based on a donor&apos;s cumulative contribution. Only callable by the fund contract address, guaranteeing tier integrity.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {[
                                { tier: 'Bronze', range: '1 → 99 XLM', num: '1', color: '#cd7f32', img: bronzeImg },
                                { tier: 'Silver', range: '100 → 999 XLM', num: '2', color: '#d4d4d4', img: silverImg },
                                { tier: 'Gold', range: '≥ 1,000 XLM', num: '3', color: '#fbbf24', img: goldImg },
                            ].map(({ tier, range, num, color, img }) => (
                                <div key={tier} style={{
                                    background: '#000',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    aspectRatio: '4 / 5',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                                }}
                                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.12), 0 16px 48px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)'; }}
                                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'; }}>

                                    {/* Title top-left */}
                                    <div style={{ padding: '28px 28px 0', zIndex: 2, position: 'relative' }}>
                                        <h4 style={{
                                            fontSize: '1.75rem',
                                            fontWeight: '700',
                                            color: '#fff',
                                            letterSpacing: '-0.02em',
                                            lineHeight: 1.1,
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                        }}>{tier}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '8px', fontFamily: 'monospace' }}>{range}</p>
                                    </div>

                                    {/* Image fills lower portion */}
                                    <div style={{ flex: 1, position: 'relative', marginTop: '12px' }}>
                                        <Image
                                            src={img}
                                            alt={tier}
                                            fill
                                            style={{ objectFit: 'cover', objectPosition: 'center top' }}
                                        />
                                        {/* Bottom fade to black */}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, #000, transparent)' }} />
                                    </div>

                                    {/* tier badge bottom right */}
                                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${color}40`, borderRadius: '8px', padding: '6px 12px', zIndex: 3 }}>
                                        <span style={{ color, fontSize: '0.75rem', fontWeight: '600', fontFamily: 'monospace' }}>tier = {num}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ────── WALLET INTEGRATION ────── */}
                <section id="wallet-integration" ref={(el) => { sectionRefs.current[3] = el; }} style={{ paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
                    <h2 ref={register('wi-h')} style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em', ...fadeUp(visible.has('wi-h')) }}>Wallet Integration</h2>
                    <div ref={register('wi-line')} style={{ width: visible.has('wi-line') ? '60px' : '0px', height: '3px', background: 'linear-gradient(to right, #a855f7, #7c3aed)', marginBottom: '28px', borderRadius: '4px', transition: 'width 0.8s ease 0.2s' }} />
                    <p ref={register('wi-intro')} style={{ fontSize: '1.1rem', lineHeight: '1.75', color: '#aaa', maxWidth: '780px', marginBottom: '56px', ...fadeUp(visible.has('wi-intro')) }}>
                        LynxX integrates deeply with the Freighter browser wallet via <code style={{ color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '2px 6px', borderRadius: '4px' }}>@stellar/freighter-api</code>, enabling a completely non-custodial workflow where users always retain full control of their private keys.
                    </p>

                    <div ref={register('wi-perms')} style={{ marginBottom: '48px', ...fadeUp(visible.has('wi-perms')) }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Permission Model</h3>
                        <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '32px' }}>
                            <p style={{ color: '#888', lineHeight: '1.7', marginBottom: '24px' }}>
                                Freighter uses an <strong style={{ color: '#fff' }}>allowlist model</strong>. On first visit, <code style={{ color: '#a855f7' }}>setAllowed()</code> prompts the user to approve the dApp origin. Once approved, subsequent calls to <code style={{ color: '#a855f7' }}>getPublicKey()</code> and <code style={{ color: '#a855f7' }}>signTransaction()</code> proceed without re-approval. Users can revoke access anytime in Freighter Settings → Connected Sites.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                {[
                                    { fn: 'isConnected()', desc: 'Check if Freighter extension is installed in the browser.' },
                                    { fn: 'setAllowed()', desc: 'Request dApp permission. Triggers Freighter popup on first visit.' },
                                    { fn: 'getPublicKey()', desc: 'Return the connected G... Stellar public address.' },
                                    { fn: 'getNetwork()', desc: 'Return the active network (TESTNET / PUBLIC / custom).' },
                                    { fn: 'signTransaction(xdr)', desc: 'Show user the transaction summary, return signed XDR blob on approval.' },
                                    { fn: 'signBlob(blob)', desc: 'Sign arbitrary data blobs for off-chain authentication.' },
                                ].map(({ fn, desc }) => (
                                    <div key={fn} style={{ borderLeft: '2px solid rgba(168,85,247,0.4)', paddingLeft: '16px' }}>
                                        <code style={{ color: '#c084fc', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>{fn}</code>
                                        <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.5' }}>{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div ref={register('wi-network')} style={{ ...fadeUp(visible.has('wi-network')) }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Network Configuration</h3>
                        <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                            <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
                                Pass a <code style={{ color: '#a855f7' }}>network</code> option when signing so Freighter can show the correct network warning if the user is on the wrong chain.
                            </p>
                            <pre style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px 24px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#c084fc', overflowX: 'auto', margin: 0, lineHeight: '1.7' }}>{`import { signTransaction } from "@stellar/freighter-api";

const signedXdr = await signTransaction(unsignedXdr, {
  network: "TESTNET",  // or "PUBLIC" for Mainnet
  networkPassphrase: "Test SDF Network ; September 2015",
});`}</pre>
                        </div>
                    </div>
                </section>

                {/* ────── API REFERENCE ────── */}
                <section id="api-reference" ref={(el) => { sectionRefs.current[4] = el; }} style={{ paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
                    <h2 ref={register('api-h')} style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em', ...fadeUp(visible.has('api-h')) }}>API Reference</h2>
                    <div ref={register('api-line')} style={{ width: visible.has('api-line') ? '60px' : '0px', height: '3px', background: 'linear-gradient(to right, #a855f7, #7c3aed)', marginBottom: '28px', borderRadius: '4px', transition: 'width 0.8s ease 0.2s' }} />
                    <p ref={register('api-intro')} style={{ fontSize: '1.1rem', lineHeight: '1.75', color: '#aaa', maxWidth: '780px', marginBottom: '56px', ...fadeUp(visible.has('api-intro')) }}>
                        Complete reference for all public methods on the Fund contract, with CLI and JavaScript SDK usage examples.
                    </p>

                    {/* JS SDK Example */}
                    <div ref={register('api-sdk')} style={{ marginBottom: '48px', ...fadeUp(visible.has('api-sdk')) }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>JavaScript SDK Usage</h3>
                        <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                            <pre style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px 24px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#c084fc', overflowX: 'auto', margin: 0, lineHeight: '1.8' }}>{`import { Contract, nativeToScVal, Address } from "@stellar/stellar-sdk";

const FUND_CONTRACT_ID = "CCIYIE3WDF5...IVDEN5FWI";
const contract = new Contract(FUND_CONTRACT_ID);

// Build a donate() operation
const op = contract.call(
  "donate",
  new Address(walletAddress).toScVal(),
  nativeToScVal(amountStroops, { type: "i128" })
);`}</pre>
                        </div>
                    </div>

                    {/* CLI Examples */}
                    <div ref={register('api-cli')} style={{ marginBottom: '48px', ...fadeUp(visible.has('api-cli')) }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>CLI Invocation Examples</h3>
                        <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '28px' }}>
                            <pre style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px 24px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#c084fc', overflowX: 'auto', margin: 0, lineHeight: '1.8' }}>{`# Read total raised amount
stellar contract invoke --id $FUND_CONTRACT_ID \\
  --network testnet -- raised

# Read a specific donor's contribution
stellar contract invoke --id $FUND_CONTRACT_ID \\
  --network testnet -- contribution --who GABC...WXYZ

# Donate 10 XLM (10,000,000 stroops)
stellar contract invoke --id $FUND_CONTRACT_ID \\
  --source $DONOR_KEY --network testnet -- donate \\
  --from GABC...WXYZ --amount 100000000`}</pre>
                        </div>
                    </div>

                    {/* Error Codes */}
                    <div ref={register('api-errors')} style={{ ...fadeUp(visible.has('api-errors')) }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Error Codes</h3>
                        <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '60px 160px 1fr', gap: '16px', padding: '14px 24px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                <div>Code</div><div>Name</div><div>When Thrown</div>
                            </div>
                            {[
                                { code: '1', name: 'ZeroAmount', when: 'donate() called with amount ≤ 0. Donor must send a positive number of stroops.' },
                                { code: '2', name: 'CampaignClosed', when: 'donate() called after the fundraising goal has already been reached.' },
                                { code: '3', name: 'NothingRaised', when: 'withdraw() called when the contract balance is 0. Nothing to transfer.' },
                            ].map(({ code, name, when }, i) => (
                                <div key={code} style={{ display: 'grid', gridTemplateColumns: '60px 160px 1fr', gap: '16px', padding: '20px 24px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                                    <code style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '700' }}>{code}</code>
                                    <code style={{ color: '#c084fc', fontSize: '0.85rem' }}>{name}</code>
                                    <span style={{ color: '#666', fontSize: '0.88rem', lineHeight: '1.5' }}>{when}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ────── TECH STACK ────── */}
                <section id="tech-stack" ref={(el) => { sectionRefs.current[5] = el; }} style={{ paddingBottom: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
                    <h2 ref={register('ts-h')} style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em', ...fadeUp(visible.has('ts-h')) }}>Tech Stack</h2>
                    <div ref={register('ts-line')} style={{ width: visible.has('ts-line') ? '60px' : '0px', height: '3px', background: 'linear-gradient(to right, #a855f7, #7c3aed)', marginBottom: '28px', borderRadius: '4px', transition: 'width 0.8s ease 0.2s' }} />
                    <p ref={register('ts-intro')} style={{ fontSize: '1.1rem', lineHeight: '1.75', color: '#aaa', maxWidth: '780px', marginBottom: '56px', ...fadeUp(visible.has('ts-intro')) }}>
                        A complete reference for every technology across LynxX — from on-chain Rust contracts to the WebGL hero animation.
                    </p>

                    {[
                        {
                            id: 'ts-sc', label: 'Smart Contracts', icon: Layers,
                            items: [
                                { tech: 'Rust', detail: 'stable (2021 edition)', role: 'Contract implementation language' },
                                { tech: 'Soroban SDK v26', detail: 'soroban-sdk = "26"', role: 'Contract macros, storage, auth, events' },
                                { tech: 'wasm32-unknown-unknown', detail: 'Rust target', role: 'Compiles contracts to WebAssembly for Soroban' },
                                { tech: 'Stellar CLI', detail: 'stellar-cli (latest)', role: 'Build, deploy, invoke contracts from terminal' },
                            ]
                        },
                        {
                            id: 'ts-bc', label: 'Blockchain & Network', icon: Globe,
                            items: [
                                { tech: 'Stellar Network', detail: 'Proof-of-Agreement, 3–5s finality', role: 'The base consensus layer' },
                                { tech: 'Soroban RPC', detail: 'https://soroban-testnet.stellar.org', role: 'JSON-RPC for simulate and submit' },
                                { tech: 'Horizon API', detail: 'https://horizon-testnet.stellar.org', role: 'REST API for balances and account info' },
                                { tech: 'Native XLM SAC', detail: 'CDLZFC3S...HHGCYSC', role: 'Stellar Asset Contract for XLM transfers' },
                            ]
                        },
                        {
                            id: 'ts-fe', label: 'Frontend', icon: Code2,
                            items: [
                                { tech: 'React 19', detail: 'react ^19.2.7', role: 'UI component library' },
                                { tech: 'Next.js', detail: 'latest', role: 'Build toolchain, routing, dev server' },
                                { tech: 'ogl', detail: 'ogl ^1.0.11', role: 'Minimal WebGL renderer for light-rays hero' },
                                { tech: 'three.js', detail: 'three ^0.184.0', role: 'Secondary 3D rendering for MagicRings' },
                                { tech: '@stellar/stellar-sdk', detail: '^15.1.0', role: 'Build transactions, parse Soroban results' },
                                { tech: '@stellar/freighter-api', detail: '^6.0.1', role: 'Connect wallet, retrieve address, sign XDR' },
                            ]
                        },
                        {
                            id: 'ts-test', label: 'Testing & CI/CD', icon: CheckCircle2,
                            items: [
                                { tech: 'Jest', detail: 'via react-scripts', role: 'Frontend unit test runner (9 tests)' },
                                { tech: 'cargo test', detail: 'Rust built-in', role: 'Soroban contract unit tests (11 tests)' },
                                { tech: 'GitHub Actions', detail: 'CI pipeline', role: 'Runs contract + frontend tests on every push' },
                                { tech: 'Vercel', detail: 'Frontend hosting', role: 'Automatic deployment on push to main' },
                            ]
                        },
                    ].map(({ id, label, icon: Icon, items }) => (
                        <div key={id} ref={register(id)} style={{ marginBottom: '40px', ...fadeUp(visible.has(id)) }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <Icon size={18} color="#a855f7" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>{label}</h3>
                            </div>
                            <div style={{ background: '#0a0a0d', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: '0', padding: '12px 24px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.72rem', fontWeight: '600', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    <div>Technology</div><div>Version / Detail</div><div>Role</div>
                                </div>
                                {items.map(({ tech, detail, role }, i) => (
                                    <div key={tech} style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: '0', padding: '16px 24px', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                                        <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{tech}</span>
                                        <span style={{ color: '#555', fontSize: '0.82rem', fontFamily: 'monospace' }}>{detail}</span>
                                        <span style={{ color: '#666', fontSize: '0.88rem' }}>{role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

            </main>
        </div>
    );
}
