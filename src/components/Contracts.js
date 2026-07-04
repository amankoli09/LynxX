import { CONTRACT_ID, BADGE_ID } from "./Fund";

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
            <div className="contract-tiers">
                <span className="contract-tiers-lbl">Donor tiers</span>
                <div className="contract-tiers-row">
                    {TIERS.map((t) => (
                        <div className={`tier-chip ${t.cls}`} key={t.name}>
                            <span className="tier-chip-name">{t.name}</span>
                            <span className="tier-chip-req">{t.req}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
