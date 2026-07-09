import { CONTRACT_ID, BADGE_ID } from "./Fund";
import Image from "next/image";
import BorderGlow from "./BorderGlow";
import bronzeImg from "../media/bronze.png";
import silverImg from "../media/silver.png";
import goldImg from "../media/gold.png";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-6)}` : "Pending deployment");
const explorer = (id) => `https://stellar.expert/explorer/testnet/contract/${id}`;

const TIERS = [
    { name: "Bronze", req: "≥ 1 XLM", cls: "tier-bronze" },
    { name: "Silver", req: "≥ 10 XLM", cls: "tier-silver" },
    { name: "Gold", req: "≥ 100 XLM", cls: "tier-gold" },
];

/* Showcase of the two deployed Soroban contracts and the cross-contract call
   between them — the heart of the on-chain architecture. */
export default function Contracts() {
    return (
        <div className="contracts-block">
            <style>{`
                .contract-card {
                    position: relative;
                    background: rgba(15, 15, 20, 0.85) !important;
                    backdrop-filter: blur(24px);
                    border-radius: 24px !important;
                    border: none !important;
                    box-shadow: 0 10px 40px rgba(255, 255, 255, 0.05), 0 0 80px rgba(255, 255, 255, 0.03) !important;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .contract-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 15px 50px rgba(255, 255, 255, 0.08), 0 0 100px rgba(255, 255, 255, 0.05) !important;
                }
                .contract-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 2px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 60%, rgba(255, 255, 255, 0.1) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
            `}</style>
            <div className="contracts-pair">
                {/* ── Fund contract ── */}
                <div className="contract-card">
                    <div className="contract-card-head">
                        <span className="contract-card-tag contract-tag-live">● Live</span>
                        <span className="contract-card-kind">Soroban · Rust</span>
                    </div>
                    <h3 className="contract-card-name">StellarFund</h3>
                    <p className="contract-card-desc">
                        On-chain crowdfunding. Records donations, tracks unique donors and
                        progress, and lets the beneficiary withdraw — fully trustless.
                    </p>
                    <a className="contract-card-addr" href={explorer(CONTRACT_ID)} target="_blank" rel="noreferrer">
                        <span className="contract-card-addr-lbl">Contract</span>
                        <span className="contract-card-addr-val">{short(CONTRACT_ID)}</span>
                    </a>
                </div>

                {/* ── Cross-contract arrow ── */}
                <div className="contract-link">
                    <span className="contract-link-call">award()</span>
                    <div className="contract-link-line">
                        <span className="contract-link-dot" />
                    </div>
                    <span className="contract-link-note">cross-contract call</span>
                </div>

                {/* ── Badge contract ── */}
                <div className="contract-card">
                    <div className="contract-card-head">
                        <span className={`contract-card-tag ${BADGE_ID ? "contract-tag-live" : "contract-tag-soon"}`}>
                            {BADGE_ID ? "● Live" : "○ Companion"}
                        </span>
                        <span className="contract-card-kind">Soroban · Rust</span>
                    </div>
                    <h3 className="contract-card-name">DonorBadge</h3>
                    <p className="contract-card-desc">
                        Loyalty layer. On every donation, StellarFund calls it to award the
                        donor a tier from their cumulative total — minted on-chain.
                    </p>
                    {BADGE_ID ? (
                        <a className="contract-card-addr" href={explorer(BADGE_ID)} target="_blank" rel="noreferrer">
                            <span className="contract-card-addr-lbl">Contract</span>
                            <span className="contract-card-addr-val">{short(BADGE_ID)}</span>
                        </a>
                    ) : (
                        <div className="contract-card-addr contract-card-addr-pending">
                            <span className="contract-card-addr-lbl">Contract</span>
                            <span className="contract-card-addr-val">Pending deployment</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Badge tiers ── */}
            <div style={{ marginTop: '60px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Donor Tiers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    {[
                        { tier: 'Bronze', range: '1 → 99 XLM', num: '1', color: '#cd7f32', img: bronzeImg, glowColor: '30 70 50' },
                        { tier: 'Silver', range: '100 → 999 XLM', num: '2', color: '#d4d4d4', img: silverImg, glowColor: '0 0 80' },
                        { tier: 'Gold', range: '≥ 1,000 XLM', num: '3', color: '#fbbf24', img: goldImg, glowColor: '45 90 60' },
                    ].map(({ tier, range, num, color, img, glowColor }) => (
                        <BorderGlow
                            key={tier}
                            edgeSensitivity={30}
                            glowColor={glowColor}
                            backgroundColor="#000"
                            borderRadius="80px 20px 80px 20px"
                            glowRadius={40}
                            glowIntensity={1}
                            coneSpread={25}
                            animated={false}
                        >
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                aspectRatio: '4 / 5',
                                position: 'relative',
                                borderRadius: 'inherit',
                                overflow: 'hidden'
                            }}>
                                {/* Title top-left */}
                                <div style={{ padding: '40px 32px 0', zIndex: 2, position: 'relative' }}>
                                    <h4 style={{
                                        fontSize: '1.8rem',
                                        fontWeight: '700',
                                        color: '#fff',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.1,
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                    }}>{tier}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '8px', fontFamily: 'monospace' }}>{range}</p>
                                </div>

                                {/* Image fills lower portion */}
                                <div style={{ flex: 1, position: 'relative', marginTop: '16px' }}>
                                    <Image
                                        src={img}
                                        alt={tier}
                                        fill
                                        style={{ objectFit: 'cover', objectPosition: 'center top' }}
                                    />
                                    {/* Bottom fade to black */}
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #000, transparent)' }} />
                                </div>

                                {/* tier badge bottom right */}
                                <div style={{ position: 'absolute', bottom: '32px', right: '32px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${color}40`, borderRadius: '12px', padding: '6px 14px', zIndex: 3 }}>
                                    <span style={{ color, fontSize: '0.8rem', fontWeight: '600', fontFamily: 'monospace' }}>tier = {num}</span>
                                </div>
                            </div>
                        </BorderGlow>
                    ))}
                </div>
            </div>
        </div>
    );
}
